"""
Embedded Local Spatial & POI Data Store for Project SARATHI
Enables 100% standalone operation without external Docker, PostgreSQL, or Redis dependencies.
"""
import sqlite3
import os
import math
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "sarathi_local.db")

PILOT_POIS = [
    {
        "id": 1,
        "name": "Shaniwar Wada",
        "category": "heritage",
        "circuit": "Pune-Lonavala-Mahabaleshwar",
        "lat": 18.5196,
        "lon": 73.8553,
        "pax_max": 600,
        "avg_dwell_minutes": 60,
        "entry_fee": 50.0,
        "opening_hour": 9,
        "closing_hour": 18,
    },
    {
        "id": 2,
        "name": "Aga Khan Palace",
        "category": "heritage",
        "circuit": "Pune-Lonavala-Mahabaleshwar",
        "lat": 18.5524,
        "lon": 73.9016,
        "pax_max": 450,
        "avg_dwell_minutes": 75,
        "entry_fee": 25.0,
        "opening_hour": 9,
        "closing_hour": 17,
    },
    {
        "id": 3,
        "name": "Sinhagad Fort",
        "category": "heritage",
        "circuit": "Pune-Lonavala-Mahabaleshwar",
        "lat": 18.3663,
        "lon": 73.7554,
        "pax_max": 1200,
        "avg_dwell_minutes": 120,
        "entry_fee": 50.0,
        "opening_hour": 6,
        "closing_hour": 18,
    },
    {
        "id": 4,
        "name": "Bhushi Dam",
        "category": "nature",
        "circuit": "Pune-Lonavala-Mahabaleshwar",
        "lat": 18.7302,
        "lon": 73.4072,
        "pax_max": 1500,
        "avg_dwell_minutes": 90,
        "entry_fee": 0.0,
        "opening_hour": 8,
        "closing_hour": 17,
    },
    {
        "id": 5,
        "name": "Tiger Point (Lions Point)",
        "category": "viewpoint",
        "circuit": "Pune-Lonavala-Mahabaleshwar",
        "lat": 18.7088,
        "lon": 73.3980,
        "pax_max": 800,
        "avg_dwell_minutes": 60,
        "entry_fee": 20.0,
        "opening_hour": 6,
        "closing_hour": 19,
    },
    {
        "id": 6,
        "name": "Karla Caves",
        "category": "heritage",
        "circuit": "Pune-Lonavala-Mahabaleshwar",
        "lat": 18.7828,
        "lon": 73.4704,
        "pax_max": 500,
        "avg_dwell_minutes": 90,
        "entry_fee": 25.0,
        "opening_hour": 9,
        "closing_hour": 17,
    },
    {
        "id": 7,
        "name": "Rajmachi Fort Point",
        "category": "adventure",
        "circuit": "Pune-Lonavala-Mahabaleshwar",
        "lat": 18.8286,
        "lon": 73.3989,
        "pax_max": 400,
        "avg_dwell_minutes": 150,
        "entry_fee": 0.0,
        "opening_hour": 6,
        "closing_hour": 18,
    },
    {
        "id": 8,
        "name": "Arthur Seat Point",
        "category": "viewpoint",
        "circuit": "Pune-Lonavala-Mahabaleshwar",
        "lat": 17.9856,
        "lon": 73.6062,
        "pax_max": 700,
        "avg_dwell_minutes": 60,
        "entry_fee": 0.0,
        "opening_hour": 6,
        "closing_hour": 18,
    },
    {
        "id": 9,
        "name": "Venna Lake",
        "category": "nature",
        "circuit": "Pune-Lonavala-Mahabaleshwar",
        "lat": 17.9237,
        "lon": 73.6627,
        "pax_max": 1000,
        "avg_dwell_minutes": 90,
        "entry_fee": 50.0,
        "opening_hour": 7,
        "closing_hour": 20,
    },
    {
        "id": 10,
        "name": "Mapro Garden Panchgani",
        "category": "nature",
        "circuit": "Pune-Lonavala-Mahabaleshwar",
        "lat": 17.9254,
        "lon": 73.7431,
        "pax_max": 850,
        "avg_dwell_minutes": 75,
        "entry_fee": 0.0,
        "opening_hour": 8,
        "closing_hour": 20,
    },
    {
        "id": 11,
        "name": "Pratapgad Fort",
        "category": "heritage",
        "circuit": "Pune-Lonavala-Mahabaleshwar",
        "lat": 17.9299,
        "lon": 73.5786,
        "pax_max": 900,
        "avg_dwell_minutes": 120,
        "entry_fee": 50.0,
        "opening_hour": 6,
        "closing_hour": 18,
    },
    {
        "id": 12,
        "name": "Table Land Panchgani",
        "category": "viewpoint",
        "circuit": "Pune-Lonavala-Mahabaleshwar",
        "lat": 17.9248,
        "lon": 73.8058,
        "pax_max": 1200,
        "avg_dwell_minutes": 90,
        "entry_fee": 0.0,
        "opening_hour": 6,
        "closing_hour": 19,
    },
]

