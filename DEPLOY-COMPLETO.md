# Despliegue completo v11

Este paquete sustituye integralmente la versión anterior. No es un parche.

1. Ejecuta `supabase.sql` completo en Supabase SQL Editor.
2. Conserva desplegada la Edge Function `admin-create-user`.
3. Sube a la raíz de `bienestarsonora/comites` todos los archivos y carpetas de este paquete.
4. Espera la publicación de GitHub Pages y fuerza recarga del navegador si fuera necesario.

## Cambio de v11
Se eliminó por completo la auditoría automática: no hay pestaña de Auditoría, consultas a `audit_log`, triggers de auditoría ni tabla `audit_log`. Si esos objetos existen por una instalación previa de v10, `supabase.sql` los elimina.


## v12 · Capacitaciones por rango de fechas
- Cada capacitación registra fecha de inicio y fecha de término.
- Permite cursos de una sola jornada o procesos de varias semanas.
- Se registra el número real de sesiones (por ejemplo, 7 sesiones).
- Los registros existentes se conservan y se migran como inicio=fin, 1 sesión.
- Para usar esta versión, vuelve a ejecutar `supabase.sql`; el script actualiza la estructura sin borrar los datos existentes.


## v13 · Gestiones generalizadas
La atención de los comités se modela mediante `committee_requests`, una estructura transversal para cualquier solicitud o necesidad. La categoría es texto libre. Se separan explícitamente la fecha de solicitud, la primera respuesta institucional, el inicio de ejecución y la conclusión, por lo que un proceso largo (por ejemplo un curso de varias semanas) no se interpreta como demora institucional. Capacitaciones sigue existiendo como módulo especializado cuando se necesita registrar sesiones y rangos de fechas.


## v14
No requiere cambios de estructura en Supabase respecto de v13. La tabla `documents` y el bucket existentes ya soportan esta organización.

Después de subir esta versión completa a GitHub Pages, haz Ctrl + Shift + R. Las actas que ya subiste con un comité relacionado no se borran: dejan de aparecer en la Biblioteca pública y quedan visibles desde el expediente del comité correspondiente.


## v15 — listado progresivo de comités
- El Directorio muestra 9 comités inicialmente.
- El botón `Mostrar más comités` carga 9 adicionales en cada clic.
- El contador indica cuántos se muestran del total filtrado.
- Al cambiar búsqueda o filtros, el listado vuelve automáticamente a los primeros 9 resultados.
- La vista compacta conserva todos los resultados para consulta tabular.


## v16 — expedientes corregidos
- `Expedientes completos` se calcula con Acta constitutiva + Lista de asistencia, aunque la lista sea privada.
- Se agrega la función segura `get_committee_file_status()`; no expone archivos privados ni sus nombres.
- Al editar un comité, el panel muestra nombre de archivo, fecha, visibilidad y enlace para Acta y Lista.
- También muestra todas las fotografías y evidencias adicionales ya cargadas.
- La tabla de comités indica Acta, Lista y cantidad de fotografías/evidencias existentes.
- Para instalar esta versión hay que ejecutar nuevamente el `supabase.sql` completo.


## v17 — evidencias visibles
- El total del expediente muestra todos los archivos: acta + lista + evidencias adicionales.
- La sección de evidencias aclara que su contador excluye acta y lista.
- Antes de guardar, muestra cuántos archivos adicionales fueron seleccionados y sus nombres.
- Las nuevas evidencias son públicas por default.
- Cada evidencia ya cargada puede cambiarse individualmente entre Pública y No pública desde Editar comité.
- No requiere cambios en Supabase respecto de v16.

## v18 — conteo total del expediente
- El panel de comités ya no muestra solo el número de evidencias adicionales.
- Muestra el total real de archivos asociados al comité.
- Ejemplo: Acta + Lista + 1 evidencia = `3 archivos en expediente`.
- Dentro de Editar comité se mantiene la separación visual: documentos principales y evidencias adicionales.
- El encabezado del expediente muestra de forma prominente el total incluyendo todos los archivos.
- No requiere cambios en Supabase.

