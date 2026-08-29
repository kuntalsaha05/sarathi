#!/bin/bash
set -e

echo "=== SARATHI Bootstrap Script ==="

# Install Python dependencies
echo "[1/4] Installing core-engine dependencies..."
cd core-engine
pip install -r requirements.txt
cd ..

# Install gateway dependencies
echo "[2/4] Installing api-gateway dependencies..."
cd api-gateway
npm ci
cd ..

# Install frontend dependencies
echo "[3/4] Installing frontend dependencies..."
cd apps/tourist-app && npm ci && cd ../..
cd apps/b2b-console && npm ci && cd ../..

# Start database and services
echo "[4/4] Starting Docker services..."
docker compose --profile backend up -d db

echo ""
echo "=== Bootstrap complete ==="
echo "Next steps:"
echo "  1. Run migrations: docker exec -i \$(docker ps -q --filter ancestor=postgis/postgis) psql -U sarathi -d sarathi -f /docker-entrypoint-initdb.d/001_init_postgis.sql"
echo "  2. Start core-engine: cd core-engine && uvicorn app.main:app --reload"
echo "  3. Start gateway: cd api-gateway && npm run dev"
echo "  4. Start tourist-app: cd apps/tourist-app && npm run dev"
echo "  5. Start b2b-console: cd apps/b2b-console && npm run dev"
