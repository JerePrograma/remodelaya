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

## Verificar la exportación estática

`site/` conserva directamente los archivos originales recuperados de Sites. El
CSS, JavaScript y assets permanecen byte a byte iguales. El HTML solo cambia los
teléfonos documentados en `MIGRATION_SITES.md` y preserva el SEO del repositorio.
`npm test` valida esa equivalencia y que el build no transforme los archivos.

Después de instalar las dependencias y Chromium:

```powershell
npm install
npx playwright install chromium
npm run build
npm test
npm run verify:sites
```

`verify:sites` inicia el build de producción en el puerto local 4173, lo revisa y
cierra su propio servidor al finalizar. El puerto debe estar libre. Usa
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` si necesitás un Chromium ya instalado.

Produce `reference/sites-current/` (ignorado por Git) con capturas nuevas,
auditorías y `report.json`. Comprueba:

- Geometría y estilos resueltos frente a los audits de 1440 y 390 px (tolerancia
  geométrica de 1 px)
- Desbordamiento horizontal y los cambios de grilla, header y hero en 12 anchos
  entre 320 y 1600 px
- Menú repetido, Escape y foco, selección de links, Atrás/Adelante, cambio a
  desktop, navegación activa, skip link y movimiento reducido
- Destinos de teléfono/WhatsApp, mensajes por servicio, año y errores de consola

Las capturas deben revisarse visualmente junto a las originales: el comando no
realiza una comparación automática de píxeles. La captura canónica usa Arial y
no descarga fuentes; diferencias de navegador o fuentes del sistema pueden
alterar métricas/rasterización. No se deben cambiar los estilos para compensar
un sustituto tipográfico de otra plataforma.
