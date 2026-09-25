> **Superseded age policy.** Approved YDG eligibility is now **13�25** at the official cohort start date. Consent bands are **13�17** (guardian consent + participant assent) and **18�25** (participant consent + parent/guardian acknowledgement). Youth aged **10�12 are not eligible**. Historical 10�25 / 10�17 / 10�13 / 10�12-in-scope wording below is archival and must not be used as an active source of truth.
# Milestone 3A — completion report

**Project:** Mecellino Haven / Youth Discovery Gateway (YDG)
**Milestone:** 3A — public journey and communication mapping
**Repository:** this repository (`docs/product/`)
**Pass type:** Analysis and specification only

---

## Files created (initial Milestone 3A pass)

All under `docs/product/`:

| File | Purpose |
|------|---------|
| `PUBLIC_JOURNEY_MAP.md` | Six audience journeys across nine public routes (entry, information needs, CTAs, safeguarding, exit, next steps) |
| `CONTENT_AND_CTA_INVENTORY.md` | Route-by-route content and CTA inventory with operational classification |
| `MVP_ROLE_AND_JOURNEY_BOUNDARIES.md` | Eleven future roles; shared event model vs separated safeguarding permissions |
| `MILESTONE_3A_DECISIONS.md` | Recorded decisions, content findings, unresolved product choices, visual approval list |
| `VISUAL_COMMUNICATION_AND_SEO_PLAN.md` | Per-route visual communication and SEO specification (no image implementation) |
| `MILESTONE_3A_COMPLETION_REPORT.md` | This report |

---

## Milestone 3A documentation correction pass

A narrowly scoped correction pass updated **only** files under `docs/product/`.

### Corrections applied

| # | Area | Files | Change |
|---|------|-------|--------|
| 1 | Git-history wording | `MILESTONE_3A_DECISIONS.md`, `MILESTONE_3A_COMPLETION_REPORT.md` | Replaced broad “no git” statements with precise wording: no Git commit, push or branch operation was performed as part of Milestone 3A; the repository already contained previously approved Phase 1 commits before the specification pass began |
| 2 | UNFOLD sequence | `CONTENT_AND_CTA_INVENTORY.md`, `VISUAL_COMMUNICATION_AND_SEO_PLAN.md` | Replaced incorrect Understand/Navigate/Focus/Own/Launch sequence with canonical seven stages: Play, Discover, Explore, Experience, Prepare, Execute, Mentor; removed “Launch” as a programme stage |
| 3 | Local workstation paths | `MILESTONE_3A_COMPLETION_REPORT.md` | Removed drive-letter repository path; replaced with “this repository” |
| 4 | Decorative-image accessibility | `VISUAL_COMMUNICATION_AND_SEO_PLAN.md` | Added global implementation rule (`alt=""`, `aria-hidden`, CSS background constraint, informative alt text, no `aria-hidden` on parents with focusable content); referenced on every route with decorative visuals |
| 5 | Report integrity | `MILESTONE_3A_COMPLETION_REPORT.md` | Documented correction pass and explicit scope confirmations below |

### Correction-pass verification

| Check | Result |
|-------|--------|
| All six `docs/product/` files reviewed | Pass |
| Incorrect UNFOLD terms (Understand, Navigate, Focus, Own) | Removed from `docs/product/` |
| “Launch” as programme stage | Removed from `docs/product/` |
| Drive-letter, Desktop, Downloads, user-profile, localhost paths in `docs/product/` | None found after correction |
| Development-tool attribution or prompt leakage | None found |
| Git status | Untracked `docs/product/` only; nothing staged or committed |

---

## Verification performed (initial pass)

