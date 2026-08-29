#!/bin/bash
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "[SARATHI] Stopping services..."

if [ -f "$ROOT/logs/core-engine.pid" ]; then kill $(cat "$ROOT/logs/core-engine.pid") 2>/dev/null || true; fi
if [ -f "$ROOT/logs/api-gateway.pid" ]; then kill $(cat "$ROOT/logs/api-gateway.pid") 2>/dev/null || true; fi
if [ -f "$ROOT/logs/tourist-app.pid" ]; then kill $(cat "$ROOT/logs/tourist-app.pid") 2>/dev/null || true; fi
if [ -f "$ROOT/logs/b2b-console.pid" ]; then kill $(cat "$ROOT/logs/b2b-console.pid") 2>/dev/null || true; fi

echo "[SARATHI] All local services stopped."
