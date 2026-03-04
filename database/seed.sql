CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO users(name, email, password_hash, role)
VALUES
  ('Admin', 'admin@donotrisk.com', crypt('Admin@12345', gen_salt('bf', 10)), 'admin'),
  ('Demo User', 'user@donotrisk.com', crypt('User@12345', gen_salt('bf', 10)), 'user')
ON CONFLICT (email) DO NOTHING;

INSERT INTO categories(name, parent_id) VALUES
  ('Electronics', NULL),
  ('Vehicles', NULL),
  ('Home Appliances', NULL),
  ('Gadgets', NULL),
  ('Furniture', NULL),
  ('Industrial Equipment', NULL),
  ('Personal Care', NULL),
  ('Outdoor and Tools', NULL)
ON CONFLICT DO NOTHING;

WITH parent AS (
  SELECT id, name FROM categories
)
INSERT INTO categories(name, parent_id)
SELECT 'WiFi Routers', id FROM parent WHERE name = 'Electronics'
UNION ALL SELECT 'Smartphones', id FROM parent WHERE name = 'Electronics'
UNION ALL SELECT 'Laptops', id FROM parent WHERE name = 'Electronics'
UNION ALL SELECT 'Televisions', id FROM parent WHERE name = 'Electronics'
UNION ALL SELECT 'Cars', id FROM parent WHERE name = 'Vehicles'
UNION ALL SELECT 'Bikes', id FROM parent WHERE name = 'Vehicles'
UNION ALL SELECT 'Scooters', id FROM parent WHERE name = 'Vehicles'
UNION ALL SELECT 'Air Conditioners', id FROM parent WHERE name = 'Home Appliances'
UNION ALL SELECT 'Refrigerators', id FROM parent WHERE name = 'Home Appliances'
UNION ALL SELECT 'Washing Machines', id FROM parent WHERE name = 'Home Appliances'
UNION ALL SELECT 'Microwaves', id FROM parent WHERE name = 'Home Appliances'
UNION ALL SELECT 'Smartwatches', id FROM parent WHERE name = 'Gadgets'
UNION ALL SELECT 'Audio Devices', id FROM parent WHERE name = 'Gadgets'
UNION ALL SELECT 'Gaming Accessories', id FROM parent WHERE name = 'Gadgets'
UNION ALL SELECT 'Office Chairs', id FROM parent WHERE name = 'Furniture'
UNION ALL SELECT 'Sofas', id FROM parent WHERE name = 'Furniture'
UNION ALL SELECT 'Storage Cabinets', id FROM parent WHERE name = 'Furniture'
UNION ALL SELECT 'Air Compressors', id FROM parent WHERE name = 'Industrial Equipment'
UNION ALL SELECT 'Power Tools', id FROM parent WHERE name = 'Industrial Equipment'
UNION ALL SELECT 'CNC Equipment', id FROM parent WHERE name = 'Industrial Equipment'
UNION ALL SELECT 'Trimmers', id FROM parent WHERE name = 'Personal Care'
UNION ALL SELECT 'Hair Dryers', id FROM parent WHERE name = 'Personal Care'
UNION ALL SELECT 'Pressure Washers', id FROM parent WHERE name = 'Outdoor and Tools'
UNION ALL SELECT 'Chain Saws', id FROM parent WHERE name = 'Outdoor and Tools'
ON CONFLICT DO NOTHING;

