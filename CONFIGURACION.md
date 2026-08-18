# Configuración v11

## Supabase
Ejecuta `supabase.sql` completo en SQL Editor. El script conserva los módulos de comités, documentos, capacitaciones, acciones, compromisos, contenido y solicitudes.

Tablas funcionales principales:
- `profiles`
- `committees`
- `documents`
- `trainings`
- `committee_events`
- `commitments`
- `site_content`
- `contact_requests`

El script elimina, si existieran por una versión previa, los triggers, función y tabla de auditoría automática.

## Usuarios
La creación de usuarios desde el panel requiere la Edge Function `admin-create-user` incluida en `supabase/functions/admin-create-user/`. Nunca expongas una `service_role` o secret key en el frontend.

## Storage
Se mantiene el bucket privado para documentos de comité y sus políticas RLS.
