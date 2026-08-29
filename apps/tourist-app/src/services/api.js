import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function optimizeTrip(payload) {
  const res = await axios.post(`${API_BASE}/api/tourist/optimize`, payload);
  return res.data;
}

export async function submitVoiceIntent(file) {
  const form = new FormData();
  form.append('file', file);
  const res = await axios.post(`${API_BASE}/api/v1/speech-intent`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}
