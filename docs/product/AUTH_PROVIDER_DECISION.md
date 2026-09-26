> **Superseded age policy.** Approved YDG eligibility is now **13�25** at the official cohort start date. Consent bands are **13�17** (guardian consent + participant assent) and **18�25** (participant consent + parent/guardian acknowledgement). Youth aged **10�12 are not eligible**. Historical 10�25 / 10�17 / 10�13 / 10�12-in-scope wording below is archival and must not be used as an active source of truth.
# Authentication provider decision

**Milestone 4B0 — decision and specification only.** No hosted project is connected, no users are created, no schemas or migrations are added, and `/admin` remains 404.

Cross-reference: `MVP_TECHNICAL_ARCHITECTURE.md`, `MVP_SECURITY_PRIVACY_AND_SAFEGUARDING_BOUNDARIES.md`, `MVP_DOMAIN_AND_EVENT_MODEL.md`, `MVP_IMPLEMENTATION_ROADMAP.md`, `PHASE1_LIMITATIONS.md`.

---

## Preconditions recorded

| Check | Result |
|-------|--------|
| Branch | `feat/ydg-mvp` |
| Milestone 4A.1 | Committed (`chore(security): harden Next.js dependency baseline`) |
| Next.js baseline | `16.3.3` (approved patched 16.x) |
| `eslint-config-next` | `16.3.3` |
| Public site | Unauthenticated; enquiry demonstration-only |
| Admin | `/admin/*` 404 via `proxy.ts` |
| Existing packages | `@supabase/ssr` and `@supabase/supabase-js` are present and **unused by public routes** |

**Packages in the tree are not a connection.** Unused `lib/supabase/{client,server}.ts` helpers do not constitute an authentication implementation.

---

## Options evaluated

All options assume the approved **Next.js modular monolith**: public `(site)` routes stay unauthenticated; later identity work is authorized on the Next.js server; safeguarding remains a segregated context.

| ID | Option | Realistic for this pilot? |
|----|--------|---------------------------|
| **S** | Supabase Auth + Postgres + RLS, used from Next.js server | Yes — packages and unused SSR helpers already exist; RLS can express least privilege |
| **I** | Dedicated identity provider (for example Auth0, Clerk or WorkOS) plus a separate application database | Yes, but adds a second vendor, new dependencies and custom authorization |
| **A** | Auth.js (NextAuth) plus managed Postgres | Yes as a framework-native path; authorization and row-level rules must be built |
| **K** | Fully self-managed identity (for example Keycloak) plus self-hosted Postgres | **Not** operationally realistic for the current public-only team and Foundation-pilot scale |

Option K is recorded only to reject it for the MVP: it requires 24/7 identity operations, patching, backup and Ghana-hosting evidence the organisation has not approved.

---

## Scoring

Scale: **H** high fit · **M** medium · **L** low · **X** unsuitable or unproven here.

| Criterion | S | I | A | K |
|-----------|:-:|:-:|:-:|:-:|
| Server-validated Next.js sessions | H | M | H | M |
| Participants aged 10–25 (optional minor accounts later) | M | M | M | M |
| Guardian / responsible-adult relationships | M | M | M | M |
| Multiple roles per identity | H | H | M | H |
| Protected role claims (not editable profile fields) | H | H | M | H |
| Least privilege | H | M | M | H |
| Row/record-level authorization | H | L | L | M |
| Safeguarding-data segregation | M | H | M | H |
| Auditability | M | H | M | M |
| Ghana privacy and data-residency | L | L | L | M |
| Operational complexity | H | M | M | X |
| Cost and pilot suitability | H | L | H | X |
| Vendor lock-in | L | L | M | H |
| Scalability | H | H | M | M |
| Backup and recovery | M | M | M | L |
| Local development and testing | H | M | H | L |
| Future migration cost | M | M | M | L |

**Notes on scores**

