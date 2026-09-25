# Content and CTA inventory — public site

**Milestone 3A.** Inventory of public content, navigation, and calls to action with operational classification.

## CTA classification key

| Class | Meaning |
|-------|---------|
| **Informational** | Navigates to public content; no data submission or account action |
| **Demonstration-only** | UI preview only; no transmission, storage, or backend |
| **Operationally blocked** | Visible gate or dead route (e.g. admin 404, recruitment closed) |
| **Future authenticated** | Copy or UX implies a later logged-in workflow — not implemented |

---

## Global chrome (all routes)

### Site header (`components/layout/SiteHeader.tsx`)

| Label | Target | Class |
|-------|--------|-------|
| Logo / home | `/` | Informational |
| Programme → YDG | `/ydg` | Informational |
| Programme → How YDG works | `/how-ydg-works` | Informational |
| Programme → Tracks | `/tracks` | Informational |
| Families → Parents & safeguarding | `/parents` | Informational |
| Schools & partners | `/schools` | Informational |
| Mobile amusement | `/mobile-amusement` | Informational |
| About | `/about` | Informational |
| Enquiry preview | `/contact` | Demonstration-only |
| Mobile drawer: Safety & Safeguarding | `/parents` | Informational |

### Site footer (`components/layout/SiteFooter.tsx`)

| Label | Target | Class |
|-------|--------|-------|
| Route links (mirror nav) | respective routes | Informational |
| Enquiry preview | `/contact` | Demonstration-only |
| Complaints | `/parents` | Informational (not a complaints system) |
| Demo notice | inline text from `demoEnquiryNotice` | Operationally blocked context |

### Root metadata (`app/layout.tsx`)

| Element | Content | Class |
|---------|---------|-------|
| Default title | Mecellino Haven \| Youth Discovery Gateway | SEO (informational) |
| Description | Ghana youth programme + mobile amusement | SEO (informational) |

---

## Route: `/` (Homepage)

**Source:** `app/(site)/page.tsx`, `components/home/HomePageContent.tsx`

### Primary content blocks

| Block | Message |
|-------|---------|
| Hero | Mecellino Haven — mobile amusement + YDG; Ghana context |
| Two pathways | YDG programme vs mobile amusement stand |
| YDG intro | Short UNFOLD teaser |
| Experiences | Amusement + programme cards |
| Safety | Supervision, consent, authorised adults |
| Community | Schools, families, sponsors |
| Enquiry band | Demo enquiry invitation |

### CTAs

| Label | Target | Class |
|-------|--------|-------|
| Explore the Youth Discovery Gateway | `/ydg` | Informational |
| Mobile amusement stand | `/mobile-amusement` | Informational |
| How YDG works | `/how-ydg-works` | Informational |
| Programme tracks | `/tracks` | Informational |
| Safety & safeguarding | `/parents` | Informational |
| For schools & referrers | `/schools` | Informational |
| About Mecellino Haven | `/about` | Informational |
| Enquiry preview (band + implicit header) | `/contact` | Demonstration-only |

### Operational gates visible

- No live booking for amusement events (see `/mobile-amusement`).
- Enquiry is preview only.

---

## Route: `/about`

**Source:** `app/(site)/about/page.tsx`

### Primary content

| Block | Message |
|-------|---------|
| Identity | Mecellino Haven purpose in Ghana |
| Leadership | Named roles (public identity safeguard) |
| Girls 70% commitment | Programme equity intent — not a quota guarantee |
| Selection model | Merit/context; not a place guarantee |
| Pilot funding | Foundation pilot context |
| Recruitment | **Closed** — explicit |

### CTAs

| Label | Target | Class |
|-------|--------|-------|
| *(none in page body)* | — | — |

**Gap:** No outbound CTAs to `/ydg`, `/contact`, or `/parents` in page component — users rely on header/footer.

### Gates

- Recruitment closed stated explicitly.

---

## Route: `/ydg`

**Source:** `app/(site)/ydg/page.tsx`

### Primary content

