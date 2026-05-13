# Proxy to portable gh.exe. Usage: npm run gh -- auth status
$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$ghExe = Join-Path $root "tools/gh/bin/gh.exe"

if (-not (Test-Path $ghExe)) {
  Write-Host "GitHub CLI is not installed in this project." -ForegroundColor Yellow
  Write-Host "From the repo root, run:  npm run install:gh" -ForegroundColor Yellow
  exit 1
}

& $ghExe @args
exit $LASTEXITCODE