| Check | Outcome |
|-------|---------|
| Nine public routes (`/`, `/about`, `/ydg`, `/how-ydg-works`, `/tracks`, `/parents`, `/mobile-amusement`, `/schools`, `/contact`) | Reviewed |
| Legacy redirects | Documented (`/attractions`, `/events`, `/visit` → `/mobile-amusement`; `/gallery` → `/`) |
| Header/footer/nav CTA targets | Confirmed via `config/routes.ts`, layout components, page CTAs |
| Enquiry demonstration-only | Confirmed — `EnquiryForm` client-only success state; `demoEnquiryNotice` in config |
| Operational gates | Recruitment closed (`/about`); no event listings (`/mobile-amusement`); `/admin` 404 (`proxy.ts`) |
| Terminology search (IGNITE, FDG, deprecated naming, guarantees) | No FDG/IGNITE on public routes; anti-guarantee copy present |
| UNFOLD canonical sequence | Play → Discover → Explore → Experience → Prepare → Execute → Mentor (documented in correction pass) |
| Age/consent consistency | Programme 10–25 and bands 10–17 / 18–25 consistent; minor wording gaps recorded (F1, F2) |

---

## Key findings (initial pass — unchanged)

1. **Dual offering is clear** — YDG programme and mobile amusement are separated across homepage, `/ydg`, and `/mobile-amusement`.
2. **Safeguarding information is strong on `/parents`** but there is **no live organisational reporting or complaints workflow** on the public web; footer “Complaints” links to informational content only.
3. **Young people 10–17 lack a dedicated public entry path** — “A young person” on `/ydg` routes to `/how-ydg-works` without age/stage split (F4).
4. **Mentors/facilitators** are served only via `/schools` and `/contact` — no dedicated route (D8).
5. **Content dead-ends** — `/how-ydg-works` and `/about` have no in-page outbound CTAs (F5, F6).
6. **`/tracks` lede** references “register interest” while recruitment is closed elsewhere — needs explicit gate on page (F3).
7. **Enquiry form** uses “under 18?” rather than programme consent bands 10–17 / 18–25 (F2).
8. **`/mobile-amusement`** retains `ImagePlaceholder` — highest-priority visual approval gap (F9).
9. **No severe factual or safety defect** requiring emergency public code change — findings recorded in decisions doc only.

---

## Unresolved product decisions (summary)

See `MILESTONE_3A_DECISIONS.md` for full list. Priority items:

- Harmonise supervision vs consent age wording (P2)
- Young-person public entry strategy (P1)
- Recruitment-closed banner on `/tracks` (P6)
- Safeguarding concern channel definition — **do not invent** (P4)
- Footer “Complaints” label vs expectations (P5)
- Per-route Open Graph and hero asset approval (P8, visual plan checklist)
- Mentor vs facilitator public distinction (F8)
- Approved responsible adult journey (F7)

---

## Visual communication and SEO

Full specification: `VISUAL_COMMUNICATION_AND_SEO_PLAN.md`.

- Nine route-specific visual concepts defined (no generic placeholders in proposed experience).
- Ghanaian context, minor depiction policy, alt text, contrast, cropping, performance, animation, and OG concepts documented.
- Global decorative-image accessibility rule added in correction pass.
- **No images sourced, generated, or implemented** in Milestone 3A or the correction pass.
- Approvals tracked in `MILESTONE_3A_DECISIONS.md` and visual plan implementation gate.

---

## Scope confirmation

### Initial Milestone 3A pass

| Item | Changed? |
|------|----------|
| Public application source code | **No** |
| Backend services / APIs | **No** |
| Database / migrations | **No** |
| Authentication | **No** |
| Personal-data collection (production) | **No** |
| Dependencies | **No** |
| Git operations in Milestone 3A | No Git commit, push or branch operation was performed as part of Milestone 3A. The repository already contained the previously approved and user-created Phase 1 commits before this specification pass began. |

### Documentation correction pass

| Item | Changed? |
|------|----------|
| Files modified | `docs/product/` only (five files) |
| Public application source code | **No** |
| Asset generated or sourced | **No** |
| Git commit, push or branch | **No** — no Git operation was performed during this correction pass |
| Backend, API, authentication or database implementation | **Did not begin** |
| Files staged or committed | **No** |

---

## Recommended next milestone (informational only)

1. Content pass: close CTA gaps on `/how-ydg-works`, `/about`, `/tracks` recruitment gate.
2. Visual asset commission per approved briefs — start with `/mobile-amusement` placeholder replacement.
3. Authenticated role implementation per `MVP_ROLE_AND_JOURNEY_BOUNDARIES.md` when programme ops approves intake opening.

---

*End of Milestone 3A completion report.*
