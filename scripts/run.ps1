#!/usr/bin/env pwsh
<#
.SYNOPSIS
Starts the SARATHI stack locally.
#>

param(
    [switch]$NoFrontend,
    [switch]$Demo
)

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
$LogDir = Join-Path $Root "logs"
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

function Write-Status($msg) { Write-Host "[SARATHI] $msg" -ForegroundColor Cyan }

Write-Status "Starting SARATHI stack..."

# 1. Start DB + Redis
Write-Status "Starting PostGIS + Redis..."
Push-Location $Root
docker compose --profile backend up -d postgres redis
Pop-Location

# 2. Wait for Postgres
Write-Status "Waiting for PostGIS..."
$ready = $false
for ($i = 1; $i -le 30; $i++) {
    try {
        $r = docker exec sarathi-postgis pg_isready -U sarathi_admin 2>&1
        if ($LASTEXITCODE -eq 0) { $ready = $true; break }
    } catch {}
    Start-Sleep -Seconds 1
}
if (-not $ready) { throw "PostGIS did not become ready in time" }

# 3. Run migrations
Write-Status "Running migrations..."
$migrations = Get-ChildItem (Join-Path $Root "database\migrations\*.sql")
foreach ($m in $migrations) {
    docker exec -i sarathi-postgis psql -U sarathi_admin -d sarathi_db -f /docker-entrypoint-initdb.d/$(Split-Path $m -Leaf) 2>&1 | Out-Null
}

# 4. Core Engine
Write-Status "Starting core-engine..."
$engineLog = Join-Path $LogDir "core-engine.log"
Start-Process -FilePath "python" -ArgumentList "-m","uvicorn","app.main:app","--reload","--port","8000","--app-dir",(Join-Path $Root "core-engine") -NoNewWindow -RedirectStandardOutput $engineLog -RedirectStandardError $engineLog

# 5. API Gateway
Write-Status "Starting api-gateway..."
$gwLog = Join-Path $LogDir "api-gateway.log"
Push-Location (Join-Path $Root "api-gateway")
if (Test-Path node_modules) {
    Start-Process -FilePath "node" -ArgumentList "src/server.js" -NoNewWindow -RedirectStandardOutput $gwLog -RedirectStandardError $gwLog
} else {
    Start-Process -FilePath "npm" -ArgumentList "run","dev" -NoNewWindow -RedirectStandardOutput $gwLog -RedirectStandardError $gwLog
}
Pop-Location

# 6. Frontends
if (-not $NoFrontend) {
    Write-Status "Starting tourist-app..."
    $clientLog = Join-Path $LogDir "tourist-app.log"
    Push-Location (Join-Path $Root "apps\tourist-app")
    Start-Process -FilePath "npm" -ArgumentList "run","dev" -NoNewWindow -RedirectStandardOutput $clientLog -RedirectStandardError $clientLog
    Pop-Location

    Write-Status "Starting b2b-console..."
    $b2bLog = Join-Path $LogDir "b2b-console.log"
    Push-Location (Join-Path $Root "apps\b2b-console")
    Start-Process -FilePath "npm" -ArgumentList "run","dev" -NoNewWindow -RedirectStandardOutput $b2bLog -RedirectStandardError $b2bLog
    Pop-Location
}

Start-Sleep -Seconds 3

Write-Host ""
Write-Status "SARATHI is starting..."
Write-Host "  Core Engine : http://localhost:8000" -ForegroundColor Green
Write-Host "  API Gateway : http://localhost:5000" -ForegroundColor Green
if (-not $NoFrontend) {
    Write-Host "  Tourist App : http://localhost:5173" -ForegroundColor Green
    Write-Host "  B2B Console : http://localhost:5174" -ForegroundColor Green
}
Write-Host ""
Write-Host "  Logs dir    : $LogDir" -ForegroundColor Yellow
Write-Host ""

if ($Demo) {
    Write-Status "Running demo disruption trigger in 5s..."
    Start-Sleep -Seconds 5
    python (Join-Path $Root "scripts\mock_disruption_trigger.py")
}
