# Despliegue completo

Este paquete sustituye integralmente la versión anterior. No es un parche.

## 1. Supabase
Ejecuta `supabase.sql` completo en SQL Editor.

## 2. Creación de usuarios desde Administración
Despliega la Edge Function incluida en:
`supabase/functions/admin-create-user/`

Nombre de la función: `admin-create-user`.
Debe requerir JWT. La función valida además que la persona conectada tenga rol `admin`.

## 3. GitHub Pages
Sube a la raíz de `bienestarsonora/comites` TODOS los archivos y carpetas de este paquete.

## Incluido
- Denominación: Comités de Contraloría Social, Bienestar y Participación Ciudadana.
- Logo institucional original proporcionado por el usuario, sin modificar.
- Administración de comités.
- Creación de usuarios desde el panel administrador.
- Roles administrador/capturista/consulta.
- Expediente por comité.
- Actas constitutivas.
- Documentos y evidencias.
- Carga múltiple de fotografías.
- Fotografías visibles en la ficha pública cuando se marquen como públicas.
- Supabase Auth, RLS y Storage privado.
