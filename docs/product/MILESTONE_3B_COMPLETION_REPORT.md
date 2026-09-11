# Milestone 3B — final report

**Project:** Mecellino Haven / Youth Discovery Gateway  
**Milestone:** 3B — public journey and communication synchronization, plus correction pass  
**Repository:** this repository

---

## Scope completed

Milestone 3B aligned the public site with the Milestone 3A product specifications and then completed a narrow correction pass. Preserved work includes young-person entry paths, track recruitment messaging, consent-band enquiry language, onward CTAs, mentor communication, footer terminology, placeholder removal, route-specific SEO metadata, and the existing Mecellino visual system.

Programme rules remain unchanged:

- YDG ages 10–25
- Education stage and age treated separately
- Consent bands 10–17 (guardian consent + participant assent) and 18–25 (own consent + acknowledgement)
- Media consent separate and optional
- Recruitment and application intake closed
- Enquiry is demonstration only
- No Launch terminology
- No IGNITE or FDG
- No employment, placement or impact guarantees
- Mentoring and facilitation described as planned
- Honest, route-specific SEO metadata

This pass did not redesign the interface and did not begin backend, authentication, database, API, storage or dashboard development.

---

## Files changed

| Area | Paths |
|------|-------|
| Pages | `app/(site)/page.tsx`, `about/page.tsx`, `ydg/page.tsx`, `how-ydg-works/page.tsx`, `tracks/page.tsx`, `schools/page.tsx`, `mobile-amusement/page.tsx`, `contact/page.tsx`, `parents/page.tsx` |
| Layout | `app/layout.tsx` |
| Components | `components/ydg/EnquiryForm.tsx`, `components/ydg/index.tsx` |
| Config | `config/routes.ts` |
| Styles | `app/globals.css` |
| Metadata helper | `lib/public-metadata.ts` |
| Environment example | `.env.example` |
| This report | `docs/product/MILESTONE_3B_COMPLETION_REPORT.md` |
| Local screenshot artefacts (gitignored) | `docs/milestone-3b-screenshots/` |

---

## Corrections made

1. **Mobile screenshot clipping.** The live interface at 390 CSS pixels does not overflow. Previous mobile PNGs were 390×844 device-pixel crops of a larger bitmap, which removed the right edge (including the menu button and wrapped words). Capture now uses an explicit 390×844 CSS viewport and device scale factor 1, with no post-capture crop or resize. No CSS layout change was required.

2. **Obsolete consent selector.** In `app/globals.css`, `#under18-label` was replaced with `#consent-band-label` to match the enquiry radiogroup. Accessible grouping (`role="radiogroup"`, `aria-labelledby="consent-band-label"`) and consent language are unchanged.

3. **Production site URL example.** `.env.example` documents `NEXT_PUBLIC_SITE_URL` as a production deployment requirement, using the non-production placeholder `https://your-production-domain.example`. No `.env.local` or deployment configuration was modified.

4. **Metadata absolute URLs.** `app/layout.tsx` sets `metadataBase` from `NEXT_PUBLIC_SITE_URL` when present. Route helpers still emit relative canonical and Open Graph paths. With the placeholder supplied at build time, `/tracks` rendered:
   - canonical: `https://your-production-domain.example/tracks`
   - `og:url`: `https://your-production-domain.example/tracks`  
   No Mecellino production domain was invented or hard-coded.

5. **This report.** Replaced the previous milestone write-up with this clean final report.

---

## Mobile overflow measurements

Viewport: 390×844 CSS pixels, device scale factor 1, production server.

| Route | scrollWidth | clientWidth | overflow | clipped elements |
|-------|-------------|-------------|----------|------------------|
| `/` | 390 | 390 | no | 0 |
| `/ydg` | 390 | 390 | no | 0 |
| `/tracks` | 390 | 390 | no | 0 |
| `/about` | 390 | 390 | no | 0 |
| `/how-ydg-works` | 390 | 390 | no | 0 |
| `/schools` | 390 | 390 | no | 0 |
| `/mobile-amusement` | 390 | 390 | no | 0 |
| `/contact` | 390 | 390 | no | 0 |
| `/parents` | 390 | 390 | no | 0 |

Live browser confirmation on `/ydg` and `/contact` at the same viewport: headings, paragraphs, links, cards, buttons and form fields remain inside the viewport. The menu button is fully visible.

---

## Screenshot regeneration details

- Source: current production build at `http://localhost:3000`
- Method: Playwright, explicit viewport 390×844, device scale factor 1 (not an iPhone device preset)
- No browser zoom, no post-capture crop, no resize
- Output files are 390×844 pixels
- Desktop screenshots were not clipped and were not regenerated

Regenerated mobile screenshots:

- `docs/milestone-3b-screenshots/ydg-mobile.png`
- `docs/milestone-3b-screenshots/tracks-mobile.png`
- `docs/milestone-3b-screenshots/about-mobile.png`
- `docs/milestone-3b-screenshots/how-ydg-works-mobile.png`
- `docs/milestone-3b-screenshots/schools-mobile.png`
- `docs/milestone-3b-screenshots/mobile-amusement-mobile.png`
- `docs/milestone-3b-screenshots/contact-mobile.png`

---

## Validation commands and results

| Command or check | Result |
|------------------|--------|
| `npm run lint` | Pass |
| `npm exec tsc -- --noEmit` | Pass |
| `npm run build` with `NEXT_PUBLIC_SITE_URL=https://your-production-domain.example` | Pass |
| Public routes `/`, `/ydg`, `/tracks`, `/about`, `/how-ydg-works`, `/schools`, `/mobile-amusement`, `/contact`, `/parents` | HTTP 200 |
| `/attractions`, `/events`, `/visit` | 307 → `/mobile-amusement` |
| `/gallery` | 307 → `/` |
| `/admin`, `/admin/bookings`, unknown route | HTTP 404 |
| Heading hierarchy (nine public routes) | Exactly one `h1` each |
| Security headers on `/` | `X-Content-Type-Options: nosniff`; `Referrer-Policy: strict-origin-when-cross-origin`; `Permissions-Policy` camera/microphone/geolocation/payment/usb/interest-cohort disabled; `X-Frame-Options: DENY`; `X-Powered-By` absent |
| Terminology | No `under18-label`, IGNITE, FDG, Launch, Complaints footer label, or `ImagePlaceholder` in app/components/config |
| Mobile overflow | All nine public routes 390 = 390, no overflow |
| Mobile screenshots | Seven files regenerated at 390×844, unclipped |

---

## Remaining limitations

- Operational safeguarding concern channel remains a policy decision
- Live intake has not replaced the demonstration enquiry
- Per-route hero assets and approved Open Graph images remain uncommissioned
- `NEXT_PUBLIC_SITE_URL` must be set to the verified production origin before go-live; the example value is a placeholder only
- Screenshot and overflow scripts are local review artefacts and remain gitignored

---

## Confirmation of excluded work

No backend, authentication, database, API, storage or dashboard work was started.  
`package.json` and project dependencies were not installed or updated.  
No git commit, push, branch, merge or pull-request commands were run.
