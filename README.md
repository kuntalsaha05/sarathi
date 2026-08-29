# SARATHI
**Smart Autonomous Routing & Adaptive Tourism Hospitality Intelligence**

SIH 2026 — Tourism Optimization & Destination Intelligence

SARATHI is a real-time destination-intelligence platform that goes beyond static
itinerary generators (e.g. Mindtrip) by combining **crowd-aware dynamic routing**
(TD-VRPTW), **demand forecasting** for hoteliers, and a **multilingual, voice-first**
interface for Indian tourists.

## Monorepo layout

```
sarathi/
├── backend/                 # FastAPI service — routing, forecasting, APIs, WebSocket
│   └── app/
│       ├── core/             # config, db session
│       ├── api/routes/       # REST endpoints
│       ├── models/           # SQLAlchemy ORM models (Phase 2)
│       ├── services/         # business logic
│       └── ml/                # TD-VRPTW solver, Prophet/LightGBM pipelines (Phase 2)
├── db/                      # SQL schema + seed data (PostGIS)
├── frontend-tourist/        # React/Vite tourist-facing PWA (Phase 3)
├── frontend-hotelier/       # React/Vite B2B dashboard (Phase 3)
├── scripts/                 # bootstrap + synthetic data generation
├── infra/                   # deployment configs (Phase 4)
├── docs/                    # architecture notes, pitch material
└── docker-compose.yml
```

## Phase 1 — Environment Setup & Data Foundation ✅

- [x] Monorepo scaffold
- [x] `docker-compose.yml` for PostgreSQL (PostGIS) + Redis
- [x] Spatial schema: destinations, POIs, footfall, properties, occupancy,
      users, trip plans, bookings, realtime events
- [x] Seed data: Jaipur destination with 8 POIs + 2 demo properties
- [x] Synthetic hourly footfall generator (daily/weekly seasonality + festival spikes)

## Phase 2 — Core Optimization & Intelligence Engine ✅ (current)

- [x] **Distance/duration matrix service** (`backend/app/services/matrix_service.py`)
      — OSRM → Mapbox → haversine fallback chain, so trip planning never
      hard-fails on network loss during judging. Hour-of-day congestion
      multiplier layered on top for time-dependence.
- [x] **TD-VRPTW solver** (`backend/app/ml/vrptw_solver.py`) — Google OR-Tools,
      soft time windows (late arrival penalized, not infeasible), must-see
      POIs (priority 5) made mandatory rather than penalty-based, droppable
      POIs cost-scaled by priority + predicted crowd. Verified against the
      real seeded Jaipur coordinates — see `scripts/test_solver_smoke.py`.
- [x] **Demand forecasting pipeline** (`backend/app/ml/forecasting.py`) —
      Prophet (primary, needs ~2 weeks hourly history) → LightGBM (secondary,
      recursive multi-step) → seasonal-naive (always works) fallback chain.
      Feeds `crowd_penalty` back into the VRPTW solver so routes avoid
      predicted crowd spikes.
- [x] API routes: `POST /routing/plan-trip`, `GET /forecast/poi/{id}`,
      `POST /forecast/poi/{id}/persist`

### Try it (after Phase 1 bootstrap)

```bash
# Generate a crowd-aware optimized itinerary for Jaipur
curl -X POST http://localhost:8000/routing/plan-trip \
  -H "Content-Type: application/json" \
  -d '{
    "destination_id": "a1a1a1a1-0000-0000-0000-000000000001",
    "start_lat": 26.9200, "start_lng": 75.8225,
    "trip_date": "2026-09-15", "start_time": "09:00",
    "max_trip_hours": 9, "avoid_crowds": true
  }'

# Forecast footfall for a specific POI (Amber Fort)
curl "http://localhost:8000/forecast/poi/b1000000-0000-0000-0000-000000000001?horizon_hours=48"
```

Or run the solver standalone without Docker/DB at all:
```bash
pip install ortools --break-system-packages
python3 scripts/test_solver_smoke.py
```

## Quick start

```bash
./scripts/bootstrap.sh
```

