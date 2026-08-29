import express from 'express';

const router = express.Router();

router.post('/weather-alert', (req, res) => {
  const { poi_id, severity, description } = req.body;
  console.log(`Weather alert for ${poi_id}: ${severity} - ${description}`);
  res.json({ received: true });
});

router.post('/traffic-alert', (req, res) => {
  const { node_id, congestion_level } = req.body;
  console.log(`Traffic alert for ${node_id}: ${congestion_level}`);
  res.json({ received: true });
});

export default router;
