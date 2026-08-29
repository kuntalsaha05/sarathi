import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function getForecast(poiId, days = 14) {
  const res = await axios.get(`${API_BASE}/api/v1/demand-forecast`, {
    params: { poi_id: poiId, horizon_days: days },
  });
  return res.data;
}

export async function getInventory() {
  const res = await axios.get(`${API_BASE}/api/b2b/inventory`);
  return res.data;
}
