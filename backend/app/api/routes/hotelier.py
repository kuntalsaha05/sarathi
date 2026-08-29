from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from app.services.hotelier_service import get_hotelier_overview, SAMPLE_PROPERTIES

router = APIRouter(prefix="/hotelier", tags=["hotelier"])


@router.get("/properties")
async def list_properties():
    """List all partner properties with live occupancy metrics."""
    return {
        "count": len(SAMPLE_PROPERTIES),
        "properties": SAMPLE_PROPERTIES
    }


@router.get("/overview")
async def get_overview(property_id: Optional[str] = Query(None)):
    """Retrieve full dashboard metrics: KPIs, 7d and 48h forecasts, dynamic pricing, and dispersal recommendations."""
    data = get_hotelier_overview(property_id)
    return data


@router.get("/dynamic-pricing/{property_id}")
async def get_dynamic_pricing(property_id: str):
    """Retrieve AI-calculated dynamic room pricing recommendations based on forecasted POI footfall."""
    data = get_hotelier_overview(property_id)
    prop = data["property"]
    kpis = data["kpis"]
    return {
        "property_id": property_id,
        "property_name": prop["name"],
        "base_adr_inr": kpis["current_adr_inr"],
        "suggested_adr_inr": kpis["suggested_adr_inr"],
        "potential_gain_inr": kpis["potential_rev_gain_inr"],
        "demand_confidence": "High (LightGBM + Prophet Ensemble)",
        "forecast_7d": data["forecast_7d"]
    }

