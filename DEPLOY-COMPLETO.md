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


## v7 — búsqueda del mapa
- Cada búsqueda nueva cancela cualquier movimiento anterior del mapa.
- Cuando hay una coincidencia única o exacta, el mapa fuerza centro y zoom al comité encontrado.
- Al cambiar de un resultado a otro (por ejemplo, Caborca → Navojoa), el nuevo resultado siempre reposiciona el mapa.


## v8 — zoom con rueda del mouse
- El mapa permite acercar y alejar directamente con la rueda del mouse.
- El zoom queda habilitado permanentemente, sin necesidad de hacer clic o enfocar antes el mapa.
