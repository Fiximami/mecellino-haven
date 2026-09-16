# Distributed authentication lockout

**Architecture decision — documentation only.**\
**Branch context:** `feat/ydg-authenticated-mvp`.\
**Status:** Proposed. Pending independently reviewed implementation. Does **not** enable hosted authentication.\
**Does not:** implement code, create or apply migrations, connect to Supabase, inspect personal records, collect personal data, or change dependencies.

Cross-reference: `HOSTED_AUTHENTICATION_CONTROLS_DECISION.md` (D5, D7, D8), `AUTHENTICATION_AND_AUTHORIZATION_SPECIFICATION.md`, `MVP_SECURITY_PRIVACY_AND_SAFEGUARDING_BOUNDARIES.md`.

The only permitted future remote target is Mecellino Haven Production in the MualenTech organisation. An unrelated project named Truth Smart Tips must **never** be accessed, inspected or modified. Project references, URLs, peppers and credentials are not recorded here.

---

## Problem

`LOCKOUT_SCOPE = local_single_process` is an in-memory map. It is lost on restart, is not shared across application instances, and hashes identifiers with unsalted SHA-256. It is not a production control.

This decision specifies a production-safe replacement. Implementation, SQL and environment changes wait for a later reviewed pass.

---

## Decision

Replace the process-local map with an application-owned table in `private`, addressed only by a server-generated keyed HMAC. Supabase Auth provider rate limiting remains an independent control. Both are required (defence in depth). Provider throttling is **not** a substitute for the application store.

Hosted authentication stays **disabled** until this store is implemented, applied to the identified production project, verified with read-only metadata, and the other D5 gates close.

Session idle and absolute limits (D7) and durable-audit fail-closed rules are unchanged.

---

## Identifier policy

Lockout rows are keyed only by `identifier_hmac`. Never persist raw email addresses, phone numbers, passwords, tokens, user agents or IP addresses as lockout identifiers or row contents.

### Normalization (before HMAC)

Apply only to the authentication identifier (today: sign-in and recovery email), never to passwords or tokens.

1. Reject non-strings and empty values after trim. Empty submissions already return the neutral sign-in or recovery message and must not create a row.
2. Unicode NFKC.
3. Trim ASCII whitespace.
4. Locale-independent casefold of the entire value.
5. Reject values longer than 320 characters.
6. Bind a purpose prefix in the HMAC message, for example `v1|email|`, so a later phone identifier cannot collide with an email HMAC.

Do not canonicalize via DNS or MX lookups. Do not store the normalized plaintext.

### Keyed HMAC

- Algorithm: HMAC-SHA256.
- Key: a dedicated lockout pepper, at least 32 cryptographically random bytes, server-only, never `NEXT_PUBLIC_`, never the database password or JWT secret.
- Output stored as 64 lowercase hex characters.
- Message: purpose prefix + normalized identifier.
- Compute the HMAC in the application process. The pepper must not be sent to SQL.

Unsalted SHA-256 of the email (the current helper) is not acceptable in production.

### Collision resistance

HMAC-SHA256 with a 256-bit pepper is collision-resistant for this use. If two identifiers ever share a digest, they share a counter. That fail-closed (stricter lock) is acceptable; fail-open is not. The primary key is the HMAC, so the database cannot hold two rows for one digest.

### Pepper rotation

- Persist `pepper_version` on each row, not the pepper.
- Environment holds current pepper and version, and optionally one previous pepper.
- Reads: compute current HMAC, and during the rotation window also the previous HMAC; a lock on either digest counts as locked.
- Writes: current version only.
- After the rotation window, remove the previous pepper from the environment. Do not rewrite historical rows. Expired rows are pruned (below).
- Missing current pepper, or inability to compute the HMAC, is treated as store unavailability.

---

## Recommended thresholds

These values are the recommended production policy. They keep the current local failure count and observation window, and add an explicit lock duration (the in-memory map currently expires from first failure rather than from threshold).

| Parameter | Recommended value |
|-----------|-------------------|
| Failure threshold | 5 failed authentications |
| Observation window | 15 minutes from `window_started_at` |
| Lock duration | 15 minutes from the instant the threshold is reached (`locked_until`) |
| Success reset | Clear the row (or set count to 0 and `locked_until` to null) after a successful authentication |
| Expiry reset | After `locked_until` passes, the next failure starts a new window at count 1 |
| Attempts while locked | Return locked; do not increment; do not extend `locked_until` |
| Privileged unlock | Later audited staff action; not self-service; same HMAC derivation on the server; no public confirmation that a lock existed |

The same thresholds apply to every identifier. Role is unknown before authentication, so privileged sessions cannot receive a different public lockout policy without enabling enumeration.

Recovery uses the same HMAC purpose as sign-in so recovery cannot be used as a parallel guessing oracle.

Owner confirmation of these numbers is listed below. They must not be guessed differently in code before that confirmation.

---

## Public responses (anti-enumeration)

Public sign-in and recovery must keep using the existing neutral messages (`NEUTRAL_AUTH_ERROR`, `NEUTRAL_RECOVERY_MESSAGE`). Locked, unknown account, wrong password, missing fields, expired lock, and store unavailability must not be distinguishable in:

- response body or message;
- HTTP status for these flows;
- headers such as `Retry-After` that appear only when locked.

