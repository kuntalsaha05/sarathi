# SARATHI Architecture

## Overview
SARATHI (Smart Adaptive Routing & AI-Driven Hospitality Intelligence) is a multi-service monorepo designed for real-time tourist route optimization, demand forecasting, and B2B hotel inventory management.

## Services

| Service | Technology | Port | Description |
|---------|------------|------|-------------|
| `core-engine` | FastAPI + OR-Tools + Prophet | 8000 | MOCOP optimizer, demand forecasting, Indic NLP |
| `api-gateway` | Express + Socket.IO | 3000 | REST aggregation, WebSocket push rerouting |
| `tourist-app` | React + Vite + Mapbox | 8080 | Tourist-facing PWA with voice input |
| `b2b-console` | React + Vite + Tailwind | 8081 | Hotelier/DMO analytics dashboard |
| `database` | PostgreSQL + PostGIS | 5432 | Spatial POI, inventory, itinerary logs |

## Data Flow
1. `tourist-app` sends origin/destination + constraints to `api-gateway`.
2. `api-gateway` forwards optimization payload to `core-engine`.
3. `core-engine` queries PostGIS for POI nodes and OSRM for travel times.
4. OR-Tools solver computes penalty-adjusted route.
5. `api-gateway` pushes `AUTO_REROUTE_EVENT` via WebSocket when congestion detected.
6. `b2b-console` polls `core-engine` for 14-day demand forecasts.

## Deployment
- Single command: `docker compose --profile backend up`
- Frontends: `docker compose --profile frontend up`
- Database migrations auto-run on container init via `/docker-entrypoint-initdb.d`.
