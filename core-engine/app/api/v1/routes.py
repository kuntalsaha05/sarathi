from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.optimizer.ortools_solver import solve_mocop
from app.optimizer.cost_matrix import build_cost_matrix

router = APIRouter()


class OptimizeRequest(BaseModel):
    origin: str
    destination: str
    waypoints: List[str]
    constraints: dict
    start_time: str


class OptimizeResponse(BaseModel):
    route: List[str]
    estimated_time: float
    total_cost: float
    alerts: List[str]


@router.post("/optimize", response_model=OptimizeResponse)
async def optimize_route(req: OptimizeRequest):
    matrix = await build_cost_matrix(req.origin, req.destination, req.waypoints)
    result = solve_mocop(matrix, req.constraints)
    return OptimizeResponse(**result)


@router.post("/reroute")
async def reroute(req: dict):
    matrix = await build_cost_matrix(req.get("origin"), req.get("destination"), req.get("waypoints", []))
    result = solve_mocop(matrix, req.get("constraints", {}))
    return result
