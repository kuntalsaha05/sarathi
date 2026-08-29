#!/usr/bin/env bash
# One-shot Phase 1 bootstrap: starts Postgres/Redis/backend, waits for health,
# then seeds synthetic footfall data.
set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -f backend/.env ]; then
  echo "Creating backend/.env from template..."
  cp backend/.env.example backend/.env
fi

echo "Starting Postgres, Redis, backend..."
docker compose up -d postgres redis

echo "Waiting for Postgres to be healthy..."
until docker compose exec -T postgres pg_isready -U sarathi -d sarathi_db >/dev/null 2>&1; do
  sleep 1
done
echo "Postgres is up."

echo "Building and starting backend..."
docker compose up -d --build backend

echo "Waiting for backend health endpoint..."
for i in $(seq 1 30); do
  if curl -sf http://localhost:8000/health >/dev/null 2>&1; then
    echo "Backend is up."
    break
  fi
  sleep 1
done

echo "Generating synthetic footfall data (60 days back)..."
python3 -m pip install --quiet psycopg2-binary
DATABASE_URL="postgresql://sarathi:sarathi_dev_pw@localhost:5432/sarathi_db" \
  python3 scripts/generate_synthetic_footfall.py --days-back 60 --days-forward 0

echo ""
echo "SARATHI Phase 1 environment is ready:"
echo "  Backend:   http://localhost:8000"
echo "  Health:    http://localhost:8000/health"
echo "  Docs:      http://localhost:8000/docs"
echo "  Postgres:  localhost:5432 (sarathi / sarathi_dev_pw / sarathi_db)"
echo "  Redis:     localhost:6379"
