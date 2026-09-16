# MVP implementation roadmap

Reconstruction Milestone **R1 is complete** (`feat(site): establish reconstructed service architecture`). Reconstruction Milestone **R2 is an accepted specification**: YDG longitudinal journey architecture and experience planning. R2 remains documentation and architecture only. Owner acceptance does not authorise migrations, live consent collection, recruitment, onboarding, personal-data processing or closure of Gate M.

Authenticated programme work still follows the gated 4A–4I sequence below. **4A, 4A.1 and 4B are closed.** **4C remains incomplete and gated.** It is the next implementation increment and still depends on the original 4C gates as well as this accepted R2 baseline.

No API, database, storage, dashboard, onboarding or tracking work starts without the gates below.

---

## Reconstruction sequence

| ID | Increment | Status | Outcome | Depends on |
|----|-----------|--------|---------|------------|
| **R1** | Reconstructed public service architecture | **Complete** | Capacity Building (including nested YDG), Lifestyle Coaching, Events & Entertainment, Amusement coming soon; canonical routes and redirects | Approved reconstruction |
| **R2** | YDG longitudinal journey architecture | **Accepted specification** | Roles, lifecycle, age vs education stage, journey/engagement concepts, consent/safeguarding gates, dashboard IA, phase boundaries, backend map. Remains documentation and architecture only | R1 committed; product owner accepted. Acceptance does not authorise production implementation, persistence, recruitment or personal-data collection |
| **R3+** | Authenticated journey delivery | Not started | Implements Phase A in `R2_EXPERIENCE_IA_AND_IMPLEMENTATION.md` through later 4C–4G slices | R2 accepted; Gate M before minor PII; no live recruitment until named gates close |

R2 documents:

- `R2_YDG_LONGITUDINAL_JOURNEY.md`
- `R2_CONSENT_SAFEGUARDING_AND_PRIVACY.md`
- `R2_EXPERIENCE_IA_AND_IMPLEMENTATION.md`

Owner-accepted as the planning and architecture baseline. This acceptance does not authorize production implementation, persistence, recruitment or personal-data collection.

---

## Increments

| ID | Increment | Status | Outcome | Explicit approval gate before start |
|----|-----------|--------|---------|-------------------------------------|
| **4A** | Architecture approval | **Closed** | Five 4A documents accepted | Product owner + safeguarding owner sign-off on roles, consent and isolation |
| **4A.1** | Dependency hardening | **Closed** | Patched Next.js 16.3.3 baseline | Owner-approved implementation pass. **Must complete before 4B.** Separate from product-feature work. See below. |
| **4B** | Authentication foundation | **Closed (dormant, fail-closed)** | Server-validated sessions; protected role claims; `/admin` remains 404 until RBAC is proven | **4A.1 closed.** Provider decision recorded. Hosted project, durable audit and distributed lockout remain prerequisites before live Auth. **No minor PII.** |
| **4C** | Consent and relationship model | Next gated implementation increment | Instruments, adult relationships, identity-reuse rule, exception workflow (no public SL contact invented). Synthetic eligibility is testable without live collection. **Not complete.** Persistence and live collection remain blocked pending legal/privacy, retention, AdultRelationship-schema and safeguarding approvals. | **R2 accepted.** Legal/privacy review of instruments. 10–17 and 18–25 rules testable without live collection. AdultRelationship physical schema, RLS/grants, audit model and independently reviewed D2–D4 migration required before linking. |
| **4D** | Enquiry / register-interest service | Not started | Replaces demonstration form for approved audiences only; audit + retention class | Monitored channel + privacy notice. Recruitment may remain closed. **Still no minor intake unless Gate M is closed** |
| **4E** | Participant onboarding | Not started | Enrolment, education stage captured separately from age, track/cohort assignment | **Gate M (minors)** plus ages 10–12 approval if that band is in scope. Use 4A stages `upper_primary \| jhs \| shs \| tertiary \| other`. **`tvet` as an education-stage value remains an open owner decision** — do not encode TVET as `other` and do not treat it as approved |
| **4F** | Programme progression | Not started | My Journey, UNFOLD stage (**Execute** preserved), milestones, structured evidence, attendance, `TransitionReviewCompleted`, `EnrolmentEnded` / `EnrolmentTransferred` | R2 Phase A engagement model. Delivery safeguarding ratios and session policy approved. **File-backed evidence** additionally requires the upload principles and a closed file-handling approval. No scores, rankings, DMs, silent enrolment moves or automatic progression |
| **4G** | Mentor / facilitator workflows | Not started | Screening status, assignments, limited write; structured mentor interaction only | Volunteer screening policy; roles remain planned until that policy exists. No mentorship marketplace |
| **4H** | Reporting | Not started | Role-scoped aggregates; girls’ enrolment commitment reporting when data exist | No case-body fields in any general report |
| **4I** | Restricted safeguarding operations | Not started | Segregated case store, restriction markers, audited break-glass | Safeguarding manual, monitored concern channel (3A P4), independent escalation policy. **Not** the enquiry form |

