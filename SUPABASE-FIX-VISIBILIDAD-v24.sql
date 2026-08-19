-- COMITES v24
-- Corrige el error:
-- column "updated_by" of relation "documents" does not exist
-- No borra datos ni archivos.

create or replace function public.set_document_visibility(
  p_document_id uuid,
  p_public boolean
)
returns table (
  id uuid,
  public boolean
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_staff() then
    raise exception 'No autorizado';
  end if;

  return query
  update public.documents d
     set public = p_public
   where d.id = p_document_id
  returning d.id, d.public;
end;
$$;

revoke all on function public.set_document_visibility(uuid, boolean) from public;
grant execute on function public.set_document_visibility(uuid, boolean) to authenticated;


create or replace function public.set_committee_evidence_visibility(
  p_committee_id uuid,
  p_public boolean
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  affected integer := 0;
begin
  if not public.is_staff() then
    raise exception 'No autorizado';
  end if;

  update public.documents d
     set public = p_public
   where d.committee_id = p_committee_id
     and d.category not in ('Acta constitutiva', 'Lista de asistencia')
     and d.public is distinct from p_public;

  get diagnostics affected = row_count;
  return affected;
end;
$$;

revoke all on function public.set_committee_evidence_visibility(uuid, boolean) from public;
grant execute on function public.set_committee_evidence_visibility(uuid, boolean) to authenticated;
