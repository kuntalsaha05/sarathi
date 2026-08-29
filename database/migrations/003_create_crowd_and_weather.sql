-- Crowd Logs (Historical & Real-time)
CREATE TABLE IF NOT EXISTS crowd_logs (
    id BIGSERIAL PRIMARY KEY,
    poi_id INT REFERENCES pois(id),
    timestamp TIMESTAMP NOT NULL,
    current_pax INT NOT NULL,
    congestion_ratio NUMERIC(4,3) GENERATED ALWAYS AS (current_pax::NUMERIC / NULLIF(current_pax, 0)) STORED,
    weather_condition VARCHAR(50) DEFAULT 'Clear',
    season VARCHAR(20)
);

CREATE INDEX IF NOT EXISTS idx_crowd_logs_poi_time ON crowd_logs(poi_id, timestamp);

-- Weather Events / Hazard Alerts
CREATE TABLE IF NOT EXISTS weather_events (
    id SERIAL PRIMARY KEY,
    geom GEOMETRY(Polygon, 4326),
    event_type VARCHAR(50),
    severity INT CHECK (severity BETWEEN 1 AND 5),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL
);
