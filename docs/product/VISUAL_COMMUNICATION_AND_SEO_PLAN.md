# Visual communication and SEO plan — public site

**Milestone 3A — specification only.** Defines visual concepts, accessibility, performance, and SEO intent for all nine public routes. **No images are sourced, generated, or implemented in this milestone.**

## Global design system (current baseline)

- **Palette:** Near-black backgrounds (`globals.css` dark tokens), cyan accent highlights, gold/navy focus rings.
- **Typography:** Source Serif 4 (headings), Libre Franklin (body), IBM Plex Mono (labels/code).
- **Components:** `PageHero`, `PathCard`, `Notice`, `BoundaryBlock`, pill CTAs — dark “playful professional” tone.
- **Logo:** `public/brand/mecellino-haven-logo.svg` with raster companion `public/brand/mecellino-haven-logo.png`; compact monogram `public/brand/mecellino-haven-mark.svg` / `.png`. Use with documented alt text. Confirmed source: `public/brand/source/Mecellino-Haven-new-LOGO.pdf`.

### Global media policy

| Rule | Requirement |
|------|-------------|
| Minors in photography | No identifiable images of minors without confirmed rights and appropriate media consent |
| Provenance | Commissioned, licensed, or purpose-created assets with documented provenance only |
| Invented evidence | Do not depict fabricated participants, delivered activities, or impact statistics |
| Readability | Background images never reduce text readability — overlays and solid fallbacks required |
| Animation | Optional, restrained, functional; respect `prefers-reduced-motion` |
| Placeholders | Replace all `ImagePlaceholder` instances only after approval sign-off in this document |

### Global decorative-image accessibility (implementation rule)

When visual assets are implemented in a later milestone:

- Decorative `<img>` elements must use `alt=""`.
- Decorative icons and non-informative visual containers must use `aria-hidden="true"` where appropriate.
- CSS background images must not introduce content unavailable to assistive technology.
- Informative images must have meaningful alternative text.
- Do not apply `aria-hidden="true"` to a parent containing focusable or meaningful content.

Every route section below references this rule wherever decorative visuals are proposed.

### Global SEO baseline

| Element | Current | Proposed enhancement (post-approval) |
|---------|---------|--------------------------------------|
| Title template | `%s \| Mecellino Haven` | Keep |
| Default description | Root layout description | Keep; ensure route overrides stay honest about demo/blocked features |
| Open Graph | Not route-specific today | Per-route OG concepts below — implement with `openGraph` metadata |
| Internal linking | Header/footer + in-page CTAs | Close gaps on `/how-ydg-works` and `/about` (content milestone) |

---

## Audience × visual tone matrix

Visual tone should reinforce journey intent without stereotyping education stage by age.

| Audience | Visual tone | Primary routes |
|----------|-------------|----------------|
| Young people 10–17 | Energetic, clear, non-school-institutional; diverse Ghanaian youth in **non-identifiable** illustration | `/`, `/ydg`, `/how-ydg-works`, `/tracks` |
| Young adults 18–25 | Forward-looking, practical; young adults in group learning/workshop **illustration** | `/tracks`, `/ydg`, `/how-ydg-works` |
| Parents/guardians/ARA | Calm, trust-forward; adults with young people at respectful distance — **illustration preferred** | `/parents`, `/` safety band |
| Schools/referrers | Professional, structured; school/community settings in Ghana — **diagram + illustration** | `/schools` |
| Mentors/facilitators | Collaborative, safeguarding-aware; adult facilitators with groups — **illustration** | `/schools` |
| Programme/safeguarding staff | Reference-only public pages; no internal dashboards on web | `/about`, `/parents` |

---

## Route 1: `/` (Homepage)

### Visual concept

**“Two front doors, one trusted organisation.”** Split visual language: left pathway YDG (structured discovery), right pathway mobile amusement (community energy) — unified by Mecellino Haven brand strip.

### Media type

- **Hero:** Composite hero — **illustration** (not photograph of real minors) showing Ghanaian community event atmosphere with abstract stand shapes and diverse silhouettes.
- **Section bands:** Iconography for safety (shield + people), schools (building outline), enquiry (speech bubble) — **icons**, not photos.
- **No** full-bleed photographic background behind body copy.

### Must communicate

- Ghana-based organisation serving children, young people, and families.
- Two distinct offerings (YDG programme vs mobile stand).
- Safety and consent are central — not an afterthought.

### Ghanaian context

