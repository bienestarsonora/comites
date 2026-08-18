# Configuración final

1. Ejecuta `supabase.sql` completo en el proyecto COMITES. Es idempotente y puede ejecutarse sobre la instalación actual.
2. Conserva `supabase-config.js` con la URL y la `anon` key que ya comprobaste que funcionan.
3. Despliega la Edge Function `admin-create-user` desde Supabase Dashboard > Edge Functions. Debe requerir JWT.
4. Sube **todo el contenido del paquete** a la raíz del repositorio, no parches sueltos.
5. En Auth > URL Configuration usa `https://bienestarsonora.github.io/comites/`.

La Edge Function usa `SUPABASE_URL`, `SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY` únicamente en el servidor de Supabase; no expongas la service role key en el frontend.
