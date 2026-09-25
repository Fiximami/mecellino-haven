# Authentication and authorization specification

**Milestone 4B0 — specification for a future 4B implementation pass.** This document does not implement Auth. It binds the provider decision in `AUTH_PROVIDER_DECISION.md` to programme rules in the 4A set.

4B itself, when implemented, is **authentication foundation only**: server-validated sessions, protected role claims, synthetic test identities. No participant onboarding, no live enquiry persistence, no minor PII, no `/admin` UI.

---

## Actors and accounts (4B vs later)

| Actor | Account in 4B | Later (after Gate M / 4C–4G) |
|-------|---------------|------------------------------|
| Synthetic staff / operations test identity | Allowed | Becomes real staff by invitation |
| System administrator (synthetic) | Allowed for tests | Required |
| Participant 13–17 | **None** | Optional; guardian usually holds the adult account |
| Participant 18–25 | **None** | Expected |
| Parent, guardian, ARA, referrer, mentor, facilitator | **None** | Invitation after relationship or screening exists |
| Safeguarding Lead / caseworker | **None** in 4B | Separate grants; no default admin inheritance |

A Person may later hold more than one role. Concurrent conflicting roles require explicit policy, not inheritance (`MVP_DOMAIN_AND_EVENT_MODEL.md`).

---

## Authentication lifecycle

All session work is **server-validated**. Cookies: httpOnly, Secure once HTTPS is confirmed, SameSite as approved. No PII in `localStorage`. HSTS/CSP remain deployment gates (`PHASE1_LIMITATIONS.md`).

| Stage | Rule |
|-------|------|
| **Invitation** | Only a system administrator (or a later delegated inviter) creates an account. Self-registration is off. Invitation is a single-use, time-bounded token sent to a **pre-verified** address. Invitation does not grant extra roles beyond those written by the server. |
| **Sign-in** | Email/password or magic link, completed on the server. Success writes a cookie session. Failure does not disclose whether the identifier exists (see threat model). |
| **Session refresh** | Server refreshes the cookie session; the browser does not hold a long-lived refresh token in script-accessible storage. Idle and absolute timeouts are required (values are an owner decision). |
| **Sign-out** | Server revokes the session and clears cookies. |
| **Recovery** | Password or link reset is rate-limited, single-use, short-lived, and does not confirm account existence in the response body. Recovery never changes roles. |
| **Lockout** | Repeated failures lock the account or throttle the identifier and source. Unlock is a privileged, audited action. |
| **Deactivation** | Soft-disable: session revoke, invitation blocked, roles remain in history. Deactivation is audited. Hard delete follows a later retention decision, not 4B. |

Minors are not invited in 4B. Later, a 13–17 participant account (if any) is created only after Gate M and a verified adult relationship.

---

## Authorization lifecycle

Authorization is **not** “logged in ⇒ allowed.” Every mutation evaluates session + protected claim + scope + resource state + context isolation + audit (`MVP_SECURITY_PRIVACY_AND_SAFEGUARDING_BOUNDARIES.md`).

| Stage | Rule |
|-------|------|
| **Role request** | A user may *ask* for a role (later volunteer/referrer flows). A request is not a grant. Self-service elevation is forbidden. |
| **Protected assignment** | Only the server writes `app_metadata` and/or `RoleAssignment`. Writers: system administrator for staff roles; later, programme operations for delivery assignments; Safeguarding Lead for caseworker assignment. |
| **Scope assignment** | Roles are useless without scope: linked Person, cohort, delivery assignment or case id. Scope is a server record, not a URL parameter the client invents. |
| **Revocation** | Immediate session-sensitive: revoked roles must fail the next authorized request. Audit old/new grant. |
| **Emergency access** | Break-glass is **not implemented in 4B**. The 4B foundation must still *deny* case access to administrators by default and leave an audit hook for a later 4I dual-control grant. |
| **Audit** | Append-only events for invite, sign-in success/failure class, lockout, deactivation, role grant/revoke, scope change, service-role use, and any future break-glass. |

Multiple roles per identity are represented as multiple `RoleAssignment` rows (or an `app_metadata` list maintained only by the server), each with its own scope and validity window.

---

## Account-linking safeguards

Knowing an email, phone number or participant identifier **must not** create a relationship.

| Link | How it is established | Forbidden shortcut |
|------|----------------------|--------------------|
| Participant ↔ guardian / parent | Staff or later verified invitation after relationship evidence; both sides confirm out of band | “I know the child’s email/phone/id” |
| Participant ↔ approved responsible adult | Safeguarding Lead exception process (later 4C/4I); not self-asserted | Same as above |
| Participant ↔ referrer | Referral record created by a scoped referrer or operations; does not open the participant profile | School staff guessing a name or id |
| Participant ↔ mentor / facilitator | `DeliveryAssignment` written by programme operations after screening | Mentor adding a young person by identifier |
| Staff ↔ any Person | Invitation + protected role + scope | Sharing an admin password or using service-role from a browser |

**Identity-reuse rule** (already public): participant and approver must not share the same identity or telephone number unless an independently verified accessibility accommodation is recorded. 4B does not collect those numbers; the future implementation must enforce the rule when contacts exist.