- Clothing, landscape hints (e.g. warm palette, tropical light), and venue types recognisable in Ghana (school field, community ground, corporate courtyard) without naming specific venues.
- Diverse representation across age, gender, and region — avoid single-tribe signalling unless programme policy defines intentional focus.

### Informative vs decorative

| Element | Role |
|---------|------|
| Hero illustration | **Informative** — encodes dual pathway |
| Pathway icons | **Informative** |
| Decorative blobs | **Decorative only** — must not carry sole meaning |

### Decorative accessibility

- Decorative blobs: if implemented as `<img>`, use `alt=""`; if CSS-only, ensure no information is lost to assistive technology (global rule).
- Informative hero illustration and pathway icons: meaningful alt text; do not mark informative icons `aria-hidden`.

### Alt text approach

- Hero: “Illustration: community event in Ghana with a mobile amusement stand and a separate youth programme group, showing two ways to engage with Mecellino Haven.”
- Icons: functional labels matching visible heading text (avoid redundant “icon of”).

### Text overlay and contrast

- Hero text on **solid gradient scrim** minimum 60% opacity dark overlay; WCAG AA contrast for headings and lede.
- No text directly on busy illustration areas.

### Mobile cropping and focal point

- Focal point: centre-left (YDG pathway figure group); amusement stand secondary right.
- Crop: 16:9 desktop → 4:5 mobile — keep both pathway motifs in frame or switch to **stacked static illustration** below `md` breakpoint.

### Responsive sizing

| Breakpoint | Hero width | Max height |
|------------|------------|------------|
| Mobile | 100vw | 50vh |
| Tablet | 100vw | 45vh |
| Desktop | 1280px container | 520px |

Use `srcset` 640w / 1024w / 1440w WebP + JPEG fallback.

### Loading priority

- Hero: `priority` / `fetchpriority="high"` — LCP candidate.
- Below-fold icons: lazy load.

### Animation

- Subtle **pathway card hover** elevation only (CSS).
- Optional hero: gentle parallax on illustration layer (5–8px) — **disabled** under `prefers-reduced-motion`.

### Reduced-motion fallback

Static hero; no parallax; instant hover states.

### SEO

| Field | Proposed value |
|-------|----------------|
| Title | Home \| Mecellino Haven |
| Description | Mecellino Haven works with children, young people and families in Ghana through mobile amusement and the Youth Discovery Gateway programme. |
| Internal linking | Hub to all major routes; primary SEO entry for brand + YDG + amusement queries |

### Open Graph image concept

1200×630 dark canvas; logo top-left; split illustration (amusement + YDG); text: “Mobile amusement & Youth Discovery Gateway · Ghana”.

**Approval required:** hero illustration brief, OG composite.

---

## Route 2: `/about`

### Visual concept

**“Governance and honesty.”** Editorial, restrained — leadership credibility without campaign polish.

### Media type

- **No hero photograph of individuals** at launch without separate media consent per leader.
- **Iconography:** governance (scale/outline), reporting (document outline), recruitment status (closed gate icon).
- Optional **diagram:** selection model flow (interest → assessment → placement) — monochrome line art.

### Must communicate

- Registered organisation seriousness; pilot context; recruitment closed; no inflated claims.

### Ghanaian context

- Abstract Accra/regional skyline silhouette at 8% opacity in footer band only — decorative.

### Informative vs decorative

Diagram informative; skyline decorative.

### Decorative accessibility

- Skyline silhouette (decorative): CSS background only — no text or meaning conveyed solely through the background; if ever rendered as `<img>`, use `alt=""` and `aria-hidden="true"` on a non-interactive wrapper (global rule).

### Alt text

Diagram: describe steps in selection model matching on-page text.

### Overlay/contrast

Diagram on solid `#0`–`#1` card surface — no image behind text.

### Mobile cropping

Diagram stacks vertically; readable without horizontal scroll.

### Responsive sizing

Diagram max-width 100%; SVG preferred.

### Loading priority

Low — text-first page.

### Animation

Optional step reveal on scroll for diagram — **static list** under reduced motion.

### SEO

| Field | Proposed value |
|-------|----------------|
| Title | About \| Mecellino Haven |
| Description | About Mecellino Haven and Youth Discovery Gateway — governance, pilot scope, and recruitment status. |
| Internal linking | Credibility anchor; link out to `/ydg`, `/parents` (post content pass) |

### OG image concept

Logo + “About Mecellino Haven” + subtle Ghana outline — no headshots until approved.

**Approval required:** selection diagram accuracy with programme ops.

---

## Route 3: `/ydg`

### Visual concept