## v19 — cache limpio y conteo inequívoco
- `index.html` carga `app-v19.js` y `styles-v19.css` como archivos físicos nuevos.
- Esto evita que una pestaña o caché del navegador reutilice el JavaScript anterior.
- La columna Expediente muestra el TOTAL REAL de archivos:
  - Ejemplo: Acta + Lista + 1 adicional = `3 archivos totales`.
- Debajo se explica la composición: `Acta + Lista + 1 adicional`.
- No requiere cambios en Supabase.

## v20 — eliminar archivos del expediente
- Los administradores pueden eliminar Acta constitutiva, Lista de asistencia, fotografías y evidencias desde Editar comité.
- Cada archivo muestra un botón rojo `Eliminar`.
- Se solicita confirmación antes de borrar.
- La eliminación quita el registro de `documents` y limpia el objeto en Storage.
- El contador del expediente y los indicadores se actualizan inmediatamente.
- Si se elimina Acta o Lista, el expediente vuelve a marcarse como incompleto.
- Los capturistas pueden subir/editar, pero el borrado destructivo queda reservado al rol administrador.
- No requiere cambios en Supabase si ya ejecutaste el SQL de v16/v17, porque las políticas de borrado ya existen.

## v21 — borrado funcional de archivos del expediente
- El botón Eliminar ya no depende del rol literal `admin`.
- Aparece para cualquier usuario institucional con permiso operativo (`admin` o `capturista`).
- Sólo aplica a archivos del expediente del comité: Acta, Lista, fotografías y evidencias.
- Biblioteca general y otras eliminaciones sensibles conservan sus restricciones anteriores.
- Supabase actualiza las políticas DELETE de `documents` y `storage.objects` para permitir esta corrección operativa a usuarios staff.
- Debes ejecutar nuevamente el `supabase.sql` de v21.
- No borra datos al instalarse.

## v22 — visibilidad editable después de subir
- Acta constitutiva y Lista de asistencia muestran un botón de estado `Público / No público`.
- Fotografías y evidencias adicionales mantienen el mismo control individual.
- El estado puede cambiarse después de haber subido el archivo; no es necesario reemplazarlo.
- El checkbox del formulario sólo define el estado inicial de un archivo nuevo.
- No requiere cambios en Supabase respecto de v21.

## v23 — visibilidad persistente
- Corregido el flujo que podía hacer pensar que “Guardar comité” cambiaba la visibilidad de evidencias ya existentes.
- La visibilidad de archivos existentes ahora se guarda INMEDIATAMENTE al pulsar Público / No público.
- El frontend verifica la respuesta de Supabase antes de mostrar el cambio como exitoso.
- Acta, Lista y evidencias adicionales pueden alternarse individualmente.
- Se agregan botones `Hacer todas públicas` y `Hacer todas no públicas` para evidencias adicionales de cada comité.
- Los checkboxes del área de carga aplican únicamente a archivos NUEVOS.
- Requiere ejecutar el `supabase.sql` de v23 porque incorpora dos RPC seguras.

## v24 — corrección visual + persistencia de visibilidad
- Corregido el error `column "updated_by" of relation "documents" does not exist`.
- Las funciones de visibilidad ya no dependen de columnas inexistentes.
- Los botones Público / Abrir / Eliminar ya no se sobreponen al nombre, fecha ni estatus del archivo.
- Las acciones quedan en una fila propia debajo del documento.
- En pantallas angostas, los controles se apilan correctamente.
- Requiere ejecutar `SUPABASE-FIX-VISIBILIDAD-v24.sql` o el `supabase.sql` completo.

## v25 — buscador admin + ficha pública en vivo
- Se agregó buscador en Administración > Comités.
- Busca por nombre, municipio, colonia, programa, tipo y estatus.
- Puede combinarse con el filtro por tipo de comité.
- Cada vez que se abre una ficha desde el mapa o directorio, la plataforma vuelve a consultar en Supabase los documentos públicos de ese comité.
- Esto evita que un documento recién cambiado de No público a Público quede oculto por caché de la sesión.
- No requiere cambios adicionales en Supabase si ya aplicaste el FIX de visibilidad de v24.
