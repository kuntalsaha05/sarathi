from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Optional
from app.forecasting.demand_model import forecast_demand
from app.forecasting.crowd_predictor import predict_crowd

router = APIRouter()


class ForecastRequest(BaseModel):
    poi_id: str
    horizon_days: int = 14


class ForecastResponse(BaseModel):
    poi_id: str
    dates: List[str]
    occupancy: List[float]
    confidence: List[float]


@router.post("/demand-forecast", response_model=ForecastResponse)
async def demand_forecast(req: ForecastRequest):
    result = forecast_demand(req.poi_id, req.horizon_days)
    return ForecastResponse(**result)


@router.get("/crowd-level/{poi_id}")
async def crowd_level(poi_id: str, timestamp: Optional[str] = None):
    return predict_crowd(poi_id, timestamp)