The reconstructed public site (R1 canonical routes), closed recruitment messaging, and demonstration enquiry stay until 4D is approved and cut over (3A D2, 3B). Direct messaging, community feeds, automated matching and alumni grants wait for their named phases in `R2_EXPERIENCE_IA_AND_IMPLEMENTATION.md`.

---

## Gate M — before collecting personal information from minors

All of the following must be recorded as approved. Until then, no name, phone, date of birth, school, image or other personal data of a person aged 10–17 is stored.

1. Architecture (4A) accepted.
2. Dependency hardening (4A.1) completed on an owner-approved patched baseline.
3. Authentication foundation (4B) live with server-validated sessions and protected role claims. Hosted-project, durable-audit and distributed-lockout prerequisites from the 4B report still apply.
4. Consent and relationship model (4C) implemented and independently tested for 10–17 (consent + assent) and identity-reuse. Owner-accepted R2 remains planning and architecture only and does **not** satisfy this gate.
5. Lawful-basis / privacy notice approved for Ghana operations (owner/legal — not invented here).
6. Safeguarding, privacy and insurance readiness gates already named in `recruitmentClosedStatement` are closed.
7. Age-specific safeguarding approval if any participant is aged 10–12.
8. Live enquiry/onboarding UI states that applications remain closed until intake is explicitly opened.
9. Retention class for minor records is set.
10. No organisational concern workflow is implied unless 4I’s channel is approved.
11. No file uploads by or of a minor until file-handling approval (permitted types, validation, private storage, malware controls) is also closed.

Adult 18–25 personal data still requires 4A.1, 4B, 4C, privacy notice and retention, but Gate M is the additional bar for minors. File-backed evidence is never implied by the EvidenceItem entity alone.

---

## What stays out of each increment

| Increment | Must not introduce |
|-----------|-------------------|
| R2 | Production UI, migrations, Supabase changes, dashboards, live forms, generated instruction files, or personal-data collection |
| R2-V | Persistence, pages, env files, or new roles in `lib/auth/roles.ts` |
| 4A.1 | Product features, authentication, live forms, or a forced `npm audit fix` |
| 4B | Participant profiles, live forms, enabled admin dashboard |
| 4C | File storage of evidence or case notes; persistence and live collection until legal/privacy, retention, AdultRelationship-schema and safeguarding approvals |
| 4D | Automatic enrolment or “register interest” as an application |
| 4E | Employment, placement or progression guarantees |
| 4F | Unrestricted uploads; file evidence without the security principles |
| 4F–4G | Safeguarding case notes in delivery tools |
| 4H | Unredacted identifiers in public or mentor reports |
| 4I | A public `/admin` case browser for general administrators |

---

## Dependency warning triage (read-only)

**4A.1 is closed.** The hardened runtime baseline is **Next.js 16.3.3**.

GitHub default-branch Dependabot alerts are a **separate metric** from the current feature-branch package audit. A historical GitHub UI warning of 64 alerts on the default branch was cited during 4A; `gh` is not available here, so that default-branch total is not re-fetched and must not be treated as the current lockfile result.

