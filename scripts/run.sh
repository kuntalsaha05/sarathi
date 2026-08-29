#!/bin/bash
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="$ROOT/logs"
mkdir -p "$LOG_DIR"

echo "=== Starting SARATHI ==="

echo "[1] Starting PostGIS + Redis..."
docker compose --profile backend up -d postgres redis

echo "[2] Waiting for PostGIS..."
for i in $(seq 1 30); do
    if docker exec sarathi-postgis pg_isready -U sarathi_admin >/dev/null 2>&1; then
        echo "PostGIS ready."
        break
    fi
    sleep 1
done

echo "[3] Running migrations..."
for f in "$ROOT"/database/migrations/*.sql; do
    [ -f "$f" ] || continue
    docker exec -i sarathi-postgis psql -U sarathi_admin -d sarathi_db -f /docker-entrypoint-initdb.d/$(basename "$f") >/dev/null 2>&1 || true
done

echo "[4] Starting core-engine..."
cd "$ROOT/core-engine"
nohup python -m uvicorn app.main:app --reload --port 8000 > "$LOG_DIR/core-engine.log" 2>&1 &
echo $! > "$LOG_DIR/core-engine.pid"

echo "[5] Starting api-gateway..."
cd "$ROOT/api-gateway"
if [ -d node_modules ]; then
    nohup node src/server.js > "$LOG_DIR/api-gateway.log" 2>&1 &
else
    nohup npm run dev > "$LOG_DIR/api-gateway.log" 2>&1 &
fi
echo $! > "$LOG_DIR/api-gateway.pid"

echo "[6] Starting tourist-app..."
cd "$ROOT/apps/tourist-app"
nohup npm run dev > "$LOG_DIR/tourist-app.log" 2>&1 &
echo $! > "$LOG_DIR/tourist-app.pid"

echo "[7] Starting b2b-console..."
cd "$ROOT/apps/b2b-console"
nohup npm run dev > "$LOG_DIR/b2b-console.log" 2>&1 &
echo $! > "$LOG_DIR/b2b-console.pid"

sleep 3

echo ""
echo "=== SARATHI is starting ==="
echo "  Core Engine : http://localhost:8000"
echo "  API Gateway : http://localhost:5000"
echo "  Tourist App : http://localhost:5173"
echo "  B2B Console : http://localhost:5174"
echo ""
echo "  Logs : $LOG_DIR"
echo ""
echo "  Stop with: ./scripts/stop.sh"
