#!/bin/bash
set -e

echo "=== SARATHI Bootstrap Script ==="

echo "[1/4] Starting Docker services..."
docker compose --profile backend up -d postgres redis

echo "[2/4] Waiting for PostGIS to be ready..."
sleep 5

echo "[3/4] Running migrations..."
docker exec -i $(docker ps -q --filter ancestor=postgis/postgis) \
  psql -U sarathi_admin -d sarathi_db -f /docker-entrypoint-initdb.d/001_init_postgis.sql || true

echo "[4/4] Installing dependencies..."
cd core-engine && pip install -r requirements.txt && cd ..
cd api-gateway && npm ci && cd ..
cd apps/tourist-app && npm ci && cd ../..
cd apps/b2b-console && npm ci && cd ../..

echo ""
echo "=== Bootstrap complete ==="
echo "Next steps:"
echo "  1. Start core-engine: cd core-engine && uvicorn app.main:app --reload"
echo "  2. Start gateway: cd api-gateway && npm run dev"
echo "  3. Start tourist-app: cd apps/tourist-app && npm run dev"
echo "  4. Start b2b-console: cd apps/b2b-console && npm run dev"
echo "  5. Run demo: python scripts/mock_disruption_trigger.py"
