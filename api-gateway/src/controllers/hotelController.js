import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/inventory', async (req, res) => {
  const resp = await axios.get(`${process.env.CORE_ENGINE_URL}/api/v1/demand-forecast`, {
    params: req.query,
  });
  res.json(resp.data);
});

router.post('/inventory/update', (req, res) => {
  res.json({ updated: true, ...req.body });
});

export default router;
