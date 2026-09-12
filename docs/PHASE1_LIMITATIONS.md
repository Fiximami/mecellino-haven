# Phase 1 limitations and pre-recruitment gates

This document records known limitations of the Phase 1 public foundation. It does not authorise enabling admin workflows or live data intake.

## Admin routes

All `/admin/*` routes return **404** unconditionally in this milestone. This is intentional.

Before any admin surface or operational data workflow is enabled:

- **Role-based authorisation** is required — an explicit allowlist or role claim (for example `app_metadata.role === 'admin'`), not merely any authenticated Supabase user.
- **Restrictive Row Level Security** is required on every table that holds operational or safeguarding-related data. The repository `booking_inquiries` baseline now has RLS enabled, revokes `anon` and `authenticated` privileges, and has no public or general-authenticated policies. The table is dormant and must not be used for YDG intake. It must not be treated as a production YDG policy or as a template for participant, guardian, consent or safeguarding data. If an older version of that migration was applied to an external database, that database still requires independent inspection and remediation.

Do not enable admin routes or connect live intake until these controls are designed, reviewed and deployed.

## Enquiry and contact

The public contact form is a **design demonstration**. Nothing entered is transmitted, stored or reviewed. No monitored general or safeguarding contact channel is published in this milestone because none has been product-owner verified for live use.

## Consent and identity safeguard

No participant and approver may use the same identity or telephone number unless this is independently verified through an approved accessibility accommodation. Phase 1 does not implement identity verification or collect additional information for it.

## Safeguarding reporting

Safeguarding programme information is published on `/parents`. **Live reporting routes are not open.** Users are directed to emergency services for immediate danger. Organisation reporting contact details will appear only after appointment of an independent escalation contact, adoption of the safeguarding manual, and verification of monitored channels.

## Ages 10–12

The approved programme age range is **10–25**, with Discovery Gateway at **10–13**. Supervision ratios and operational safeguarding provisions for participants aged **10–12** are not published here. **Age-specific safeguarding approval is required before recruitment of participants aged 10–12.** Live recruitment and application intake remain unavailable.

## Recruitment and applications

Recruitment and live application intake remain closed until safeguarding, privacy and insurance readiness gates are closed — regardless of how ready the public design and content are.

## Response headers, CSP and HSTS

Baseline response headers are set in `next.config.ts` (`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, clickjacking protection, and `X-Powered-By` disabled). **HSTS is not enabled in Phase 1.**

### Content Security Policy (deployment gate)

A full restrictive Content Security Policy must be **finalized against the confirmed production origin and required asset hosts** (fonts, styles, scripts, images, and any future analytics or media hosts). Do not enable a production CSP without testing against the live build and verifying that Next.js rendering and hydration are unaffected.

### HTTP Strict Transport Security (deployment gate)

**HSTS must be enabled only after HTTPS deployment and domain behaviour are confirmed** — including canonical host redirects, certificate validity, and mixed-content checks. Do not add HSTS locally or in staging without that deployment basis.
