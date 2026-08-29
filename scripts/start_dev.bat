@echo off
echo ======================================================================
echo                 SARATHI 2.0 - System Launcher
echo    Smart Autonomous Routing & Adaptive Tourism Hospitality Intelligence
echo ======================================================================
echo.

echo [1/3] Starting FastAPI Backend (Port 8000)...
start "SARATHI Backend (FastAPI)" cmd /k "cd backend && python -m uvicorn app.main:app --port 8000 --host 0.0.0.0"

timeout /t 2 >nul

echo [2/3] Starting Tourist Companion PWA (Port 5173)...
start "SARATHI Tourist App" cmd /k "cd frontend-tourist && npm run dev"

timeout /t 2 >nul

echo [3/3] Starting Hotelier Intelligence Dashboard (Port 5174)...
start "SARATHI Hotelier Dashboard" cmd /k "cd frontend-hotelier && npm run dev"

echo.
echo ======================================================================
echo  SARATHI Services Launched:
echo    - FastAPI Backend:     http://localhost:8000 (Docs: /docs)
echo    - Tourist Companion:   http://localhost:5173
echo    - Hotelier Dashboard:  http://localhost:5174
echo    - Real-Time WebSocket: ws://localhost:8000/realtime/ws
echo ======================================================================
pause

