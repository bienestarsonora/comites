# Despliegue completo v11

Este paquete sustituye integralmente la versión anterior. No es un parche.

1. Ejecuta `supabase.sql` completo en Supabase SQL Editor.
2. Conserva desplegada la Edge Function `admin-create-user`.
3. Sube a la raíz de `bienestarsonora/comites` todos los archivos y carpetas de este paquete.
4. Espera la publicación de GitHub Pages y fuerza recarga del navegador si fuera necesario.

## Cambio de v11
Se eliminó por completo la auditoría automática: no hay pestaña de Auditoría, consultas a `audit_log`, triggers de auditoría ni tabla `audit_log`. Si esos objetos existen por una instalación previa de v10, `supabase.sql` los elimina.
