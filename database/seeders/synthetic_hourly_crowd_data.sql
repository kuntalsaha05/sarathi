INSERT INTO pois (name, category, rating, geom, city, state) VALUES
('Pune Station', 'transport', 3.8, ST_SetSRID(ST_MakePoint(73.8563, 18.5204), 4326), 'Pune', 'Maharashtra'),
('Lonavala Station', 'transport', 3.5, ST_SetSRID(ST_MakePoint(73.4060, 18.7545), 4326), 'Lonavala', 'Pune'),
('Mahabaleshwar Bus Stand', 'transport', 3.2, ST_SetSRID(ST_MakePoint(73.6545, 17.9250), 4326), 'Mahabaleshwar', 'Satara'),
('Karla Caves', 'historical', 4.6, ST_SetSRID(ST_MakePoint(73.4686, 18.7856), 4326), 'Karla', 'Pune'),
('Bhaja Caves', 'historical', 4.5, ST_SetSRID(ST_MakePoint(73.4697, 18.7339), 4326), 'Bhaja', 'Pune'),
('Princess Street', 'market', 4.1, ST_SetSRID(ST_MakePoint(73.8654, 18.5189), 4326), 'Pune', 'Maharashtra'),
('Osho Teerth', 'park', 4.3, ST_SetSRID(ST_MakePoint(73.8278, 18.5519), 4326), 'Pune', 'Maharashtra'),
('Dagdusheth Halwai Ganpati', 'religious', 4.8, ST_SetSRID(ST_MakePoint(73.8563, 18.5198), 4326), 'Pune', 'Maharashtra')
ON CONFLICT DO NOTHING;
