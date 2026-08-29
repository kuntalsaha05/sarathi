import express from 'express';
import axios from 'axios';

const router = express.Router();

export const getInventory = async (req, res) => {
  try {
    const resp = await axios.get(`${process.env.CORE_ENGINE_URL || 'http://localhost:8000'}/api/v1/demand-forecast`, {
      params: req.query,
    });
    res.json(resp.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateInventory = (req, res) => {
  res.json({ updated: true, ...req.body });
};

router.get('/inventory', getInventory);

router.post('/inventory/update', updateInventory);

export default router;
