-- Hotels Table
CREATE TABLE IF NOT EXISTS hotels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    geom GEOMETRY(Point, 4326) NOT NULL,
    total_rooms INT NOT NULL,
    base_price_per_night NUMERIC(8,2) NOT NULL,
    category VARCHAR(50)
);

CREATE INDEX IF NOT EXISTS idx_hotels_geom ON hotels USING GIST (geom);

-- Itinerary Logs
CREATE TABLE IF NOT EXISTS itinerary_logs (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    trip_id VARCHAR(255) NOT NULL,
    origin POINT NOT NULL,
    destination POINT NOT NULL,
    waypoints JSONB DEFAULT '[]'::jsonb,
    optimized_route JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(50) DEFAULT 'planned',
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    disruption_events JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_itinerary_logs_user ON itinerary_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_logs_trip ON itinerary_logs(trip_id);
