# Plataforma de Comités de Contraloría Social y Participación Social

Versión preparada para operación institucional con GitHub Pages + Supabase.

## Qué incluye

- Portal público con mapa Leaflet/OpenStreetMap, directorio, fichas e indicadores.
- Logo oficial de la Secretaría de Bienestar proporcionado para esta versión.
- Supabase como fuente central de información.
- Autenticación por correo y contraseña con Supabase Auth.
- Roles `admin`, `capturista` y `consulta`.
- Row Level Security (RLS) para impedir escrituras públicas.
- CRUD de comités.
- Gestión de documentos con Supabase Storage privado y enlaces temporales firmados.
- Gestión de capacitaciones.
- Solicitudes ciudadanas guardadas en Supabase.
- Edición de textos principales del portal desde el panel.
- Gestión de permisos de usuarios por administradores.
- Recuperación de contraseña.
- Curso de Introducción a la Contraloría Social y reconocimiento.

## Archivos importantes

- `index.html`: portal y panel administrativo.
- `app.js`: integración con Supabase y lógica del portal.
- `styles.css`: interfaz pública y administrativa.
- `supabase.sql`: esquema, RLS, Storage y datos iniciales.
- `supabase-config.js`: URL y publishable key del proyecto.
- `assets/logo-bienestar.png`: logo institucional.
- `curso-contraloria.html`, `curso.css`, `curso.js`: curso ciudadano.

## Configuración de Supabase

1. Crear o seleccionar un proyecto Supabase para COMITES.
2. Ejecutar `supabase.sql` como migración.
3. Copiar la URL del proyecto y la publishable key en `supabase-config.js`.
4. En Auth > URL Configuration configurar como Site URL:
   `https://bienestarsonora.github.io/comites/`
5. Añadir la misma URL en Redirect URLs para recuperación de contraseña.
6. Crear la primera cuenta desde el botón `Crear cuenta` del panel.
7. Promover esa cuenta una sola vez a administrador:

```sql
update public.profiles
set role = 'admin', active = true
where email = 'CORREO_ADMIN';
```

Después, el propio administrador puede asignar roles a otras cuentas desde el panel.

## Seguridad

La URL y la publishable key de Supabase son credenciales públicas del frontend. La seguridad real depende de RLS, que se configura en `supabase.sql`. Nunca colocar una `service_role` key en GitHub Pages. El bucket documental queda privado; los archivos públicos se entregan mediante enlaces firmados y los internos solo son legibles por personal autorizado.

`capturista` puede crear y modificar información operativa; las eliminaciones y la gestión de usuarios/contenido quedan reservadas a `admin`.