**“Discovery gateway — ages 10–25, tracks not labels.”** Forward motion through UNFOLD without classroom clichés.

### Media type

- **Hero:** **Illustration** — diverse young people moving through arch/gateway motif (abstract UNFOLD nod).
- **Path cards:** **Icons** per audience (person, guardian, school).
- **UNFOLD preview:** **Diagram** — seven-phase horizontal stepper.

### Must communicate

- Programme for evidence-building and direction — not employment guarantee.
- Multiple audiences enter here.

### Ghanaian context

- Illustration dress and settings culturally grounded; avoid US/UK school visual tropes (lockers, yellow buses).

### Informative vs decorative

UNFOLD diagram **informative**; gateway illustration **informative**.

### Decorative accessibility

- No decorative-only `<img>` proposed on this route. If ornamental elements are added later, apply the global decorative-image rule.

### Alt text

Diagram: list all seven canonical UNFOLD stages — Play, Discover, Explore, Experience, Prepare, Execute, Mentor — matching on-page copy.

### Overlay/contrast

Hero scrim as homepage; path cards solid surfaces.

### Mobile cropping

UNFOLD diagram → vertical stepper on mobile with same reading order.

### Responsive sizing

Diagram SVG; hero same sizing rules as homepage.

### Loading priority

Hero high; diagram lazy.

### Animation

Optional UNFOLD step highlight on scroll — show all steps statically when reduced motion.

### SEO

| Field | Proposed value |
|-------|----------------|
| Title | Youth Discovery Gateway \| Mecellino Haven |
| Description | Youth Discovery Gateway helps young people aged 10–25 build evidence about interests, strengths and possible directions. |
| Internal linking | Primary programme landing; routes to `/how-ydg-works`, `/tracks`, audience paths |

### OG image concept

Gateway illustration + “Youth Discovery Gateway (YDG)” + age range 10–25.

**Approval required:** UNFOLD diagram naming alignment with `/how-ydg-works`.

---

## Route 4: `/how-ydg-works`

### Visual concept

**“Method made visible.”** UNFOLD + five-day cycle as scannable structure.

### Media type

- **No photographic hero.**
- **Primary:** **Diagram** — UNFOLD seven phases + nested five-day cycle wheel or table.
- **Secondary:** **Icons** for each weekday theme.

### Must communicate

- At least five working days per cohort cycle.
- Facilitation in groups with authorised adults.

### Ghanaian context

- Weekday icons use neutral symbology; facilitator illustration shows adult with small group outdoors.

### Informative vs decorative

Entire visual system **informative**.

### Decorative accessibility

- No decorative-only media proposed; UNFOLD and weekday visuals are informative. Apply the global rule if non-informative ornament is added later.

### Alt text

Long-desc `<details>` or appendix link for complex diagram — short alt summarises structure and names all seven UNFOLD stages (Play through Mentor).

### Overlay/contrast

Diagram labels on solid cards; minimum 4.5:1.

### Mobile cropping

Two diagrams stack; weekday icons in 2×3 grid.

### Responsive sizing

SVG with `viewBox`; font-size clamp for labels.

### Loading priority

Medium — likely landing from `/ydg`.

### Animation

Optional phased reveal of UNFOLD steps (200ms stagger) — instant full diagram if reduced motion.

### SEO

| Field | Proposed value |
|-------|----------------|
| Title | How YDG works \| Mecellino Haven |
| Description | UNFOLD is the seven-stage method behind Youth Discovery Gateway. Each cohort cycle runs at least five working days. |
| Internal linking | Method reference from `/ydg`, `/tracks`; needs outbound CTAs (content gap) |

### OG image concept

UNFOLD step diagram on dark background — readable at thumbnail size.

**Approval required:** diagram simplification for OG legibility.

---

## Route 5: `/tracks`

### Visual concept

**“Four tracks, one cohort rule.”** Age bands as parallel paths, not hierarchy of worth.

### Media type

- **Illustration strip:** four track colours/icons (10–13, 14–15, 16–17, 18–25).
- **Diagram:** cohort first-day age rule timeline.
- **No** photos of children in track cards.

### Must communicate

- Age counted on cohort first day.
- Education stage is **not** depicted on track cards — optional future callout icon “stage recorded at intake”.

### Ghanaian context

- Track illustrations use Ghanaian youth fashion diversity; 18–25 track shows young adults not in school uniforms only.

### Informative vs decorative

Timeline **informative**; track mascots/icons **informative** if paired with text labels.

### Decorative accessibility

