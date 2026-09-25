> **Superseded age policy.** Approved YDG eligibility is now **13ñ25** at the official cohort start date. Consent bands are **13ñ17** (guardian consent + participant assent) and **18ñ25** (participant consent + parent/guardian acknowledgement). Youth aged **10ñ12 are not eligible**. Historical 10ñ25 / 10ñ17 / 10ñ13 / 10ñ12-in-scope wording below is archival and must not be used as an active source of truth.
# Milestone 4B ‚Äî completion report

**Project:** Mecellino Haven / Youth Discovery Gateway  
**Milestone:** 4B ‚Äî Supabase authentication foundation  
**Branch:** `feat/ydg-mvp`  
**Provider:** Supabase Auth + Postgres + strict RLS (intended target from 4B0)

This increment implemented a fail-closed authentication and authorization foundation. It did not start participant onboarding, guardian linking, consent records, live enquiry persistence, programme tracking, file storage, safeguarding casework or an administrator dashboard.

---

## Preconditions confirmed

| Check | Result |
|-------|--------|
| Branch | `feat/ydg-mvp` |
| Milestone 4B0 | Present as `03145a3` (`docs(auth): define secure authentication foundation`) |
| Working tree at start | Clean |
| Next.js baseline | `16.3.3` |
| Specifications read | 4A architecture, domain, security, roadmap and reports; 4A.1 hardening report; 4B0 decision and specification |
| Existing helpers | `lib/supabase/{client,server}.ts` inspected and **adapted**, not replaced |
| Hosted project | **None connected** |

---

## Official guidance reviewed

Current Supabase SSR / Auth documentation was reviewed before implementation, including:

- Creating a Supabase client for SSR (cookie `getAll` / `setAll`, Proxy session refresh)
- `getClaims()` for verified identity, `getUser()` for a fresh Auth-server user record, and `getSession()` as untrusted for authorization
- Publishable / anonymous public keys versus server-only secrets
- PKCE callback / `exchangeCodeForSession`

Installed packages were kept at the existing versions (`@supabase/ssr@0.5.2`, `@supabase/supabase-js@2.99.1`). Helpers were adapted to that official cookie pattern, with `getClaims()` used when present and `getUser()` required for privileged authorization.

Realtime remains unused. The `ws` leftover recorded in 4A.1 is therefore still dormant.

---

## Live Supabase project

**No hosted Supabase project was created or used.**  
**No real users or credentials were written.**  
**This report does not claim live Supabase verification.**

Approved non-production project credentials were absent. The foundation therefore fails closed locally: public routes stay available; sign-in, recovery, callback and session validation return anonymous or a neutral failure without crashing the site.

Hosted integration remains pending until an owner-approved non-production project is supplied outside this repository.

---

## What was implemented

### Environment validation

