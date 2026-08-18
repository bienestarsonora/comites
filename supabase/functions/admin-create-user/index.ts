import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const allowedOrigins = new Set([
  'https://bienestarsonora.github.io',
  'http://localhost:5500',
  'http://127.0.0.1:5500'
])

function cors(origin: string | null) {
  const allowed = origin && allowedOrigins.has(origin) ? origin : 'https://bienestarsonora.github.io'
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  }
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin')
  const headers = cors(origin)
  if (req.method === 'OPTIONS') return new Response('ok', { headers })
  if (req.method !== 'POST') return new Response(JSON.stringify({ ok: false, error: 'Método no permitido' }), { status: 405, headers })

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const authHeader = req.headers.get('Authorization') || ''
    if (!authHeader.startsWith('Bearer ')) return new Response(JSON.stringify({ ok: false, error: 'Sesión requerida' }), { status: 401, headers })

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false, autoRefreshToken: false }
    })
    const { data: userData, error: userError } = await userClient.auth.getUser()
    if (userError || !userData.user) return new Response(JSON.stringify({ ok: false, error: 'Sesión inválida' }), { status: 401, headers })

    const adminClient = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } })
    const { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .select('role, active')
      .eq('id', userData.user.id)
      .maybeSingle()
    if (profileError || !profile?.active || profile.role !== 'admin') {
      return new Response(JSON.stringify({ ok: false, error: 'Solo un administrador puede crear usuarios' }), { status: 403, headers })
    }

    const body = await req.json()
    const email = String(body.email || '').trim().toLowerCase()
    const password = String(body.password || '')
    const fullName = String(body.full_name || '').trim()
    const role = ['admin', 'capturista', 'consulta'].includes(body.role) ? body.role : 'consulta'
    if (!email || !email.includes('@')) return new Response(JSON.stringify({ ok: false, error: 'Correo inválido' }), { status: 400, headers })
    if (password.length < 8) return new Response(JSON.stringify({ ok: false, error: 'La contraseña debe tener al menos 8 caracteres' }), { status: 400, headers })

    const { data: created, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName }
    })
    if (createError || !created.user) return new Response(JSON.stringify({ ok: false, error: createError?.message || 'No se pudo crear el usuario' }), { status: 400, headers })

    const { error: upsertError } = await adminClient.from('profiles').upsert({
      id: created.user.id,
      email,
      full_name: fullName,
      role,
      active: true
    }, { onConflict: 'id' })
    if (upsertError) {
      await adminClient.auth.admin.deleteUser(created.user.id)
      return new Response(JSON.stringify({ ok: false, error: 'No se pudo asignar el rol al usuario' }), { status: 500, headers })
    }

    return new Response(JSON.stringify({ ok: true, user: { id: created.user.id, email, full_name: fullName, role } }), { status: 200, headers })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ ok: false, error: 'Error interno al crear el usuario' }), { status: 500, headers })
  }
})
