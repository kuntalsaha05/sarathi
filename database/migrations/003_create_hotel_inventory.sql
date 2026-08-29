CREATE TABLE IF NOT EXISTS hotels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    poi_id INT REFERENCES pois(id),
    star_rating INT CHECK (star_rating BETWEEN 1 AND 5),
    room_count INT NOT NULL,
    available_rooms INT NOT NULL,
    base_price NUMERIC(10,2) NOT NULL,
    current_price NUMERIC(10,2) NOT NULL,
    amenities JSONB DEFAULT '[]'::jsonb,
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hotels_poi ON hotels(poi_id);
CREATE INDEX IF NOT EXISTS idx_hotels_price ON hotels(current_price);
