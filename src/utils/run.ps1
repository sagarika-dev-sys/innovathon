param(
    [string]$Command = "demo"
)

$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCmd) {
    $nodePath = $nodeCmd.Source
} else {
    $env:ELECTRON_RUN_AS_NODE = "1"
    $nodePath = "C:\Users\sanje\AppData\Local\Programs\antigravity\Antigravity.exe"
}

if ($Command -eq "test") {
    Write-Host "Running 27 automated unit tests..." -ForegroundColor Cyan
    & $nodePath --test tests/matchingAlgorithm.test.js
} else {
    Write-Host "Running SkillBridge matching demo (example.js)..." -ForegroundColor Cyan
    & $nodePath example.js
}
