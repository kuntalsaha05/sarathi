@echo off
chcp 65001 >nul
echo Starting SARATHI...
powershell -ExecutionPolicy Bypass -File scripts\run.ps1 %*
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to start. Make sure Docker Desktop is running and "docker" is in your PATH.
    echo.
    echo Quick checks:
    echo   1. Open Docker Desktop and wait until it says "Docker is running"
    echo   2. Run "docker --version" in a new terminal to confirm it's installed
    echo   3. Then run .\scripts\start.bat again
)
pause
