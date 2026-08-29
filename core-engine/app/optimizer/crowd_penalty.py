from typing import List, Dict, Any
from app.db.local_store import get_poi_by_identifier

ALPHA = 15.0
BETA = 45.0


async def compute_dynamic_costs(waypoints: List[Any], start_time: str = "") -> List[float]:
    """
    Compute penalty-adjusted costs for each waypoint.
    Cost_edge(i,j,t) = BaseTravelTime(i,j) + alpha * (Pax_current(j,t) / Pax_max(j))^2 + beta * WeatherHazardPenalty(j,t)
    """
    penalties = []
    for wp in waypoints:
        crowd_ratio = _get_crowd_ratio(wp)
        weather_penalty = _get_weather_hazard(wp)
        penalty = ALPHA * (crowd_ratio ** 2) + BETA * weather_penalty
        penalties.append(penalty)
    return penalties


def _get_crowd_ratio(node: Any) -> float:
    poi = get_poi_by_identifier(node)
    if poi:
        return float(poi.get("congestionRatio", 0.35))
    return 0.35


def _get_weather_hazard(node: Any) -> float:
    return 0.0
