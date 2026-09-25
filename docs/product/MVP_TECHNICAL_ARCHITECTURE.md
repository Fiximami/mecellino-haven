# MVP technical architecture

**Milestone 4A — specification only.** This document defines a scalable architecture for later authenticated programme services. It does not implement authentication, APIs, databases, storage, dashboards, onboarding or participant tracking.

Approved public behaviour remains as recorded in `PUBLIC_JOURNEY_MAP.md`, `MVP_ROLE_AND_JOURNEY_BOUNDARIES.md`, `MILESTONE_3A_DECISIONS.md` and `MILESTONE_3B_COMPLETION_REPORT.md`.

---

## Current application baseline

| Item | State today |
|------|-------------|
| Runtime | Next.js `16.1.6` App Router, React `19.2.3` |
| Public IA | Nine routes plus legacy redirects; enquiry demonstration-only |
| Admin | `/admin/*` returns 404 via `proxy.ts` |
| Supabase packages | Present (`@supabase/ssr@0.5.2`, `@supabase/supabase-js@2.99.1`) with unused `lib/supabase/{client,server}.ts` helpers |
| Legacy SQL | `supabase/migrations/20250101000000_create_booking_inquiries.sql` — broad authenticated access; **not** a production YDG policy (`PHASE1_LIMITATIONS.md`) |
| Personal data | Not collected or transmitted from the public site |

Future authenticated work must not reuse the booking-inquiry table or its policies for YDG, consent, referrals or safeguarding.

---

## Target shape: modular monolith first

A single Next.js application remains the delivery vehicle. Scalability comes from **bounded contexts and permission isolation**, not from splitting services on day one.

```
Public web (unauthenticated)
        │
        ▼
Next.js server (session, authorization, audit)
        │
   ┌────┼────────────────────────────┐
   ▼    ▼                            ▼
Programme   Consent / relationships   Safeguarding casework
context     context                   (segregated store + policy)
   │         │                            │
   └────┬────┘                            │
        ▼                                 ▼
   Shared identity + audit log     Restricted case audit
```

Add separate runtimes only when isolation, residency or rate-of-change evidence requires it. The safeguarding context may become a separate datastore or project earlier than other contexts.

---

## Actors served by the MVP architecture

| Actor | Account expectation | Primary future surface |
|-------|---------------------|------------------------|
| Participant aged 13–25 | Optional for 13–17; expected for 18–25 | Own profile, assent or consent, evidence, withdrawal |
| Parent or legal guardian | Expected when linked to a 13–17 participant | Consent, collection list, linked-minor visibility |
| Approved responsible adult | Expected when formally approved | Scoped consent or pickup; not automatic guardian rights |
| School or community referrer | Expected for live referral | Nomination / referral only |
| Mentor | Expected after screening | Assigned participants and attendance; no case notes |
| Facilitator | Expected after screening | Session delivery and attendance; no case notes |
| Programme operations | Required | Cohorts, enrolment, communications, operational reports |
| Safeguarding Lead | Required | Exceptions, case assignment, org safeguarding reports |
| Restricted safeguarding caseworker | Required | Assigned case records only |
| System administrator | Required | Tenant config, user lifecycle, integrations — **not** automatic case access |

A read-only auditor role is already introduced in `MVP_ROLE_AND_JOURNEY_BOUNDARIES.md` and remains available for compliance reporting. It is not a 4A implementation target.

Mentors and facilitators share delivery events but never share identical write permissions.

---

## Progression dimensions (must stay separate)

A person does not have to enter at Play, Discovery Gateway, or any single starting point. Each of the following is an independent field or relationship:

| Dimension | Rule |
|-----------|------|
| Age | Counted on official cohort first day; eligibility 13–25; consent bands are 13–17 and 18–25 |
| Education stage | `upper_primary` \| `jhs` \| `shs` \| `tertiary` \| `other` — never inferred from age |
| YDG track | Discovery Gateway (10–13), Foundation (14–15), Direction (16–17), Execution & Progression (18–25) |
| Cohort | Time-bounded delivery group; amusement events are a separate offering |
| UNFOLD stage | Play, Discover, Explore, Experience, Prepare, Execute, Mentor — current stage is assigned, not implied by track |
| Milestones and evidence | Evidence-informed; finishing a track does not entitle the next |
| Mentor / facilitator relationships | Explicit assignments; planned, not open today |
| Consent or assent status | Separate records per required instrument |
| Participation status | Independent of track, stage and consent |