| Block | Message |
|-------|---------|
| Programme intro | YDG purpose, ages 13–25 |
| Who are you? path cards | Young person, parent, school/referrer |
| UNFOLD preview | Four phases summary |
| Tracks summary | Four age bands |
| Skills preview | Money, communication, etc. |
| Enquiry + tracks CTAs | Bottom actions |

### CTAs

| Label | Target | Class |
|-------|--------|-------|
| Path: A young person | `/how-ydg-works` | Informational |
| Path: A parent or guardian | `/parents` | Informational |
| Path: A school or referrer | `/schools` | Informational |
| Enquiry preview | `/contact` | Demonstration-only |
| See programme tracks | `/tracks` | Informational |

### Gates

- Recruitment closed (via site facts / about cross-read).

### Content notes

- “A young person” path does not split 13–17 vs 18–25 or education stage.

---

## Route: `/how-ydg-works`

**Source:** `app/(site)/how-ydg-works/page.tsx`

### Primary content

| Block | Message |
|-------|---------|
| UNFOLD model | Seven canonical stages: Play, Discover, Explore, Experience, Prepare, Execute, Mentor |
| Five-day cycle | Day-by-day structure |
| Facilitation | Group-based, authorised adults |

### CTAs

| Label | Target | Class |
|-------|--------|-------|
| *(no in-page CTAs)* | — | — |

**Gap:** Dead-end for users who arrive without header — no links to `/tracks`, `/parents`, or `/contact`.

---

## Route: `/tracks`

**Source:** `app/(site)/tracks/page.tsx`

### Primary content

| Block | Message |
|-------|---------|
| Lede | Cohort first-day age rule; mentions “register interest” (**future intake language**) |
| Track cards | Developmental stages; eligibility 13–25 |
| Execute phase | Programme completion framing |

### CTAs

| Label | Target | Class |
|-------|--------|-------|
| Enquiry preview | `/contact` | Demonstration-only |

### Gates

- “Register interest” implies **future authenticated** intake — not live; pairs with recruitment closed elsewhere.

---

## Route: `/parents`

**Source:** `app/(site)/parents/page.tsx`

### Primary content

| Block | Message |
|-------|---------|
| Safeguarding overview | Ratios, authorised adults |
| Consent | Ages 13–17 minor band; 18–25 adult band; Safeguarding Lead exception |
| Supervision rules | Including “under-18s” wording |
| Emergency | Emergency services — no org hotline |
| FAQ | Fees, media, disability, school need, selection, withdrawal |
| Not a guarantee | Explicit anti-guarantee list |

### CTAs

| Label | Target | Class |
|-------|--------|-------|
| Enquiry preview (if present in shell) | `/contact` | Demonstration-only |
| Footer complaints | `/parents` | Informational |

### Safeguarding copy inventory

- Consent before participation.
- Two authorised adults for under-18 activities.
- Safeguarding Lead named for consent exception only — **no contact route**.
- No live organisational reporting channel on public web.

### Terminology flag

- Supervision: “under-18s” vs consent: “ages 13–17” — see decisions doc.

---

## Route: `/schools`

**Source:** `app/(site)/schools/page.tsx`

### Primary content

| Block | Message |
|-------|---------|
| Three relationships | Nomination, partnership, sponsored visit |
| Conduct | Behaviour and safeguarding alignment |
| Mentor/facilitator | Screening and training first |

### CTAs

| Label | Target | Class |
|-------|--------|-------|
| Preview enquiry (school) | `/contact` | Demonstration-only |
| Preview enquiry (sponsor) | `/contact` | Demonstration-only |
| Preview enquiry (mentor/facilitator) | `/contact` | Demonstration-only |

---

## Route: `/mobile-amusement`

**Source:** `app/(site)/mobile-amusement/page.tsx`

### Primary content

| Block | Message |
|-------|---------|
| No permanent park | Stand comes to events |
| No events listed | Empty / placeholder state |
| YDG optional | Stand use does not require YDG membership |
| Imagery | Placeholder visuals — spec in visual plan |

### CTAs

