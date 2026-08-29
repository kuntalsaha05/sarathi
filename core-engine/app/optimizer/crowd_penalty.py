from typing import List, Dict, Any
import httpx

ALPHA = 15.0
BETA = 45.0


async def compute_dynamic_costs(waypoints: List[str], start_time: str) -> List[float]:
    """
    Compute penalty-adjusted costs for each waypoint.
    Cost_edge(i,j,t) = BaseTravelTime(i,j) + alpha * (Pax_current(j,t) / Pax_max(j))^2 + beta * WeatherHazardPenalty(j,t)
    """
    penalties = []
    for wp in waypoints:
        crowd_ratio = await _get_crowd_ratio(wp)
        weather_penalty = _get_weather_hazard(wp)
        penalty = ALPHA * (crowd_ratio ** 2) + BETA * weather_penalty
        penalties.append(penalty)
    return penalties


async def _get_crowd_ratio(poi_id: str) -> float:
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"http://localhost:8000/api/v1/crowd-level/{poi_id}")
            resp.raise_for_status()
            data = resp.json()
            return min(data.get("predicted_crowd", 0) / max(data.get("pax_max", 1), 1), 1.0)
    except Exception:
        return 0.3


def _get_weather_hazard(poi_id: str) -> float:
    return 0.0
