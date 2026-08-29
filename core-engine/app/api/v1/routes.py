from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from app.optimizer.vrptw_solver import solve_sarathi_itinerary
from app.optimizer.cost_matrix import build_cost_matrix, resolve_coordinates
from app.optimizer.crowd_penalty import compute_dynamic_costs
from app.db.local_store import get_all_pois, get_all_hotels, get_poi_by_identifier, set_live_crowd

router = APIRouter()


class OptimizeRequest(BaseModel):
    origin: str = "Pune"
    destination: str = "Mahabaleshwar"
    waypoints: List[str] = ["Bhushi Dam", "Tiger Point (Lions Point)", "Karla Caves"]
    constraints: Optional[Dict[str, Any]] = None
    start_time: Optional[str] = "09:00"


class OptimizeResponse(BaseModel):
    status: str
    route: List[Dict[str, Any]]
    total_time_min: float
    alerts: List[str]


class CrowdUpdateRequest(BaseModel):
    poiId: int
    newCongestionRatio: float


@router.get("/pois")
async def list_pois():
    """Returns all circuit POIs with real-time crowd congestion indicators."""
    return get_all_pois()


@router.get("/hotels")
async def list_hotels():
    """Returns all registered hotels along the circuit."""
    return get_all_hotels()


@router.post("/crowd-update")
async def update_crowd(req: CrowdUpdateRequest):
    """Updates live crowd congestion ratio for a POI without requiring Redis."""
    set_live_crowd(req.poiId, req.newCongestionRatio)
    return {"status": "success", "poiId": req.poiId, "newCongestionRatio": req.newCongestionRatio}


@router.post("/optimize", response_model=OptimizeResponse)
async def optimize_route(req: OptimizeRequest):
    all_nodes = [req.origin] + req.waypoints + [req.destination]
    distance_matrix, time_matrix = await build_cost_matrix(req.origin, req.destination, req.waypoints)
    crowd_penalties = await compute_dynamic_costs(req.waypoints, req.start_time or "")
    
    # Pad crowd penalties for origin and destination
    padded_penalties = [0.0] + list(crowd_penalties) + [0.0]
    
    result = solve_sarathi_itinerary(time_matrix, padded_penalties)

    # Enrich route stops with names and coordinates
    enriched_route = []
    alerts = list(result.get("alerts", []))
    for stop in result.get("route", []):
        node_idx = stop["poi_index"]
        if node_idx < len(all_nodes):
            node_identifier = all_nodes[node_idx]
            lat, lon = resolve_coordinates(node_identifier)
            poi_info = get_poi_by_identifier(node_identifier)
            name = poi_info["name"] if poi_info else str(node_identifier)
            category = poi_info.get("category", "hub") if poi_info else "hub"
            congestion = poi_info.get("congestionRatio", 0.3) if poi_info else 0.2
            
            if congestion > 0.85:
                alerts.append(f"High crowd surge (>85%) at {name}. Alternative suggested.")
                
            enriched_route.append({
                "poi_index": node_idx,
                "name": name,
                "lat": lat,
                "lon": lon,
                "category": category,
                "congestion_ratio": congestion,
                "arrival_time_min": stop["arrival_time_min"],
                "departure_time_min": stop["departure_time_min"]
            })

    return OptimizeResponse(
        status=result["status"],
        route=enriched_route,
        total_time_min=result.get("total_time_min", 0),
        alerts=alerts,
    )


@router.post("/reroute")
async def reroute(req: Dict[str, Any]):
    origin = req.get("origin", "Pune")
    destination = req.get("destination", "Mahabaleshwar")
    waypoints = req.get("waypoints", [])
    distance_matrix, time_matrix = await build_cost_matrix(origin, destination, waypoints)
    crowd_penalties = await compute_dynamic_costs(waypoints, req.get("start_time", ""))
    padded_penalties = [0.0] + list(crowd_penalties) + [0.0]
    result = solve_sarathi_itinerary(time_matrix, padded_penalties)
    return result
