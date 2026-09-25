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

## Required photography and final visual assets

No licensed photography is in the repository. Public pages currently use original SVG artwork. Commission or licence the following before treating the public site as visually complete. Do not invent partnership, outcome or testimonial imagery.

| Surface | Required asset | Intended concept |
| --- | --- | --- |
| Home hero | Owned wide photograph or commissioned illustration | A sheltered, welcoming gathering place — growth and belonging, not a classroom cliché. |
| Capacity Building | Owned photograph of guided group learning | Facilitated progression and institutional participation (school, workplace or community setting). |
| Youth Discovery Gateway | Owned photograph or commissioned illustration | Discovery, direction, evidence-building and long-term progression. No numeric age-range captions. |
| Lifestyle Coaching | Owned photograph | Wellbeing, confidence and personal growth in an everyday setting. Not clinical or therapy imagery. |
| Events and Entertainment | Owned event photograph | Safe, energetic community experience with visible adult supervision. |
| Amusement | Owned concept still or commissioned illustration | Current mobile amusement through temporary event stands. No permanent park, opening hours, admission passes or fixed venue. |

Deployment environment variables that must be present in the production host (values held outside the repository): `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_PROJECT_REF`, `SUPABASE_DATABASE_URL`, and the lockout pepper names above when hosted authentication is prepared.
