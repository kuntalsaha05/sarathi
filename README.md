# SARATHI
**Smart Autonomous Routing & Adaptive Tourism Hospitality Intelligence**

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_0.115-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_18_Vite_Tailwind-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_16_PostGIS-336791?logo=postgresql&logoColor=white)](https://postgis.net)
[![Redis](https://img.shields.io/badge/Cache-Redis_7-DC382D?logo=redis&logoColor=white)](https://redis.io)
[![OR-Tools](https://img.shields.io/badge/Optimization-Google_OR--Tools-4285F4?logo=google&logoColor=white)](https://developers.google.com/optimization)
[![Prophet](https://img.shields.io/badge/Forecasting-Prophet_&_LightGBM-FF6F00?logo=scikit-learn&logoColor=white)](https://facebook.github.io/prophet/)
[![WebSockets](https://img.shields.io/badge/Realtime-WebSockets-010101?logo=socketdotio&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)

> **SIH 2026 — Tourism Optimization & Destination Intelligence**  
> SARATHI is a real-time, crowd-aware destination intelligence and adaptive routing platform built to eliminate overtourism bottlenecks, provide dynamic yield pricing for local hoteliers, and empower Indian tourists with an accessible, voice-first companion in regional languages.

---

## Table of Contents

- [Overview & Value Proposition](#overview--value-proposition)
- [Key Features](#key-features)
- [System Architecture & Resilient Fallbacks](#system-architecture--resilient-fallbacks)
- [Monorepo Structure](#monorepo-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
  - [Option A: One-Click Launch (Windows)](#option-a-one-click-launch-windows)
  - [Option B: Docker Compose (Full Stack)](#option-b-docker-compose-full-stack)
  - [Option C: Manual Local Setup](#option-c-manual-local-setup)
- [API & WebSocket Reference](#api--websocket-reference)
- [Configuration (.env)](#configuration-env)
- [Synthetic Data & Seeding](#synthetic-data--seeding)
- [Testing & Validation](#testing--validation)
- [Development Roadmap](#development-roadmap)
- [Tech Stack](#tech-stack)

---

## Overview & Value Proposition

Traditional travel planning tools (e.g., Mindtrip, Google Trips) generate static itineraries that fail to account for live crowd saturation, seasonal surges, and opening/closing constraints. When unexpected bottlenecks happen, tourists face severe delays, while local hoteliers and destination authorities suffer from unmanaged demand spikes and lost yield.

**SARATHI bridges this gap through a dual-interface ecosystem powered by mathematical optimization:**

1. **For Tourists (B2C PWA):** Real-time crowd-aware routing (TD-VRPTW), one-click instant rerouting upon surge detection, interactive spatial timelines, and Indic multilingual voice assistance.
2. **For Hoteliers & Authorities (B2B Dashboard):** Live destination crowd heatmaps, 48-hour and 7-day Prophet/LightGBM demand forecasts, dynamic Average Daily Rate (ADR) surge pricing recommendations, and targeted tourist dispersal campaign dispatchers.

---

## Key Features

### 1. Crowd-Aware Time-Dependent VRPTW Solver (`backend/app/ml/vrptw_solver.py`)
- Formulates itinerary generation as a **Time-Dependent Vehicle Routing Problem with Time Windows (TD-VRPTW)** solved using **Google OR-Tools**.
- **Soft Time Windows:** Late arrival incurs penalty scaling without marking the entire schedule infeasible.
- **Priority Preservation:** Must-see attractions (Priority 5) are strictly retained, while lower-priority points are dynamically scheduled or dropped based on trip time limits and predicted crowd saturation.
- **Dynamic Dwell Times & Speeds:** Accounts for site-specific dwell times and hour-of-day traffic multipliers.

### 2. Multi-Tier Resilient Fallback Chains
- **Matrix Service (`matrix_service.py`):** `OSRM (Local/Remote)` → `Mapbox Matrix API` → `Haversine Matrix (with diurnal congestion factors)`. Guaranteed 0% crash rate during network drops or offline judging.
- **Demand Forecasting (`forecasting.py`):** `Prophet (Hourly/Daily Seasonality)` → `LightGBM (Recursive Autoregressive Multi-step)` → `Seasonal-Naive Baseline`.
- **Pub/Sub Layer (`ws_manager.py`):** `Redis Pub/Sub` → `In-Memory Async Broadcast Queue`.

### 3. Real-Time Telemetry & Simulation Engine (`backend/app/services/event_simulator.py`)
- Emits live crowd surge alerts, inclement weather warnings, and traffic bottlenecks over WebSockets (`ws://localhost:8000/realtime/ws`).
- Allows hackathon judges and evaluators to trigger simulated events and observe instant UI reactions.

### 4. Tourist Adaptive Routing PWA (`frontend-tourist/` on `:5173`)
- **Interactive Map & Timeline:** Leaflet map with color-coded crowd saturation pins (🟢 Normal, 🟡 Moderate, 🔴 High Surge) and schedule timelines.
- **One-Click Dynamic Reroute:** In-app toast notifying users of crowd surges with instant alternative itinerary generation.
- **Voice & Multilingual Companion:** Voice-first interaction in Hindi and English with intent extraction and audio guides.
- **Rich Exploration:** Inspiration feeds, destination discover cards, saved bookmarks, and custom trip builders.

### 5. Hotelier & Authority Intelligence Hub (`frontend-hotelier/` on `:5174`)
- **Destination Saturation Heatmap:** Live spatial saturation indices for key attractions.
- **Recharts Demand Projections:** 48-hour and 7-day predicted tourist footfall trends.
- **AI Dynamic Yield Management:** Automated ADR surge / discount recommendations based on forecasted footfall.
- **Smart Dispersal Campaigns:** Dispatches incentive vouchers (e.g. 20% off cafe coupons) to divert tourists from congested POIs to off-peak cultural sites.

---

## System Architecture & Resilient Fallbacks

```
                       ┌────────────────────────────────────────┐
                       │           SARATHI Ecosystem            │
                       └───────────────────┬────────────────────┘
                                           │
            ┌──────────────────────────────┴──────────────────────────────┐
            ▼                                                             ▼
┌───────────────────────────────┐                             ┌───────────────────────────────┐
│   Tourist Companion PWA       │                             │ Hotelier / Authority Portal   │
│   (React + Vite + Leaflet)    │                             │ (React + Vite + Recharts)     │
│   Port: 5173                  │                             │ Port: 5174                    │
└───────────────┬───────────────┘                             └───────────────┬───────────────┘
                │ HTTP / WebSocket                                            │ HTTP / WebSocket
                └──────────────────────────────┬──────────────────────────────┘
                                               ▼
                               ┌───────────────────────────────┐
                               │     FastAPI Core Engine       │
                               │     Port: 8000                │
                               └───────────────┬───────────────┘
                                               │
        ┌──────────────────────────────┬───────┴──────────────────────┬──────────────────────────────┐
        ▼                              ▼                              ▼                              ▼
┌──────────────────┐          ┌──────────────────┐          ┌──────────────────┐          ┌──────────────────┐
│ TD-VRPTW Solver  │          │ Demand Forecast  │          │ Realtime Engine  │          │ Matrix Routing   │
│ (Google OR-Tools)│          │ (Prophet/LightGBM│          │ (WebSocket/Event)│          │ (OSRM / Mapbox / │
│ Soft Windows     │          │  Seasonal-Naive) │          │  PubSub Broker   │          │  Haversine Fall) │
└──────────────────┘          └──────────────────┘          └──────────────────┘          └──────────────────┘
        │                              │                              │                              │
        └──────────────────────────────┼──────────────────────────────┴──────────────────────────────┘
                                       ▼
                     ┌───────────────────────────────────┐
                     │ PostgreSQL 16 + PostGIS & Redis 7 │
                     │ Port: 5432 / 6379                 │
                     └───────────────────────────────────┘
```

---

## Monorepo Structure

```
sarathi/
├── backend/                       # FastAPI high-performance asynchronous core
│   ├── app/
│   │   ├── api/routes/            # REST & WebSocket route handlers
│   │   │   ├── destinations.py    # POI lookup, spatial queries, details
│   │   │   ├── forecast.py        # Footfall prediction endpoints
│   │   │   ├── health.py          # Service, PostGIS, Redis health checks
│   │   │   ├── hotelier.py        # B2B KPIs, dynamic pricing, campaigns
│   │   │   ├── realtime.py        # WebSocket streams & event simulator
│   │   │   ├── routing.py         # TD-VRPTW itinerary optimization
│   │   │   └── voice.py           # Indic voice intent & audio guide synthesis
│   │   ├── core/                  # Configuration, database engine, WebSocket manager
│   │   ├── ml/                    # OR-Tools VRPTW solver & Prophet/LightGBM pipelines
│   │   ├── models/                # SQLAlchemy database models
│   │   └── services/              # Matrix service, voice NLP, event simulator
│   ├── requirements.txt           # Python backend dependencies
│   ├── Dockerfile                 # Multi-stage production Docker build
│   └── .env.example               # Backend environment variables template
├── db/                            # Database migrations and spatial seed data
│   ├── 001_schema.sql             # PostGIS DDL (tables, indices, spatial geometry)
│   └── 002_seed_destinations.sql  # Seed dataset for Jaipur destination & POIs
├── frontend-tourist/              # Tourist-facing React + Vite PWA (Port 5173)
│   ├── src/
│   │   ├── components/            # Interactive map, timeline, chat, voice modal, search
│   │   ├── data/                  # Offline fallback POI and destination data
│   │   └── services/              # API and WebSocket client
│   └── package.json
├── frontend-hotelier/             # Hospitality B2B intelligence dashboard (Port 5174)
│   ├── src/
│   │   ├── components/            # Heatmaps, forecast charts, ADR dynamic pricing
│   │   └── services/              # API and telemetry client
│   └── package.json
├── scripts/                       # Operational and testing automation
│   ├── start_dev.bat              # Windows batch 1-click launcher
│   ├── start_dev.ps1              # Windows PowerShell multi-window launcher
│   ├── bootstrap.sh               # Linux/macOS Docker & seeding script
│   ├── generate_synthetic_footfall.py # Hourly synthetic footfall generator
│   └── test_solver_smoke.py       # Standalone TD-VRPTW solver verification script
├── sampleui/                      # UI design references and prototypes
├── docker-compose.yml             # Orchestration for PostGIS, Redis, and Backend
└── README.md                      # Project documentation
```

---

## Prerequisites

- **Python:** 3.11, 3.12, or 3.13
- **Node.js:** v18+ or v20+ with npm
- **Docker & Docker Compose:** Optional for local dev, recommended for full PostGIS stack
- **Git**

---

## Quick Start

### Option A: One-Click Launch (Windows)

Launch all 3 services (FastAPI Backend, Tourist PWA, Hotelier Dashboard) in parallel terminal windows:

```powershell
# Using PowerShell
.\scripts\start_dev.ps1
```
*or using Command Prompt:*
```cmd
scripts\start_dev.bat
```

---

### Option B: Docker Compose (Full Stack)

To run Postgres (PostGIS), Redis, and the FastAPI backend in Docker:

```bash
# 1. Setup environment file
cp backend/.env.example backend/.env

# 2. Run automated bootstrap (Linux / macOS / WSL)
chmod +x scripts/bootstrap.sh
./scripts/bootstrap.sh
```

Or run Docker Compose directly:
```bash
docker compose up -d postgres redis
docker compose up -d --build backend

# Seed 60 days of synthetic footfall data
pip install psycopg2-binary
python scripts/generate_synthetic_footfall.py --days-back 60
```

---

### Option C: Manual Local Setup

#### 1. Backend Service
```bash
cd backend
python -m venv .venv

# Activate virtual environment:
# Windows: .venv\Scripts\activate
# Linux/macOS: source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000 --host 0.0.0.0
```
- Interactive API Docs: `http://localhost:8000/docs`
- Health Endpoint: `http://localhost:8000/health`

#### 2. Tourist Companion PWA
```bash
cd frontend-tourist
npm install
npm run dev
```
- Accessible at: `http://localhost:5173`

#### 3. Hotelier & Authority Dashboard
```bash
cd frontend-hotelier
npm install
npm run dev
```
- Accessible at: `http://localhost:5174`

---

## API & WebSocket Reference

### 1. Itinerary Optimization & Routing
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/routing/plan-trip` | Computes crowd-aware TD-VRPTW optimal itinerary |

**Sample Request:**
```bash
curl -X POST http://localhost:8000/routing/plan-trip \
  -H "Content-Type: application/json" \
  -d '{
    "destination_id": "a1a1a1a1-0000-0000-0000-000000000001",
    "start_lat": 26.9200,
    "start_lng": 75.8225,
    "trip_date": "2026-09-15",
    "start_time": "09:00",
    "max_trip_hours": 9.0,
    "avoid_crowds": true,
    "selected_poi_ids": []
  }'
```

---

### 2. Demand & Footfall Forecasting
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/forecast/poi/{poi_id}?horizon_hours=48` | Predicts future hourly footfall for a given POI |
| `POST` | `/forecast/poi/{poi_id}/persist` | Calculates and persists forecasts to database |

**Sample Request:**
```bash
curl "http://localhost:8000/forecast/poi/b1000000-0000-0000-0000-000000000001?horizon_hours=48"
```

---

### 3. Hotelier & Authority Intelligence
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/hotelier/destination/{id}/overview` | Returns destination saturation heatmap, alerts, and KPIs |
| `GET` | `/hotelier/property/{id}/pricing-recommendation` | Dynamic ADR yield pricing recommendation based on footfall |
| `POST` | `/hotelier/campaigns/dispersal` | Dispatches tourist dispersal incentive campaigns |

**Sample Request:**
```bash
curl "http://localhost:8000/hotelier/destination/a1a1a1a1-0000-0000-0000-000000000001/overview"
```

---

### 4. Real-Time Telemetry & Event Simulation
| Method | Endpoint | Description |
|---|---|---|
| `WS` | `/realtime/ws` | Live WebSocket stream for telemetry, crowd alerts, and rerouting |
| `GET` | `/realtime/events` | Retrieves recent destination events and alerts |
| `POST` | `/realtime/events/simulate` | Triggers a synthetic incident/crowd spike for live demo |

**Trigger a Simulation Event for Testing:**
```bash
curl -X POST http://localhost:8000/realtime/events/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "poi_id": "b1000000-0000-0000-0000-000000000001",
    "event_type": "CROWD_SURGE",
    "severity": "HIGH",
    "multiplier": 2.4,
    "description": "Sudden influx of 3,500 tourists at Amber Fort due to VIP arrival."
  }'
```

---

### 5. Multilingual Indic Voice & Audio Guide
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/voice/intent` | NLP intent classification and entity extraction for voice queries |
| `POST` | `/voice/audio-guide` | Synthesizes localized audio guide descriptions (Hindi/English) |

---

## Configuration (.env)

Create a `.env` file in the `backend/` directory based on `backend/.env.example`:

| Variable | Default Value | Purpose |
|---|---|---|
| `APP_NAME` | `SARATHI` | Service identifier |
| `ENVIRONMENT` | `development` | Environment mode (`development` / `production`) |
| `DEBUG` | `true` | Enables verbose debug logging |
| `DATABASE_URL` | `postgresql+asyncpg://sarathi:sarathi_dev_pw@localhost:5432/sarathi_db` | Async SQLAlchemy database URL |
| `SYNC_DATABASE_URL` | `postgresql://sarathi:sarathi_dev_pw@localhost:5432/sarathi_db` | Sync connection URL for migrations & scripts |
| `REDIS_URL` | `redis://localhost:6379/0` | Redis caching & WebSocket pub/sub URL |
| `MAPBOX_ACCESS_TOKEN` | `""` | Optional Mapbox API token for secondary matrix fallback |
| `OSRM_BASE_URL` | `http://localhost:5000` | Optional self-hosted OSRM routing engine URL |
| `BHASHINI_API_KEY` | `""` | Optional Bhashini Indic translation & TTS credentials |
| `CORS_ORIGINS` | `http://localhost:5173,http://localhost:5174` | Allowed CORS origins for frontend apps |

---

## Synthetic Data & Seeding

SARATHI includes a realistic synthetic footfall generator modeling:
- **Diurnal Cycles:** Morning rise, afternoon peak, evening decline, night lull.
- **Weekly Seasonality:** Weekend surge multipliers (Saturday/Sunday peaks).
- **Festival Spikes:** Diwali, Pushkar Fair, Teej, and New Year holiday traffic.

To regenerate 60 days of historical data:
```bash
python scripts/generate_synthetic_footfall.py --days-back 60 --days-forward 7
```

---

## Testing & Validation

### Run Standalone Solver Smoke Test (No DB or Docker Required)
Verify the TD-VRPTW algorithm with soft time windows and priority preservation against real Jaipur POI coordinates:

```bash
python scripts/test_solver_smoke.py
```

Expected output:
```
======================================================================
SARATHI TD-VRPTW Solver Smoke Test
======================================================================
[INFO] Initializing distance & duration matrix (Haversine + Congestion)...
[INFO] Executing OR-Tools VRPTW solver with Soft Time Windows...
[SUCCESS] Route computed successfully!
  - Visited POIs: 5 / 7
  - Total Duration: 6.4 hrs (within 8.0 hr limit)
  - Must-See Mandatory POIs (Amber Fort, City Palace): Visited
  - Low-priority crowded POIs dropped gracefully without infeasibility.
======================================================================
```

---

## Development Roadmap

| Phase | Milestone | Focus | Status |
|---|---|---|---|
| **Phase 1** | **Environment & Spatial Data Foundation** | Monorepo scaffold, PostGIS schema, Redis, synthetic footfall generator, seed datasets | ✅ Complete |
| **Phase 2** | **Core Optimization & Intelligence Engine** | Google OR-Tools TD-VRPTW solver, OSRM/Mapbox matrix fallback chain, Prophet/LightGBM forecasting | ✅ Complete |
| **Phase 3** | **Dual-Interface Build & Real-Time Sync** | Tourist PWA (Leaflet + Voice + Rerouting), Hotelier Dashboard (Recharts + ADR Yield), WebSockets | ✅ Complete |
| **Phase 4** | **Integration, Polish & Pitch Prep** | Offline container packaging for judging, edge-case hardening, benchmarking | ⏳ In Progress |

---

## Tech Stack

- **Backend Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Python 3.13) with Async SQLAlchemy 2.0 & Pydantic v2
- **Spatial Database:** [PostgreSQL 16](https://www.postgresql.org/) + [PostGIS 3.4](https://postgis.net/) (Spatial geometry, indexing, distance calculations)
- **Caching & Pub/Sub:** [Redis 7](https://redis.io/) (with graceful in-memory async fallback)
- **Combinatorial Optimization:** [Google OR-Tools](https://developers.google.com/optimization) (Time-Dependent VRPTW with soft time windows and dropped penalty scaling)
- **Machine Learning & Forecasting:** [Prophet](https://facebook.github.io/prophet/), [LightGBM](https://lightgbm.readthedocs.io/), [Pandas](https://pandas.pydata.org/), [NumPy](https://numpy.org/)
- **Routing & Matrix Layer:** OSRM, Mapbox Matrix API, Haversine Matrix with diurnal congestion curves
- **Tourist Frontend (PWA):** [React 18](https://react.dev/), [Vite](https://vitejs.dev/), [TailwindCSS](https://tailwindcss.com/), [Leaflet](https://leafletjs.com/), [Lucide Icons](https://lucide.dev/)
- **Hotelier Dashboard:** [React 18](https://react.dev/), [Vite](https://vitejs.dev/), [TailwindCSS](https://tailwindcss.com/), [Recharts](https://recharts.org/), [Leaflet](https://leafletjs.com/)
- **Real-Time Communication:** Native WebSockets with live event broadcasting
- **Voice & Accessibility:** Web Speech API, Indic NLP intent extraction, Audio synthesis
- **Containerization:** Docker & Docker Compose


