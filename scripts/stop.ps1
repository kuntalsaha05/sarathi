#!/usr/bin/env pwsh
<#
.SYNOPSIS
Stops the SARATHI stack.
#>

$ErrorActionPreference = 'SilentlyContinue'

Write-Host "[SARATHI] Stopping services..."

# Kill Node processes from our apps
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -match "tourist-app|b2b-console|server.js" } | Stop-Process -Force

# Kill Python uvicorn
Get-Process -Name "python" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -match "uvicorn" } | Stop-Process -Force

# Stop docker compose services
Push-Location (Split-Path -Parent $PSScriptRoot)
docker compose --profile backend down
Pop-Location

Write-Host "[SARATHI] All services stopped."
