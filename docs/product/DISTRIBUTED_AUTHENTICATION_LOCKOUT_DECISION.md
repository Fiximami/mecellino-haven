# Distributed authentication lockout

**Architecture decision.**\
**Branch context:** `feat/ydg-authenticated-mvp`.\
**Status:** Owner-approved policy. Local foundation implemented. **Not** applied to production. Does **not** enable hosted authentication.\
**Does not:** apply migrations, connect to Supabase, inspect personal records, collect personal data, wire live sign-in, or change hosted-auth enablement.

Cross-reference: `HOSTED_AUTHENTICATION_CONTROLS_DECISION.md` (D5, D7, D8), `AUTHENTICATION_AND_AUTHORIZATION_SPECIFICATION.md`, `MVP_SECURITY_PRIVACY_AND_SAFEGUARDING_BOUNDARIES.md`.

The only permitted future remote target is Mecellino Haven Production in the MualenTech organisation. An unrelated project named Truth Smart Tips must **never** be accessed, inspected or modified. Project references, URLs, peppers and credentials are not recorded here.

---

## Problem

`LOCKOUT_SCOPE = local_single_process` is an in-memory map. It is lost on restart, is not shared across application instances, and hashes identifiers with unsalted SHA-256. It is not a production control. It remains available only for synthetic and local flows and must never be a hosted fallback.

---

## Decision

Replace the process-local map, for hosted use, with an application-owned table in `private`, addressed only by a server-generated keyed HMAC. Supabase Auth provider rate limiting remains an independent control. Both are required (defence in depth). Provider throttling is **not** a substitute for the application store.

Hosted authentication stays **disabled** until this store is applied to the identified production project, verified with read-only metadata, and the other D5 gates close.

Session idle and absolute limits (D7) and durable-audit fail-closed rules are unchanged.

---

## Owner-approved policy

| Parameter | Approved value |
|-----------|----------------|
| Failure threshold | 5 failed authentications |
| Observation window | 15 minutes from `window_started_at` |
| Lock duration | 15 minutes from the instant the threshold is reached (`locked_until`) |
| Normalization | Unicode NFKC, trim, locale-independent lowercase (`String#toLowerCase`), maximum 320 characters |
| Identifier | HMAC-SHA256 of `v1|{purpose}|{normalized}` with a dedicated server-only pepper |
| Pepper rotation | Every 90 days; current version plus at most one previous version during transition |
| Manual unlock | `system_administrator` only; always audited; no identifier or HMAC in the audit event |
| Database access | Existing server-side privileged role only; no `anon` or `authenticated` access |

Success reset: clear the row after a successful authentication.

Expiry reset: after `locked_until` passes, the next failure starts a new window at count 1.

Attempts while locked: return locked; do not increment; do not extend `locked_until`.

The same thresholds apply to every identifier. Role is unknown before authentication.

Recovery uses the same HMAC purpose as sign-in so recovery cannot be used as a parallel guessing oracle.

---

## Identifier policy

Lockout rows are keyed only by `identifier_hmac`. Never persist raw email addresses, phone numbers, passwords, tokens, user agents or IP addresses as lockout identifiers or row contents.

### Normalization (before HMAC)

Apply only to the authentication identifier (today: sign-in and recovery email), never to passwords or tokens.

1. Reject non-strings and empty values after trim. Empty submissions must not create a row.
2. Unicode NFKC.
3. Trim.
4. Locale-independent lowercase of the entire value.
5. Reject values longer than 320 characters.
6. Bind a purpose prefix in the HMAC message, `v1|email|`, so a later phone identifier cannot collide with an email HMAC.

Do not canonicalize via DNS or MX lookups. Do not store the normalized plaintext.

### Keyed HMAC

- Algorithm: HMAC-SHA256.
- Key: a dedicated lockout pepper, at least 32 cryptographically random bytes, passed only as explicit server-side input, never `NEXT_PUBLIC_`, never the database password or JWT secret, never embedded in source.
- Output stored as 64 lowercase hex characters.
- Compute the HMAC in the application process. The pepper must not be sent to SQL.

Unsalted SHA-256 of the email (the local helper) is not acceptable in production.

### Collision resistance

HMAC-SHA256 with a 256-bit pepper is collision-resistant for this use. If two identifiers ever share a digest, they share a counter. That fail-closed (stricter lock) is acceptable; fail-open is not.

### Pepper rotation

- Persist `pepper_version` on each row, not the pepper.
- Callers supply current pepper and version, and optionally one previous pepper.
- Reads: compute current HMAC, and during the rotation window also the previous HMAC; a lock on either digest counts as locked.
- Writes: current version only.
- After rotation, omit the previous pepper. Do not retain it indefinitely. Do not rewrite historical rows.
- Missing current pepper, or inability to compute the HMAC, is treated as store unavailability.

---

## Public responses (anti-enumeration)

Public sign-in and recovery must keep using the existing neutral messages (`NEUTRAL_AUTH_ERROR`, `NEUTRAL_RECOVERY_MESSAGE`). Locked, unknown account, wrong password, missing fields, expired lock, and store unavailability must not be distinguishable in:

- response body or message;
- HTTP status for these flows;
- headers such as `Retry-After` that appear only when locked.

