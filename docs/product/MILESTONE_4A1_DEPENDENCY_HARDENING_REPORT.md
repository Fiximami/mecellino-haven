> **Superseded age policy.** Approved YDG eligibility is now **13�25** at the official cohort start date. Consent bands are **13�17** (guardian consent + participant assent) and **18�25** (participant consent + parent/guardian acknowledgement). Youth aged **10�12 are not eligible**. Historical 10�25 / 10�17 / 10�13 / 10�12-in-scope wording below is archival and must not be used as an active source of truth.
# Milestone 4A.1 — dependency hardening report

**Project:** Mecellino Haven / Youth Discovery Gateway  
**Milestone:** 4A.1 — targeted Next.js security baseline  
**Branch:** `feat/ydg-mvp`  
**Working tree at start:** clean

This increment upgraded the framework baseline only. It did not begin authentication, backend, database, API, storage, onboarding or product-feature work. No `npm audit fix` was used. No Git commit, push, merge, branch or pull-request operations were run.

---

## Official sources consulted

| Source | Use |
|--------|-----|
| [Next.js August 2026 Security Release](https://nextjs.org/blog/august-2026-security-release) | Official instruction: `npm install next@16.3.3` for the 16.x line |
| [GHSA-p293-qw3h-jr36](https://github.com/vercel/next.js/security/advisories/GHSA-p293-qw3h-jr36) / CVE-2026-75604 | Windows-hosted unauthenticated RCE; patched in **16.3.3** |
| [GHSA-2xp9-vwfh-vxw4](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4) | Image Optimization AVIF RCE; patched in **16.3.3** |
| [GHSA-955p-x3mx-jcvp](https://github.com/vercel/next.js/security/advisories/GHSA-955p-x3mx-jcvp) / CVE-2026-64643 | Server Function endpoint disclosure; patched in **16.2.11** (included by 16.3.3) |
| [Next.js v16.3.3 release notes](https://github.com/vercel/next.js/releases/tag/v16.3.3) | Security release for the two critical advisories |
| [Next.js v16.3.4 release notes](https://github.com/vercel/next.js/releases/tag/v16.3.4) | Follow-up that re-enables AVIF; not the security release |
| [Next.js v16.3.5 release notes](https://github.com/vercel/next.js/releases/tag/v16.3.5) | Later bugfixes only; not selected |
| `npm view next@16.3.3` peerDependencies and engines | Compatibility |

**Selected version:** `next@16.3.3` (smallest supported 16.x that official advisories list as patched).  
`eslint-config-next` was aligned to **16.3.3**.  
`16.3.5` appeared in some `npm audit` “fixAvailable” output and was **not** used as the selection source.

### Compatibility

| Requirement | Result |
|-------------|--------|
| Node | `next@16.3.3` requires `>=20.9.0`. Local Node `v24.18.0` satisfies this. |
| React | Peer `^18.2.0 \|\| ^19.0.0`. Project remains `react@19.2.3` / `react-dom@19.2.3`. |
| ESLint config | `eslint-config-next@16.3.3` peers: `eslint >=9`, `typescript >=3.3.1`. Project has `eslint@9.39.4` and `typescript@5.9.3`. |

---

## Before and after versions

Recorded before change with `node -v`, `npm -v` and `npm ls --depth=0`.

| Item | Before | After |
|------|--------|-------|
| Node | v24.18.0 | v24.18.0 (unchanged) |
| npm | 11.16.0 | 11.16.0 (unchanged) |
| next | 16.1.6 | **16.3.3** |
| eslint-config-next | 16.1.6 | **16.3.3** |
| react / react-dom | 19.2.3 | 19.2.3 |
| @supabase/ssr | 0.5.2 | 0.5.2 |
| @supabase/supabase-js | 2.99.1 | 2.99.1 |
| zod | 3.25.76 | 3.25.76 |
| framer-motion | 12.36.0 | 12.36.0 |
| clsx | 2.1.1 | 2.1.1 |
| tailwind-merge | 2.6.1 | 2.6.1 |
| eslint | 9.39.4 | 9.39.4 |
| typescript | 5.9.3 | 5.9.3 |
| tailwindcss / @tailwindcss/postcss | 4.2.1 | 4.2.1 |

Direct application dependencies other than `next` and `eslint-config-next` were not upgraded.

---

## Exact files changed

| File | Change |
|------|--------|
| `package.json` | `next` and `eslint-config-next` 16.1.6 → 16.3.3 |
| `package-lock.json` | Lockfile for that targeted install |
| `docs/product/MILESTONE_4A1_DEPENDENCY_HARDENING_REPORT.md` | This report (new) |

Application source, environment files, schemas, migrations and deployment settings were not modified.

A clean `npm ci` from the updated lockfile completed after leftover local `next start` processes holding old native binaries were stopped.

---

## Applicable advisories

| Advisory | Severity | Affected (16.x) | Status after 16.3.3 |
|----------|----------|-----------------|---------------------|
| GHSA-p293-qw3h-jr36 / CVE-2026-75604 | Critical | `>=16.0 <16.3.3` | Addressed by official patched release |
| GHSA-2xp9-vwfh-vxw4 | Critical | `<16.3.3` | Addressed; 16.3.3 disables AVIF optimization until the upstream image-stack fix |
| GHSA-955p-x3mx-jcvp / CVE-2026-64643 | Moderate (disclosure) | `>=16.0.0 <16.2.11` | Addressed by being on 16.3.3 |

This host is Windows, so the Windows RCE advisory is relevant to local and any future Windows-hosted production.

---

## Audit results

Read-only `npm audit` and `npm audit --omit=dev` only. No `audit fix`.

### Before (`next@16.1.6`)

| Scope | critical | high | moderate | low | total |
|-------|----------|------|----------|-----|-------|
| Production (`--omit=dev`) | 1 | 4 | 1 | 0 | 6 |
| Full | 1 | 9 | 2 | 1 | 13 |

Production packages named: `next` (critical, direct), `postcss`, `sharp`, `nanoid`, `ws`, `baseline-browser-mapping`.

### After (`next@16.3.3`)

| Scope | critical | high | moderate | low | total |
|-------|----------|------|----------|-----|-------|
| Production (`--omit=dev`) | **0** | 1 | 1 | 0 | 2 |
| Full | **0** | 6 | 2 | 1 | 9 |

`npm ls --depth=0` reports `next@16.3.3` and `eslint-config-next@16.3.3` with no missing peers.

---

## Remaining risks

Not every advisory is resolved. Remaining findings are classified below.

| Package | Severity | Direct? | Exposure | Blocks 4B? |
|---------|----------|---------|----------|------------|
| `ws@8.19.0` | high | Transitive via `@supabase/realtime-js` | Production **dependency present**; current public pages do not import the Supabase helpers | No — not a Next.js critical advisory. Track for 4B if those helpers become live. |
| `baseline-browser-mapping` | moderate | Transitive | Appears under production audit; toolchain/browser-data, not application auth | No |
| `@babel/core`, `@humanfs/node`, `brace-expansion`, `browserslist`, `flatted`, `js-yaml`, `picomatch` | low–high | Transitive | Development / lint-build toolchain | No |

These leftover findings must not be described as fully remediated. They do **not** restore the Next.js critical RCEs that blocked 4B.

Behaviour note: official 16.3.3 disables AVIF image optimization. This project does not rely on AVIF as a published feature. Re-enabling AVIF (16.3.4+) is out of scope unless a later owner-approved pass is scheduled.

---

## Regression results

| Check | Result |
|-------|--------|
| Clean `npm ci` from updated lockfile | Pass |
| `npm ls --depth=0` | Pass (`next@16.3.3`, `eslint-config-next@16.3.3`) |
| `npm audit --omit=dev` | No critical; 2 remaining transitive |
| Full `npm audit` | No critical; 9 remaining (mostly development) |
| `npm run lint` | Pass |
| `npm exec tsc -- --noEmit` | Pass |
| `npm run build` | Pass (Next.js 16.3.3) |
| Public routes `/`, `/ydg`, `/tracks`, `/about`, `/how-ydg-works`, `/schools`, `/mobile-amusement`, `/contact`, `/parents` | HTTP 200 |
| `/attractions`, `/events`, `/visit` | 307 → `/mobile-amusement` |
| `/gallery` | 307 → `/` |
| `/admin`, `/admin/bookings`, unknown route | HTTP 404 |
| One `h1` per public route | Pass |
| Canonical and Open Graph on `/tracks` | Present (title, description, url, site_name, type) |
| Security headers on `/` | `X-Content-Type-Options: nosniff`; `Referrer-Policy: strict-origin-when-cross-origin`; `Permissions-Policy` camera/microphone/geolocation/payment/usb/interest-cohort disabled; `X-Frame-Options: DENY`; `X-Powered-By` absent |
| Mobile navigation at 390×844 | Open menu expands; drawer links present |
| Horizontal overflow at 390px on `/contact` | `scrollWidth = clientWidth = 390` |
| Enquiry demonstration | Demo notice and “Show demonstration result” present; nothing submitted |
| Consent bands after family audience | Ages 10–17 (consent + assent) and 18–25 (legal consent + acknowledgement) present |
| `/parents` safeguarding wording | 10–17 / 18–25, media optional, identity-reuse, emergency/publication limits preserved |
| IGNITE, FDG, Launch, `ImagePlaceholder`, `under18-label` | None in app, components or config |

---

## Rollback considerations

1. Restore `package.json` and `package-lock.json` to the pre-4A.1 versions (`next@16.1.6`, `eslint-config-next@16.1.6`).
2. Run a clean install from that lockfile.
3. Repeat lint, type-check, production build and the public-route checks.

Rollback would **re-expose** the critical Next.js advisories and must not be used to start 4B.

---

## Whether Milestone 4B may safely begin

**The Next.js critical framework baseline is no longer the 16.1.6 line.** On that specific 4A.1 gate, authentication work is no longer blocked by the Windows RCE and AVIF RCE advisories.

4B still must not start until:

- Product/safeguarding owners accept 4A architecture
- An authentication provider decision and session/secrets review are recorded
- Remaining 4B gates in `MVP_IMPLEMENTATION_ROADMAP.md` are closed (no minor PII; `/admin` stays 404 until RBAC is proven)

Remaining transitive audit findings do not block 4B, and they are not claimed resolved.

---

## Confirmation of excluded work

No authentication, API, database, storage, dashboard, onboarding or tracking features were added.  
No environment, schema, migration or deployment files were changed.  
`npm audit fix` was not run.  
No Git commit, push, merge, branch or pull-request commands were run.
