CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS poi_nodes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    geom GEOMETRY(Point, 4326) NOT NULL,
    type VARCHAR(100),
    capacity INT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_poi_nodes_geom ON poi_nodes USING GIST (geom);
