INSERT INTO pois (name, category, rating, geom, address, city, state) VALUES
('Shaniwar Wada', 'historical', 4.5, ST_SetSRID(ST_MakePoint(73.8563, 18.5204), 4326), 'Shaniwar Peth', 'Pune', 'Maharashtra'),
('Sinhagad Fort', 'fort', 4.7, ST_SetSRID(ST_MakePoint(73.7512, 18.3649), 4326), 'Sinhagad Road', 'Pune', 'Maharashtra'),
('Lonavala Lake', 'nature', 4.3, ST_SetSRID(ST_MakePoint(73.4060, 18.7545), 4326), 'Lonavala', 'Pune', 'Maharashtra'),
('Mahabaleshwar Temple', 'religious', 4.6, ST_SetSRID(ST_MakePoint(73.6545, 17.9250), 4326), 'Mahabaleshwar', 'Satara', 'Maharashtra'),
('Mapro Garden', 'nature', 4.4, ST_SetSRID(ST_MakePoint(73.6600, 17.9300), 4326), 'Mahabaleshwar', 'Satara', 'Maharashtra')
ON CONFLICT DO NOTHING;
