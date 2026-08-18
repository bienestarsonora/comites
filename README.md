# Plataforma de Comités de Contraloría Social, Bienestar y Participación Ciudadana

Paquete completo de producción para GitHub Pages + Supabase.

## Incluye
- Portal público con mapa, directorio, indicadores y curso.
- Panel de administración con Auth y RLS.
- Alta, edición y baja de comités.
- Expediente por comité: actas constitutivas, documentos, evidencias y fotografías.
- Creación de usuarios desde el panel mediante Edge Function segura.
- Roles: administrador, capturista y consulta.
- Solicitudes ciudadanas y capacitaciones.
- Contenido principal editable.
- Logo institucional original proporcionado por la Secretaría.

## Archivos de producción
Sube a la raíz de `bienestarsonora/comites`: `index.html`, `styles.css`, `app.js`, `curso-contraloria.html`, `curso.css`, `curso.js`, `supabase-config.js` y la carpeta `assets`.

## Supabase
Ejecuta `supabase.sql` completo en SQL Editor. Después despliega la función `supabase/functions/admin-create-user/index.ts`. Nunca coloques una secret/service_role key en GitHub Pages.
