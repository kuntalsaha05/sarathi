from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.ml.forecasting import forecast_poi_footfall

router = APIRouter(prefix="/forecast", tags=["forecast"])


@router.get("/poi/{poi_id}")
async def get_poi_forecast(
    poi_id: str,
    horizon_hours: int = Query(48, ge=1, le=24 * 14),
    model: str | None = Query(None, description="Force 'prophet', 'lightgbm', or 'naive'"),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(text("""
        SELECT observed_at, footfall_count
        FROM footfall_records
        WHERE poi_id = :poi_id AND is_forecast = false
        ORDER BY observed_at
    """), {"poi_id": poi_id})
    rows = result.all()

    if not rows:
        raise HTTPException(status_code=404, detail="No footfall history for this POI. Seed data first.")

    history = [(r.observed_at, r.footfall_count) for r in rows]
    forecast = forecast_poi_footfall(poi_id, history, horizon_hours=horizon_hours, prefer_model=model)

    return {
        "poi_id": poi_id,
        "model_used": forecast.model_used,
        "history_points": len(history),
        "forecast": [
            {
                "timestamp": p.timestamp.isoformat(),
                "predicted_footfall": round(p.predicted_value, 1),
                "lower_bound": round(p.lower_bound, 1),
                "upper_bound": round(p.upper_bound, 1),
            }
            for p in forecast.points
        ],
    }


@router.post("/poi/{poi_id}/persist")
async def persist_poi_forecast(
    poi_id: str,
    horizon_hours: int = Query(48, ge=1, le=24 * 14),
    db: AsyncSession = Depends(get_db),
):
    """Compute a forecast and write it back to footfall_records (is_forecast=true)
    so the hotelier dashboard / trip planner can query forecast + history uniformly."""
    result = await db.execute(text("""
        SELECT observed_at, footfall_count
        FROM footfall_records
        WHERE poi_id = :poi_id AND is_forecast = false
        ORDER BY observed_at
    """), {"poi_id": poi_id})
    rows = result.all()
    if not rows:
        raise HTTPException(status_code=404, detail="No footfall history for this POI.")

    history = [(r.observed_at, r.footfall_count) for r in rows]
    forecast = forecast_poi_footfall(poi_id, history, horizon_hours=horizon_hours)

    await db.execute(text("""
        DELETE FROM footfall_records WHERE poi_id = :poi_id AND is_forecast = true
    """), {"poi_id": poi_id})

    for p in forecast.points:
        await db.execute(text("""
            INSERT INTO footfall_records
                (poi_id, observed_at, footfall_count, is_synthetic, is_forecast, source)
            VALUES (:poi_id, :observed_at, :count, false, true, :model)
        """), {
            "poi_id": poi_id,
            "observed_at": p.timestamp,
            "count": round(p.predicted_value),
            "model": forecast.model_used,
        })
    await db.commit()

    return {"poi_id": poi_id, "model_used": forecast.model_used, "points_written": len(forecast.points)}
