from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from app.optimizer.vrptw_solver import solve_sarathi_itinerary
from app.optimizer.cost_matrix import build_cost_matrix
from app.optimizer.crowd_penalty import compute_dynamic_costs

router = APIRouter()


class OptimizeRequest(BaseModel):
    origin: str
    destination: str
    waypoints: List[str]
    constraints: Dict[str, Any]
    start_time: str


class OptimizeResponse(BaseModel):
    status: str
    route: List[Dict[str, Any]]
    total_time_min: float
    alerts: List[str]


@router.post("/optimize", response_model=OptimizeResponse)
async def optimize_route(req: OptimizeRequest):
    distance_matrix, time_matrix = await build_cost_matrix(req.origin, req.destination, req.waypoints)
    crowd_penalties = await compute_dynamic_costs(req.waypoints, req.start_time)
    result = solve_sarathi_itinerary(time_matrix, crowd_penalties)
    return OptimizeResponse(
        status=result["status"],
        route=result.get("route", []),
        total_time_min=result.get("total_time_min", 0),
        alerts=result.get("alerts", []),
    )


@router.post("/reroute")
async def reroute(req: Dict[str, Any]):
    distance_matrix, time_matrix = await build_cost_matrix(
        req.get("origin"), req.get("destination"), req.get("waypoints", [])
    )
    crowd_penalties = await compute_dynamic_costs(req.get("waypoints", []), req.get("start_time", ""))
    result = solve_sarathi_itinerary(time_matrix, crowd_penalties)
    return result
