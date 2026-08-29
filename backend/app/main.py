from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import destinations, forecast, health, hotelier, realtime, routing, voice
from app.core.config import get_settings

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description="Smart Autonomous Routing & Adaptive Tourism Hospitality Intelligence",
    version="0.3.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(destinations.router)
app.include_router(routing.router)
app.include_router(forecast.router)
app.include_router(realtime.router)
app.include_router(hotelier.router)
app.include_router(voice.router)


@app.get("/")
async def root():
    return {
        "name": settings.app_name,
        "status": "running",
        "phase": "3 — Dual-Interface Build & Real-Time Sync",
        "endpoints": {
            "health": "/health",
            "destinations": "/destinations",
            "plan_trip": "/routing/plan-trip",
            "forecast": "/forecast/poi/{id}",
            "realtime_ws": "/realtime/ws",
            "live_crowds": "/realtime/crowds/live",
            "hotelier_overview": "/hotelier/overview",
            "voice_parse": "/voice/parse-intent",
        }
    }

