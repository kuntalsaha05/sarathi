#!/usr/bin/env pwsh
<#
.SYNOPSIS
Stops the SARATHI stack.
#>

$ErrorActionPreference = 'SilentlyContinue'
$Root = Split-Path -Parent $PSScriptRoot
$LogDir = Join-Path $Root "logs"

Write-Host "[SARATHI] Stopping services..."

$patterns = @("uvicorn", "node.*server.js", "npm.*run dev")
$procs = Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object {
    $cmd = $_.CommandLine
    $cmd -match "uvicorn" -or $cmd -match "node.*server\.js" -or $cmd -match "npm.*run dev"
}
foreach ($p in $procs) { Stop-Process -Id $p.ProcessId -Force }

try {
    Push-Location $Root
    docker compose --profile backend down 2>&1 | Out-Null
    Pop-Location
} catch {}

# Clean up logs if desired
if (Test-Path $LogDir) {
    Remove-Item "$LogDir\*.log" -Force -ErrorAction SilentlyContinue
}

Write-Host "[SARATHI] All services stopped."
