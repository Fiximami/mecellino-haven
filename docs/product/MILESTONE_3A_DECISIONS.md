> **Superseded age policy.** Approved YDG eligibility is now **13�25** at the official cohort start date. Consent bands are **13�17** (guardian consent + participant assent) and **18�25** (participant consent + parent/guardian acknowledgement). Youth aged **10�12 are not eligible**. Historical 10�25 / 10�17 / 10�13 / 10�12-in-scope wording below is archival and must not be used as an active source of truth.
# Milestone 3A decisions and unresolved items

**Date context:** September 2026 analysis pass.
**Scope:** Public journey and communication mapping only — no implementation.

---

## Decisions recorded in 3A

### D1 — Nine-route public IA confirmed

The public information architecture remains nine routes plus legacy redirects. No new public routes added in 3A.

### D2 — Enquiry stays demonstration-only until a later milestone

All “Enquiry preview” CTAs map to `/contact` with client-side-only `EnquiryForm`. No transmission, storage, or email. Product must not imply messages reach staff.

### D3 — Recruitment closed remains visible

`/about` and programme facts state recruitment closed. Future “register interest” language on `/tracks` and form hints is **future tense** — must stay paired with closed recruitment until intake milestone explicitly opens.

### D4 — Age, education stage, and track stay separate in future data model

Public copy uses age-based tracks only. Future authenticated intake must capture education stage independently. Journey map and role boundaries document this rule.

### D5 — Safeguarding Lead named without public contact route

Consent exception references Safeguarding Lead role without phone, email, or form. Operational channel definition deferred — do not invent in content passes.

### D6 — No organisational safeguarding reporting on public web

Families are directed to emergency services for immediate danger. Org concern/complaints workflow is not live on the site. Footer “Complaints” → `/parents` is informational only.

### D7 — Admin remains operationally blocked

`/admin/*` returns 404 via proxy. Visible gate until authenticated admin milestone.

### D8 — Mentors/facilitators use schools + contact paths for MVP public phase

No dedicated `/mentors` route for public phase. Content lives under `/schools` and enquiry audience option.

### D9 — Visual assets are spec-only in 3A

All route imagery concepts documented in `VISUAL_COMMUNICATION_AND_SEO_PLAN.md`. No sourcing, generation, or implementation in this milestone.

### D10 — No invented operational facts

Contact details, partnerships, programme dates, venues, escalation channels, application opening dates, automated placement, employment guarantees, and national-scale reporting were not added in 3A documentation or code.

---

## Content findings (not fixed in 3A)

Record only — no source changes unless severe safety defect (none identified at severity requiring code fix).

### F1 — Supervision vs consent age wording (minor)

| Location | Wording |
|----------|---------|
| `/parents` supervision | “under-18s” |
| `/parents` consent | “ages 10–17” minor band |

Both can be true (supervision applies to all minors under 18; consent band starts at 10). **Unresolved:** Align public copy for family clarity without conflating programme minimum age (10) with general child law framing.

### F2 — Enquiry form “under 18?” vs consent bands

Form uses binary under-18 for guardian fields. Site consent model uses 10–17 minor band and 18–25 adult participant band. A user aged 18–25 selecting “family” may see under-18 question — logically consistent but **does not teach** the 10–17 / 18–25 bands.

**Unresolved:** Whether live form should use programme consent bands instead of under-18 binary.

### F3 — `/tracks` “register interest” lede

References registering interest on cohort first day rule. Intake not live. **Decision:** Keep but ensure all entry points show recruitment closed (currently via `/about` and demo notice — not on `/tracks` itself).

**Unresolved:** Add explicit recruitment-closed callout on `/tracks`.

### F4 — `/ydg` “A young person” path (10–25 undifferentiated)

Single card routes to `/how-ydg-works` without age/stage split.

**Unresolved:** Add young-person pathway split (10–17 / 18–25) or link to `/tracks` first.

### F5 — `/how-ydg-works` has no outbound CTAs

Page is a content dead-end relative to tracks, parents, and enquiry.

**Unresolved:** Add footer CTAs on page (content change — post-3A).

### F6 — `/about` has no outbound CTAs

Same as F5 for credibility-only visitors.

