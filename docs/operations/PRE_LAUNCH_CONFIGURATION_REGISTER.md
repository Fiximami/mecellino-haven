# Pre-launch configuration register

Record of names and operational responsibilities only. Do not store credentials, DNS tokens, API keys, peppers or other secrets in this file.

| Item | Configuration names | Responsibility |
| --- | --- | --- |
| Professional public mailbox | `info@mecellinohaven.com` | Create and publish the organisational mailbox as the only public contact address. |
| Forwarding / routing | Unpublished operational Gmail destination | Forward or route `info@mecellinohaven.com` to the operational Gmail account held in organisational custody. Do not publish that Gmail address on the website. |
| Sender authentication | SPF, DKIM, DMARC | Verify SPF, DKIM and DMARC for `mecellinohaven.com` at the DNS host before treating outbound mail as production-ready. |
| Canonical origin | `NEXT_PUBLIC_SITE_URL` | Set the approved HTTPS origin with no trailing slash. Host and `X-Forwarded-Host` are not a substitute. |
| Supabase public client | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (alias `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) | Production project URL and publishable key for the browser client. Public routes remain available if these stay empty. |
| Supabase project identity | `SUPABASE_PROJECT_REF` | Server-only project reference used to bind the database adapter. |
| Supabase database adapter | `SUPABASE_DATABASE_URL` | Server-only pooled PostgreSQL URL. Never prefix with `NEXT_PUBLIC_`. |
| Privileged Supabase credential | `SUPABASE_SERVICE_ROLE_KEY` | Leave unset for ordinary user requests in this milestone. Server-only if ever required. |
| Distributed lockout peppers | `AUTH_LOCKOUT_PEPPER_CURRENT`, `AUTH_LOCKOUT_PEPPER_CURRENT_VERSION`, `AUTH_LOCKOUT_PEPPER_PREVIOUS`, `AUTH_LOCKOUT_PEPPER_PREVIOUS_VERSION` | Server-only lockout HMAC peppers and versions. Supply through operational custody; never expose to the browser. |
| Public contact form | Demonstration `EnquiryForm` on `/contact` | Remains client-side only. No live mail API, inbox ingestion or storage until a monitored channel is approved. |
| Dormant booking table | `booking_inquiries` | Exists in schema. No public write path is enabled. |
| External transactional email | Not configured | No Resend, SendGrid or equivalent integration is live. Configure only after the monitored contact channel is approved. |
| Hosted authentication | HTTPS origin + Auth + database configuration | Remains fail-closed until hosted-authentication readiness gates are closed. |

## Editorial photography currently in the repository

Nine licensed editorial photographs with documented provenance are present under `public/images/editorial/`. The authoritative records are `docs/asset-provenance.md` and `docs/product/IMAGE_PROVENANCE.json`.

These assets are **general editorial imagery**. They are not verified Mecellino participant photographs and must not be described as showing actual Youth Discovery Gateway participants, identifiable families, or confirmed programme delivery.

No participant photography and consent library has yet been approved. Participant images, testimonials and identifiable programme imagery must remain unpublished until the appropriate consent and asset-governance process is approved.

| Surface | Current editorial file | Constraint |
| --- | --- | --- |
| Home hero | `home-hero-guided-learning.jpg` | Editorial only; not a participant photograph |
| Youth Discovery Gateway | `ydg-tracks-collaboration.jpg` | Editorial only; not a participant photograph |
| Individual / How YDG works | `individual-guided-discussion.jpg` | Editorial only; not a participant photograph |
| Capacity Building | `institutional-document-review.jpg` | Editorial only; not a participant photograph |
| Retirement Life Preparedness | `retirement-professional-planning.jpg` | Editorial only; not a participant photograph |
| Lifestyle Coaching | `lifestyle-guided-session.jpg` | Editorial only; not a participant photograph |
| Events and Entertainment | `events-traditional-gathering.jpg` | Editorial only; not a participant photograph |
| Amusement | `amusement-portable-ringtoss.jpg` | Editorial only; temporary event-stand context |
| About | `about-independence-square.jpg` | Civic context; caption must not claim a Mecellino facility |

Deployment environment variables that must be present in the production host (values held outside the repository): `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_PROJECT_REF`, `SUPABASE_DATABASE_URL`, and the lockout pepper names above when hosted authentication is prepared.
