CREATE DATABASE IF NOT EXISTS parking_db;
USE parking_db;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Parking Locations
CREATE TABLE IF NOT EXISTS locations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  address VARCHAR(255) NOT NULL,
  total_slots INT NOT NULL,
  price_per_hour DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(255)
);

-- Individual Slots
CREATE TABLE IF NOT EXISTS slots (
  id INT PRIMARY KEY AUTO_INCREMENT,
  location_id INT NOT NULL,
  slot_number VARCHAR(10) NOT NULL,
  is_occupied BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (location_id) REFERENCES locations(id)
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  slot_id INT NOT NULL,
  location_id INT NOT NULL,
  slot_number VARCHAR(10) NOT NULL,
  location_name VARCHAR(150) NOT NULL,
  hours INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (slot_id) REFERENCES slots(id),
  FOREIGN KEY (location_id) REFERENCES locations(id)
);

-- ============================================
-- SEED: 10 Chennai Parking Locations
-- ============================================

INSERT INTO locations (name, address, total_slots, price_per_hour) VALUES
('Express Avenue Mall Parking',     'Whites Road, Royapettah, Chennai - 600014',         20, 40.00),
('Chennai Central Railway Parking', 'Park Town, Chennai - 600003',                        15, 30.00),
('Phoenix MarketCity Parking',      'Velachery Main Road, Velachery, Chennai - 600042',  25, 50.00),
('Marina Beach Parking',            'Kamarajar Salai, Chennai - 600005',                  10, 20.00),
('T. Nagar Bus Stand Parking',      'Thyagaraya Road, T. Nagar, Chennai - 600017',        12, 35.00),
('Vadapalani Metro Parking',        'Arcot Road, Vadapalani, Chennai - 600026',           18, 25.00),
('Chennai Airport Parking',         'Trident Hotel Road, Meenambakkam, Chennai - 600027', 30, 60.00),
('Besant Nagar Beach Parking',      'Edward Elliots Road, Besant Nagar, Chennai - 600090',8, 20.00),
('Nungambakkam High Road Parking',  'Nungambakkam High Road, Chennai - 600034',           14, 45.00),
('Sholinganallur IT Park Parking',  'OMR, Sholinganallur, Chennai - 600119',              22, 35.00);

-- ============================================
-- SEED: Slots for each location
-- ============================================

-- Location 1: Express Avenue (20 slots, A1-A20)
INSERT INTO slots (location_id, slot_number) VALUES
(1,'A1'),(1,'A2'),(1,'A3'),(1,'A4'),(1,'A5'),
(1,'A6'),(1,'A7'),(1,'A8'),(1,'A9'),(1,'A10'),
(1,'A11'),(1,'A12'),(1,'A13'),(1,'A14'),(1,'A15'),
(1,'A16'),(1,'A17'),(1,'A18'),(1,'A19'),(1,'A20');

-- Location 2: Chennai Central (15 slots)
INSERT INTO slots (location_id, slot_number) VALUES
(2,'B1'),(2,'B2'),(2,'B3'),(2,'B4'),(2,'B5'),
(2,'B6'),(2,'B7'),(2,'B8'),(2,'B9'),(2,'B10'),
(2,'B11'),(2,'B12'),(2,'B13'),(2,'B14'),(2,'B15');

-- Location 3: Phoenix MarketCity (25 slots)
INSERT INTO slots (location_id, slot_number) VALUES
(3,'C1'),(3,'C2'),(3,'C3'),(3,'C4'),(3,'C5'),
(3,'C6'),(3,'C7'),(3,'C8'),(3,'C9'),(3,'C10'),
(3,'C11'),(3,'C12'),(3,'C13'),(3,'C14'),(3,'C15'),
(3,'C16'),(3,'C17'),(3,'C18'),(3,'C19'),(3,'C20'),
(3,'C21'),(3,'C22'),(3,'C23'),(3,'C24'),(3,'C25');

-- Location 4: Marina Beach (10 slots)
INSERT INTO slots (location_id, slot_number) VALUES
(4,'D1'),(4,'D2'),(4,'D3'),(4,'D4'),(4,'D5'),
(4,'D6'),(4,'D7'),(4,'D8'),(4,'D9'),(4,'D10');

-- Location 5: T. Nagar (12 slots)
INSERT INTO slots (location_id, slot_number) VALUES
(5,'E1'),(5,'E2'),(5,'E3'),(5,'E4'),(5,'E5'),
(5,'E6'),(5,'E7'),(5,'E8'),(5,'E9'),(5,'E10'),
(5,'E11'),(5,'E12');

-- Location 6: Vadapalani Metro (18 slots)
INSERT INTO slots (location_id, slot_number) VALUES
(6,'F1'),(6,'F2'),(6,'F3'),(6,'F4'),(6,'F5'),
(6,'F6'),(6,'F7'),(6,'F8'),(6,'F9'),(6,'F10'),
(6,'F11'),(6,'F12'),(6,'F13'),(6,'F14'),(6,'F15'),
(6,'F16'),(6,'F17'),(6,'F18');

-- Location 7: Chennai Airport (30 slots)
INSERT INTO slots (location_id, slot_number) VALUES
(7,'G1'),(7,'G2'),(7,'G3'),(7,'G4'),(7,'G5'),
(7,'G6'),(7,'G7'),(7,'G8'),(7,'G9'),(7,'G10'),
(7,'G11'),(7,'G12'),(7,'G13'),(7,'G14'),(7,'G15'),
(7,'G16'),(7,'G17'),(7,'G18'),(7,'G19'),(7,'G20'),
(7,'G21'),(7,'G22'),(7,'G23'),(7,'G24'),(7,'G25'),
(7,'G26'),(7,'G27'),(7,'G28'),(7,'G29'),(7,'G30');

-- Location 8: Besant Nagar (8 slots)
INSERT INTO slots (location_id, slot_number) VALUES
(8,'H1'),(8,'H2'),(8,'H3'),(8,'H4'),
(8,'H5'),(8,'H6'),(8,'H7'),(8,'H8');

-- Location 9: Nungambakkam (14 slots)
INSERT INTO slots (location_id, slot_number) VALUES
(9,'I1'),(9,'I2'),(9,'I3'),(9,'I4'),(9,'I5'),
(9,'I6'),(9,'I7'),(9,'I8'),(9,'I9'),(9,'I10'),
(9,'I11'),(9,'I12'),(9,'I13'),(9,'I14');

-- Location 10: Sholinganallur (22 slots)
INSERT INTO slots (location_id, slot_number) VALUES
(10,'J1'),(10,'J2'),(10,'J3'),(10,'J4'),(10,'J5'),
(10,'J6'),(10,'J7'),(10,'J8'),(10,'J9'),(10,'J10'),
(10,'J11'),(10,'J12'),(10,'J13'),(10,'J14'),(10,'J15'),
(10,'J16'),(10,'J17'),(10,'J18'),(10,'J19'),(10,'J20'),
(10,'J21'),(10,'J22');

CREATE INDEX idx_slots_location_id ON slots(location_id);
CREATE INDEX idx_bookings_user ON bookings(user_id);
create index idx_bookings_slot ON bookings(slot_id);