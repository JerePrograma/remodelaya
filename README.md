# Remodelaya

Sitio estático institucional de Remodelaya: construcción integral y refacciones.
El HTML, CSS, JavaScript y las imágenes provienen directamente del código original
de Sites, con los teléfonos corregidos, dos correos públicos de contacto y los
metadatos SEO del repositorio.

## Estructura

- `site/`: los cinco archivos fuente del sitio; editar acá
- `dist/`: salida generada, no versionada
- `scripts/`: build, validación y captura de referencia
- `reference/sites-original/`: capturas y audits de la referencia canónica

## Desarrollo local

```powershell
npm install
npm run dev
```

## Build, pruebas y vista previa

```powershell
npm run build
npm test
npm run preview
```

El build copia `site/` a `dist/` sin transformar los archivos. Vite se usa únicamente
como servidor local de desarrollo y vista previa; no hay React ni TypeScript.
Para publicar en un hosting estático, usar el contenido de `dist/`.

`npm test` verifica la fidelidad de los archivos al original, las únicas
modificaciones autorizadas de contacto/SEO, los assets y la igualdad del build.
GitHub Actions ejecuta el build y estas pruebas en cada push/PR a `main`.

Los correos se muestran en Contacto: `presupuestos@remodelaya.com.ar` para
presupuestos y `contacto@remodelaya.com.ar` para consultas generales. Los enlaces
`mailto:` abren la aplicación de correo configurada por el visitante.

Ver `REFERENCE_SITES.md` para las capturas y pruebas en navegador, y
`MIGRATION_SITES.md` para la procedencia y la corrección de contacto.
