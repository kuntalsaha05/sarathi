from fastapi import APIRouter, Depends
from redis.asyncio import Redis
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.db import get_db

router = APIRouter(prefix="/health", tags=["health"])


@router.get("")
async def health_check(db: AsyncSession = Depends(get_db)):
    settings = get_settings()
    status = {"app": settings.app_name, "postgres": "unknown", "redis": "unknown"}

    try:
        await db.execute(text("SELECT 1"))
        status["postgres"] = "ok"
    except Exception as e:  # noqa: BLE001
        status["postgres"] = f"error: {e}"

    try:
        redis_client = Redis.from_url(settings.redis_url)
        await redis_client.ping()
        status["redis"] = "ok"
        await redis_client.close()
    except Exception as e:  # noqa: BLE001
        status["redis"] = f"error: {e}"

    return status
