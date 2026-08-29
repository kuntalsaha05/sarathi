import express from 'express';
import axios from 'axios';

const router = express.Router();

export const optimizeRoute = async (req, res) => {
  try {
    const { itinerary, user_id } = req.body;
    const response = await axios.post(`${process.env.CORE_ENGINE_URL || 'http://localhost:8000'}/api/v1/optimize`, itinerary);
    res.json({ ...response.data, user_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const reroute = async (req, res) => {
  try {
    const { route_id, disruption } = req.body;
    const response = await axios.post(`${process.env.CORE_ENGINE_URL || 'http://localhost:8000'}/api/v1/reroute`, { route_id, disruption });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

router.post('/book', optimizeRoute);

router.get('/bookings/:user_id', (req, res) => {
  res.json({ bookings: [], user_id: req.params.user_id });
});

export default router;
