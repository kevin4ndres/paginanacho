# EIRP Construcciones — sitio web

Sitio estático (HTML, CSS y JS, sin build) listo para Netlify.

## Desplegar en Netlify
1. En Netlify: **Add new site → Import an existing project → GitHub** y elige `paginanacho`.
2. Deja la configuración por defecto (la toma de `netlify.toml`: sin comando de build, carpeta `.`).
3. Deploy. Luego en **Domain management** conecta el dominio del cliente.

## Formulario de cotización
Usa **Netlify Forms** (formulario `cotizacion`). Las solicitudes aparecen en
*Site configuration → Forms*. Para recibirlas por correo:
*Forms → Form notifications → Add notification → Email*.
Después de enviar, el cliente puede además confirmar por WhatsApp.

## Datos que hay que reemplazar (hoy son de relleno)
- **WhatsApp:** `js/main.js`, constante `WHATSAPP_NUMERO` (formato `569XXXXXXXX`).
- **Teléfono, correo y ciudad:** en `index.html` (sección "Contacto Directo" y footer).
  Busca `+56 9 1234 5678`, `56912345678`, `contacto@eirpconstrucciones.cl` y `Santiago, Chile`.
- **Proyectos:** reemplazar los recuadros "Foto próximamente" por fotos reales de obras.

## Calculadora de proyecto
Los valores están en `js/main.js`, objeto `CALC`:
- `valorUF`: valor de la UF en pesos (actualizar cada cierto tiempo).
- `ufPorM2`: UF/m² base por terminación (económica, media, premium).
- `factorMaterial`: multiplicador por sistema constructivo.
- `factorObra`: multiplicador por tipo de obra (nueva, ampliación, remodelación).
- `margen`: rango ± que se muestra.
Al tocar "Cotizar este proyecto", el resumen se copia al formulario y llega a Netlify en el campo `estimacion`.
