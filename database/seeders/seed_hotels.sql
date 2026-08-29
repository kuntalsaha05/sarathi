INSERT INTO hotels (name, geom, total_rooms, base_price_per_night, category) VALUES
('Hotel Shreeman', ST_SetSRID(ST_MakePoint(73.8563, 18.5204), 4326), 80, 3500.00, 'mid-range'),
('The Westin', ST_SetSRID(ST_MakePoint(73.8553, 18.5196), 4326), 120, 8500.00, 'luxury'),
('Lonavala Resort', ST_SetSRID(ST_MakePoint(73.4060, 18.7545), 4326), 60, 4500.00, 'mid-range'),
('Mahabaleshwar Retreat', ST_SetSRID(ST_MakePoint(73.6545, 17.9250), 4326), 45, 5200.00, 'mid-range'),
('Panchgani Cottage', ST_SetSRID(ST_MakePoint(73.7431, 17.9254), 4326), 30, 3800.00, 'budget')
ON CONFLICT DO NOTHING;
