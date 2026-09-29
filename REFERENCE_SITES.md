# Referencia canónica de ChatGPT Sites

La réplica visual debe compararse contra el Site publicado, no contra una interpretación manual.

## Capturar el Site original

Desde PowerShell:

```powershell
Set-Location -LiteralPath 'C:\laburo\remodelaya'

git pull --ff-only origin main
npm install
npx playwright install chromium
npm run capture:sites
```

El comando crea:

```text
reference/sites-original/
├── desktop-1440.png
├── desktop-1440.html
├── desktop-1440.audit.json
├── mobile-390.png
├── mobile-390.html
├── mobile-390.audit.json
├── capture-summary.json
├── resource-manifest.json
└── resources/
```

Los archivos `*.audit.json` contienen geometría real mediante
`getBoundingClientRect()` y estilos resueltos mediante `getComputedStyle()`
para los elementos principales del sitio.

El directorio `resources/` conserva los recursos same-origin observados por el
navegador durante la carga, de modo que podamos identificar CSS, JavaScript,
imágenes y fuentes que no aparecen en una extracción semántica.

## Regla de migración

No rediseñar mientras exista una diferencia visible con la referencia.
Primero alcanzar paridad visual y funcional. Después se puede refactorizar la
implementación manteniendo pruebas de regresión visual.
