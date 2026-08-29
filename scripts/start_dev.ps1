# SARATHI 2.0 - PowerShell Launcher
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "                SARATHI 2.0 - System Launcher" -ForegroundColor Yellow
Write-Host "   Smart Autonomous Routing & Adaptive Tourism Hospitality Intelligence" -ForegroundColor White
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

$baseDir = Split-Path -Parent $PSScriptRoot

Write-Host "[1/3] Launching FastAPI Backend on http://localhost:8000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$baseDir\backend'; python -m uvicorn app.main:app --port 8000 --host 0.0.0.0"

Start-Sleep -Seconds 2

Write-Host "[2/3] Launching Tourist PWA on http://localhost:5173..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$baseDir\frontend-tourist'; npm run dev"

Start-Sleep -Seconds 2

Write-Host "[3/3] Launching Hotelier Dashboard on http://localhost:5174..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$baseDir\frontend-hotelier'; npm run dev"

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host " SARATHI Services Running:" -ForegroundColor Green
Write-Host "   • FastAPI Backend:     http://localhost:8000 (API Docs: http://localhost:8000/docs)" -ForegroundColor Yellow
Write-Host "   • Tourist Companion:   http://localhost:5173" -ForegroundColor Yellow
Write-Host "   • Hotelier Dashboard:  http://localhost:5174" -ForegroundColor Yellow
Write-Host "   • Real-Time WebSocket: ws://localhost:8000/realtime/ws" -ForegroundColor Yellow
Write-Host "======================================================================" -ForegroundColor Cyan

