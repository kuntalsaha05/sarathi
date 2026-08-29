from typing import Any, Dict, Optional
from fastapi import APIRouter, Query, WebSocket, WebSocketDisconnect
from pydantic import BaseModel

from app.core.ws_manager import ws_manager
from app.services.event_simulator import simulator

router = APIRouter(prefix="/realtime", tags=["realtime"])


class TriggerEventRequest(BaseModel):
    event_type: str = "crowd_spike"
    poi_id: Optional[str] = None
    custom_payload: Optional[Dict[str, Any]] = None


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, channel: str = Query("all")):
    """WebSocket endpoint for real-time crowd alerts, dynamic rerouting suggestions, and hotelier updates."""
    await ws_manager.connect(websocket, channel=channel)
    try:
        # Send initial welcome & connection confirmation
        await websocket.send_json({
            "event_type": "connection_established",
            "channel": channel,
            "message": "Connected to SARATHI Real-Time Intelligence Stream",
            "recent_events": ws_manager.get_recent_events(limit=5)
        })
        while True:
            # Keep connection open and listen for any client messages or pings
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception:
        ws_manager.disconnect(websocket)


@router.get("/events")
async def get_recent_events(limit: int = Query(20, ge=1, le=100)):
    """Retrieve recent real-time events published on the platform."""
    return {
        "count": len(ws_manager.get_recent_events(limit)),
        "events": ws_manager.get_recent_events(limit)
    }


@router.get("/crowds/live")
async def get_live_crowds():
    """Returns the current real-time crowd saturation state across all Jaipur POIs."""
    return {
        "status": "live",
        "pois": simulator.get_current_crowd_state()
    }


@router.post("/events/trigger")
async def trigger_event(req: TriggerEventRequest):
    """Trigger a custom crowd surge or tourism event (used for live SIH presentation demos)."""
    payload = req.custom_payload or {}
    if req.poi_id:
        payload["poi_id"] = req.poi_id

    event = await simulator.trigger_event(req.event_type, custom_payload=payload)
    return {
        "status": "broadcast_success",
        "active_subscribers": len(ws_manager.active_connections),
        "event": event
    }


@router.post("/simulator/start")
async def start_simulator(interval_seconds: int = Query(15, ge=5, le=120)):
    """Starts the automatic background crowd & incident simulation loop."""
    simulator.start(interval_seconds=interval_seconds)
    return {"status": "simulator_running", "interval_seconds": interval_seconds}


@router.post("/simulator/stop")
async def stop_simulator():
    """Stops the automatic background simulation loop."""
    simulator.stop()
    return {"status": "simulator_stopped"}

