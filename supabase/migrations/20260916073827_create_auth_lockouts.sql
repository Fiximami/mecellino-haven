-- Distributed authentication lockout store. Local foundation only; not applied here.
-- Contains no personal, contact or network identifiers.

do $$
begin
  if to_regnamespace('private') is null then
    raise exception 'private schema is absent';
  end if;
end
$$;

create table private.auth_lockouts (
  identifier_hmac char(64) primary key
    check (identifier_hmac ~ '^[0-9a-f]{64}$'),
  pepper_version smallint not null check (pepper_version >= 1),
  failure_count integer not null check (failure_count >= 0),
  window_started_at timestamptz not null,
  locked_until timestamptz,
  last_event_at timestamptz not null,
  created_at timestamptz not null default now()
);

comment on table private.auth_lockouts is
  'Operational lockout state keyed only by HMAC. Never store credentials, contact details, network addresses or secrets.';

alter table private.auth_lockouts enable row level security;
alter table private.auth_lockouts force row level security;

revoke all on table private.auth_lockouts from public;
revoke all on table private.auth_lockouts from anon;
revoke all on table private.auth_lockouts from authenticated;
grant select, insert, update, delete on table private.auth_lockouts to service_role;

create index auth_lockouts_locked_until_idx
  on private.auth_lockouts (locked_until)
  where locked_until is not null;

