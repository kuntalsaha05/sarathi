import express from 'express';
import { optimizeRoute, reroute } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/optimize', optimizeRoute);
router.post('/reroute', reroute);
router.get('/health', (req, res) => res.json({ status: 'ok' }));

export default router;
