"""
matrix_service.py

Produces travel-time / travel-distance matrices between a set of locations.
Three-tier strategy, in priority order:

    1. OSRM (self-hosted or public demo server)   -- free, fast, no key needed
    2. Mapbox Matrix API                            -- fallback if OSRM unreachable
    3. Haversine + average-speed estimate            -- offline fallback so the
                                                         TD-VRPTW solver and the
                                                         judging-day demo NEVER
                                                         hard-fail on network loss

All three return the same shape:
    duration_matrix[i][j]  -> seconds to travel from location i to location j
    distance_matrix[i][j]  -> meters from location i to location j

Time-dependence (rush-hour slowdowns) is layered on top via a simple
multiplier curve keyed by hour-of-day, since OSRM/Mapbox free tiers don't
give live traffic for India. This is what makes the VRP "TD" (time-dependent).
"""

import math
from dataclasses import dataclass
from typing import Sequence

import httpx

from app.core.config import get_settings

settings = get_settings()

EARTH_RADIUS_M = 6_371_000
AVG_URBAN_SPEED_KMPH = 22.0  # conservative Indian tourist-city driving speed


@dataclass
class Location:
    id: str
    lat: float
    lng: float


def haversine_distance_m(a: Location, b: Location) -> float:
    lat1, lng1, lat2, lng2 = map(math.radians, [a.lat, a.lng, b.lat, b.lng])
    dlat = lat2 - lat1
    dlng = lng2 - lng1
    h = (math.sin(dlat / 2) ** 2
         + math.cos(lat1) * math.cos(lat2) * math.sin(dlng / 2) ** 2)
    return 2 * EARTH_RADIUS_M * math.asin(math.sqrt(h))


# Hour-of-day congestion multiplier applied to base travel time.
# >1.0 = slower than free-flow (rush hour), 1.0 = free-flow.
HOURLY_CONGESTION = {
    0: 0.85, 1: 0.85, 2: 0.85, 3: 0.85, 4: 0.85, 5: 0.90,
    6: 1.00, 7: 1.15, 8: 1.35, 9: 1.30, 10: 1.10, 11: 1.05,
    12: 1.10, 13: 1.10, 14: 1.05, 15: 1.10, 16: 1.20, 17: 1.40,
    18: 1.45, 19: 1.35, 20: 1.15, 21: 1.00, 22: 0.90, 23: 0.85,
}


def congestion_multiplier(hour: int) -> float:
    return HOURLY_CONGESTION.get(hour % 24, 1.0)


def _haversine_matrix(locations: Sequence[Location]) -> tuple[list[list[float]], list[list[float]]]:
    n = len(locations)
    distance = [[0.0] * n for _ in range(n)]
    duration = [[0.0] * n for _ in range(n)]
    speed_mps = AVG_URBAN_SPEED_KMPH * 1000 / 3600
    for i in range(n):
        for j in range(n):
            if i == j:
                continue
            # Manhattan-ish penalty (1.3x) to roughly approximate road networks
            # over straight-line distance in a dense old-city layout.
            d = haversine_distance_m(locations[i], locations[j]) * 1.3
            distance[i][j] = d
            duration[i][j] = d / speed_mps
    return distance, duration


async def _osrm_matrix(locations: Sequence[Location]) -> tuple[list[list[float]], list[list[float]]] | None:
    coords = ";".join(f"{loc.lng},{loc.lat}" for loc in locations)
    url = f"{settings.osrm_base_url}/table/v1/driving/{coords}"
    params = {"annotations": "distance,duration"}
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(url, params=params)
            resp.raise_for_status()
            data = resp.json()
            if data.get("code") != "Ok":
                return None
            return data["distances"], data["durations"]
    except Exception:
        return None


async def _mapbox_matrix(locations: Sequence[Location]) -> tuple[list[list[float]], list[list[float]]] | None:
    if not settings.mapbox_access_token:
        return None
    coords = ";".join(f"{loc.lng},{loc.lat}" for loc in locations)
    url = f"https://api.mapbox.com/directions-matrix/v1/mapbox/driving/{coords}"
    params = {"annotations": "distance,duration", "access_token": settings.mapbox_access_token}
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(url, params=params)
            resp.raise_for_status()
            data = resp.json()
            if data.get("code") != "Ok":
                return None
            return data["distances"], data["durations"]
    except Exception:
        return None


async def get_matrix(
    locations: Sequence[Location],
    depart_hour: int = 9,
) -> dict:
    """
    Returns a dict:
        {
            "distance_matrix": [[meters,...],...],
            "duration_matrix": [[seconds,...],...],   # time-dependent adjusted
            "source": "osrm" | "mapbox" | "haversine_fallback"
        }
    """
    result = await _osrm_matrix(locations)
    source = "osrm"
    if result is None:
        result = await _mapbox_matrix(locations)
        source = "mapbox"
    if result is None:
        result = _haversine_matrix(locations)
        source = "haversine_fallback"

    distance_matrix, duration_matrix = result
    mult = congestion_multiplier(depart_hour)
    duration_matrix = [[d * mult for d in row] for row in duration_matrix]

    return {
        "distance_matrix": distance_matrix,
        "duration_matrix": duration_matrix,
        "source": source,
    }
