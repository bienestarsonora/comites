# Comités de Contraloría Social, Bienestar y Participación Ciudadana

Versión v11 · Impacto, transparencia y gobierno abierto.

## Funcionalidades principales
- Directorio y mapa interactivo de comités.
- Filtros, búsqueda, zoom con rueda y mapa en pantalla completa.
- Panel institucional con roles Administrador, Capturista y Consulta.
- Registro y edición de comités.
- Expediente digital por comité con documentos, actas y fotografías.
- Capacitaciones.
- Acciones y compromisos con responsable, fechas, avance y semáforo.
- Tablero de impacto con indicadores calculados desde los datos registrados.
- Índice de Fortalecimiento del Comité con metodología visible.
- Datos abiertos en CSV y JSON y diccionario de datos.
- Solicitudes ciudadanas.

Esta versión no incluye auditoría automática ni historial automático de cambios. Tampoco incorpora cuentas ciudadanas, replicabilidad ni costos.


## v12 · Capacitaciones por rango de fechas
- Cada capacitación registra fecha de inicio y fecha de término.
- Permite cursos de una sola jornada o procesos de varias semanas.
- Se registra el número real de sesiones (por ejemplo, 7 sesiones).
- Los registros existentes se conservan y se migran como inicio=fin, 1 sesión.
- Para usar esta versión, vuelve a ejecutar `supabase.sql`; el script actualiza la estructura sin borrar los datos existentes.


## v13 · Gestiones generalizadas
La atención de los comités se modela mediante `committee_requests`, una estructura transversal para cualquier solicitud o necesidad. La categoría es texto libre. Se separan explícitamente la fecha de solicitud, la primera respuesta institucional, el inicio de ejecución y la conclusión, por lo que un proceso largo (por ejemplo un curso de varias semanas) no se interpreta como demora institucional. Capacitaciones sigue existiendo como módulo especializado cuando se necesita registrar sesiones y rangos de fechas.


## v14 — Expediente por comité y biblioteca ordenada
- Acta constitutiva y lista de asistencia se cargan en Crear/Editar comité.
- Las actas ya asociadas a cada comité se conservan y se detectan automáticamente.
- La Biblioteca pública sólo muestra recursos generales sin committee_id.
- El área pública de recursos muestra 9 elementos inicialmente y permite cargar 9 más sucesivamente.
- El panel de comités muestra rápidamente si cada expediente ya tiene Acta y Lista.


### Archivos activos v19
La página principal carga `app-v19.js` y `styles-v19.css` para evitar caché de versiones anteriores.


### v20
El panel de edición de cada comité permite al administrador eliminar archivos cargados por error, incluyendo documentos principales y evidencias.