Internal audit may record `denied` versus `failure` versus `fail_closed`. That distinction must not be copied to the client.

---

## Data model (pending migration)

Proposed table `private.auth_lockouts`:

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

Indexes: primary key on `identifier_hmac`; optional index on `locked_until` for prune. No unique index on any personal identifier.

### Privileges and RLS

Match the existing private-schema pattern:

- `ENABLE ROW LEVEL SECURITY` and `FORCE ROW LEVEL SECURITY`.
- No `CREATE POLICY` for `anon` or `authenticated`.
- `REVOKE ALL` from `public`, `anon` and `authenticated`.
- Grant only to the same server-side database role already used for durable audit inserts. Do not grant to `anon` or `authenticated`.
- Do not use `SECURITY DEFINER`. Callable helpers, if any, are `SECURITY INVOKER` with `search_path` emptied, `EXECUTE` revoked from `anon`/`authenticated`/`public`.

Realtime must not be enabled on this table.

### Retention

This table is operational state, not the audit trail. Rows may be deleted once `locked_until` is null or past **and** the observation window has expired, after a short grace period (recommended: 24 hours after `last_event_at`). Durable history lives only in `private.auth_audit_events` without lockout identifiers.

---

## Transaction approach

The application uses the transaction pooler with prepared statements disabled. Session-level advisory locks and multi-round-trip `SELECT` then `UPDATE` are not safe.

All check-and-mutate behaviour must be **one atomic statement** per request, typically a `SECURITY INVOKER` SQL function:

1. **Is locked:** single `SELECT` of `locked_until > now()` for the current (and, during rotation, previous) HMAC. Return only a boolean to the application, never the failure count.
2. **Record failure:** one function that `INSERT`s the row or `UPDATE`s it under the primary key:
   - if currently locked, no increment and no extension;
   - if the observation window has expired, reset count to 1 and start a new window;
   - otherwise increment `failure_count`;
   - if the count reaches the threshold, set `locked_until = now() + lock duration`.
3. **Clear on success:** one `DELETE` or reset `UPDATE` by HMAC.

`INSERT … ON CONFLICT (identifier_hmac) DO UPDATE` (or `SELECT … FOR UPDATE` inside the function) makes concurrent instances safe. Two instances racing at count 4 both increment; reaching 5 locks. That is the intended fail-closed outcome.

Do not fall back to the in-memory map for hosted or privileged authentication.

---

## Unavailable store

Treat as unavailable: missing database configuration, connection or statement error, missing current pepper, HMAC failure, or unexpected function result.

- **Privileged and all hosted authentication, including recovery:** fail closed. Do not authenticate, do not issue a session, and do not skip the lockout check.
- **Public message:** the same neutral sign-in or recovery text as any other failure.
- **Audit:** `fail_closed` without identifiers or error payloads.
- Local synthetic flows may keep `LOCKOUT_SCOPE = local_single_process` only while hosted authentication remains disabled.

Durable audit requirements are unchanged: a successful hosted sign-in still requires the durable sink; audit failure still revokes the new session.

---

## Audit events

Do not store attempted credentials, normalized identifiers, HMAC digests, peppers, IPs or tokens in audit rows.

| Event | Recommended recording |
|-------|------------------------|
| Failure below threshold | Existing `sign_in` / `failure` |
| Locked (at or after threshold) | Existing `sign_in` / `denied` (already used by the local map) |
| Store or pepper unavailable | `sign_in` or `recovery` / `fail_closed` |
| Privileged unlock | New `lockout` event class with action `unlock`, `actor_user_id` of the staff session, **no** object identifier |

Adding `lockout` to `private.auth_audit_events.event_class` is part of the later reviewed migration if unlock is implemented. Until then, do not widen the audit table with identifier-bearing columns. Do not begin writing `source_ip` on audit rows.

---

## Defence in depth

| Control | Role |
|---------|------|
| Application `private.auth_lockouts` | Required distributed identifier lockout across instances |
| Supabase Auth provider rate limiting | Independent provider-side throttle; keep enabled; do not disable because the application store exists |
| Neutral public messages | Anti-enumeration |
| Durable audit sink | Separate from lockout state |
| D7 session lifetimes | Unrelated idle/absolute session bounds; do not reuse lockout rows as session store |

Provider limits may use provider-owned identifiers. This project must not copy those values into `private.auth_lockouts`.

---

## What this pass does not do

- Does not change `lib/auth/lockout.ts` or `LOCKOUT_SCOPE`.
- Does not create or apply a migration.
- Does not add environment names or pepper values.
- Does not enable hosted authentication, `/admin`, `link_adult_relationship`, Realtime, or enquiry intake.
- Does not connect to Supabase or inspect personal records.

---

## Unresolved owner decisions

| Item | Notes |
|------|--------|
| Confirm 5 failures / 15-minute window / 15-minute lock | Recommended above; do not encode different numbers until confirmed |
| Email casefold algorithm | Locale-independent Unicode casefold versus runtime `toLowerCase` (Turkish dotted-i risk) |
| Unlock staff role | Which protected role may clear a lock, and whether unlock exists before other privileged writes |
| Pooled-role RLS | Whether the durable-audit pooled role bypasses FORCE RLS (as `service_role` does) or needs a later owner-reviewed policy **only for that server role** |
| Pepper custody and rotation interval | Operational handling; not recorded in this repository |
