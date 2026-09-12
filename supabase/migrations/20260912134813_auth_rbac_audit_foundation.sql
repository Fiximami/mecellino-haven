-- Applied to the designated Mecellino staging project after independent review.
-- Contains no participant, guardian, consent, upload, or safeguarding case data.

create schema if not exists private;

revoke all on schema private from public;
revoke all on schema private from anon;
revoke all on schema private from authenticated;
grant usage on schema private to service_role;

alter default privileges in schema private revoke all on tables from public;
alter default privileges in schema private revoke all on sequences from public;
alter default privileges in schema private revoke execute on functions from public;

create table private.role_assignments (
  id bigint generated always as identity primary key,
  account_id uuid not null references auth.users (id) on delete restrict,
  role text not null check (
    role in (
      'participant',
      'guardian',
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
  ),
  scope_type text not null check (
    scope_type in ('global', 'programme', 'cohort', 'participant')
  ),
  scope_id uuid,
  valid_from timestamptz not null default now(),
  valid_until timestamptz,
  granted_by uuid not null references auth.users (id) on delete restrict,
  revoked_at timestamptz,
  revoked_by uuid references auth.users (id) on delete restrict,
  revocation_reason_code text,
  created_at timestamptz not null default now(),
  constraint role_assignments_scope_shape check (
    (scope_type = 'global' and scope_id is null)
    or (scope_type <> 'global' and scope_id is not null)
  ),
  constraint role_assignments_validity_window check (
    valid_until is null or valid_until > valid_from
  ),
  constraint role_assignments_revocation_shape check (
    (revoked_at is null and revoked_by is null and revocation_reason_code is null)
    or (revoked_at is not null and revoked_by is not null and revocation_reason_code is not null)
  ),
  constraint role_assignments_revocation_time check (
    revoked_at is null or revoked_at >= valid_from
  )
);

alter table private.role_assignments enable row level security;
alter table private.role_assignments force row level security;

revoke all on table private.role_assignments from public;
revoke all on table private.role_assignments from anon;
revoke all on table private.role_assignments from authenticated;
grant select, insert, update on table private.role_assignments to service_role;
grant usage, select on sequence private.role_assignments_id_seq to service_role;

create unique index role_assignments_one_active_grant_idx
  on private.role_assignments (
    account_id,
    role,
    scope_type,
    coalesce(scope_id, '00000000-0000-0000-0000-000000000000'::uuid)
  )
  where revoked_at is null and valid_until is null;

create index role_assignments_account_id_idx
  on private.role_assignments (account_id);

create index role_assignments_granted_by_idx
  on private.role_assignments (granted_by);

create index role_assignments_revoked_by_idx
  on private.role_assignments (revoked_by)
  where revoked_by is not null;

create function private.enforce_role_assignment_history()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.id is distinct from old.id
    or new.account_id is distinct from old.account_id
    or new.role is distinct from old.role
    or new.scope_type is distinct from old.scope_type
    or new.scope_id is distinct from old.scope_id
    or new.valid_from is distinct from old.valid_from
    or new.granted_by is distinct from old.granted_by
    or new.created_at is distinct from old.created_at then
    raise exception 'role grant identity and provenance are immutable';
  end if;

  if old.revoked_at is not null and (
    new.revoked_at is distinct from old.revoked_at
    or new.revoked_by is distinct from old.revoked_by
    or new.revocation_reason_code is distinct from old.revocation_reason_code
  ) then
    raise exception 'role revocation history is immutable';
  end if;

  return new;
end;
$$;

revoke execute on function private.enforce_role_assignment_history() from public;
revoke execute on function private.enforce_role_assignment_history() from anon;
revoke execute on function private.enforce_role_assignment_history() from authenticated;
revoke execute on function private.enforce_role_assignment_history() from service_role;

create trigger role_assignments_preserve_history
before update on private.role_assignments
for each row execute function private.enforce_role_assignment_history();

create table private.auth_audit_events (
  id bigint generated always as identity primary key,
  occurred_at timestamptz not null default now(),
  event_class text not null check (
    event_class in (
      'sign_in',
      'sign_out',
      'recovery',
      'authorize',
      'invite',
      'role_write',
      'link_attempt',
      'service_role_refused',
      'session_refresh'
    )
  ),
  result text not null check (
    result in ('success', 'failure', 'denied', 'fail_closed')
  ),
  actor_user_id uuid,
  action text not null check (char_length(action) between 1 and 100),
  object_type text check (object_type is null or char_length(object_type) between 1 and 100),
  object_id text check (object_id is null or char_length(object_id) between 1 and 200),
  previous_summary_sha256 text check (
    previous_summary_sha256 is null
    or previous_summary_sha256 ~ '^[0-9a-f]{64}$'
  ),
  new_summary_sha256 text check (
    new_summary_sha256 is null
    or new_summary_sha256 ~ '^[0-9a-f]{64}$'
  ),
  session_id uuid,
  request_id uuid,
  source_ip inet
);

comment on table private.auth_audit_events is
  'Append-only authentication and access-control audit events. Never store credentials, tokens, contact details, names, dates of birth, schools, or safeguarding case content.';

alter table private.auth_audit_events enable row level security;
alter table private.auth_audit_events force row level security;

revoke all on table private.auth_audit_events from public;
revoke all on table private.auth_audit_events from anon;
revoke all on table private.auth_audit_events from authenticated;
grant select, insert on table private.auth_audit_events to service_role;
grant usage, select on sequence private.auth_audit_events_id_seq to service_role;

create index auth_audit_events_occurred_at_idx
  on private.auth_audit_events (occurred_at desc);

create index auth_audit_events_actor_user_id_idx
  on private.auth_audit_events (actor_user_id, occurred_at desc)
  where actor_user_id is not null;

create index auth_audit_events_object_idx
  on private.auth_audit_events (object_type, object_id, occurred_at desc)
  where object_type is not null and object_id is not null;

create function private.reject_auth_audit_mutation()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  raise exception 'auth audit events are append-only';
end;
$$;

revoke execute on function private.reject_auth_audit_mutation() from public;
revoke execute on function private.reject_auth_audit_mutation() from anon;
revoke execute on function private.reject_auth_audit_mutation() from authenticated;
revoke execute on function private.reject_auth_audit_mutation() from service_role;

create trigger auth_audit_events_reject_mutation
before update or delete on private.auth_audit_events
for each row execute function private.reject_auth_audit_mutation();
