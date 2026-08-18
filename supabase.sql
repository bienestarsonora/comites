-- Plataforma de Comités de Contraloría Social, Bienestar y Participación Ciudadana
-- Esquema de producción para Supabase/Postgres

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'consulta' check (role in ('admin','capturista','consulta')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.committees (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('CCS','CPS')),
  name text not null,
  municipality text not null,
  colony text not null default '',
  program text not null default '',
  members integer not null default 1 check (members > 0),
  integration_date date not null,
  lat double precision not null,
  lng double precision not null,
  status text not null default 'Activo' check (status in ('Activo','En seguimiento','Inactivo')),
  description text not null default '',
  public boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists committees_type_idx on public.committees(type);
create index if not exists committees_municipality_idx on public.committees(municipality);
create index if not exists committees_colony_idx on public.committees(colony);
create index if not exists committees_public_status_idx on public.committees(public,status);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  committee_id uuid references public.committees(id) on delete set null,
  title text not null,
  category text not null default 'General',
  description text not null default '',
  storage_path text not null,
  file_url text not null default '',
  public boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.documents add column if not exists file_name text not null default '';
alter table public.documents add column if not exists mime_type text not null default '';
alter table public.documents add column if not exists file_size bigint not null default 0;

create index if not exists documents_committee_idx on public.documents(committee_id);
create index if not exists documents_public_idx on public.documents(public);

create table if not exists public.trainings (
  id uuid primary key default gen_random_uuid(),
  committee_id uuid references public.committees(id) on delete set null,
  title text not null,
  training_date date not null,
  location text not null default '',
  attendees integer not null default 0 check (attendees >= 0),
  status text not null default 'Programada' check (status in ('Programada','Realizada','Cancelada')),
  notes text not null default '',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists trainings_date_idx on public.trainings(training_date desc);

create table if not exists public.site_content (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  committee_type text not null,
  request_type text not null,
  message text not null,
  status text not null default 'Nueva' check (status in ('Nueva','En atención','Atendida','Descartada')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

update public.contact_requests
set committee_type = 'Bienestar y Participación Ciudadana'
where committee_type = 'Participación Social';

alter table public.contact_requests drop constraint if exists contact_requests_committee_type_check;
alter table public.contact_requests add constraint contact_requests_committee_type_check
  check (committee_type in ('Contraloría Social','Bienestar y Participación Ciudadana'));

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists committees_set_updated_at on public.committees;
create trigger committees_set_updated_at before update on public.committees
for each row execute function public.set_updated_at();

drop trigger if exists documents_set_updated_at on public.documents;
create trigger documents_set_updated_at before update on public.documents
for each row execute function public.set_updated_at();

drop trigger if exists trainings_set_updated_at on public.trainings;
create trigger trainings_set_updated_at before update on public.trainings
for each row execute function public.set_updated_at();

drop trigger if exists contact_requests_set_updated_at on public.contact_requests;
create trigger contact_requests_set_updated_at before update on public.contact_requests
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles(id,email,full_name,role,active)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name',''),
    'consulta',
    true
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.active = true and p.role in ('admin','capturista')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.active = true and p.role = 'admin'
  );
$$;

grant execute on function public.is_staff() to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.committees enable row level security;
alter table public.documents enable row level security;
alter table public.trainings enable row level security;
alter table public.site_content enable row level security;
alter table public.contact_requests enable row level security;

-- PRIVILEGIOS DE API: RLS sigue siendo la capa que decide qué filas puede usar cada rol.
revoke all on table public.profiles from anon;
revoke all on table public.trainings from anon;
revoke all on table public.contact_requests from anon;
revoke all on table public.committees from anon;
revoke all on table public.documents from anon;
revoke all on table public.site_content from anon;

grant select on table public.committees to anon;
grant select on table public.documents to anon;
grant select on table public.site_content to anon;
grant insert on table public.contact_requests to anon;

grant select, update on table public.profiles to authenticated;
grant select, insert, update, delete on table public.committees to authenticated;
grant select, insert, update, delete on table public.documents to authenticated;
grant select, insert, update, delete on table public.trainings to authenticated;
grant select, insert, update on table public.site_content to authenticated;
grant select, insert, update, delete on table public.contact_requests to authenticated;

-- PROFILES
DROP POLICY IF EXISTS "profiles_self_select" ON public.profiles;
CREATE POLICY "profiles_self_select" ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "profiles_admin_update" ON public.profiles;
CREATE POLICY "profiles_admin_update" ON public.profiles FOR UPDATE TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- COMMITTEES
DROP POLICY IF EXISTS "committees_public_select" ON public.committees;
CREATE POLICY "committees_public_select" ON public.committees FOR SELECT TO anon, authenticated
USING (public = true OR public.is_staff());

DROP POLICY IF EXISTS "committees_staff_insert" ON public.committees;
CREATE POLICY "committees_staff_insert" ON public.committees FOR INSERT TO authenticated
WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "committees_staff_update" ON public.committees;
CREATE POLICY "committees_staff_update" ON public.committees FOR UPDATE TO authenticated
USING (public.is_staff()) WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "committees_admin_delete" ON public.committees;
CREATE POLICY "committees_admin_delete" ON public.committees FOR DELETE TO authenticated
USING (public.is_admin());

-- DOCUMENTS
DROP POLICY IF EXISTS "documents_public_select" ON public.documents;
CREATE POLICY "documents_public_select" ON public.documents FOR SELECT TO anon, authenticated
USING (public = true OR public.is_staff());

DROP POLICY IF EXISTS "documents_staff_insert" ON public.documents;
CREATE POLICY "documents_staff_insert" ON public.documents FOR INSERT TO authenticated
WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "documents_staff_update" ON public.documents;
CREATE POLICY "documents_staff_update" ON public.documents FOR UPDATE TO authenticated
USING (public.is_staff()) WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "documents_admin_delete" ON public.documents;
CREATE POLICY "documents_admin_delete" ON public.documents FOR DELETE TO authenticated
USING (public.is_admin());

-- TRAININGS (internal)
DROP POLICY IF EXISTS "trainings_staff_select" ON public.trainings;
CREATE POLICY "trainings_staff_select" ON public.trainings FOR SELECT TO authenticated
USING (public.is_staff());

DROP POLICY IF EXISTS "trainings_staff_insert" ON public.trainings;
CREATE POLICY "trainings_staff_insert" ON public.trainings FOR INSERT TO authenticated
WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "trainings_staff_update" ON public.trainings;
CREATE POLICY "trainings_staff_update" ON public.trainings FOR UPDATE TO authenticated
USING (public.is_staff()) WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "trainings_admin_delete" ON public.trainings;
CREATE POLICY "trainings_admin_delete" ON public.trainings FOR DELETE TO authenticated
USING (public.is_admin());

-- SITE CONTENT
DROP POLICY IF EXISTS "site_content_public_select" ON public.site_content;
CREATE POLICY "site_content_public_select" ON public.site_content FOR SELECT TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "site_content_admin_insert" ON public.site_content;
CREATE POLICY "site_content_admin_insert" ON public.site_content FOR INSERT TO authenticated
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "site_content_admin_update" ON public.site_content;
CREATE POLICY "site_content_admin_update" ON public.site_content FOR UPDATE TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- CONTACT REQUESTS
DROP POLICY IF EXISTS "contact_public_insert" ON public.contact_requests;
CREATE POLICY "contact_public_insert" ON public.contact_requests FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(name) between 2 and 120
  and char_length(message) between 5 and 3000
);

DROP POLICY IF EXISTS "contact_staff_select" ON public.contact_requests;
CREATE POLICY "contact_staff_select" ON public.contact_requests FOR SELECT TO authenticated
USING (public.is_staff());

DROP POLICY IF EXISTS "contact_staff_update" ON public.contact_requests;
CREATE POLICY "contact_staff_update" ON public.contact_requests FOR UPDATE TO authenticated
USING (public.is_staff()) WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "contact_admin_delete" ON public.contact_requests;
CREATE POLICY "contact_admin_delete" ON public.contact_requests FOR DELETE TO authenticated
USING (public.is_admin());

-- STORAGE
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values (
  'committee-documents',
  'committee-documents',
  false,
  15728640,
  array['application/pdf','image/jpeg','image/png','image/webp','application/vnd.openxmlformats-officedocument.wordprocessingml.document']::text[]
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create or replace function public.can_read_committee_document(object_name text)
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select public.is_staff() or exists (
    select 1 from public.documents d
    where d.storage_path = object_name and d.public = true
  );
$$;

grant execute on function public.can_read_committee_document(text) to anon, authenticated;

DROP POLICY IF EXISTS "committee_documents_public_read" ON storage.objects;
CREATE POLICY "committee_documents_public_read" ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'committee-documents' AND public.can_read_committee_document(name));

DROP POLICY IF EXISTS "committee_documents_staff_insert" ON storage.objects;
CREATE POLICY "committee_documents_staff_insert" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'committee-documents' AND public.is_staff());

DROP POLICY IF EXISTS "committee_documents_staff_update" ON storage.objects;
CREATE POLICY "committee_documents_staff_update" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'committee-documents' AND public.is_staff())
WITH CHECK (bucket_id = 'committee-documents' AND public.is_staff());

