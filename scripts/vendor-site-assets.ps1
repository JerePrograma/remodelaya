$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$assetDir = Join-Path $projectRoot 'public\assets'

New-Item -ItemType Directory -Force -Path $assetDir | Out-Null

$assets = @{
    'brand-mark.png'    = 'https://remodelaya.jereprograma.chatgpt.site/assets/brand-mark.png'
    'interior-hero.webp' = 'https://remodelaya.jereprograma.chatgpt.site/assets/interior-hero.webp'
}

foreach ($entry in $assets.GetEnumerator()) {
    $destination = Join-Path $assetDir $entry.Key
    Write-Host "Descargando $($entry.Key)..."
    Invoke-WebRequest -Uri $entry.Value -OutFile $destination
}

Write-Host ''
Write-Host 'Assets originales de Sites copiados a public\assets.'
Write-Host 'Antes de retirar Sites, versionalos en Git y cambia App.tsx para usar /assets/*.'
