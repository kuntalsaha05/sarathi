import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import touristRoutes from './routes/tourist.routes.js';
import b2bRoutes from './routes/b2b.routes.js';
import { liveRerouteSocket } from './sockets/liveReroute.socket.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 60_000, max: 100 }));

app.use('/api/tourist', touristRoutes);
app.use('/api/b2b', b2bRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'api-gateway' }));

liveRerouteSocket(io);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log(`Gateway listening on ${PORT}`));
