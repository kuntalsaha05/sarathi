-- Seed: one demo destination (Jaipur) with a realistic POI set.
-- Extend with more destinations/POIs as needed for the pitch demo.

INSERT INTO destinations (id, name, state, country, centroid, timezone)
VALUES (
    'a1a1a1a1-0000-0000-0000-000000000001',
    'Jaipur', 'Rajasthan', 'India',
    ST_GeogFromText('POINT(75.7873 26.9124)'),
    'Asia/Kolkata'
);

INSERT INTO points_of_interest
    (id, destination_id, name, category, location, avg_visit_minutes, max_capacity,
     opening_time, closing_time, entry_fee_inr, languages_supported)
VALUES
    ('b1000000-0000-0000-0000-000000000001', 'a1a1a1a1-0000-0000-0000-000000000001',
     'Amber Fort', 'heritage', ST_GeogFromText('POINT(75.8513 26.9855)'),
     120, 4000, '08:00', '17:30', 200, ARRAY['en','hi','ta','bn']),

    ('b1000000-0000-0000-0000-000000000002', 'a1a1a1a1-0000-0000-0000-000000000001',
     'Hawa Mahal', 'heritage', ST_GeogFromText('POINT(75.8267 26.9239)'),
     45, 1500, '09:00', '16:30', 200, ARRAY['en','hi']),

    ('b1000000-0000-0000-0000-000000000003', 'a1a1a1a1-0000-0000-0000-000000000001',
     'City Palace', 'heritage', ST_GeogFromText('POINT(75.8235 26.9258)'),
     90, 2000, '09:30', '17:00', 300, ARRAY['en','hi','gu']),

    ('b1000000-0000-0000-0000-000000000004', 'a1a1a1a1-0000-0000-0000-000000000001',
     'Jal Mahal', 'viewpoint', ST_GeogFromText('POINT(75.8464 26.9538)'),
     30, NULL, '00:00', '23:59', 0, ARRAY['en','hi']),

    ('b1000000-0000-0000-0000-000000000005', 'a1a1a1a1-0000-0000-0000-000000000001',
     'Nahargarh Fort', 'nature', ST_GeogFromText('POINT(75.8154 26.9373)'),
     75, 2500, '10:00', '19:30', 100, ARRAY['en','hi']),

    ('b1000000-0000-0000-0000-000000000006', 'a1a1a1a1-0000-0000-0000-000000000001',
     'Johari Bazaar', 'shopping', ST_GeogFromText('POINT(75.8267 26.9196)'),
     60, NULL, '10:30', '21:00', 0, ARRAY['en','hi']),

    ('b1000000-0000-0000-0000-000000000007', 'a1a1a1a1-0000-0000-0000-000000000001',
     'Chokhi Dhani', 'entertainment', ST_GeogFromText('POINT(75.8138 26.7783)'),
     150, 5000, '17:00', '23:00', 900, ARRAY['en','hi']),

    ('b1000000-0000-0000-0000-000000000008', 'a1a1a1a1-0000-0000-0000-000000000001',
     'Albert Hall Museum', 'museum', ST_GeogFromText('POINT(75.8194 26.9114)'),
     60, 1200, '09:00', '17:00', 150, ARRAY['en','hi']);

-- Sample properties for hotelier dashboard demo
INSERT INTO properties (id, destination_id, name, location, total_rooms, star_rating, amenities)
VALUES
    ('c1000000-0000-0000-0000-000000000001', 'a1a1a1a1-0000-0000-0000-000000000001',
     'Pink City Heritage Stay', ST_GeogFromText('POINT(75.8225 26.9200)'), 40, 4,
     ARRAY['wifi','pool','breakfast']),
    ('c1000000-0000-0000-0000-000000000002', 'a1a1a1a1-0000-0000-0000-000000000001',
     'Amber Boutique Hotel', ST_GeogFromText('POINT(75.8490 26.9800)'), 25, 3,
     ARRAY['wifi','parking']);
