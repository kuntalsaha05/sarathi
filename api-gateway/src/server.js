import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import axios from 'axios';
import touristRoutes from './routes/tourist.routes.js';
import b2bRoutes from './routes/b2b.routes.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

const CORE_ENGINE_URL = process.env.CORE_ENGINE_URL || 'http://localhost:8000';

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 60_000, max: 200 }));

app.use('/api/tourist', touristRoutes);
app.use('/api/b2b', b2bRoutes);

// POIs & Hotels Proxy to Core Engine
app.get('/api/pois', async (req, res) => {
  try {
    const response = await axios.get(`${CORE_ENGINE_URL}/api/v1/pois`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/hotels', async (req, res) => {
  try {
    const response = await axios.get(`${CORE_ENGINE_URL}/api/v1/hotels`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Live Disruption Simulation Trigger
app.post('/api/reroute/simulate', async (req, res) => {
  const { poiId, newCongestionRatio, suggestedAlternativePoiId } = req.body;
  
  // Forward to Core Engine in-memory store
  try {
    await axios.post(`${CORE_ENGINE_URL}/api/v1/crowd-update`, { poiId, newCongestionRatio });
  } catch (e) {}

  io.emit('crowd_update', { poiId, newCongestionRatio });
  if (newCongestionRatio > 0.85) {
    io.emit('reroute_recommendation', {
      congestedPoiId: poiId,
      alternativePoiId: suggestedAlternativePoiId,
      message: 'Sudden footfall spike detected. Auto-rerouting suggested to save travel time.',
    });
  }
  res.json({ status: 'Broadcasted simulation alert successfully.' });
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'api-gateway', mode: 'standalone' }));

io.on('connection', (socket) => {
  console.log(`[Socket Connected] ID: ${socket.id}`);

  socket.on('subscribe_itinerary', (itineraryId) => {
    socket.join(`itinerary_${itineraryId}`);
  });

  socket.on('trigger_crowd_surge', async (data) => {
    const { poiId, newCongestionRatio, suggestedAlternativePoiId } = data;
    console.log(`[Alert] High crowd at POI ${poiId}: ${(newCongestionRatio * 100).toFixed(0)}%`);
    
    try {
      await axios.post(`${CORE_ENGINE_URL}/api/v1/crowd-update`, { poiId, newCongestionRatio });
    } catch (e) {}

    io.emit('crowd_update', data);
    if (newCongestionRatio > 0.85) {
      io.emit('reroute_recommendation', {
        congestedPoiId: poiId,
        alternativePoiId: suggestedAlternativePoiId,
        message: 'High crowd surge detected! Tap to accept optimized detour.',
      });
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Socket Disconnected] ID: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`🚀 SARATHI Gateway listening on port ${PORT} (Standalone Mode)`));