The current feature-branch lockfile was assessed with existing read-only commands: `npm audit` and `npm audit --omit=dev`. **Both reported zero vulnerabilities.** No `npm install`, `npm update` or `npm audit fix` was run. Lockfiles were not modified in this documentation correction.

### Current package versions

From `package.json` / `package-lock.json` after the closed 4A.1 pass:

| Package | Declared | Lockfile |
|---------|----------|----------|
| next | 16.3.3 | 16.3.3 |
| react / react-dom | 19.2.3 | 19.2.3 |
| @supabase/ssr | ^0.5.2 | 0.5.2 |
| @supabase/supabase-js | ^2.99.1 | 2.99.1 |
| zod | ^3.24.1 | 3.25.76 |
| framer-motion | ^12.36.0 | 12.36.0 |
| clsx | ^2.1.1 | 2.1.1 |
| tailwind-merge | ^2.6.0 | 2.6.1 |
| eslint | ^9 | 9.39.4 |
| eslint-config-next | 16.3.3 | 16.3.3 |
| typescript | ^5 | 5.9.3 |
| tailwindcss / @tailwindcss/postcss | ^4 | 4.2.1 |

### Reproducibility

| Source | Result |
|--------|--------|
| GitHub default-branch alerts (historical UI warning) | 64 alerts cited on the default branch; not this feature-branch lockfile; not re-verified here (`gh` missing) |
| `npm audit` on this feature-branch lockfile | **0 vulnerabilities** |
| `npm audit --omit=dev` on this feature-branch lockfile | **0 vulnerabilities** |

Do not add GitHub default-branch alert counts to the feature-branch npm audit result.

### Exposure

The former **next@16.1.6** critical advisories (including Windows RCE and image-optimisation issues in `<16.3.3`) were the 4A.1 trigger. That baseline is replaced by **next@16.3.3**. Remaining transitive packages (postcss, sharp, ws via unused Realtime helpers, eslint tooling) are not currently reported as vulnerable by the feature-branch `npm audit` commands above.

Never apply service-role keys or enable admin as a “fix” for dependency warnings. No automatic or forced `npm audit fix` is approved.

### Milestone 4A.1 — dependency hardening (required before 4B)

**Closed.** Owner-approved hardening upgraded the runtime to **Next.js 16.3.3**. 4B was not started on the former `next@16.1.6` baseline.

4A.1 remains a separate hardening pass, not product-feature work, and is not mixed into consent, enquiry or onboarding. Rules that governed the pass still apply to later audits:

- No automatic or forced `npm audit fix` is approved.
- Patched Next.js versions must follow **current official security guidance** at the time of the pass.
- After an upgrade: public-route, redirect, metadata, responsive, security-header, lint, type-check and production-build regression tests must pass.
- `package.json` and lockfile changes happen only in a dedicated, owner-approved pass.
- Re-run read-only `npm audit` and `npm audit --omit=dev` after upgrades.
- Never apply service-role keys or enable admin as a “fix” for these warnings.

---

## Related documents

- `R2_YDG_LONGITUDINAL_JOURNEY.md`
- `R2_CONSENT_SAFEGUARDING_AND_PRIVACY.md`
- `R2_EXPERIENCE_IA_AND_IMPLEMENTATION.md`
- `MVP_TECHNICAL_ARCHITECTURE.md`
- `MVP_DOMAIN_AND_EVENT_MODEL.md`
- `MVP_SECURITY_PRIVACY_AND_SAFEGUARDING_BOUNDARIES.md`
- `MILESTONE_3A_DECISIONS.md` (P3 live enquiry, P4 concern channel, P7 education stage, P10 case residency)
- `HOSTED_AUTHENTICATION_CONTROLS_DECISION.md` (parent vs legal_guardian; hosted Auth enablement gates)
- `DISTRIBUTED_AUTHENTICATION_LOCKOUT_DECISION.md` (owner-approved HMAC lockout store; dormant sign-in integration; hosted Auth remains disabled)
- `MILESTONE_4C_ADULT_RELATIONSHIP_AND_CONSENT_ARCHITECTURE.md` (design-only AdultRelationship, ConsentRecord, ARA workflow, security and retention; persistence and live collection remain blocked)
