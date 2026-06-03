const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// POST /api/bookings — book a slot with row-level lock
router.post('/', auth, async (req, res) => {
  const { slot_id, location_id, hours } = req.body;
  const user_id = req.user.id;

  if (!slot_id || !location_id || !hours || hours < 1)
    return res.status(400).json({ error: 'slot_id, location_id, and hours (minimum 1) are required.' });  

  // Get a dedicated connection for the transaction
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // --- CRITICAL: Row-level lock on the slot ---
    // SELECT ... FOR UPDATE blocks any other transaction from
    // reading/modifying this row until we commit or rollback.
    const [slotRows] = await conn.query(
      `SELECT s.id, s.slot_number, s.is_occupied, l.price_per_hour, l.name AS location_name
       FROM slots s
       JOIN locations l ON l.id = s.location_id
       WHERE s.id = ? AND s.location_id = ?
       FOR UPDATE`,
      [slot_id, location_id]
    );

    if (slotRows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ error: 'Slot not found.' });
    }

    const slot = slotRows[0];

    if (slot.is_occupied) {
      await conn.rollback();
      // 409 Conflict — slot was taken while user was on the form
      return res.status(409).json({ error: 'Sorry! This slot was just booked by someone else.' });
    }

    const total_amount = parseFloat(slot.price_per_hour) * parseInt(hours);

    // Mark slot as occupied
    await conn.query('UPDATE slots SET is_occupied = TRUE WHERE id = ?', [slot_id]);

    // Insert booking record
    const [result] = await conn.query(
      `INSERT INTO bookings 
        (user_id, slot_id, location_id, slot_number, location_name, hours, total_amount)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, slot_id, location_id, slot.slot_number, slot.location_name, hours, total_amount]
    );

    await conn.commit();

    res.status(201).json({
      message: 'Slot booked successfully!',
      booking: {
        id: result.insertId,
        slot_number: slot.slot_number,
        location_name: slot.location_name,
        hours,
        total_amount,
      },
    });
  } catch (err) {
    await conn.rollback();
    console.error('Booking error:', err);
    res.status(500).json({ error: 'Booking failed due to a server error.' });
  } finally {
    conn.release(); // Always release back to pool
  }
});

// GET /api/bookings/history — user's booking history
router.get('/history', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        b.id,
        b.slot_number,
        b.location_name,
        b.hours,
        b.total_amount,
        b.booked_at,
        l.address,
        l.price_per_hour
       FROM bookings b
       JOIN locations l ON l.id = b.location_id
       WHERE b.user_id = ?
       ORDER BY b.booked_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('History error:', err);
    res.status(500).json({ error: 'Failed to fetch booking history.' });
  }
});

module.exports = router;
