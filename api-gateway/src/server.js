import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createClient } from 'redis';
import { createServer } from 'http';
import { Server } from 'socket.io';
import touristRoutes from './routes/tourist.routes.js';
import b2bRoutes from './routes/b2b.routes.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

const redisClient = createClient({ url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}` });
redisClient.connect().catch(console.error);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 60_000, max: 100 }));

app.use('/api/tourist', touristRoutes);
app.use('/api/b2b', b2bRoutes);

app.post('/api/reroute/simulate', (req, res) => {
  const { poiId, newCongestionRatio, suggestedAlternativePoiId } = req.body;
  io.emit('crowd_update', { poiId, newCongestionRatio });
  if (newCongestionRatio > 0.85) {
    io.emit('reroute_recommendation', {
      congestedPoiId: poiId,
      alternativePoiId: suggestedAlternativePoiId,
      message: 'Sudden footfall spike detected. Auto-rerouting suggested.',
    });
  }
  res.json({ status: 'Broadcasted simulation alert successfully.' });
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'api-gateway' }));

io.on('connection', (socket) => {
  console.log(`[Socket Connected] ID: ${socket.id}`);

  socket.on('subscribe_itinerary', (itineraryId) => {
    socket.join(`itinerary_${itineraryId}`);
  });

  socket.on('trigger_crowd_surge', (data) => {
    const { poiId, newCongestionRatio, suggestedAlternativePoiId } = data;
    console.log(`[Alert] High crowd at POI ${poiId}: ${(newCongestionRatio * 100).toFixed(0)}%`);
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
httpServer.listen(PORT, () => console.log(`Gateway listening on ${PORT}`));