- No decorative-only `<img>` proposed. Informative track icons must not use `aria-hidden`.

### Alt text

Per track card: “Track 14–15 Foundation — ages 14 to 15 on cohort first day.”

### Overlay/contrast

Track cards solid; no background photos.

### Mobile cropping

Four cards → 1-column stack; timeline full width.

### Responsive sizing

Icons 48px mobile / 64px desktop.

### Loading priority

Lazy — text-led.

### Animation

Optional track card expand on focus for screen readers only — no motion required.

### SEO

| Field | Proposed value |
|-------|----------------|
| Title | The four tracks \| Mecellino Haven |
| Description | Four age-based YDG tracks — Discovery Gateway, Foundation, Direction, and Execution & Progression. |
| Internal linking | Target “YDG ages”, track names; link from `/ydg` and future young-person paths |

### OG image concept

Four colour-coded track bands with cohort-day calendar icon.

**Approval required:** track naming vs public marketing names.

---

## Route 6: `/parents`

### Visual concept

**“Trust, clarity, no false promises.”** Calm safeguarding editorial — parents feel safe reading, not sold to.

### Media type

- **No hero image of children.**
- **Icons:** consent document, supervision (two adults), emergency (generic alert — not alarmist).
- Optional **diagram:** consent band flow 10–17 vs 18–25.

### Must communicate

- Consent before participation; supervision rules; no guarantee of place; emergency services for immediate danger.

### Ghanaian context

- Illustration of parent/guardian with teenager in conversation — **illustrated**, side-by-side not surveillance framing.

### Informative vs decorative

Consent diagram **informative**; calm header gradient **decorative** with strong scrim if used.

### Decorative accessibility

- Calm header gradient (decorative): CSS background only — must not carry sole meaning; if paired with `<img>`, use `alt=""`. Do not wrap consent diagram or emergency copy in `aria-hidden` parents (global rule).

### Alt text

Emergency section: no imagery that implies org hotline exists.

### Overlay/contrast

Maximum readability — parents page is text-critical; prefer **no background image**.

### Mobile cropping

N/A — text first.

### Responsive sizing

Diagram stacks; FAQ accordion native.

### Loading priority

Low.

### Animation

None recommended except focus rings.

### SEO

| Field | Proposed value |
|-------|----------------|
| Title | Parents, safety & safeguarding \| Mecellino Haven |
| Description | Safeguarding and consent information for parents and guardians. Operational reporting routes are not open on the public website. |
| Internal linking | Safety hub from footer, homepage, `/ydg`; complaints pointer destination |

### OG image concept

Shield + “Safety & safeguarding” — no child faces.

**Approval required:** consent diagram legal alignment.

---

## Route 7: `/schools`

### Visual concept

**“Three ways to work with us.”** Institutional partner clarity.

### Media type

- **Diagram:** three relationship types (nomination, partnership, sponsored visit).
- **Illustration:** school/community setting with facilitator and small group — backs to camera or stylised faces.
- **Icons** for mentor/facilitator screening path.

### Must communicate

- Referral ≠ automatic placement.
- Conduct and safeguarding alignment required.

### Ghanaian context

- School architecture hints (block buildings, assembly ground) without naming institutions.

### Informative vs decorative

Relationship diagram **informative**.

### Decorative accessibility

- No decorative-only `<img>` proposed. Screening-path icons are informative when paired with visible labels.

### Alt text

Match three relationship titles on page.

### Overlay/contrast

Solid card backgrounds for diagram nodes.

### Mobile cropping

Diagram vertical flow top-to-bottom.

### Responsive sizing

SVG relationship map.

### Loading priority

Medium for referrer landing.

### Animation

Optional highlight of relationship type on hover — static under reduced motion.

### SEO

| Field | Proposed value |
|-------|----------------|
| Title | Schools & partners \| Mecellino Haven |
| Description | How schools, sponsors, mentors and facilitators engage with Mecellino Haven and Youth Discovery Gateway. |
| Internal linking | Referrer entry; ties to `/contact` demo segments |

### OG image concept

Three-node partnership diagram + “Schools & partners”.

**Approval required:** mentor vs facilitator visual distinction.

---

## Route 8: `/mobile-amusement`

### Visual concept

**“Comes to you — no permanent park.”** Temporary stand, community energy, honest empty state.

### Media type

- **Hero:** **Approved photograph** OR **illustration** of stand in setup (current `ImagePlaceholder` specifies photograph brief).
- **Empty state:** **Icon** (calendar with dash) for no events — not fake event posters.
- **No** fake crowd photos.

