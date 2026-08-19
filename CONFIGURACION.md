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


## v12 · Capacitaciones por rango de fechas
- Cada capacitación registra fecha de inicio y fecha de término.
- Permite cursos de una sola jornada o procesos de varias semanas.
- Se registra el número real de sesiones (por ejemplo, 7 sesiones).
- Los registros existentes se conservan y se migran como inicio=fin, 1 sesión.
- Para usar esta versión, vuelve a ejecutar `supabase.sql`; el script actualiza la estructura sin borrar los datos existentes.


## v13 · Gestiones generalizadas
La atención de los comités se modela mediante `committee_requests`, una estructura transversal para cualquier solicitud o necesidad. La categoría es texto libre. Se separan explícitamente la fecha de solicitud, la primera respuesta institucional, el inicio de ejecución y la conclusión, por lo que un proceso largo (por ejemplo un curso de varias semanas) no se interpreta como demora institucional. Capacitaciones sigue existiendo como módulo especializado cuando se necesita registrar sesiones y rangos de fechas.