| Label | Target | Class |
|-------|--------|-------|
| Event enquiry preview | `/contact` | Demonstration-only |
| Learn about YDG | `/ydg` | Informational |

### Gates

- No event calendar, booking, or dates published.

---

## Route: `/contact`

**Source:** `app/(site)/contact/page.tsx`, `components/ydg/EnquiryForm.tsx`

### Primary content

| Block | Message |
|-------|---------|
| Demo notice | From `demoEnquiryNotice` — no transmission |
| Enquiry form | Audience segmentation, validation, consent checkbox |

### Form audience options → implied journey

| Option | Hint | Class |
|--------|------|-------|
| A young person or family | Joining, cost, safety, dates | Demonstration-only |
| A school | Nomination, partnership, timetable | Demonstration-only |
| I want help applying | Help when intake opens | Demonstration-only + **future authenticated** |
| A company or sponsor | Funding, supervised visit | Demonstration-only |
| A mentor or facilitator | Volunteering, screening first | Demonstration-only |
| An event enquiry | Mobile amusement stand | Demonstration-only |

### Form fields (demo behaviour)

| Field | Purpose | Data handling |
|-------|---------|---------------|
| Audience | Routing preview | Client-only; not sent |
| Name, phone, email | Contact preview | Client-only; not sent |
| Under 18? / Guardian | Safeguarding UX preview | Client-only; “under 18” ≠ consent band 13–17 |
| Message | Free text | Client-only; not sent |
| Demonstration acknowledgement | Required consent to demo | Client-only |

### Submit CTA

| Label | Action | Class |
|-------|--------|-------|
| Send enquiry (label may vary) | Shows success state locally | **Demonstration-only** — no API, no email, no storage |

Post-submit copy confirms demonstration-only.

---

## Route: `/admin/*`

**Source:** `proxy.ts` — returns 404

| Element | Class |
|---------|-------|
| Any `/admin` path | **Operationally blocked** |

---

## Legacy redirects (`next.config.ts`)

| From | To | Class |
|------|-----|-------|
| `/attractions`, `/events`, `/visit` | `/mobile-amusement` | Informational redirect |
| `/gallery` | `/` | Informational redirect |

---

## Contradiction and consistency search (3A verification)

| Topic | Finding | Severity |
|-------|---------|----------|
| Programme name | YDG used consistently; no FDG/IGNITE on public routes | OK |
| UNFOLD sequence | Canonical seven stages (Play → Discover → Explore → Experience → Prepare → Execute → Mentor) match public site copy | OK |
| Age range | 13–25 on programme facts and tracks | OK |
| Consent bands | 13–17 and 18–25 on `/parents` | OK |
| Supervision wording | “under-18s” on `/parents` supervision vs “13–17” consent | Minor inconsistency — product decision |
| Enquiry form | “under 18?” vs consent bands 13–17 / 18–25 | UX modelling gap — product decision |
| Register interest | `/tracks` lede + form hint reference future intake | OK with recruitment closed gates |
| Guarantees | Anti-guarantee copy on `/parents`; no employment promises | OK |
| Enquiry transmission | None — demo only | OK |
| Admin | 404 | OK |
| Partnerships/dates/contacts | Not invented on site | OK |

---

## Duplication matrix

| Content | Locations |
|---------|-----------|
| Safeguarding summary | `/`, `/parents` |
| UNFOLD | `/ydg` (short), `/how-ydg-works` (full) |
| Four tracks | `/ydg`, `/tracks` |
| Recruitment closed | `/about`, hints on `/contact`, programme facts |
| Demo enquiry notice | Footer, `/contact`, config-driven |
| YDG vs amusement | `/`, `/mobile-amusement`, `/ydg` |

---

## Summary counts

| Class | Approx. count (global + repeated per route) |
|-------|---------------------------------------------|
| Informational nav/content links | 40+ (including repeats) |
| Demonstration-only enquiry CTAs | Header, footer, 6+ page bands |
| Operationally blocked | `/admin`, recruitment closed messaging, no event listings |
| Future authenticated (copy-implied) | Register interest, help applying, live intake |
