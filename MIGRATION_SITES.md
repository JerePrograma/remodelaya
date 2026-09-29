# Migración desde ChatGPT Sites

Fuente pública relevada:

- https://remodelaya.jereprograma.chatgpt.site/
- Título: `Remodelaya · Construcción integral y refacciones`
- Color principal observado: `#102b43`
- Color de acento observado: `#f57826`

## Assets originales detectados

- `/assets/brand-mark.png`
- `/assets/interior-hero.webp`

Mientras se valida la réplica, el frontend usa esos dos recursos desde el Site original para conservar fidelidad visual.

Para independizarlos del Site:

```powershell
Set-Location -LiteralPath 'C:\laburo\remodelaya'
.\scripts\vendor-site-assets.ps1
```

Después de verificar los archivos descargados, deben versionarse y cambiar las constantes de `src/App.tsx` a rutas locales `/assets/...`.

## Cambio deliberado respecto del Site actualmente publicado

El repositorio incorpora la corrección solicitada de contacto:

- contacto principal: `+54 9 3758 55-0237`
- WhatsApp alternativo: `11 2779 2932`

Los CTAs comerciales y de servicios continúan usando WhatsApp `11 2779 2932`.
