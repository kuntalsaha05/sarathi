CREATE EXTENSION IF NOT EXISTS postgis;

-- POIs Table
CREATE TABLE IF NOT EXISTS pois (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    circuit VARCHAR(100) DEFAULT 'Pune-Lonavala-Mahabaleshwar',
    geom GEOMETRY(Point, 4326) NOT NULL,
    pax_max INT NOT NULL,
    avg_dwell_minutes INT NOT NULL,
    entry_fee NUMERIC(8,2) DEFAULT 0.0,
    opening_hour INT DEFAULT 8,
    closing_hour INT DEFAULT 18,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pois_geom ON pois USING GIST (geom);
