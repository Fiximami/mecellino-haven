-- Permit parent as a distinct protected role alongside legal_guardian.
-- Leaves RLS and FORCE RLS unchanged. Adds no tables, policies or privileges.

begin;

do $$
declare
  table_oid oid;
  constraint_oid oid;
  current_def text;
  rls_enabled boolean;
  force_rls boolean;
  expected_role text;
  expected_roles text[] := array[
    'participant',
    'legal_guardian',
    'approved_responsible_adult',
    'referrer',
    'mentor',
    'facilitator',
    'programme_operations',
    'safeguarding_lead',
    'restricted_caseworker',
    'system_administrator',
    'auditor'
  ];
begin
  select c.oid, c.relrowsecurity, c.relforcerowsecurity
    into table_oid, rls_enabled, force_rls
  from pg_catalog.pg_class c
  join pg_catalog.pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'private'
    and c.relname = 'role_assignments'
    and c.relkind = 'r';

  if table_oid is null then
    raise exception 'private.role_assignments is absent';
  end if;

  if rls_enabled is not true or force_rls is not true then
    raise exception 'private.role_assignments must keep RLS and FORCE RLS';
  end if;

  select con.oid, pg_get_constraintdef(con.oid)
    into constraint_oid, current_def
  from pg_catalog.pg_constraint con
  where con.conrelid = table_oid
    and con.conname = 'role_assignments_role_check'
    and con.contype = 'c';

  if constraint_oid is null then
    raise exception 'role_assignments_role_check is absent';
  end if;

  foreach expected_role in array expected_roles loop
    if position(quote_literal(expected_role) in current_def) = 0 then
      raise exception
        'role_assignments_role_check is missing expected role %',
        expected_role;
    end if;
  end loop;

  if position(quote_literal('parent') in current_def) > 0 then
    raise exception 'role_assignments_role_check already permits parent';
  end if;

  alter table private.role_assignments
    drop constraint role_assignments_role_check;

  alter table private.role_assignments
    add constraint role_assignments_role_check check (
      role in (
        'participant',
        'parent',
        'legal_guardian',
        'approved_responsible_adult',
        'referrer',
        'mentor',
        'facilitator',
        'programme_operations',
        'safeguarding_lead',
        'restricted_caseworker',
        'system_administrator',
        'auditor'
      )
    );
end
$$;

commit;