Link tokens are unguessable, single-purpose, expiry-bounded and bound to the inviter’s session. Accepting a link still requires the invitee to authenticate as the invited Person.

---

## Threat model

| Threat | Example | Required control |
|--------|---------|------------------|
| Account enumeration | Different messages for unknown vs known email | Uniform responses; rate limits |
| Credential stuffing | Reused passwords against staff accounts | Lockout, breach-resistant passwords or magic link, no public registration |
| Session theft | XSS reading tokens | httpOnly cookies; no script-accessible refresh token; later CSP gate |
| CSRF | Cross-site POST using the session cookie | SameSite; origin checks on mutations; no cookie auth on cross-site GET that changes state |
| Open redirects | `?next=https://evil` after sign-in | Allow-list of relative internal paths only |
| Role escalation | Client sets `role=admin` or edits `user_metadata` | Ignore client role fields; protected `app_metadata` / server table only |
| IDOR | `/participants/{id}` of another cohort | Server scope check + RLS |
| Confused deputy | Service role used “on behalf of” a user without checks | Service role not used for ordinary requests; user-scoped client on the server instead |
| Invitation abuse | Forwarded invite creates a guardian link | Invite bound to intended contact; out-of-band verify; no self-link by identifier |
| Unsafe recovery | Reset confirms the account or leaves an open session | Neutral messaging; revoke sessions on recovery |
| Duplicate identities | Two accounts for one Person | Server-owned Person; linking only via invitation; identity-reuse rule |
| Sensitive logging | Tokens, passwords, minor PII in logs | Redact secrets; 4B logs must not contain minor PII |

Safeguarding case IDs and notes are out of 4B scope but the session layer must not log them if encountered.

---

## Future 4B implementation sequence

Do not start until owners accept `AUTH_PROVIDER_DECISION.md` and this specification.

1. **Non-production project only** — create or designate a hosted project **outside this repository**. Do not commit secrets. Do not write production env files in this pass unless the owner separately approves a local-only untracked file.
2. **Server session adapter** — cookie `createServerClient` path only. Do not authorize from the browser helper.
3. **Disable Realtime** — no realtime subscriptions; leave the `ws` risk dormant.
4. **Synthetic users** — invite two or more clearly fake adult/staff identities. No real names of families or young people.
5. **Protected role write path** — server-only function to set `app_metadata` and/or insert `RoleAssignment`. Prove that `user_metadata` changes do not grant access.
6. **Session probe** — a server-only check (not `/admin`) that returns authorized/denied for the current cookie. Public nine routes stay unchanged.
7. **Keep `/admin` 404** — `proxy.ts` remains the gate until a later milestone has passing authorization tests.
8. **Audit stub** — persist or structured-log invite, sign-in, sign-out, grant and revoke for synthetic users.
9. **Acceptance tests** below must pass before 4B is called complete.
10. **No product features** — no participant profiles, live forms, enquiry persistence or casework.

Legacy `booking_inquiries` is not migrated, queried or used as a policy template.

---

## Acceptance tests (future 4B pass)

### Must pass

| ID | Test |
|----|------|
| T1 | Unauthenticated request to public routes still 200; enquiry remains demonstration-only. |
| T2 | `/admin` and `/admin/*` still 404 for anonymous **and** for a signed-in synthetic user. |
| T3 | Sign-in sets an httpOnly session cookie; a server component/read sees the user. |
| T4 | Sign-out clears the session; the next server read is anonymous. |
| T5 | Editing `user_metadata.role` (or equivalent) does not grant programme or admin rights. |
| T6 | A synthetic user without a protected grant is denied any privileged server action. |
| T7 | Service-role key is absent from client bundles and `NEXT_PUBLIC_*`. |
| T8 | No Realtime channel is opened. |
| T9 | No record contains a real minor’s name, phone, date of birth, school or image. |
| T10 | Invitation of an uninvited email does not create a guardian or participant link. |
| T11 | Guessing a participant identifier does not return that Person. |
| T12 | Open redirect after sign-in rejects absolute external URLs. |
| T13 | Recovery and failed sign-in responses do not distinguish unknown vs known identifiers. |
| T14 | Lint, type-check and production build still pass; nine public routes, redirects and security headers unchanged. |

### Must not be treated as 4B success

- Enabling the dormant admin dashboard.
- Reusing `booking_inquiries` RLS.
- Collecting 13–17 PII “just for a demo.”
- Trusting a browser Supabase client for authorization.

---

## Mapping to later milestones

| After 4B | Uses this foundation for |
|----------|--------------------------|
| 4C | Consent and `AdultRelationship` (still no minor PII until Gate M) |
| 4D | Authenticated enquiry / register-interest |
| 4E | Onboarding and education-stage capture |
| 4G | Mentor/facilitator assignments |
| 4I | Case policies that **exclude** general administrators |

---

## Related documents

- `AUTH_PROVIDER_DECISION.md` — scored options and mandatory Supabase controls
- `MVP_ROLE_AND_JOURNEY_BOUNDARIES.md` — role intent
- `MVP_SECURITY_PRIVACY_AND_SAFEGUARDING_BOUNDARIES.md` — permission matrix
- `MILESTONE_4A1_DEPENDENCY_HARDENING_REPORT.md` — `ws` leftover; 4B not blocked by Next.js critical advisories
