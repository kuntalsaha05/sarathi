from typing import List
import httpx

OSRM_URL = "http://localhost:5000"


async def build_cost_matrix(origin: str, destination: str, waypoints: List[str]) -> List[List[float]]:
    coordinates = ";".join([origin] + waypoints + [destination])
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{OSRM_URL}/table/v1/driving/{coordinates}")
        resp.raise_for_status()
        data = resp.json()
    return data["durations"]
