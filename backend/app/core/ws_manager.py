import asyncio
import json
import logging
from typing import Any, Dict, List, Set
from fastapi import WebSocket

logger = logging.getLogger("sarathi.websocket")


class ConnectionManager:
    """Manages active WebSocket connections with room/topic subscription support."""

    def __init__(self):
        self.active_connections: Set[WebSocket] = set()
        self.channel_subscriptions: Dict[str, Set[WebSocket]] = {}
        self.recent_events: List[Dict[str, Any]] = []
        self._max_recent_events = 50

    async def connect(self, websocket: WebSocket, channel: str = "all"):
        await websocket.accept()
        self.active_connections.add(websocket)
        if channel not in self.channel_subscriptions:
            self.channel_subscriptions[channel] = set()
        self.channel_subscriptions[channel].add(websocket)
        logger.info(f"WebSocket client connected to channel '{channel}'. Active: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.discard(websocket)
        for channel, subs in self.channel_subscriptions.items():
            subs.discard(websocket)
        logger.info(f"WebSocket client disconnected. Active: {len(self.active_connections)}")

    def subscribe(self, websocket: WebSocket, channel: str):
        if channel not in self.channel_subscriptions:
            self.channel_subscriptions[channel] = set()
        self.channel_subscriptions[channel].add(websocket)

    def unsubscribe(self, websocket: WebSocket, channel: str):
        if channel in self.channel_subscriptions:
            self.channel_subscriptions[channel].discard(websocket)

    async def broadcast(self, message: Dict[str, Any], channel: str = "all"):
        """Broadcasts a JSON message to all clients or clients subscribed to a channel."""
        self.recent_events.append(message)
        if len(self.recent_events) > self._max_recent_events:
            self.recent_events.pop(0)

        data_str = json.dumps(message)
        targets: Set[WebSocket] = set()

        if channel == "all":
            targets = set(self.active_connections)
        else:
            targets = self.channel_subscriptions.get(channel, set()) | self.channel_subscriptions.get("all", set())

        dead_connections: List[WebSocket] = []
        for connection in targets:
            try:
                await connection.send_text(data_str)
            except Exception as e:
                logger.warning(f"Error sending message to WebSocket client: {e}")
                dead_connections.append(connection)

        for dead in dead_connections:
            self.disconnect(dead)

    def get_recent_events(self, limit: int = 20) -> List[Dict[str, Any]]:
        return list(reversed(self.recent_events[-limit:]))


# Global singleton connection manager
ws_manager = ConnectionManager()

