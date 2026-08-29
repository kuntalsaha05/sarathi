import asyncio
import datetime
import logging
import random
from typing import Any, Dict, Optional
from app.core.ws_manager import ws_manager

logger = logging.getLogger("sarathi.simulator")

JAIPUR_POIS = [
    {
        "id": "b1000000-0000-0000-0000-000000000001",
        "name": "Amber Fort",
        "category": "heritage",
        "base_capacity": 4000,
        "current_crowd": 2400,
        "alt_recommendation": "Nahargarh Fort",
        "alt_poi_id": "b1000000-0000-0000-0000-000000000005"
    },
    {
        "id": "b1000000-0000-0000-0000-000000000002",
        "name": "Hawa Mahal",
        "category": "heritage",
        "base_capacity": 1500,
        "current_crowd": 1100,
        "alt_recommendation": "Albert Hall Museum",
        "alt_poi_id": "b1000000-0000-0000-0000-000000000008"
    },
    {
        "id": "b1000000-0000-0000-0000-000000000003",
        "name": "City Palace",
        "category": "heritage",
        "base_capacity": 2000,
        "current_crowd": 1350,
        "alt_recommendation": "Jal Mahal Promenade",
        "alt_poi_id": "b1000000-0000-0000-0000-000000000004"
    },
    {
        "id": "b1000000-0000-0000-0000-000000000004",
        "name": "Jal Mahal",
        "category": "viewpoint",
        "base_capacity": 3000,
        "current_crowd": 800,
        "alt_recommendation": "Nahargarh Fort",
        "alt_poi_id": "b1000000-0000-0000-0000-000000000005"
    },
    {
        "id": "b1000000-0000-0000-0000-000000000005",
        "name": "Nahargarh Fort",
        "category": "nature",
        "base_capacity": 2500,
        "current_crowd": 950,
        "alt_recommendation": "Amber Fort",
        "alt_poi_id": "b1000000-0000-0000-0000-000000000001"
    },
    {
        "id": "b1000000-0000-0000-0000-000000000006",
        "name": "Johari Bazaar",
        "category": "shopping",
        "base_capacity": 5000,
        "current_crowd": 2800,
        "alt_recommendation": "Bapu Bazaar",
        "alt_poi_id": "b1000000-0000-0000-0000-000000000006"
    },
    {
        "id": "b1000000-0000-0000-0000-000000000007",
        "name": "Chokhi Dhani",
        "category": "entertainment",
        "base_capacity": 5000,
        "current_crowd": 1200,
        "alt_recommendation": "Albert Hall Evening Light Show",
        "alt_poi_id": "b1000000-0000-0000-0000-000000000008"
    },
    {
        "id": "b1000000-0000-0000-0000-000000000008",
        "name": "Albert Hall Museum",
        "category": "museum",
        "base_capacity": 1200,
        "current_crowd": 450,
        "alt_recommendation": "City Palace",
        "alt_poi_id": "b1000000-0000-0000-0000-000000000003"
    }
]


class EventSimulator:
    def __init__(self):
        self._is_running = False
        self._task: Optional[asyncio.Task] = None
        self._current_state = {poi["id"]: dict(poi) for poi in JAIPUR_POIS}

    @property
    def is_running(self) -> bool:
        return self._is_running

    def get_current_crowd_state(self) -> list[Dict[str, Any]]:
        return list(self._current_state.values())

    async def trigger_event(self, event_type: str, custom_payload: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Manually trigger a realistic tourism / crowd event and broadcast it."""
        now_str = datetime.datetime.now(datetime.timezone.utc).isoformat()

        if event_type == "crowd_spike":
            poi = random.choice(JAIPUR_POIS)
            if custom_payload and "poi_id" in custom_payload:
                poi = next((p for p in JAIPUR_POIS if p["id"] == custom_payload["poi_id"]), poi)

            spike_pct = random.randint(45, 85)
            new_crowd = int(poi["base_capacity"] * (0.85 + (spike_pct / 100.0) * 0.4))
            self._current_state[poi["id"]]["current_crowd"] = new_crowd
            saturation_pct = min(100, int((new_crowd / poi["base_capacity"]) * 100))

            event = {
                "event_id": f"evt-{int(datetime.datetime.now().timestamp()*1000)}",
                "event_type": "crowd_spike",
                "poi_id": poi["id"],
                "poi_name": poi["name"],
                "severity": "high" if saturation_pct > 85 else "moderate",
                "timestamp": now_str,
                "payload": {
                    "headline": f"Crowd Surge at {poi['name']}",
                    "message": f"Footfall spiked by +{spike_pct}%. Wait time is currently ~{int(new_crowd/45)} mins.",
                    "saturation_pct": saturation_pct,
                    "recommended_action": "reroute",
                    "alternative_poi_name": poi["alt_recommendation"],
                    "alternative_poi_id": poi["alt_poi_id"],
                    "reroute_benefit_mins": random.randint(25, 55)
                }
            }
        elif event_type == "hotel_demand_spike":
            event = {
                "event_id": f"evt-{int(datetime.datetime.now().timestamp()*1000)}",
                "event_type": "hotel_demand_spike",
                "timestamp": now_str,
                "payload": {
                    "headline": "Destination Influx Alert: Weekend Surge",
                    "message": "Prophet forecasting model predicts +38% tourist footfall this Saturday in Old City sector.",
                    "suggested_rate_multiplier": 1.22,
                    "target_sector": "Amer-Jaipur Corridor",
                    "recommended_action": "adjust_pricing"
                }
            }
        elif event_type == "weather_alert":
            event = {
                "event_id": f"evt-{int(datetime.datetime.now().timestamp()*1000)}",
                "event_type": "weather_alert",
                "timestamp": now_str,
                "payload": {
                    "headline": "Sudden Afternoon Heat Advisory",
                    "message": "Temperature touching 39°C. SARATHI recommends indoor heritage visits (City Palace/Albert Hall) between 12:30 PM - 3:30 PM.",
                    "recommended_action": "reschedule_outdoor"
                }
            }
        else:
            event = {
                "event_id": f"evt-{int(datetime.datetime.now().timestamp()*1000)}",
                "event_type": event_type,
                "timestamp": now_str,
                "payload": custom_payload or {"headline": "Live Tourism Update", "message": "System status nominal."}
            }

        await ws_manager.broadcast(event)
        return event

    async def _simulation_loop(self, interval_seconds: int = 15):
        logger.info("Starting SARATHI Realtime Event Simulator loop...")
        try:
            while self._is_running:
                await asyncio.sleep(interval_seconds)
                event_types = ["crowd_spike", "hotel_demand_spike", "weather_alert"]
                chosen = random.choice(event_types)
                await self.trigger_event(chosen)
        except asyncio.CancelledError:
            logger.info("Event Simulator loop stopped.")
        except Exception as e:
            logger.error(f"Event simulator encountered error: {e}", exc_info=True)

    def start(self, interval_seconds: int = 20):
        if not self._is_running:
            self._is_running = True
            self._task = asyncio.create_task(self._simulation_loop(interval_seconds))

    def stop(self):
        if self._is_running:
            self._is_running = False
            if self._task:
                self._task.cancel()
                self._task = None


simulator = EventSimulator()

