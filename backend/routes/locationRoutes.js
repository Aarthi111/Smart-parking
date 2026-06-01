const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET /api/locations — all cards with free/occupied counts
router.get('/', auth, async (req, res) => {
  try {
    const [locations] = await pool.query(`
      SELECT 
        l.id,
        l.name,
        l.address,
        l.total_slots,
        l.price_per_hour,
        SUM(s.is_occupied) AS occupied_slots,
        SUM(!s.is_occupied) AS free_slots
      FROM locations l
      JOIN slots s ON s.location_id = l.id
      GROUP BY l.id
      ORDER BY l.id
    `);
    res.json(locations);
  } catch (err) {
    console.error('Fetch locations error:', err);
    res.status(500).json({ error: 'Failed to fetch locations.' });
  }
});

// GET /api/locations/:id — single location with all slot details
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const [locRows] = await pool.query(`
      SELECT 
        l.id,
        l.name,
        l.address,
        l.total_slots,
        l.price_per_hour,
        SUM(s.is_occupied) AS occupied_slots,
        SUM(!s.is_occupied) AS free_slots
      FROM locations l
      JOIN slots s ON s.location_id = l.id
      WHERE l.id = ?
      GROUP BY l.id
    `, [id]);

    if (locRows.length === 0)
      return res.status(404).json({ error: 'Location not found.' });

    const [slots] = await pool.query(
      'SELECT id, slot_number, is_occupied FROM slots WHERE location_id = ? ORDER BY slot_number',
      [id]
    );

    res.json({ ...locRows[0], slots });
  } catch (err) {
    console.error('Fetch location error:', err);
    res.status(500).json({ error: 'Failed to fetch location details.' });
  }
});

module.exports = router;
