@echo off
chcp 65001 >nul
echo Starting Project SARATHI (Standalone Mode - No Docker Required)...
powershell -ExecutionPolicy Bypass -File scripts\run.ps1 %*
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to start SARATHI.
    echo Please make sure Node.js (v18+) and Python (v3.10+) are installed.
    echo.
)
pause
