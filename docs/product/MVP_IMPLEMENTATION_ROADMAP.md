# MVP implementation roadmap

**Milestone 4A — specification only.** Ordered increments after this architecture pass. No authentication, API, database, storage, dashboard, onboarding or tracking work starts without the gates below.

---

## Increments

| ID | Increment | Outcome | Explicit approval gate before start |
|----|-----------|---------|-------------------------------------|
| **4A** | Architecture approval | These five documents accepted | Product owner + safeguarding owner sign-off on roles, consent and isolation |
| **4A.1** | Dependency hardening | Patched runtime baseline; lockfile updated only in that dedicated pass | Owner-approved implementation pass. **Must complete before 4B.** Separate from product-feature work. See below. |
| **4B** | Authentication foundation | Server-validated sessions; protected role claims; `/admin` remains 404 until RBAC is proven | **4A.1 closed.** Provider decision recorded (see architecture options). Security review of session and secrets. **No minor PII.** Authentication must not begin on the currently vulnerable framework baseline. |
| **4C** | Consent and relationship model | Instruments, adult relationships, identity-reuse rule, exception workflow (no public SL contact invented) | Legal/privacy review of instruments. 10–17 and 18–25 rules testable without live collection |
| **4D** | Enquiry / register-interest service | Replaces demonstration form for approved audiences only; audit + retention class | Monitored channel + privacy notice. Recruitment may remain closed. **Still no minor intake unless Gate M is closed** |
| **4E** | Participant onboarding | Enrolment, education stage captured separately from age, track/cohort assignment | **Gate M (minors)** plus ages 10–12 approval if that band is in scope |
| **4F** | Programme progression | UNFOLD stage, milestones, structured evidence, attendance | Delivery safeguarding ratios and session policy approved. **File-backed evidence** additionally requires the upload principles and a closed file-handling approval |
| **4G** | Mentor / facilitator workflows | Screening status, assignments, limited write | Volunteer screening policy; roles remain planned until that policy exists |
| **4H** | Reporting | Role-scoped aggregates; girls’ enrolment commitment reporting when data exist | No case-body fields in any general report |
| **4I** | Restricted safeguarding operations | Segregated case store, restriction markers, audited break-glass | Safeguarding manual, monitored concern channel (3A P4), independent escalation policy. **Not** the enquiry form |

Public nine-route site, closed recruitment messaging, and demonstration enquiry stay until 4D is approved and cut over (3A D2, 3B).

---

## Gate M — before collecting personal information from minors

All of the following must be recorded as approved. Until then, no name, phone, date of birth, school, image or other personal data of a person aged 10–17 is stored.

1. Architecture (4A) accepted.
2. Dependency hardening (4A.1) completed on an owner-approved patched baseline.
3. Authentication foundation (4B) live with server-validated sessions and protected role claims.
4. Consent and relationship model (4C) implemented and independently tested for 10–17 (consent + assent) and identity-reuse.
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
| 4A.1 | Product features, authentication, live forms, or a forced `npm audit fix` |
| 4B | Participant profiles, live forms, enabled admin dashboard |
| 4C | File storage of evidence or case notes |
| 4D | Automatic enrolment or “register interest” as an application |
| 4E | Employment, placement or progression guarantees |
| 4F | Unrestricted uploads; file evidence without the security principles |
| 4F–4G | Safeguarding case notes in delivery tools |
| 4H | Unredacted identifiers in public or mentor reports |
| 4I | A public `/admin` case browser for general administrators |

---

## Dependency warning triage (read-only)

GitHub has displayed a large vulnerability count on the default branch. `gh` is not available on this workstation, so Dependabot’s exact alert total could not be re-fetched. The current lockfile **was** assessed with existing read-only commands: `npm ls --depth=0` and `npm audit` / `npm audit --omit=dev`. No `npm install`, `npm update` or `npm audit fix` was run. Lockfiles were not modified.

### Current package versions

From `package-lock.json` / `npm ls --depth=0`:

| Package | Declared | Lockfile |
|---------|----------|----------|
| next | 16.1.6 | 16.1.6 |
| react / react-dom | 19.2.3 | 19.2.3 |
| @supabase/ssr | ^0.5.2 | 0.5.2 |
| @supabase/supabase-js | ^2.99.1 | 2.99.1 |
| zod | ^3.24.1 | 3.25.76 |
| framer-motion | ^12.36.0 | 12.36.0 |
| clsx | ^2.1.1 | 2.1.1 |
| tailwind-merge | ^2.6.0 | 2.6.1 |
| eslint | ^9 | 9.39.4 |
| eslint-config-next | 16.1.6 | 16.1.6 |
| typescript | ^5 | 5.9.3 |
| tailwindcss / @tailwindcss/postcss | ^4 | 4.2.1 |

### Reproducibility

| Source | Result |
|--------|--------|
| GitHub UI warning (previously shown on push) | 64 alerts cited; not re-verified here (`gh` missing) |
| `npm audit` on this lockfile | **13** vulnerable package groups: 1 critical, 9 high, 2 moderate, 1 low |
| `npm audit --omit=dev` | **6** groups: 1 critical, 4 high, 1 moderate |

GitHub’s 64 figure is **not the same metric** as npm’s grouped packages. The lockfile does reproduce a real, smaller set of advisories.

### Exposure

| Package | Direct? | Runtime vs dev | Notes |
|---------|---------|----------------|-------|
| **next@16.1.6** | Direct | Runtime | Advisories include Windows RCE and image-optimisation issues in `<16.3.3`. Highest priority. |
| postcss (via next) | Transitive | Runtime (build/image pipeline) | Pulled by Next |
| sharp | Transitive | Runtime (Next image) | libvips / libheif advisories |
| ws@8.19.0 | Transitive | Runtime dependency present | Via `@supabase/realtime-js`. Supabase helpers are unused by current pages but the package is installed. |
| nanoid, baseline-browser-mapping | Transitive | Appear under `--omit=dev` | Confirm against Next/Tailwind tree before treating as unused |
| brace-expansion, picomatch, flatted, browserslist, @babel/core, @humanfs/node | Transitive | Development (eslint / tooling) | Not in the public request path |

No direct production dependency other than **next** is named as the critical finding.

### Milestone 4A.1 — dependency hardening (required before 4B)

`next@16.1.6` currently has **critical** advisories. Authentication development (4B) must not begin on this vulnerable framework baseline. Dependency remediation **remains pending** after Milestone 4A.

4A.1 is a **separate** owner-approved implementation pass. It is not product-feature work and is not mixed into consent, enquiry or onboarding.

Rules for that pass:

- No automatic or forced `npm audit fix` is approved.
- The target patched Next.js version must be selected using **current official security guidance** at the time of the pass — not a version guessed in this document.
- After the upgrade: public-route, redirect, metadata, responsive, security-header, lint, type-check and production-build regression tests must pass.
- `package.json` and lockfile changes happen only in that dedicated, owner-approved pass.
- Re-run read-only `npm audit --omit=dev` after the upgrade; then address remaining runtime and (later) dev-only advisories.
- Never apply service-role keys or enable admin as a “fix” for these warnings.

---

## Related documents

- `MVP_TECHNICAL_ARCHITECTURE.md`
- `MVP_DOMAIN_AND_EVENT_MODEL.md`
- `MVP_SECURITY_PRIVACY_AND_SAFEGUARDING_BOUNDARIES.md`
- `MILESTONE_3A_DECISIONS.md` (P3 live enquiry, P4 concern channel, P7 education stage, P10 case residency)