**Unresolved:** Add contextual links to `/ydg`, `/parents`, `/contact` preview.

### F7 — Approved responsible adult has no dedicated journey

Mentioned in consent copy only.

**Unresolved:** Whether ARA needs distinct public section or authenticated-only workflow.

### F8 — Mentor vs facilitator role distinction

Public site treats both under one schools subsection and one enquiry audience.

**Unresolved:** Separate role definitions for future auth and volunteer screening.

### F9 — `/mobile-amusement` placeholder visuals

Page uses placeholder image treatment. Spec defined in visual plan; assets not approved.

**Unresolved:** Asset commission and provenance sign-off.

### F10 — No severe factual or safety defect requiring emergency code change

Identity safeguard, demo enquiry, emergency services pointer, anti-guarantee copy, and admin 404 verified. **No public source code modified in 3A.**

---

## Unresolved product decisions (prioritised)

| ID | Topic | Options | Recommendation |
|----|-------|---------|----------------|
| P1 | Young person public entry | Dedicated `/young-people` vs enhanced `/ydg` paths | Enhanced `/ydg` + `/tracks` links (lower IA churn) |
| P2 | Consent wording harmonisation | “Under-18” vs “ages 10–17” vs both with gloss | Single glossary box on `/parents` explaining both |
| P3 | Live enquiry cutover | Replace demo vs parallel shadow | Replace with authenticated backend + audit |
| P4 | Safeguarding concern channel | Hosted form vs third-party vs phone-only | Policy decision outside web team — do not invent |
| P5 | Complaints footer label | Rename “Complaints” to “Safeguarding information” | Reduces false expectation of case system |
| P6 | Track page recruitment gate | Banner on `/tracks` | Add when content pass approved |
| P7 | Education stage capture | Optional referrer field vs required at intake | Required at intake; optional on referral |
| P8 | Open Graph images | One global vs per-route | Per-route concepts in visual plan — approve before build |
| P9 | SEO page titles | Route-level metadata vs template only | Add per-route `metadata` exports post-3A |
| P10 | Casework data residency | Separate DB schema vs RLS partition | Separate logical boundary minimum — see role doc |

---

## Visual and SEO approvals pending

See `VISUAL_COMMUNICATION_AND_SEO_PLAN.md` for full per-route spec. Summary of approvals needed before implementation:

| Item | Approval owner (TBD) |
|------|----------------------|
| Ghanaian representation guidelines for all hero/illustration briefs | Programme + comms |
| Minor depiction policy (no identifiable minors without consent) | Safeguarding Lead |
| Photography vs illustration per route | Comms |
| Open Graph image set (9 concepts) | Comms |
| Per-route SEO titles/descriptions | Comms + programme |
| Animation policy (functional only, reduced-motion) | Design + a11y |
| `/mobile-amusement` event imagery style | Comms |

---

## Verification summary (3A)

| Check | Result |
|-------|--------|
| All 9 public routes reviewed | Pass |
| Nav and CTA targets confirmed | Pass |
| IGNITE / FDG misuse (deprecated programme naming) | None found on public routes |
| Age 10–25 consistency | Pass |
| Consent bands documented | Pass (wording nuance F1/F2) |
| Guarantees | Anti-guarantee present; no employment promises |
| Enquiry demo-only | Pass (`EnquiryForm` no backend) |
| Operational gates visible | Pass (recruitment closed, admin 404, no events listed) |
| Application/backend code changed | **No** |
| Dependencies changed | **No** |
| Git operations in Milestone 3A | No Git commit, push or branch operation was performed as part of Milestone 3A. The repository already contained the previously approved and user-created Phase 1 commits before this specification pass began. |

---

## Document index

| File | Purpose |
|------|---------|
| `PUBLIC_JOURNEY_MAP.md` | Six audiences × nine dimensions |
| `CONTENT_AND_CTA_INVENTORY.md` | Route content and CTA classification |
| `MVP_ROLE_AND_JOURNEY_BOUNDARIES.md` | Future roles and permission boundaries |
| `VISUAL_COMMUNICATION_AND_SEO_PLAN.md` | Visual + SEO specification per route |
| `MILESTONE_3A_COMPLETION_REPORT.md` | External completion summary |
