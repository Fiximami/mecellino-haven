> **Superseded age policy.** Approved YDG eligibility is now **13–25** at the official cohort start date. Consent bands are **13–17** (guardian consent + participant assent) and **18–25** (participant consent + parent/guardian acknowledgement). Youth aged **10–12 are not eligible**. Historical 10–25 / 10–17 / 10–13 / 10–12-in-scope wording below is archival and must not be used as an active source of truth.
# Milestone 4B0 â€” completion report

**Project:** Mecellino Haven / Youth Discovery Gateway  
**Milestone:** 4B0 â€” authentication-provider evaluation and implementation specification  
**Repository:** this repository  
**Branch:** `feat/ydg-mvp`

---

## Preconditions confirmed

| Check | Result |
|-------|--------|
| Branch | `feat/ydg-mvp` |
| Working tree at start | Clean |
| Milestone 4A.1 | Committed as the Next.js hardening change |
| Next.js / eslint-config-next | `16.3.3` (approved patched baseline) |
| Application source, packages, lockfile, env, schemas | Not modified in this pass |

---

## Scope completed

4B0 is decision and specification only. It records a scored provider evaluation and the authentication, authorization, linking, threat and test rules for a **future** 4B implementation pass.

It does **not** implement authentication, create users, connect a hosted service, add environment values, run migrations, change dependencies or expose `/admin`.

Approved 4A architecture, consent, least privilege, safeguarding isolation and 3A/3B public behaviour are unchanged.

---

## Files created

| File | Purpose |
|------|---------|
| `docs/product/AUTH_PROVIDER_DECISION.md` | Scored options; Supabase as intended 4B target; mandatory controls |
| `docs/product/AUTHENTICATION_AND_AUTHORIZATION_SPECIFICATION.md` | Lifecycles, linking safeguards, threat model, 4B sequence and acceptance tests |
| `docs/product/MILESTONE_4B0_COMPLETION_REPORT.md` | This report |

---

## Decision recorded

**Intended 4B implementation target:** Supabase Auth + Postgres + RLS, used from the Next.js server.

This is not a live connection. Packages already in the tree do not count as integration.

A dedicated identity provider plus a separate database remains a valid alternative if Ghana residency or audit requirements later fail Supabase. Fully self-managed identity (for example Keycloak) is rejected as unrealistic for this pilot.

Mandatory Supabase controls (summary): server-validated sessions; protected `app_metadata` or server-owned roles; strict RLS; service-role server-only and not for ordinary requests; Realtime off until the `ws` risk is resolved; safeguarding policies isolated; no reuse of `booking_inquiries` policies; `/admin` stays 404; no minor PII; synthetic test identities only.

Ghana privacy and data-residency remain **unproven** for every option and require owner/legal review before production Auth.

---

## Specification recorded

- Authentication lifecycle: invitation, sign-in, refresh, sign-out, recovery, lockout, deactivation
- Authorization lifecycle: role request, protected assignment, scope, revocation, emergency-access hook, audit
- Linking: no self-link by email, phone or participant identifier
- Threat model: enumeration, stuffing, session theft, CSRF, open redirects, escalation, IDOR, confused deputy, invitation abuse, unsafe recovery, duplicate identities, sensitive logging
- Future 4B sequence and acceptance tests T1â€“T14

---

## Validation

| Check | Result |
|-------|--------|
| Only the three listed documents added | Yes |
| Source, `package.json`, lockfile, `.env*`, schemas | Unchanged |
| Next.js baseline still `16.3.3` | Yes |
| `/admin` still specified as 404 | Yes |
| IGNITE, FDG, Launch as a programme stage | Not introduced |
| Employment / placement guarantees | Not introduced |
| Invented Ghana hosting region or live contact channel | None |
| Git commit, push, branch, merge, pull request | Not run |

---

## Remaining limitations

- Owners must accept the provider decision before any 4B implementation.
- No hosted Auth project is connected.
- Ghana lawful-basis and residency review is still outstanding.
- Transitive `ws` finding from 4A.1 remains; Realtime stays disabled.
- 4B, when implemented, still collects no minor PII and still does not enable `/admin`.

---

## Confirmation of excluded work

No authentication, user creation, hosted-service connection, schema, migration, environment or dependency change was made.  
No Git commit, push, branch, merge or pull-request commands were run.
