# Exportación directa desde Sites

Se recuperó el código fuente del Site original, sin reconstruirlo en React:

- Site: https://remodelaya.jereprograma.chatgpt.site/
- Revisión de origen: `71d2c58bcb9f6105c39c77f8fdf3236962257c83`
- Archivos: `index.html`, `styles.css`, `app.js`, `assets/brand-mark.png` y
  `assets/interior-hero.webp`

Los cinco archivos se versionan en `site/`. El build los copia byte a byte a
`dist/`. El JavaScript y las dos imágenes son idénticos al original. El CSS
original se conserva con un bloque acotado para los nuevos enlaces de correo.
No se importaron la configuración de alojamiento de Sites ni las inyecciones
que Cloudflare agregaba a las capturas HTML del sitio publicado.

## Modificaciones autorizadas al original

Se conservan las correcciones de contacto que ya tenía el repositorio:

- Contacto principal: `+54 9 3758 55-0237`, enlace `tel:+5493758550237`
- WhatsApp alternativo: `11 2779 2932`
- Todos los CTAs comerciales y de servicios usan WhatsApp `5491127792932`
- Presupuestos por email: `presupuestos@remodelaya.com.ar`
- Consultas generales: `contacto@remodelaya.com.ar`

Los dos correos se incorporan como enlaces `mailto:` debajo de los teléfonos,
con un icono de sobre del mismo estilo. Las direcciones largas se ajustan a
pantallas angostas sin recortes ni desplazamiento horizontal. No se publican
las casillas administrativa ni personal para mantener claras las opciones.

También se mantienen los cuatro metadatos Open Graph y el enlace canónico
`https://remodelaya.com.ar/` ya existentes en el repositorio. El resto del diseño,
los textos, iconos, estilos y comportamiento se conserva.

## Verificación

`npm run build && npm test` comprueba los hashes del código original, permite
solamente las sustituciones de contacto/SEO y adiciones de correo indicadas,
y verifica que `dist/`
contenga exactamente los mismos cinco archivos que `site/`.

La tipografía original es `Arial, Helvetica, sans-serif`, sin fuentes remotas.
El color principal es `#102b43`, el acento de texto `#ff8a3d` y el fondo de
botones `#fc8637`.

La verificación en navegador sigue siendo una etapa separada. No se debe afirmar
paridad de píxeles por el solo hecho de que coincidan los archivos. Ver
`REFERENCE_SITES.md` para ejecutarla.
