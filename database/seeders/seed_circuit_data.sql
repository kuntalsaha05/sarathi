-- Seed Pilot Circuit: Pune - Lonavala - Khandala - Mahabaleshwar - Panchgani

INSERT INTO pois (name, category, circuit, geom, pax_max, avg_dwell_minutes, entry_fee, opening_hour, closing_hour) VALUES
-- Pune Heritage & Culture
('Shaniwar Wada', 'heritage', 'Pune-Lonavala-Mahabaleshwar', ST_SetSRID(ST_MakePoint(73.8553, 18.5196), 4326), 600, 60, 50.00, 9, 18),
('Aga Khan Palace', 'heritage', 'Pune-Lonavala-Mahabaleshwar', ST_SetSRID(ST_MakePoint(73.9016, 18.5524), 4326), 450, 75, 25.00, 9, 17),
('Sinhagad Fort', 'heritage', 'Pune-Lonavala-Mahabaleshwar', ST_SetSRID(ST_MakePoint(73.7554, 18.3663), 4326), 1200, 120, 50.00, 6, 18),

-- Lonavala - Khandala Circuit
('Bhushi Dam', 'nature', 'Pune-Lonavala-Mahabaleshwar', ST_SetSRID(ST_MakePoint(73.4072, 18.7302), 4326), 1500, 90, 0.00, 8, 17),
('Tiger Point (Lions Point)', 'viewpoint', 'Pune-Lonavala-Mahabaleshwar', ST_SetSRID(ST_MakePoint(73.3980, 18.7088), 4326), 800, 60, 20.00, 6, 19),
('Karla Caves', 'heritage', 'Pune-Lonavala-Mahabaleshwar', ST_SetSRID(ST_MakePoint(73.4704, 18.7828), 4326), 500, 90, 25.00, 9, 17),
('Rajmachi Fort Point', 'adventure', 'Pune-Lonavala-Mahabaleshwar', ST_SetSRID(ST_MakePoint(73.3989, 18.8286), 4326), 400, 150, 0.00, 6, 18),

-- Mahabaleshwar - Panchgani Circuit
('Arthur Seat Point', 'viewpoint', 'Pune-Lonavala-Mahabaleshwar', ST_SetSRID(ST_MakePoint(73.6062, 17.9856), 4326), 700, 60, 0.00, 6, 18),
('Venna Lake', 'nature', 'Pune-Lonavala-Mahabaleshwar', ST_SetSRID(ST_MakePoint(73.6627, 17.9237), 4326), 1000, 90, 50.00, 7, 20),
('Mapro Garden Panchgani', 'nature', 'Pune-Lonavala-Mahabaleshwar', ST_SetSRID(ST_MakePoint(73.7431, 17.9254), 4326), 850, 75, 0.00, 8, 20),
('Pratapgad Fort', 'heritage', 'Pune-Lonavala-Mahabaleshwar', ST_SetSRID(ST_MakePoint(73.5786, 17.9299), 4326), 900, 120, 50.00, 6, 18),
('Table Land Panchgani', 'viewpoint', 'Pune-Lonavala-Mahabaleshwar', ST_SetSRID(ST_MakePoint(73.8058, 17.9248), 4326), 1200, 90, 0.00, 6, 19)
ON CONFLICT DO NOTHING;