create function private.auth_lockout_is_locked(
  p_hmac text,
  p_hmac_previous text
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if p_hmac is null or p_hmac !~ '^[0-9a-f]{64}$' then
    raise exception 'invalid lockout identifier';
  end if;
  if p_hmac_previous is not null and p_hmac_previous !~ '^[0-9a-f]{64}$' then
    raise exception 'invalid lockout identifier';
  end if;

  return exists (
    select 1
    from private.auth_lockouts as lockout_row
    where lockout_row.identifier_hmac in (p_hmac, p_hmac_previous)
      and lockout_row.locked_until is not null
      and lockout_row.locked_until > pg_catalog.now()
  );
end;
$$;

create function private.auth_lockout_record_failure(
  p_hmac text,
  p_pepper_version smallint
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_now timestamptz := pg_catalog.now();
  v_locked boolean;
begin
  if p_hmac is null or p_hmac !~ '^[0-9a-f]{64}$' then
    raise exception 'invalid lockout identifier';
  end if;
  if p_pepper_version is null or p_pepper_version < 1 then
    raise exception 'invalid lockout pepper version';
  end if;

  insert into private.auth_lockouts as lockout_row (
    identifier_hmac,
    pepper_version,
    failure_count,
    window_started_at,
    locked_until,
    last_event_at,
    created_at
  )
  values (
    p_hmac,
    p_pepper_version,
    1,
    v_now,
    null,
    v_now,
    v_now
  )
  on conflict (identifier_hmac) do update
  set
    pepper_version = excluded.pepper_version,
    last_event_at = excluded.last_event_at,
    failure_count = case
      when lockout_row.locked_until is not null
        and lockout_row.locked_until > excluded.last_event_at
        then lockout_row.failure_count
      when (
        lockout_row.locked_until is not null
        and lockout_row.locked_until <= excluded.last_event_at
      ) or excluded.last_event_at >= lockout_row.window_started_at + interval '15 minutes'
        then 1
      else lockout_row.failure_count + 1
    end,
    window_started_at = case
      when lockout_row.locked_until is not null
        and lockout_row.locked_until > excluded.last_event_at
        then lockout_row.window_started_at
      when (
        lockout_row.locked_until is not null
        and lockout_row.locked_until <= excluded.last_event_at
      ) or excluded.last_event_at >= lockout_row.window_started_at + interval '15 minutes'
        then excluded.last_event_at
      else lockout_row.window_started_at
    end,
    locked_until = case
      when lockout_row.locked_until is not null
        and lockout_row.locked_until > excluded.last_event_at
        then lockout_row.locked_until
      when (
        lockout_row.locked_until is not null
        and lockout_row.locked_until <= excluded.last_event_at
      ) or excluded.last_event_at >= lockout_row.window_started_at + interval '15 minutes'
        then null
      when lockout_row.failure_count + 1 >= 5
        then excluded.last_event_at + interval '15 minutes'
      else null
    end
  returning (
    locked_until is not null
    and locked_until > pg_catalog.now()
  ) into v_locked;

  return coalesce(v_locked, false);
end;
$$;

create function private.auth_lockout_clear(
  p_hmac text,
  p_hmac_previous text
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if p_hmac is null or p_hmac !~ '^[0-9a-f]{64}$' then
    raise exception 'invalid lockout identifier';
  end if;
  if p_hmac_previous is not null and p_hmac_previous !~ '^[0-9a-f]{64}$' then
    raise exception 'invalid lockout identifier';
  end if;

  delete from private.auth_lockouts as lockout_row
  where lockout_row.identifier_hmac in (p_hmac, p_hmac_previous);
end;
$$;

create function private.auth_lockout_unlock_and_audit(
  p_hmac text,
  p_hmac_previous text
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_removed integer;
begin
  if p_hmac is null or p_hmac !~ '^[0-9a-f]{64}$' then
    raise exception 'invalid lockout identifier';
  end if;
  if p_hmac_previous is not null and p_hmac_previous !~ '^[0-9a-f]{64}$' then
    raise exception 'invalid lockout identifier';
  end if;

  delete from private.auth_lockouts as lockout_row
  where lockout_row.identifier_hmac in (p_hmac, p_hmac_previous);
  get diagnostics v_removed = row_count;

  if v_removed < 1 then
    return false;
  end if;

  insert into private.auth_audit_events (event_class, result, action)
  values ('lockout', 'success', 'unlock_auth_lockout');

  return true;
end;
$$;

revoke all on function private.auth_lockout_is_locked(text, text) from public;
revoke all on function private.auth_lockout_is_locked(text, text) from anon;
revoke all on function private.auth_lockout_is_locked(text, text) from authenticated;
grant execute on function private.auth_lockout_is_locked(text, text) to service_role;

revoke all on function private.auth_lockout_record_failure(text, smallint) from public;
revoke all on function private.auth_lockout_record_failure(text, smallint) from anon;
revoke all on function private.auth_lockout_record_failure(text, smallint) from authenticated;
grant execute on function private.auth_lockout_record_failure(text, smallint) to service_role;

revoke all on function private.auth_lockout_clear(text, text) from public;
revoke all on function private.auth_lockout_clear(text, text) from anon;
revoke all on function private.auth_lockout_clear(text, text) from authenticated;
grant execute on function private.auth_lockout_clear(text, text) to service_role;

revoke all on function private.auth_lockout_unlock_and_audit(text, text) from public;
revoke all on function private.auth_lockout_unlock_and_audit(text, text) from anon;
revoke all on function private.auth_lockout_unlock_and_audit(text, text) from authenticated;
grant execute on function private.auth_lockout_unlock_and_audit(text, text) to service_role;

do $$
declare
  constraint_oid oid;
begin
  if to_regclass('private.auth_audit_events') is null then
    raise exception 'private.auth_audit_events is absent';
  end if;

  select con.oid
    into constraint_oid
  from pg_catalog.pg_constraint as con
  where con.conrelid = 'private.auth_audit_events'::regclass
    and con.conname = 'auth_audit_events_event_class_check'
    and con.contype = 'c';

  if constraint_oid is null then
    raise exception 'auth_audit_events_event_class_check is absent';
  end if;

  alter table private.auth_audit_events
    drop constraint auth_audit_events_event_class_check;

  alter table private.auth_audit_events
    add constraint auth_audit_events_event_class_check check (
      event_class in (
        'sign_in',
        'sign_out',
        'recovery',
        'authorize',
        'invite',
        'role_write',
        'link_attempt',
        'service_role_refused',
        'session_refresh',
        'lockout'
      )
    );
end
$$;