WITH product_rows AS (
  SELECT * FROM (VALUES
    ('Airtel Xstream Router', 'Airtel', 'AXR-2025', 'WiFi Routers', 'Dual-band WiFi 6 router with mesh support and ISP-managed firmware security patches.', DATE '2025-05-15', 2, 6, 18, 76, 42, 'Moderate'),
    ('Samsung Galaxy A56', 'Samsung', 'SMA56-5G', 'Smartphones', '5G smartphone with AMOLED panel, Knox security, and multi-year software support.', DATE '2025-02-21', 1, 5, 14, 82, 31, 'Low'),
    ('Lenovo IdeaPad Pro 5', 'Lenovo', 'LNV-IP5-16', 'Laptops', 'Performance laptop for creators with aluminum body, fast SSD, and premium cooling.', DATE '2024-11-09', 1, 6, 16, 79, 36, 'Low'),
    ('Sony Bravia X82L', 'Sony', 'SONY-X82L', 'Televisions', '4K Google TV with low-latency mode and wide color support for home entertainment.', DATE '2024-06-01', 0, 4, 12, 84, 22, 'Low'),
    ('Hyundai Venue SX', 'Hyundai', 'HY-VENUE-SX', 'Cars', 'Compact SUV with connected diagnostics, low running cost, and broad service coverage.', DATE '2025-01-05', 2, 7, 20, 74, 47, 'Moderate'),
    ('Honda CB350 RS', 'Honda', 'HND-CB350RS', 'Bikes', 'Retro roadster bike designed for daily touring with robust engine reliability.', DATE '2024-09-20', 3, 6, 19, 75, 45, 'Moderate'),
    ('TVS iQube ST', 'TVS', 'TVS-IQ-ST', 'Scooters', 'Connected electric scooter with battery diagnostics and over-the-air feature updates.', DATE '2025-03-10', 2, 7, 22, 70, 51, 'Moderate'),
    ('CoolHome EcoCool AC 1.5T', 'CoolHome', 'ECA-15-INV', 'Air Conditioners', 'Inverter split AC with anti-corrosion condenser and app-controlled scheduling.', DATE '2024-10-01', 2, 7, 22, 71, 49, 'Moderate'),
    ('LG FrostFree 340L', 'LG', 'LG-FF-340', 'Refrigerators', 'Frost-free refrigerator with smart inverter compressor and humidity control zones.', DATE '2024-12-15', 1, 5, 13, 83, 28, 'Low'),
    ('Bosch WashPro 8kg', 'Bosch', 'BOS-WP8', 'Washing Machines', 'Front-load washer with vibration control and eco wash cycles for fabric safety.', DATE '2025-01-12', 2, 6, 17, 78, 38, 'Low'),
    ('IFB HeatWave 30L', 'IFB', 'IFB-HW30', 'Microwaves', 'Convection microwave with steam-clean mode and auto-cook profiles.', DATE '2024-08-10', 0, 4, 11, 85, 20, 'Low'),
    ('Amazfit Balance 2', 'Amazfit', 'AMZ-BAL2', 'Smartwatches', 'Health smartwatch with advanced sleep analytics and multi-day battery backup.', DATE '2025-02-02', 0, 4, 12, 83, 22, 'Low'),
    ('JBL Tune Pro X', 'JBL', 'JBL-TPX', 'Audio Devices', 'Wireless earbuds with ANC, low-latency game mode, and quick-pair support.', DATE '2024-09-01', 0, 3, 10, 86, 17, 'Low'),
    ('Razer Kiyo Stream Kit', 'Razer', 'RZR-KIYO-KIT', 'Gaming Accessories', 'Creator kit bundle with webcam and lighting optimized for long streaming sessions.', DATE '2024-11-30', 0, 5, 15, 80, 30, 'Low'),
    ('ErgoChair Flex', 'WoodForm', 'WF-ERGO-FLX', 'Office Chairs', 'Ergonomic office chair with lumbar support and breathable back mesh.', DATE '2024-07-05', 0, 3, 9, 88, 14, 'Low'),
    ('UrbanLounge 3-Seater', 'UrbanNest', 'URN-SF3', 'Sofas', 'High-density foam sofa with stain-resistant fabric and reinforced wooden frame.', DATE '2024-06-22', 0, 3, 8, 89, 12, 'Low'),
    ('SteelSafe Cabinet 4D', 'SteelSafe', 'SS-CAB-4D', 'Storage Cabinets', 'Heavy-duty powder-coated storage unit suitable for home and office use.', DATE '2024-05-18', 0, 2, 7, 91, 10, 'Low'),
    ('Atlas AirMax 200', 'Atlas', 'ATL-AM200', 'Air Compressors', 'Industrial air compressor with thermal overload protection and low-noise design.', DATE '2025-01-27', 4, 8, 26, 68, 59, 'Moderate'),
    ('Makita DrillPro X', 'Makita', 'MKT-DPX', 'Power Tools', 'Brushless impact drill with metal gear housing for continuous worksite duty.', DATE '2024-10-09', 2, 6, 18, 77, 40, 'Moderate'),
    ('CNC MillOne M4', 'MillTech', 'MLT-M4', 'CNC Equipment', 'Entry industrial CNC milling unit with precision spindle and remote diagnostics.', DATE '2025-02-11', 4, 9, 28, 64, 65, 'Moderate'),
    ('Philips BeardMaster Pro', 'Philips', 'PH-BMPRO', 'Trimmers', 'Cordless precision trimmer with washable blades and skin-safe rounded tips.', DATE '2024-08-12', 0, 3, 9, 88, 14, 'Low'),
    ('Dyson AirFlow Swift', 'Dyson', 'DYS-AFS', 'Hair Dryers', 'High-velocity ionic hair dryer with heat regulation to reduce damage.', DATE '2024-09-28', 0, 4, 11, 85, 20, 'Low'),
    ('Karcher K5 Pro', 'Karcher', 'KAR-K5P', 'Pressure Washers', 'Outdoor pressure washer with variable spray system and motor thermal protection.', DATE '2025-01-20', 1, 5, 14, 82, 31, 'Low'),
    ('Husqvarna Ranger 250', 'Husqvarna', 'HSQ-R250', 'Chain Saws', 'Gas chain saw with anti-vibration system for heavy-duty garden maintenance.', DATE '2024-10-15', 2, 6, 17, 78, 38, 'Low')
  ) AS t(name, brand, model_number, subcategory, description, release_date, servicing_frequency_per_year, warranty_complexity, failure_rate, claim_success_probability, risk_score, risk_band)
)
INSERT INTO products(
  name, brand, model_number, category_id, description, release_date,
  servicing_frequency_per_year, warranty_complexity, failure_rate, claim_success_probability, risk_score, risk_band
)
SELECT
  p.name, p.brand, p.model_number, c.id, p.description, p.release_date,
  p.servicing_frequency_per_year, p.warranty_complexity, p.failure_rate, p.claim_success_probability, p.risk_score, p.risk_band
