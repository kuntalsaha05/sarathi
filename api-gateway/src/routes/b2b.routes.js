import express from 'express';
import { getInventory, updateInventory } from '../controllers/hotelController.js';

const router = express.Router();

router.get('/inventory', getInventory);
router.post('/inventory/update', updateInventory);

export default router;
