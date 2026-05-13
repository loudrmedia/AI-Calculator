# Installs official GitHub CLI (gh) as a portable Windows binary under tools/gh/bin/
# Run from repo root: npm run install:gh

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$binDir = Join-Path $root "tools/gh/bin"
$zipPath = Join-Path $env:TEMP ("gh-portable-" + [Guid]::NewGuid().ToString() + ".zip")
$extractRoot = Join-Path $env:TEMP ("gh-extract-" + [Guid]::NewGuid().ToString())

try {
  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

  $ghExe = Join-Path $binDir "gh.exe"
  if (Test-Path $ghExe) {
    Write-Host "Already installed: $ghExe" -ForegroundColor Green
    & $ghExe --version
    exit 0
  }

  Write-Host "Fetching latest GitHub CLI release..." -ForegroundColor Cyan
  $release = Invoke-RestMethod -Uri "https://api.github.com/repos/cli/cli/releases/latest" -Headers @{ "User-Agent" = "ai-calculator-install-script" }
  $asset = $release.assets | Where-Object {
    $_.name -match '^gh_.*_windows_amd64\.zip$'
  } | Select-Object -First 1

  if (-not $asset) {
    throw "Could not find windows_amd64.zip in latest cli/cli release."
  }

  Write-Host "Downloading $($asset.name)..." -ForegroundColor Cyan
  Invoke-WebRequest -Uri $asset.browser_download_url -OutFile $zipPath -UseBasicParsing

  New-Item -ItemType Directory -Path $extractRoot -Force | Out-Null
  Expand-Archive -Path $zipPath -DestinationPath $extractRoot -Force

  $found = Get-ChildItem -Path $extractRoot -Filter "gh.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
  if (-not $found) {
    throw "gh.exe not found inside downloaded archive."
  }

  New-Item -ItemType Directory -Path $binDir -Force | Out-Null
  Copy-Item -Path $found.FullName -Destination $ghExe -Force

  Write-Host "Installed: $ghExe" -ForegroundColor Green
  & $ghExe --version
  Write-Host ""
  Write-Host "Next: npm run gh:login" -ForegroundColor Yellow
}
finally {
  if (Test-Path $zipPath) { Remove-Item $zipPath -Force -ErrorAction SilentlyContinue }
  if (Test-Path $extractRoot) { Remove-Item $extractRoot -Recurse -Force -ErrorAction SilentlyContinue }
}