FROM product_rows p
JOIN categories c ON c.name = p.subcategory
ON CONFLICT (model_number) DO NOTHING;

INSERT INTO warranty_details(
  product_id, duration_months, coverage_type, start_conditions,
  registration_requirements, claim_process, validity_conditions, void_conditions
)
SELECT
  p.id,
  CASE
    WHEN parent.name = 'Vehicles' THEN 36
    WHEN parent.name = 'Industrial Equipment' THEN 24
    WHEN parent.name = 'Furniture' THEN 18
    ELSE 24
  END AS duration_months,
  'manufacturer warranty',
  'Warranty starts from purchase invoice date and product activation.',
  'Product registration with serial number and valid invoice required within 30 days.',
  'Raise claim via brand support portal, attach invoice, serial number, and issue evidence.',
  'Periodic servicing where applicable, no physical abuse, and no unauthorized tampering.',
  'Water/fire damage, non-approved repairs, missing invoice, broken seals, or skipped mandatory service.'
FROM products p
JOIN categories c ON c.id = p.category_id
LEFT JOIN categories parent ON parent.id = c.parent_id
ON CONFLICT (product_id) DO NOTHING;

INSERT INTO pros_cons(product_id, pros, cons)
SELECT
  p.id,
  CASE
    WHEN parent.name = 'Vehicles' THEN 'Strong brand service network; predictable part availability; detailed maintenance manuals.'
    WHEN parent.name = 'Industrial Equipment' THEN 'Built for heavy duty cycles; reliable diagnostics; clear maintenance schedule.'
    WHEN parent.name = 'Furniture' THEN 'Low claim rejection rates; easy replacement workflow; simple condition checklist.'
    ELSE 'Balanced warranty terms; decent service coverage; good long-term product reliability.'
  END,
  CASE
    WHEN parent.name = 'Vehicles' THEN 'Strict servicing timeline; high labor charges in metro service centers.'
    WHEN parent.name = 'Industrial Equipment' THEN 'High spare part cost; strict compliance documentation for claims.'
    WHEN parent.name = 'Furniture' THEN 'Limited cosmetic coverage; transit-related damages often excluded.'
    ELSE 'Some exclusions are strict; invoice and servicing records must be preserved carefully.'
  END
FROM products p
JOIN categories c ON c.id = p.category_id
LEFT JOIN categories parent ON parent.id = c.parent_id
ON CONFLICT (product_id) DO NOTHING;

INSERT INTO service_centers(product_id, name, address, city, state, phone)
SELECT
  p.id,
  p.brand || ' Authorized Service Center',
  'Main Service Road, Sector 4',
  'Bengaluru',
  'Karnataka',
  '+91-8000001111'
FROM products p
ON CONFLICT DO NOTHING;
