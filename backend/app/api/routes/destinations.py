from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db

router = APIRouter(prefix="/destinations", tags=["destinations"])


@router.get("")
async def list_destinations(db: AsyncSession = Depends(get_db)):
    result = await db.execute(text("""
        SELECT id, name, state, country,
               ST_Y(centroid::geometry) AS lat,
               ST_X(centroid::geometry) AS lng
        FROM destinations
        ORDER BY name
    """))
    rows = result.mappings().all()
    return [dict(r) for r in rows]


@router.get("/{destination_id}/pois")
async def list_pois_for_destination(destination_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(text("""
        SELECT id, name, category,
               ST_Y(location::geometry) AS lat,
               ST_X(location::geometry) AS lng,
               avg_visit_minutes, max_capacity,
               opening_time, closing_time, entry_fee_inr
        FROM points_of_interest
        WHERE destination_id = :destination_id
        ORDER BY name
    """), {"destination_id": destination_id})
    rows = result.mappings().all()
    return [dict(r) for r in rows]
