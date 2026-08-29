from datetime import datetime, time as dtime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.ml.forecasting import crowd_penalty_from_forecast, forecast_poi_footfall
from app.ml.vrptw_solver import POINode, SolveResult, TripConstraints, solve_td_vrptw
from app.services.matrix_service import Location, get_matrix

router = APIRouter(prefix="/routing", tags=["routing"])


class PlanTripRequest(BaseModel):
    destination_id: str
    start_lat: float
    start_lng: float
    trip_date: str = Field(description="YYYY-MM-DD")
    start_time: str = Field(default="09:00", description="HH:MM")
    max_trip_hours: float = Field(default=10.0, ge=1, le=16)
    poi_ids: list[str] | None = Field(
        default=None, description="Specific POIs to consider; omit to use all POIs in the destination."
    )
    avoid_crowds: bool = Field(default=True, description="Weight route toward lower predicted footfall.")


def _minutes_from_hhmm(hhmm: str) -> int:
    h, m = map(int, hhmm.split(":"))
    return h * 60 + m


@router.post("/plan-trip")
async def plan_trip(req: PlanTripRequest, db: AsyncSession = Depends(get_db)):
    poi_query = """
        SELECT id, name, ST_Y(location::geometry) AS lat, ST_X(location::geometry) AS lng,
               avg_visit_minutes, max_capacity, opening_time, closing_time
        FROM points_of_interest
        WHERE destination_id = :destination_id
    """
    params = {"destination_id": req.destination_id}
    if req.poi_ids:
        poi_query += " AND id = ANY(:poi_ids)"
        params["poi_ids"] = req.poi_ids

    result = await db.execute(text(poi_query), params)
    poi_rows = result.mappings().all()
    if not poi_rows:
        raise HTTPException(status_code=404, detail="No POIs found for this destination/selection.")

    start_minute = _minutes_from_hhmm(req.start_time)
    trip_date = datetime.fromisoformat(req.trip_date)
    depart_hour = start_minute // 60

    # Build location list: index 0 = tourist start point, 1..n = POIs
    locations = [Location(id="start", lat=req.start_lat, lng=req.start_lng)]
    locations += [Location(id=str(r["id"]), lat=r["lat"], lng=r["lng"]) for r in poi_rows]

    matrix = await get_matrix(locations, depart_hour=depart_hour)

    nodes: list[POINode] = []
    for r in poi_rows:
        open_t: dtime | None = r["opening_time"]
        close_t: dtime | None = r["closing_time"]
        open_minute = open_t.hour * 60 + open_t.minute if open_t else 0
        close_minute = close_t.hour * 60 + close_t.minute if close_t else 23 * 60 + 59
        if close_minute <= open_minute:
            close_minute = 23 * 60 + 59

        crowd_penalty = 0
        if req.avoid_crowds:
            try:
                hist = await db.execute(text("""
                    SELECT observed_at, footfall_count FROM footfall_records
                    WHERE poi_id = :poi_id AND is_forecast = false ORDER BY observed_at
                """), {"poi_id": r["id"]})
                hist_rows = [(row.observed_at, row.footfall_count) for row in hist.all()]
                if hist_rows:
                    fc = forecast_poi_footfall(str(r["id"]), hist_rows, horizon_hours=24)
                    target_dt = trip_date.replace(hour=depart_hour, minute=0, second=0, microsecond=0)
                    crowd_penalty = crowd_penalty_from_forecast(fc, r["max_capacity"], target_dt)
            except Exception:
                crowd_penalty = 0  # never let forecasting hiccups block trip planning

        nodes.append(POINode(
            id=str(r["id"]),
            name=r["name"],
            visit_minutes=r["avg_visit_minutes"] or 45,
            open_minute=open_minute,
            close_minute=close_minute,
            crowd_penalty=crowd_penalty,
            priority=3,
        ))

    constraints = TripConstraints(
        start_minute=start_minute,
        max_trip_minutes=int(req.max_trip_hours * 60),
    )

    result: SolveResult = solve_td_vrptw(
        nodes=nodes,
        duration_matrix=matrix["duration_matrix"],
        distance_matrix=matrix["distance_matrix"],
        constraints=constraints,
    )

    return {
        "status": result.status,
        "matrix_source": matrix["source"],
        "total_distance_km": result.total_distance_km,
        "total_travel_minutes": result.total_travel_minutes,
        "stops": result.ordered_stops,
        "dropped_stops": result.dropped_stops,
    }