PILOT_HOTELS = [
    {
        "id": 1,
        "name": "Hotel Shreeman Pune",
        "lat": 18.5204,
        "lon": 73.8563,
        "total_rooms": 80,
        "base_price_per_night": 3500.0,
        "category": "mid-range",
    },
    {
        "id": 2,
        "name": "The Westin Pune",
        "lat": 18.5196,
        "lon": 73.8553,
        "total_rooms": 120,
        "base_price_per_night": 8500.0,
        "category": "luxury",
    },
    {
        "id": 3,
        "name": "Lonavala Hill Resort",
        "lat": 18.7545,
        "lon": 73.4060,
        "total_rooms": 60,
        "base_price_per_night": 4500.0,
        "category": "mid-range",
    },
    {
        "id": 4,
        "name": "Mahabaleshwar Highland Retreat",
        "lat": 17.9250,
        "lon": 73.6545,
        "total_rooms": 45,
        "base_price_per_night": 5200.0,
        "category": "mid-range",
    },
    {
        "id": 5,
        "name": "Panchgani Valley Cottage",
        "lat": 17.9254,
        "lon": 73.7431,
        "total_rooms": 30,
        "base_price_per_night": 3800.0,
        "category": "budget",
    },
]

_live_crowd_overrides: Dict[int, float] = {}


def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_local_database():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS pois (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        category TEXT NOT NULL,
        circuit TEXT DEFAULT 'Pune-Lonavala-Mahabaleshwar',
        lat REAL NOT NULL,
        lon REAL NOT NULL,
        pax_max INTEGER NOT NULL,
        avg_dwell_minutes INTEGER NOT NULL,
        entry_fee REAL DEFAULT 0.0,
        opening_hour INTEGER DEFAULT 8,
        closing_hour INTEGER DEFAULT 18
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS hotels (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        lat REAL NOT NULL,
        lon REAL NOT NULL,
        total_rooms INTEGER NOT NULL,
        base_price_per_night REAL NOT NULL,
        category TEXT
    )
    """)

    for poi in PILOT_POIS:
        cursor.execute("""
        INSERT OR REPLACE INTO pois (id, name, category, circuit, lat, lon, pax_max, avg_dwell_minutes, entry_fee, opening_hour, closing_hour)
        VALUES (:id, :name, :category, :circuit, :lat, :lon, :pax_max, :avg_dwell_minutes, :entry_fee, :opening_hour, :closing_hour)
        """, poi)

    for hotel in PILOT_HOTELS:
        cursor.execute("""
        INSERT OR REPLACE INTO hotels (id, name, lat, lon, total_rooms, base_price_per_night, category)
        VALUES (:id, :name, :lat, :lon, :total_rooms, :base_price_per_night, :category)
        """, hotel)

    conn.commit()
    conn.close()


def get_all_pois() -> List[Dict[str, Any]]:
    init_local_database()
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM pois ORDER BY id ASC").fetchall()
    conn.close()
    
    result = []
    for r in rows:
        d = dict(r)
        poi_id = d["id"]
        d["congestionRatio"] = _live_crowd_overrides.get(poi_id, 0.35 + (poi_id % 4) * 0.12)
        d["currentPax"] = int(d["pax_max"] * d["congestionRatio"])
        result.append(d)
    return result


def get_poi_by_identifier(identifier: Any) -> Optional[Dict[str, Any]]:
    init_local_database()
    pois = get_all_pois()
    if isinstance(identifier, int) or (isinstance(identifier, str) and str(identifier).isdigit()):
        poi_id = int(identifier)
        for p in pois:
            if p["id"] == poi_id:
                return p
    if isinstance(identifier, str):
        ident_lower = identifier.lower().strip()
        for p in pois:
            if ident_lower in p["name"].lower() or p["name"].lower() in ident_lower:
                return p
    return None


def get_all_hotels() -> List[Dict[str, Any]]:
    init_local_database()
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM hotels ORDER BY id ASC").fetchall()
    conn.close()
    return [dict(r) for r in rows]


def set_live_crowd(poi_id: int, ratio: float):
    _live_crowd_overrides[poi_id] = min(max(ratio, 0.0), 1.0)


init_local_database()