Baseline capability checks personalise delivery. They are not punitive selection scores (`config/site.ts` selection model).

---

## Future service boundaries

These are logical APIs. They may be Next.js Route Handlers or Server Actions in the same app.

| Boundary | Owns | Must not own |
|----------|------|--------------|
| Identity and access | Accounts, session validation, role claims | Programme evidence, case notes |
| Enquiry and referral | Pre-intake interest, school nominations, amusement-event enquiries (type-flagged) | Consent completion, enrolment |
| Consent and relationship | Guardian, ARA, assent, acknowledgement, media, identity-reuse exceptions | Case body |
| Programme delivery | Cohort, enrolment, track assignment, attendance, operational notes | Safeguarding case notes |
| Progression and evidence | UNFOLD stage, milestones, artefacts | Employment or placement guarantees |
| Reporting | Aggregates permitted by role | Unredacted case content |
| Safeguarding casework | Concerns, cases, restricted notes | Ordinary programme CRUD |
| Audit | Append-only privileged-action log | Business workflow decisions |

Every mutating call is authorized on the server. Browser code never holds a service-role or admin secret.

---

## Server and client separation

| Layer | Allowed | Forbidden |
|-------|---------|-----------|
| Browser | Public pages; later authenticated UI; cookie-backed session | Service-role keys; role elevation; trusting `user_metadata`; storing participant PII in `localStorage` |
| Next.js server | Validate session, enforce role + relationship + state, write audit | Treating “any logged-in user” as authorised (`PHASE1_LIMITATIONS.md`) |
| Data layer | Least-privilege policies per context | Broad `authenticated` read/write (legacy booking policy pattern) |

The current `EnquiryForm` remains client-only until the enquiry service milestone and its privacy gate are approved.

---

## Authentication and backend options

No provider is selected or configured in this milestone. Owner approval and a written security review are required before any choice.

| Option | Fit with this repo | Main risks | Evidence |
|--------|--------------------|------------|----------|
| **Supabase Auth + Postgres + RLS** | Packages and unused SSR helpers already present; Phase 1 already named `app_metadata.role` | Legacy booking RLS is too broad; service-role leakage; Ghana data-residency not evidenced here | `package.json`, `lib/supabase/*`, `PHASE1_LIMITATIONS.md` |
| **Auth.js (NextAuth) + managed Postgres** | Native to Next.js; provider-agnostic | Authorization and RLS must be built; more custom code | Not in current dependencies |
| **Hosted IdP (Clerk, Auth0 or similar)** | Faster hosted MFA/UX | Cost, lock-in, phone/SMS in Ghana, residency | Not in current dependencies |
| **Custom JWT + own database** | Maximum control | Highest chance of unsafe session design | Not recommended for this MVP |

**Evaluation stance:** treat Supabase as the **first candidate to evaluate**, because it is already in the tree and Phase 1 already assumed protected role claims. That is not a selection.

### If Supabase is later approved

These controls are mandatory, not optional extras:

1. **Server-validated sessions** via `@supabase/ssr` cookie flow on the Next.js server. Do not authorize from browser-only client state.
2. **Strict Row Level Security** on every programme, consent and safeguarding table. The existing booking-inquiry policies must not be copied.
3. **Authorization claims from protected app metadata** (or an equivalent server-owned role table). Never from editable `user_metadata`.
4. **No service-role secret in browser code**, client bundles, `NEXT_PUBLIC_*` variables or repository files.
5. **Separate safeguarding access policies** — different schema or project; general `authenticated` and `admin` roles have no default case select.
6. **Auditable privileged actions** — role changes, consent exceptions, break-glass, case assignment and exports write an append-only audit event.

Phone or email identity reuse remains blocked unless an independently verified accessibility accommodation is recorded.

---

## Related documents

- `MVP_DOMAIN_AND_EVENT_MODEL.md` — entities and events
- `MVP_SECURITY_PRIVACY_AND_SAFEGUARDING_BOUNDARIES.md` — consent, matrix, retention
- `MVP_IMPLEMENTATION_ROADMAP.md` — milestones, gates, dependency triage
- `docs/PHASE1_LIMITATIONS.md` — admin, CSP, HSTS and ages 10–12 gates
