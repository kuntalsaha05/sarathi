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

# Check Docker
$dockerAvailable = $false
try {
    $null = docker --version
    $dockerAvailable = $true
} catch {
    Write-Host "[SARATHI] Docker not found in PATH." -ForegroundColor Yellow
}

if ($dockerAvailable) {
    Write-Status "Starting PostGIS + Redis via Docker..."
    Push-Location $Root
    docker compose --profile backend up -d postgres redis
    Pop-Location

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

    Write-Status "Running migrations..."
    $migrations = Get-ChildItem (Join-Path $Root "database\migrations\*.sql") | Sort-Object Name
    foreach ($m in $migrations) {
        $fname = Split-Path $m -Leaf
        $psi = New-Object System.Diagnostics.ProcessStartInfo
        $psi.FileName = "docker"
        $psi.Arguments = @(
            "exec",
            "-i",
            "sarathi-postgis",
            "psql",
            "-U",
            "sarathi_admin",
            "-d",
            "sarathi_db",
            "-v",
            "ON_ERROR_STOP=1",
            "-f",
            "/docker-entrypoint-initdb.d/$fname"
        ) -join ' '
        $psi.RedirectStandardOutput = $true
        $psi.RedirectStandardError = $true
        $psi.UseShellExecute = $false
        $process = [System.Diagnostics.Process]::Start($psi)
        $stdout = $process.StandardOutput.ReadToEnd()
        $stderr = $process.StandardError.ReadToEnd()
        $process.WaitForExit()
        if ($process.ExitCode -ne 0) {
            $msg = @($stdout, $stderr) | Where-Object { $_ } | Out-String
            throw "Migration failed for $fname`n$msg"
        }
    }
} else {
    Write-Host "[SARATHI] Skipping Docker. Make sure Postgres+PostGIS and Redis are running locally." -ForegroundColor Yellow
    Write-Host "         Or install Docker Desktop: https://www.docker.com/products/docker-desktop/" -ForegroundColor Yellow
}

# Core Engine
Write-Status "Starting core-engine..."
$engineLog = Join-Path $LogDir "core-engine.log"
$engineOut = "$engineLog.out"
$engineErr = "$engineLog.err"
Push-Location (Join-Path $Root "core-engine")
if (-not (Test-Path .venv)) {
    Write-Status "Creating Python virtual environment..."
    python -m venv .venv
    .\.venv\Scripts\pip install -r requirements.txt
}
Start-Process -FilePath ".\.venv\Scripts\python.exe" -ArgumentList "-m","uvicorn","app.main:app","--reload","--port","8000" -NoNewWindow -RedirectStandardOutput $engineOut -RedirectStandardError $engineErr
Pop-Location

# API Gateway
Write-Status "Starting api-gateway..."
$gwLog = Join-Path $LogDir "api-gateway.log"
$gwOut = "$gwLog.out"
$gwErr = "$gwLog.err"
Push-Location (Join-Path $Root "api-gateway")
if (-not (Test-Path node_modules)) {
    Write-Status "Installing gateway dependencies..."
    npm install
}
Start-Process -FilePath "node" -ArgumentList "src/server.js" -NoNewWindow -RedirectStandardOutput $gwOut -RedirectStandardError $gwErr
Pop-Location

# Frontends
if (-not $NoFrontend) {
    Write-Status "Starting tourist-app..."
    $clientLog = Join-Path $LogDir "tourist-app.log"
    $clientOut = "$clientLog.out"
    $clientErr = "$clientLog.err"
    Push-Location (Join-Path $Root "apps\tourist-app")
    if (-not (Test-Path node_modules)) { npm install }
    Start-Process -FilePath "npm.cmd" -ArgumentList "run","dev" -NoNewWindow -RedirectStandardOutput $clientOut -RedirectStandardError $clientErr
    Pop-Location

    Write-Status "Starting b2b-console..."
    $b2bLog = Join-Path $LogDir "b2b-console.log"
    $b2bOut = "$b2bLog.out"
    $b2bErr = "$b2bLog.err"
    Push-Location (Join-Path $Root "apps\b2b-console")
    if (-not (Test-Path node_modules)) { npm install }
    Start-Process -FilePath "npm.cmd" -ArgumentList "run","dev" -NoNewWindow -RedirectStandardOutput $b2bOut -RedirectStandardError $b2bErr
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