Internal audit may record `denied` versus `failure` versus `fail_closed`. That distinction must not be copied to the client.

---

## Data model

Table `private.auth_lockouts`:

| Column | Intent |
|--------|--------|
| `identifier_hmac` | `char(64)` primary key, `^[0-9a-f]{64}$` |
| `pepper_version` | Small integer; not a secret |
| `failure_count` | Integer `>= 0` |
| `window_started_at` | Start of the current observation window |
| `locked_until` | Null unless locked; absolute expiry of the lock |
| `last_event_at` | Server time of last mutating lockout event |
| `created_at` | Row creation time |

Forbidden columns: email, phone, password, token, IP, user agent, account id, person id.

### Privileges and RLS

- `ENABLE ROW LEVEL SECURITY` and `FORCE ROW LEVEL SECURITY`.
- No `CREATE POLICY` for `anon` or `authenticated`.
- `REVOKE ALL` from `public`, `anon` and `authenticated`.
- Grant only to `service_role`, the existing server-side privileged role used for durable audit.
- Callable helpers are `SECURITY INVOKER` with `search_path` emptied. `EXECUTE` is revoked from `public`, `anon` and `authenticated`.

Realtime must not be enabled on this table.

### Retention

This table is operational state, not the audit trail. Rows may be deleted once `locked_until` is null or past **and** the observation window has expired, after a short grace period (24 hours after `last_event_at`). Durable history lives only in `private.auth_audit_events` without lockout identifiers.

---

## Clock authority

Production lockout state transitions use the database clock (`pg_catalog.now()`). PostgreSQL helpers do not accept an application timestamp. The application cannot move observation windows or lock expiry forward or backward by supplying `now`.

The in-memory reference model may inject a deterministic clock for synthetic tests only. That clock is not a production control and must not be sent to SQL.

---

## Transaction approach

The application uses the transaction pooler with prepared statements disabled. All check-and-mutate behaviour is one atomic statement per request:

1. `private.auth_lockout_is_locked` — boolean only, current and optional previous HMAC.
2. `private.auth_lockout_record_failure` — `INSERT … ON CONFLICT` implementing the approved increment, lock, window and expiry rules. Timing is `pg_catalog.now()`.
3. `private.auth_lockout_clear` — delete by current and optional previous HMAC after a successful authentication.
4. `private.auth_lockout_unlock_and_audit` — privileged unlock: delete matching rows and, only if at least one row was removed, insert `lockout` / `success` with action `unlock_auth_lockout` in the same invoker function. Returns whether a row was unlocked. A missing lock is a no-op: `false`, and no success audit. Either the removal and success audit both persist, or neither does.

Do not fall back to the in-memory map for hosted or privileged authentication.

---

## Unavailable store

Treat as unavailable: missing database configuration, connection or statement error, missing current pepper, HMAC failure, or unexpected function result.

- **Privileged and all hosted authentication, including recovery:** fail closed.
- **Public message:** the same neutral sign-in or recovery text as any other failure.
- **Audit:** `fail_closed` without identifiers or error payloads.
- Local synthetic flows may keep `LOCKOUT_SCOPE = local_single_process` only while hosted authentication remains disabled.

---

## Audit events

Do not store attempted credentials, normalized identifiers, HMAC digests, peppers, IPs, user agents or tokens in audit rows.

| Event | Recording |
|-------|-----------|
| Failure below threshold | `sign_in` / `failure` |
| Locked | `sign_in` / `denied` |
| Store or pepper unavailable | `sign_in` or `recovery` / `fail_closed` |
| Privileged unlock of an existing lock | `lockout` / `success` with action `unlock_auth_lockout` and no object identifier, recorded only in the same transaction that removes the row |
| Privileged unlock of a missing lock | No success audit; explicit non-success / no-op |

Do not write `source_ip` on audit rows.

A privileged unlock must not record `success` unless at least one lockout row was removed. If the removal cannot complete, no success row is written. If the success row cannot be written, the lock remains. A missing lock is not labelled successful. Failed or denied unlock attempts may be recorded accurately as `denied`, `failure` or `fail_closed`; they must never be labelled `success`.

---

## Defence in depth

| Control | Role |
|---------|------|
| Application `private.auth_lockouts` | Required distributed identifier lockout across instances |
| Supabase Auth provider rate limiting | Independent provider-side throttle |
| Neutral public messages | Anti-enumeration |
| Durable audit sink | Separate from lockout state |
| D7 session lifetimes | Unrelated idle/absolute session bounds |

---

## What this pass does not do

- Does not apply the migration or connect to Supabase.
- Does not wire distributed lockout into live sign-in or recovery.
- Does not enable hosted authentication, `/admin`, invitations, protected-claim writes, `link_adult_relationship`, Realtime, or personal-data intake.
- Does not add pepper values to environment files.
- Does not inspect personal records.

---

## Unresolved owner decisions

| Item | Notes |
|------|--------|
| Remote apply and metadata verification | Required before D5.3 is treated as closed |
| Pooled-role RLS | Whether the durable-audit pooled role bypasses FORCE RLS (as `service_role` does) |
| Pepper custody | Operational handling; not recorded in this repository |
