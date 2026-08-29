#!/bin/bash
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="$ROOT/logs"
mkdir -p "$LOG_DIR"

echo "=== Starting SARATHI (Standalone Mode - No Docker Required) ==="

echo "[1/4] Starting core-engine (Python / OR-Tools)..."
cd "$ROOT/core-engine"
if [ ! -d .venv ]; then
    python3 -m venv .venv
    ./.venv/bin/pip install -r requirements.txt
fi
./.venv/bin/python -m uvicorn app.main:app --reload --port 8000 > "$LOG_DIR/core-engine.log" 2>&1 &
echo $! > "$LOG_DIR/core-engine.pid"

echo "[2/4] Starting api-gateway (Node.js / Express)..."
cd "$ROOT/api-gateway"
if [ ! -d node_modules ]; then
    npm install
fi
node src/server.js > "$LOG_DIR/api-gateway.log" 2>&1 &
echo $! > "$LOG_DIR/api-gateway.pid"

echo "[3/4] Starting tourist-app (PWA)..."
cd "$ROOT/apps/tourist-app"
if [ ! -d node_modules ]; then
    npm install
fi
npx vite --port 5173 > "$LOG_DIR/tourist-app.log" 2>&1 &
echo $! > "$LOG_DIR/tourist-app.pid"

echo "[4/4] Starting b2b-console..."
cd "$ROOT/apps/b2b-console"
if [ ! -d node_modules ]; then
    npm install
fi
npx vite --port 5174 > "$LOG_DIR/b2b-console.log" 2>&1 &
echo $! > "$LOG_DIR/b2b-console.pid"

sleep 3

echo ""
echo "=== SARATHI is active ==="
echo "  Tourist App : http://localhost:5173"
echo "  B2B Console : http://localhost:5174"
echo "  API Gateway : http://localhost:5000"
echo "  Core Engine : http://localhost:8000"
echo ""
echo "  Stop with: ./scripts/stop.sh"
