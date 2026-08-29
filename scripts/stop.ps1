#!/usr/bin/env pwsh
<#
.SYNOPSIS
Stops all SARATHI services.
#>

$ErrorActionPreference = 'SilentlyContinue'

Write-Host "[SARATHI] Stopping all local services..." -ForegroundColor Cyan

# Stop processes listening on SARATHI ports (5000, 8000, 5173, 5174)
$ports = @(5000, 8000, 5173, 5174)
foreach ($port in $ports) {
    try {
        $connections = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
        foreach ($conn in $connections) {
            $pidToKill = $conn.OwningProcess
            if ($pidToKill -and $pidToKill -ne 0 -and $pidToKill -ne $PID) {
                Stop-Process -Id $pidToKill -Force -ErrorAction SilentlyContinue
            }
        }
    } catch {}
}

# Stop uvicorn and vite processes
$procs = Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object {
    $cmd = $_.CommandLine
    $cmd -match "uvicorn" -or $cmd -match "api-gateway" -or $cmd -match "tourist-app" -or $cmd -match "b2b-console"
}
foreach ($p in $procs) {
    Stop-Process -Id $p.ProcessId -Force -ErrorAction SilentlyContinue
}

Write-Host "[SARATHI] All SARATHI services stopped successfully." -ForegroundColor Green