Public URL and publishable/anonymous key are accepted only when they are non-placeholder HTTP(S) values. `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is accepted as the current official alias for the existing anonymous key.

A service-role value must never use `NEXT_PUBLIC_`. If such a public secret is present, authentication configuration is treated as invalid. The service-role key is not used for ordinary requests.

### Supabase boundaries

- Browser client: authentication transport only; returns `null` when configuration is missing or invalid.
- Server client: official SSR cookie adapter; never receives a service-role key.
- Authorization reads a server-validated user via `getUser()`. Browser session state is not an authority.
- Proxy refreshes cookies on non-admin requests only when public configuration is valid. Failures are swallowed so public routes do not crash.
- Realtime is not subscribed to.

### Authentication lifecycle foundation

- `/auth/sign-in` for synthetic / non-production accounts only. Not linked from public navigation. No self-registration.
- `/auth/callback` exchanges a PKCE code and allowlists the return path.
- Sign-out clears the Auth session and `sb-*-auth-token` cookies.
- Recovery always returns the same existence-neutral message.
- In-memory lockout after repeated failures is **local/single-process only**. Durable distributed throttling or a provider-supported equivalent is required before production authentication. Unlock / deactivation / invitation writes fail closed until a later hosted privileged path exists.

### Authorization foundation

Typed roles match the approved architecture. Roles are parsed only from `app_metadata` (or a later server-owned RoleAssignment adapter). `user_metadata`, URL parameters, form fields and other client state are ignored.

`authorize()` fails closed. Privileged actions require `fresh: true` because JWT claims can lag a revoke. Safeguarding case read/write and break-glass remain denied, including for `system_administrator`.

No role-assignment tables or migrations were created.

### Route protection

`/admin` and `/admin/*` still return 404 for anonymous and authenticated callers. The Proxy 404s admin paths before session refresh.

`GET /api/auth/session` returns only `{ "authenticated": boolean }`. It does not include tokens, claims, user identifiers or personal data.

The nine public routes are unchanged.

### Security controls

- Session cookies: httpOnly, SameSite=Lax, Secure in production.
- POST `/auth/sign-out` checks Origin / Referer against `NEXT_PUBLIC_SITE_URL` only. Host and `X-Forwarded-Host` are ignored.
- `NEXT_PUBLIC_SITE_URL` is mandatory before hosted authentication may be enabled. Missing or placeholder origin stays safe locally and does not make hosted Auth ready.
- Return paths are an allowlist of internal public routes. External, protocol-relative and `/admin` targets are rejected.
- Audit helpers construct a redacted event and emit it to a documented non-durable local sink. **No operational audit trail exists yet.**
- Service-role use for ordinary requests is refused.
- The legacy `booking_inquiries` repository baseline now keeps RLS enabled, revokes `anon` and `authenticated` privileges, and grants no policies. The table is dormant and must not be used for YDG intake or for participant, guardian, consent or safeguarding data.

---

## Control status

### Implemented controls

- Fail-closed public Auth configuration and unused-Realtime server/browser clients
- Server-only authorization from protected `app_metadata`, ignoring `user_metadata` and client-supplied roles
- Admin 404 gate, session probe without identifiers, public nine-route preservation
- Neutral sign-in / recovery messages and allowlisted return paths
- Cookie flags (httpOnly, SameSite=Lax, Secure in production)
- Neutralized unapplied `booking_inquiries` repository baseline (RLS on, no anon/authenticated policies)

### Local-only controls

- In-memory lockout (`LOCKOUT_SCOPE = local_single_process`) ‚Äî not shared across processes or restarts
- Mutation origin checks that require a configured `NEXT_PUBLIC_SITE_URL` and do not trust request Host headers
- Local non-durable audit sink

### Constructed-but-not-persisted audit events

`buildAuthAuditEvent()` builds a redacted `{ class, result, at }` object.  
`emitNonDurableAuthAudit()` sends that object to `localNonDurableAuditSink`, which discards it.

Call sites do not claim durable recording. No tokens, identifiers, email, phone, names or metadata are logged. **There is no operational audit trail yet.** Durable append-only audit storage is mandatory before live hosted authentication or privileged role changes. Audit-sink failure for those later privileged operations must fail closed; that fail-closed persistence path is **not** implemented in this milestone.

### Hosted-integration prerequisites

Hosted authentication must not be declared ready until all of the following exist:

1. An owner-approved non-production (then production) Supabase project outside this repository
2. Valid public URL and publishable key (not placeholders)
3. An approved HTTPS `NEXT_PUBLIC_SITE_URL` (not a placeholder, not loopback)
4. Durable append-only audit storage with fail-closed sink failure for privileged operations
5. Durable distributed lockout / provider throttling
6. Independent inspection of any external database that ever applied the historical booking migration ‚Äî editing the source file does not remediate a deployed database

`isHostedAuthenticationReady()` returns false unless items 2 and 3 are present.

### Tests requiring a real non-production project

T3 and T4 (live httpOnly cookie sign-in and sign-out) and live authenticated `/admin` 404 with a real session.

---

## Files changed

### Modified

| File | Change |
|------|--------|
| `.env.example` | Empty public Auth placeholders; hosted-origin requirement; no real values |
| `lib/supabase/client.ts` | Fail-closed browser client; cookie options; Realtime left unused |
| `lib/supabase/server.ts` | Fail-closed SSR cookie client; no service-role |
| `proxy.ts` | Admin 404 first; optional fail-closed session refresh |
| `package.json` | `test` and `test:types` scripts; no runtime dependency changes |
| `tsconfig.json` | Application type-check excludes `tests` |
| `supabase/migrations/20250101000000_create_booking_inquiries.sql` | Unsafe anon/authenticated policies removed; RLS kept; privileges revoked; dormancy documented |

### Added

| Area | Files |
|------|--------|
| Auth library | `lib/auth/admin-gate.ts`, `audit.ts`, `authorize.ts`, `cookies.ts`, `credentials.ts`, `env.ts`, `errors.ts`, `identity.ts`, `linking.ts`, `lockout.ts`, `origin.ts`, `privileged.ts`, `probe.ts`, `return-path.ts`, `roles.ts`, `session.ts` |
| Supabase helpers | `lib/supabase/options.ts`, `lib/supabase/proxy.ts` |
| Auth routes | `app/auth/layout.tsx`, `app/auth/actions.ts`, `app/auth/sign-in/page.tsx`, `app/auth/recovery/page.tsx`, `app/auth/callback/route.ts`, `app/auth/sign-out/route.ts` |
| Session probe | `app/api/auth/session/route.ts` |
| Tests | `tests/auth-*.test.ts`, `tests/helpers/synthetic.ts` |
| Test type-check | `tsconfig.tests.json` |
| Scripts | `scripts/run-unit-tests.mjs`, `scripts/ts-extension-hooks.mjs`, `scripts/check-auth-foundation.mjs`, `scripts/check-public-routes.mjs` |
| This report | `docs/product/MILESTONE_4B_COMPLETION_REPORT.md` |
| Phase 1 limitations | `docs/PHASE1_LIMITATIONS.md` ‚Äî booking baseline wording aligned with the neutralized repository migration |

No lockfiles, real environment values, hosted projects or deployment settings were added. The booking SQL file was corrected in place because it is an unapplied repository baseline; a second migration filename was not invented.

---

## Acceptance tests (4B0 T1‚ÄìT14)

| ID | Result | Evidence |
|----|--------|----------|
| T1 | **Pass (local)** | Nine public routes HTTP 200; `/contact` remains demonstration-only |
| T2 | **Pass (anonymous); authenticated live pending** | `/admin` and `/admin/bookings` HTTP 404. Proxy 404s admin before session refresh, so a later signed-in user still cannot open `/admin`. Live cookie-backed confirmation needs a hosted project |
| T3 | **Pending hosted project** | Unit coverage of cookie flags and server identity parsing. Live httpOnly cookie write was not verified against Supabase |
| T4 | **Pending hosted project** | Sign-out clears Auth cookies in code. Live round-trip not verified |
| T5 | **Pass** | `user_metadata.role` does not grant rights |
| T6 | **Pass** | Synthetic authenticated identity without a protected grant is denied |
| T7 | **Pass (local)** | No `NEXT_PUBLIC_` service-role name; no service-role strings in scanned browser bundles |
| T8 | **Pass** | No `.channel(` or Realtime subscribe in application source |
| T9 | **Pass** | No participant/minor records, tables or stored PII added |
| T10 | **Pass** | Invitation / identifier linking fails closed and does not create a relationship |
| T11 | **Pass** | Guessed participant identifiers return no Person |
| T12 | **Pass** | Unsafe return URLs sanitize to `/` |
| T13 | **Pass** | Failed sign-in and recovery use one neutral message |
| T14 | **Pass** | Lint, type-check and production build passed; public routes, redirects and security headers unchanged |

Client-provided roles/scopes are ignored (covered with T5). Missing environment fails closed (covered in env tests and by running the site without Auth credentials).

### Must not be treated as 4B success ‚Äî confirmed absent

- Dormant admin dashboard remains 404.
- `booking_inquiries` open policies were removed from the repository baseline and must not be reused. If that historical file was ever applied elsewhere, the deployed database must be inspected separately.
- No 10‚Äì17 PII collected.
- Browser Supabase client is not used for authorization.

---

## Other validation

| Check | Result |
|-------|--------|
| `npm run lint` | Pass |
| Application type-check (`npx tsc --noEmit`) | Pass |
| Test type-check (`npm run test:types`) | Pass |
| `npm test` | 29 passed |
| `npm run build` | Pass (Next.js 16.3.3) |
| Public routes | 200 |
| Legacy redirects | 307 as before |
| `/admin`, unknown route | 404 |
| Security headers on `/` | nosniff, referrer, Permissions-Policy, `X-Frame-Options: DENY`, no `X-Powered-By` |
| Session probe | `{ "authenticated": false }` with no extra fields |
| Fail-closed sign-in | Neutral error; no account created |
| Mobile navigation at 390√ó844 | Menu opens; drawer links present |
| `/contact` overflow at 390px | `scrollWidth = clientWidth = 390` |
| Enquiry demonstration | Demonstration wording and ‚ÄúShow demonstration result‚Äù present |
| Prohibited terms in 4B source | None |
| `npm audit --omit=dev` and full `npm audit` | **Not re-fetched.** The registry was unreachable (`ENOTFOUND registry.npmjs.org`). 4A.1 remains the last recorded result: no Next.js critical findings; leftover transitive `ws` via unused Realtime |

---

## Limitations

- Owners still need to accept this foundation before any hosted Auth project is connected.
- Ghana lawful-basis and residency review remains outstanding.
- Invitation, protected `app_metadata` writes, lockout unlock and account deactivation are fail-closed stubs until a server-only privileged path is approved.
- No operational audit trail exists. Durable append-only audit storage is still required before hosted Auth or privileged role changes.
- Current lockout is local/single-process only.
- Idle/absolute session timeout values remain an owner decision.
- HSTS and a restrictive CSP remain deployment gates.
- Realtime stays disabled until separately justified and the `ws` advisory is closed.
- `/admin` stays 404 until a later milestone has passing authorization tests that explicitly enable a dashboard.

---

## Confirmation of excluded work

No hosted Supabase project, real users, real credentials or participant data were created.  
`/admin` remains 404.  
No runtime dependencies were added or upgraded.  
No Git commit, push, branch, merge or pull-request commands were run.