DROP POLICY IF EXISTS "committee_documents_admin_delete" ON storage.objects;
CREATE POLICY "committee_documents_admin_delete" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'committee-documents' AND public.is_admin());

-- CONTENIDO EDITABLE INICIAL
insert into public.site_content(key,value) values
('hero', jsonb_build_object(
  'eyebrow','Transparencia, comunidad y participación que generan valor público',
  'title','La ciudadanía vigila, participa y transforma.',
  'subtitle','Conoce los Comités de Contraloría Social de Sonora y los Comités de Bienestar y Participación Ciudadana de las colonias de Hermosillo.'
)),
('participation', jsonb_build_object(
  'title','¿Formas parte de un comité?',
  'subtitle','Solicita orientación, capacitación o apoyo para fortalecer las actividades de tu comité.'
))
on conflict (key) do update set value = excluded.value, updated_at = now();

-- NORMALIZACIÓN DE DENOMINACIÓN VIGENTE
update public.committees
set name = replace(name, 'Comité de Participación Social', 'Comité de Bienestar y Participación Ciudadana')
where type = 'CPS' and name like 'Comité de Participación Social%';

-- DATOS BASE ACTUALES DE LA PLATAFORMA. Se insertan solo si la tabla está vacía; validar contra el padrón oficial.
insert into public.committees(type,name,municipality,colony,program,members,integration_date,lat,lng,status,description,public)
select * from (values
('CCS','Comité de Contraloría Social Hermosillo Centro','Hermosillo','','Programa de Bienestar Social',7,'2026-02-12'::date,29.0729,-110.9559,'Activo','','true'::boolean),
('CCS','Comité de Contraloría Social Navojoa','Navojoa','','Apoyo Alimentario',7,'2026-02-20'::date,27.0706,-109.4437,'Activo','','true'::boolean),
('CCS','Comité de Contraloría Social Bacanora','Bacanora','','Programa de Bienestar Social',7,'2026-03-03'::date,28.978,-109.399,'Activo','','true'::boolean),
('CCS','Comité de Contraloría Social San Pedro de la Cueva','San Pedro de la Cueva','','Apoyo Comunitario',7,'2026-03-18'::date,29.286,-109.737,'Activo','','true'::boolean),
('CCS','Comité de Contraloría Social Guaymas','Guaymas','','Programa de Bienestar Social',7,'2026-04-07'::date,27.9193,-110.8974,'Activo','','true'::boolean),
('CCS','Comité de Contraloría Social Nogales','Nogales','','Apoyo Alimentario',7,'2026-04-13'::date,31.3012,-110.9381,'Activo','','true'::boolean),
('CCS','Comité de Contraloría Social Caborca','Caborca','','Apoyo Comunitario',7,'2026-04-29'::date,30.7167,-112.1647,'Activo','','true'::boolean),
('CCS','Comité de Contraloría Social Agua Prieta','Agua Prieta','','Programa de Bienestar Social',7,'2026-05-08'::date,31.3307,-109.5489,'Activo','','true'::boolean),
('CCS','Comité de Contraloría Social Etchojoa','Etchojoa','','Apoyo Alimentario',7,'2026-05-16'::date,26.9104,-109.626,'Activo','','true'::boolean),
('CCS','Comité de Contraloría Social Álamos','Álamos','','Apoyo Comunitario',7,'2026-05-24'::date,27.0275,-108.9404,'Activo','','true'::boolean),
('CPS','Comité de Bienestar y Participación Ciudadana El Mirador','Hermosillo','El Mirador','',8,'2026-02-15'::date,29.118,-110.993,'Activo','','true'::boolean),
('CPS','Comité de Bienestar y Participación Ciudadana Las Cuevitas','Hermosillo','Las Cuevitas','',9,'2026-02-28'::date,29.064,-111.012,'Activo','','true'::boolean),
('CPS','Comité de Bienestar y Participación Ciudadana Villas del Real','Hermosillo','Villas del Real','',7,'2026-03-14'::date,29.129,-110.947,'Activo','','true'::boolean),
('CPS','Comité de Bienestar y Participación Ciudadana Cañada de los Negros','Hermosillo','Cañada de los Negros','',7,'2026-03-28'::date,29.083,-110.928,'Activo','','true'::boolean),
('CPS','Comité de Bienestar y Participación Ciudadana Internacional','Hermosillo','Internacional','',10,'2026-04-11'::date,29.096,-111.018,'Activo','','true'::boolean),
('CPS','Comité de Bienestar y Participación Ciudadana Solidaridad','Hermosillo','Solidaridad','',8,'2026-04-26'::date,29.132,-111.002,'Activo','','true'::boolean),
('CPS','Comité de Bienestar y Participación Ciudadana Nuevo Hermosillo','Hermosillo','Nuevo Hermosillo','',7,'2026-05-10'::date,29.008,-110.934,'Activo','','true'::boolean),
('CPS','Comité de Bienestar y Participación Ciudadana Los Olivos','Hermosillo','Los Olivos','',8,'2026-05-23'::date,29.024,-110.979,'Activo','','true'::boolean)
) as seed(type,name,municipality,colony,program,members,integration_date,lat,lng,status,description,public)
where not exists (select 1 from public.committees);