- **Participants 10–25:** no vendor gives a programme consent model. All options are medium: 10–17 accounts remain optional; 4B must not collect minor PII (`MVP_IMPLEMENTATION_ROADMAP.md` Gate M).
- **Relationships:** must live in application records (`AdultRelationship`), never in “knowing an email or phone.” Vendor choice does not replace that rule.
- **Protected claims:** Supabase `app_metadata` is server-writable; hosted IdPs have equivalent private claims; Auth.js needs a server-owned role table to be safe.
- **RLS:** native and strong on Supabase/Postgres. IdP+separate-DB and Auth.js require equivalent policies in the app database or they fail least privilege.
- **Safeguarding segregation:** a second project or schema is possible on all options; a dedicated IdP does not by itself isolate case files.
- **Ghana privacy / residency:** **no option is evidenced** in this repository. Ghana’s Data Protection Act, 2012 (Act 843) and children’s-data / cross-border-transfer questions are **owner and legal decisions**. No vendor region is approved here. All options score low or unproven until that review exists.
- **`ws` risk:** `@supabase/realtime-js` still pulls `ws` (4A.1 leftover). Realtime stays **disabled** unless separately justified and that advisory is closed.

---

## Decision

**Intended implementation target for a future 4B pass: Option S — Supabase Auth + Postgres + RLS**, used only through the Next.js server, subject to owner approval of this document and the mandatory controls below.

This is a **recorded decision for the next implementation pass**, not a connection, not a production go-live, and not permission to collect personal data.

Reasons:

- Fits the modular monolith and Phase 1 note that roles must come from protected claims (for example `app_metadata`), not “any authenticated user.”
- Packages and unused SSR helpers already exist; 4B should complete them correctly rather than add a second stack.
- RLS can enforce record scope (linked minor, assigned cohort, assigned case) if policies are written from scratch.
- Pilot operational load is lower than a second IdP plus a second database.

Rejected for MVP: Option K. Deferred: Options I and A remain valid **migration paths** if residency, audit or vendor constraints later fail Option S.

---

## Mandatory controls if Supabase is used

These are implementation requirements, not optional hardening.

1. **Not connected yet.** Presence of npm packages and unused helpers does not connect a project, create users or store sessions.
2. **Server-side session validation is mandatory.** Authorize from `@supabase/ssr` cookie session on the Next.js server. Browser client state is not an authority.
3. **Protected claims only.** Roles and staff flags come from `app_metadata` and/or a server-owned `RoleAssignment` table. Never from editable `user_metadata` or a client-supplied role field.
4. **Strict RLS** on every exposed table. No `authenticated` can-do-everything policy.
5. **Service-role credentials are server-only.** Never in browser code, client bundles, `NEXT_PUBLIC_*` or the repository. The service role is not used for ordinary user requests; it is limited to privileged server jobs (invitation, claim write, break-glass) that are themselves authorized and audited.
6. **Realtime remains disabled** unless a later increment justifies it **and** the `ws` dependency risk recorded in 4A.1 is resolved.
7. **Safeguarding case content** uses separately restricted policies (separate schema or project). General administrator and `authenticated` roles do **not** inherit case select. System administrators do not automatically receive case access (`MVP_SECURITY_PRIVACY_AND_SAFEGUARDING_BOUNDARIES.md`).
8. **Legacy `booking_inquiries` policies must not be reused** or copied. That migration’s anonymous insert and broad authenticated access are not a YDG pattern (`PHASE1_LIMITATIONS.md`).
9. **`/admin` remains 404** until automated authorization tests prove the boundary. Connecting Auth does not enable the dormant dashboard.
10. **No minor PII in 4B.** No name, phone, date of birth, school or image of a person aged 10–17 is stored.
11. **Test identities must be synthetic** (clearly fake adults/staff). No real families, schools or young people.

Phone or email reuse between participant and approver remains blocked unless an independently verified accessibility accommodation is recorded (later consent milestone, not 4B data collection).

---

## Residual risks and owner actions

| Risk | Owner action before production Auth |
|------|-------------------------------------|
| Ghana lawful basis, children’s data, cross-border processing | Legal/privacy review; no invented residency claim |
| Hosted-region choice | Recorded only after that review |
| Unused Supabase helpers could be wired incorrectly | 4B implementation must fail closed and keep `/admin` 404 |
| `ws` / Realtime | Keep Realtime off |
| Legacy booking table | Do not migrate YDG onto it |
| Vendor lock-in | Keep domain entities portable (`Person`, `Account`, `RoleAssignment`) |

---

## What 4B0 does not do

- Does not create a Supabase project, users, env values or login UI.
- Does not change dependencies or lockfiles.
- Does not expose `/admin` or collect participant data.
- Does not replace demonstration enquiry.