### Must communicate

- Mobile/temporary; no memberships; no events listed when none confirmed; children remain adult’s responsibility.

### Ghanaian context

- Stand design colours compatible with brand; Ghanaian community event setting.

### Informative vs decorative

Setup photo/illustration **informative** if approved; empty state icon **informative**.

### Decorative accessibility

- Optional string-light blink (decorative only): CSS or non-interactive SVG with `aria-hidden="true"`; must not use `<img>` with missing alt — if `<img>`, use `alt=""`. Disabled under reduced motion.

### Alt text

Approved asset: “Temporary Mecellino Haven amusement stand being set up at a community event in Ghana.”
Placeholder until approved: keep explicit “illustration pending approval” in alt — not “photo of children playing”.

### Overlay/contrast

If hero photo used: 70% dark scrim on text side; on mobile move text below image (no overlay on photo).

### Mobile cropping

Focal point: stand structure centre; avoid cropping out safety barriers if visible.

### Responsive sizing

Hero 3:2 aspect; card image 4:3 max 400px height.

### Loading priority

Hero medium — not global LCP unless landing route.

### Animation

None on hero; optional subtle string-light blink on stand **decorative only**, disabled reduced motion.

### SEO

| Field | Proposed value |
|-------|----------------|
| Title | Mobile amusement \| Mecellino Haven |
| Description | Temporary mobile amusement stands at selected community, school, corporate and public events in Ghana — no permanent park. |
| Internal linking | Amusement pathway from `/`; cross-link `/ydg`; event enquiry demo |

### OG image concept

Stand illustration at event + “Mobile amusement · Ghana”.

**Approval required:** replace `ImagePlaceholder` — **highest priority asset gap** on public site.

---

## Route 9: `/contact`

### Visual concept

**“Demonstration only — honest UX preview.”** Form-forward; visuals must not imply messages are delivered.

### Media type

- **No hero image.**
- **Icon:** demo badge / preview ribbon near form.
- Optional **illustration:** envelope with dashed line (not sent) — light humour, clear meaning.

### Must communicate

- Form is not connected; demonstration acknowledgement required.

### Ghanaian context

- Minimal — form is universal; phone field hint supports local formats without flag icons implying single carrier.

### Informative vs decorative

Demo badge **informative**; envelope illustration **informative**.

### Decorative accessibility

- No decorative-only `<img>` proposed. Demo badge and envelope convey operational meaning — meaningful alt text required; do not use `aria-hidden` on the form region.

### Alt text

“Demonstration form — messages are not sent.”

### Overlay/contrast

Form on solid surface; error states high contrast (existing `.bad` styling).

### Mobile cropping

Single column form; sticky demo notice top.

### Responsive sizing

Full-width inputs mobile; max 640px form column desktop.

### Loading priority

Low — no large media.

### Animation

No submit spinner implying network — local success state only (current behaviour).

### SEO

| Field | Proposed value |
|-------|----------------|
| Title | Enquiry preview \| Mecellino Haven |
| Description | Design preview of the programme enquiry form. Nothing entered is transmitted on the public website. |
| Internal linking | Terminal for demo CTAs; `noindex` **not** recommended — transparency helps set expectations |

### OG image concept

Form wireframe + prominent “Preview only” banner.

**Approval required:** demo wording in OG to prevent social mis-sharing as live contact.

---

## Cross-route performance budget

| Metric | Target |
|--------|--------|
| LCP | ≤ 2.5s on 4G — homepage hero only `priority` |
| CLS | ≤ 0.1 — explicit width/height on all images |
| Total image weight per route | ≤ 300KB excluding homepage hero (≤ 180KB WebP hero) |
| Font | Already self-hosted via `next/font` — keep |

---

## Implementation gate checklist (post-3A)

- [ ] Safeguarding Lead approves minor depiction policy
- [ ] Comms approves each route OG concept
- [ ] Programme ops approves UNFOLD/tracks diagrams
- [ ] Legal/policy approves consent diagram on `/parents`
- [ ] Asset provenance log created before any photograph published
- [ ] `prefers-reduced-motion` tested on animated routes
- [ ] Mobile crop review on real devices for homepage and `/mobile-amusement`

---

## Related documents

- `PUBLIC_JOURNEY_MAP.md` — audience needs per route
- `MILESTONE_3A_DECISIONS.md` — unresolved visual approvals (P8, F9)
- `CONTENT_AND_CTA_INVENTORY.md` — CTA and content gaps affecting SEO landing quality
