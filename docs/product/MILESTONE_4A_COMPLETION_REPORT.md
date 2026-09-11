# Milestone 4A — completion report

**Project:** Mecellino Haven / Youth Discovery Gateway  
**Milestone:** 4A — MVP architecture and specification  
**Repository:** this repository

---

## Scope completed

Milestone 4A recorded a scalable, least-privilege architecture for later authenticated programme work. It did not implement authentication, APIs, databases, storage, dashboards, onboarding forms or participant tracking.

Approved 3A/3B public journeys, consent language, closed recruitment, demonstration enquiry, SEO and visual-system work are unchanged.

Defined in this pass:

- Actors: participants 10–25, parents/legal guardians, approved responsible adults, school and community referrers, mentors, facilitators, programme operations, Safeguarding Lead, restricted safeguarding caseworkers, system administrators
- Progression dimensions kept separate: age, education stage, track, cohort, UNFOLD stage, milestones/evidence, assignments, consent/assent, participation status
- Canonical consent (10–17 consent + assent; 18–25 legal consent + acknowledgement; media optional; identity-reuse rule; Safeguarding Lead exception)
- Least-privilege matrix with safeguarding cases isolated from ordinary records
- Technology-neutral domain and event model
- Future API boundaries, authorization, audit, retention and server/client split
- Authentication/backend comparison including Supabase as an unelected candidate
- Read-only dependency-warning triage
- Incremental roadmap with Gate M before collecting personal information from minors
- Principle-level evidence and file-upload security (correction pass)
- Milestone **4A.1** dependency hardening before any 4B authentication work (correction pass)

---

## Files created

| File | Purpose |
|------|---------|
| `docs/product/MVP_TECHNICAL_ARCHITECTURE.md` | Current baseline, modular monolith, service boundaries, auth options |
| `docs/product/MVP_DOMAIN_AND_EVENT_MODEL.md` | Entities, vocabularies, shared and isolated events |
| `docs/product/MVP_SECURITY_PRIVACY_AND_SAFEGUARDING_BOUNDARIES.md` | Consent, permission matrix, segregation, audit, retention |
| `docs/product/MVP_IMPLEMENTATION_ROADMAP.md` | Increments 4A, **4A.1**, 4B–4I, Gate M, dependency triage |
| `docs/product/MILESTONE_4A_COMPLETION_REPORT.md` | This report |

No application source, environment files, lockfiles or migrations were modified.

---

## Corrections and decisions recorded (not implemented)

- Participants may enter at different UNFOLD stages and tracks; nothing assumes a single start point.
- Education stage values for later intake: upper primary, JHS, SHS, tertiary or other.
- System administrators do not inherit safeguarding-case access.
- Restriction markers are operational flags, not case files.
- Supabase is the first candidate to evaluate (already in the tree; Phase 1 named protected `app_metadata` roles) and is **not** selected. If later approved, server-validated sessions, strict RLS, protected claims, no browser service-role, separate safeguarding policies and audited privileged actions are mandatory.
- Legacy `booking_inquiries` policies must not be reused.
- Live enquiry cutover and the organisational concern channel remain later gates (3A P3, P4).
- **EvidenceItem** does not imply unrestricted uploads. File-backed evidence is deferred until explicit type/size limits, server-side MIME and signature checks, generated keys, private storage, short-lived authorized access, malware quarantine, metadata stripping, no executables, encryption in transit and at rest, audit of upload/access/replace/delete, retention/deletion, participant/cohort isolation, separate safeguarding-case files, media-consent rules and a withdrawal restriction/removal workflow are approved. No minor uploads before Gate M and file-handling approval. No upload API, schema or storage provider was designed.
- Dependency hardening is **Milestone 4A.1** and must finish before 4B. `next@16.1.6` currently has critical advisories. No automatic or forced `audit fix` is approved. The patched version must be chosen from official security guidance in a separate owner-approved implementation pass, with full public-site regression. **Dependency remediation remains pending.** Authentication must not start on the current vulnerable baseline.

---

## Dependency triage (summary)

Read-only `npm ls` and `npm audit` against the current lockfile. GitHub CLI was not available, so the previously displayed “64 vulnerabilities” count was not re-fetched from Dependabot.

| Check | Result |
|-------|--------|
| Direct runtime named in critical findings | `next@16.1.6` |
| `npm audit` | 13 package groups (1 critical, 9 high, 2 moderate, 1 low) |
| `npm audit --omit=dev` | 6 groups (1 critical, 4 high, 1 moderate) |
| Typical production exposure | Next.js and its image/CSS toolchain; `ws` via unused-in-pages Supabase realtime |
| Typical development exposure | ESLint / TypeScript toolchain transitives |
| Remediation | **Pending.** Scheduled as Milestone 4A.1 before 4B. No `audit fix` in this pass. |

Full table: `MVP_IMPLEMENTATION_ROADMAP.md`.

---

## Validation

| Check | Result |
|-------|--------|
| Only the five listed documents added | Yes |
| Application code, `package.json`, lockfile, `.env*` | Unchanged |
| `npm run lint` | Pass |
| `npm exec tsc -- --noEmit` | Pass |
| Terminology in new docs: IGNITE, FDG, Launch as a programme stage | None |
| Employment / placement / impact guarantees introduced | None |
| Invented production domain, contact channel or dates | None |
| Git commit, push, branch, merge, pull request | Not run |
| `npm install` / `update` / `audit fix` | Not run |

---

## Remaining limitations

- Owner must accept 4A, then complete **4A.1**, before 4B.
- **Dependency remediation remains pending**; `next@16.1.6` still has critical advisories.
- Auth provider remains unselected.
- Safeguarding concern channel remains a policy decision.
- Retention periods require legal/owner values.
- Dependabot’s exact GitHub alert inventory was not available without `gh`.
- Public site still collects no personal data and still blocks `/admin`.

---

## Confirmation of excluded work

No backend, authentication, database, API, storage or dashboard development was started.  
No dependencies were installed or updated.  
No Git commit, push, branch, merge or pull-request commands were run.