This will:
1. Copy `backend/.env.example` → `backend/.env`
2. Start Postgres (PostGIS) + Redis via Docker Compose
3. Build and start the FastAPI backend
4. Seed the schema (auto-run via `db/*.sql` on first Postgres init) and
   generate 60 days of synthetic hourly footfall data

Then check:
- `http://localhost:8000/health` — Postgres + Redis connectivity
- `http://localhost:8000/docs` — interactive API docs
- `http://localhost:8000/destinations` — seeded Jaipur destination
- `http://localhost:8000/destinations/{id}/pois` — seeded POIs

### Manual setup (without the bootstrap script)

```bash
cp backend/.env.example backend/.env
docker compose up -d postgres redis
docker compose up -d --build backend

pip install psycopg2-binary
python3 scripts/generate_synthetic_footfall.py --days-back 60
```

## Phase 3 — Dual-Interface Build & Real-Time Sync ✅ (current)

- [x] **Real-time WebSocket & Pub/Sub layer** (`backend/app/core/ws_manager.py`, `/realtime/ws`, `/realtime/events`)
      — Broadcasts live telemetry, crowd surge alerts, and destination incidents.
- [x] **Simulation Engine** (`backend/app/services/event_simulator.py`)
      — Emits synthetic real-time footfall spikes and weather advisories for interactive judging demos.
- [x] **Tourist Adaptive Routing PWA** (`frontend-tourist/`)
      — React + Vite + TailwindCSS + Leaflet interactive map with color-coded crowd saturation pins,
      schedule timeline (arrival/departure, dwell times, travel duration), Indic Voice companion
      (Hindi/English NLP intent parser), and **"One-Click Reroute"** banner when crowd surges occur.
- [x] **Hotelier & Authority B2B Intelligence Dashboard** (`frontend-hotelier/`)
      — Real-time destination crowd saturation heatmap, 48-hour & 7-day Prophet/LightGBM demand
      forecasting charts (Recharts), AI Dynamic Yield / ADR surge pricing recommendations, and
      tourist dispersal campaign dispatcher.
- [x] **Multilingual Voice & Audio Guide Service** (`backend/app/services/voice_service.py`)
      — Speech recognition + text-to-speech audio guides in Hindi and English.

### Running the Apps

#### 1. Backend (FastAPI + WebSocket)
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```
- API Docs: `http://localhost:8000/docs`
- Realtime WebSocket: `ws://localhost:8000/realtime/ws`

#### 2. Tourist Companion PWA
```bash
cd frontend-tourist
npm run dev
# Accessible at http://localhost:5173
```

#### 3. Hotelier & Authority Dashboard
```bash
cd frontend-hotelier
npm run dev
# Accessible at http://localhost:5174
```

## Roadmap

| Phase | Focus | Days | Status |
|---|---|---|---|
| 1 | Environment Setup & Data Foundation | 1–3 | ✅ Done |
| 2 | Core Optimization & Intelligence Engine (TD-VRPTW via OR-Tools, OSRM/Mapbox Matrix, Prophet/LightGBM demand forecasting) | 4–7 | ✅ Done |
| 3 | Dual-Interface Build & Real-Time Sync (tourist PWA, hotelier dashboard, WebSocket layer, Indic Voice) | 8–11 | ✅ Done |
| 4 | Integration, Testing & Pitch Prep (deploy, offline-fallback Docker container for judging) | 12–14 | ⏳ Next |

## Tech stack

- **DB**: PostgreSQL 16 + PostGIS
- **Cache/pubsub**: Redis + In-Memory Fallback
- **Backend**: Python 3.13, FastAPI, SQLAlchemy (async), WebSockets
- **Optimization**: Google OR-Tools (TD-VRPTW with soft time windows)
- **Forecasting**: Prophet, LightGBM, Seasonal-Naive
- **Routing/matrix**: OSRM / Mapbox Matrix API / Haversine Matrix
- **Speech/Voice**: Web Speech API + Indic NLP Intent Parser + Audio Synthesis
- **Tourist Frontend**: React + Vite + TailwindCSS + Leaflet PWA
- **Hotelier Frontend**: React + Vite + TailwindCSS + Recharts + Leaflet
- **Realtime**: WebSocket stream with live event simulator

