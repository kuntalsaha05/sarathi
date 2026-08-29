import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/book', async (req, res) => {
  const { itinerary, user_id } = req.body;
  const response = await axios.post(`${process.env.CORE_ENGINE_URL}/api/v1/optimize`, itinerary);
  res.json({ ...response.data, user_id });
});

router.get('/bookings/:user_id', (req, res) => {
  res.json({ bookings: [], user_id: req.params.user_id });
});

export default router;
