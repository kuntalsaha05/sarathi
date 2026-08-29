# SARATHI

**Smart Adaptive Routing & AI-Driven Hospitality Intelligence**

Real-time tourist route optimization, voice-based trip planning, and AI-powered demand forecasting for hotels and DMOs. Built for Smart India Hackathon.

## Features

- **Real-time Route Optimization** — MOCOP/TD-VRPTW solver with crowd and weather penalty multipliers
- **Indic Voice Interface** — Speech-to-intent via Bhashini API for regional language trip planning
- **14-Day Demand Forecasting** — Prophet + LightGBM occupancy models for hotels/DMOs
- **Live Rerouting** — WebSocket-based push notifications when waypoints become congested
- **B2B Analytics** — Footfall heatmaps, dynamic pricing, and inventory management

## Architecture

```
sarathi/
├── core-engine/          # Python / FastAPI + OR-Tools + Prophet + Bhashini
├── api-gateway/          # Node.js / Express + Socket.IO aggregator
├── apps/
│   ├── tourist-app/      # React / Vite / Mapbox GL PWA
│   └── b2b-console/      # React / Vite / Recharts dashboard
├── database/             # PostgreSQL + PostGIS migrations & seeders
├── docker/               # Multi-stage Dockerfiles
├── scripts/              # Bootstrap, mock data, disruption triggers
└── docs/                 # Architecture diagrams & SIH abstract
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Optimization** | OR-Tools (MOCOP/TD-VRPTW), OSRM |
| **Forecasting** | Prophet, LightGBM |
| **NLP** | Bhashini Indic ASR, regex/spacy slot extraction |
| **Backend Gateway** | Express, Socket.IO, rate limiting |
| **Frontend** | React, Vite, Mapbox GL, Tailwind CSS, Recharts |
| **Data** | PostgreSQL + PostGIS, asyncpg |
| **Deployment** | Docker, Docker Compose, Nginx |

## Prerequisites

- Node.js >= 18
- Python >= 3.10
- Docker & Docker Compose
- PostgreSQL with PostGIS (or use Docker)

## Quick Start

### Option A: Docker (Recommended)

```bash
# Start database + backend services
docker compose --profile backend up -d

# Start frontend apps
docker compose --profile frontend up -d
```

Services will be available at:
- API Gateway: http://localhost:3000
- Core Engine: http://localhost:8000
- Tourist App: http://localhost:8080
- B2B Console: http://localhost:8081

### Option B: Local Development

```bash
# 1. Clone and install dependencies
git clone https://github.com/your-org/sarathi.git
cd sarathi

# 2. Bootstrap all services
bash scripts/bootstrap_dev.sh

# 3. Start database
docker compose up -d db

# 4. Run migrations
docker exec -i $(docker ps -q --filter ancestor=postgis/postgis) \
  psql -U sarathi -d sarathi -f database/migrations/001_init_postgis.sql

# 5. Start core-engine (Terminal 1)
cd core-engine
pip install -r requirements.txt
uvicorn app.main:app --reload

# 6. Start api-gateway (Terminal 2)
cd api-gateway
npm ci
npm run dev

# 7. Start tourist-app (Terminal 3)
cd apps/tourist-app
npm ci
npm run dev

# 8. Start b2b-console (Terminal 4)
cd apps/b2b-console
npm ci
npm run dev
```

## API Reference

### Core Engine (`:8000`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Service health check |
| `/api/v1/optimize` | POST | MOCOP route optimization |
| `/api/v1/reroute` | POST | Real-time route adjustment |
| `/api/v1/demand-forecast` | POST | 14-day occupancy forecast |
| `/api/v1/crowd-level/{poi_id}` | GET | Real-time crowd prediction |
| `/api/v1/speech-intent` | POST | Indic voice → intent extraction |

### API Gateway (`:3000`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Gateway health check |
| `/api/tourist/optimize` | POST | Tourist route optimization |
| `/api/tourist/book` | POST | Create booking |
| `/api/b2b/inventory` | GET | Hotel inventory forecast |
| `/api/webhook/weather-alert` | POST | Ingest weather disruption |
| `/api/webhook/traffic-alert` | POST | Ingest traffic disruption |

### WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `subscribe_trip` | Client → Server | Subscribe to trip updates |
| `AUTO_REROUTE_EVENT` | Server → Client | Push new route when congestion detected |

## Scripts

| Script | Description |
|--------|-------------|
| `scripts/bootstrap_dev.sh` | One-command install & seed all services |
| `scripts/mock_disruption_trigger.py` | Simulate crowd/weather disruption events |
| `scripts/generate_mock_datasets.py` | Generate realistic POI & footfall CSVs |

## Database Schema

- `poi_nodes` / `pois` — Spatial points of interest with PostGIS geometry
- `hotels` — Inventory, pricing, and amenities
- `itinerary_logs` — Trip planning and optimization history

Pilot circuit seeded: **Pune → Lonavala → Mahabaleshwar**

## CI/CD

GitHub Actions workflows run on PRs:
- `.github/workflows/ci-backend.yml` — Lint + test core-engine + database
- `.github/workflows/ci-frontend.yml` — Lint + build both frontend apps

## Contributing

1. Create a feature branch from `main`
2. Make changes and ensure tests pass
3. Open a PR with a clear description

## License

MIT
