# Milestone 4C — AdultRelationship and ConsentRecord architecture

**Status:** Design only. **4C is not complete.**\
**Age policy:** Eligible ages are **13–25** at the official cohort start date. Consent bands are **13–17** and **18–25**. Youth aged **10–12 are not eligible**.\
**Does not:** create or apply migrations, connect to Supabase, implement APIs or UI, enable `link_adult_relationship`, collect personal data, or mount the dormant consent component.

Cross-reference: `MVP_DOMAIN_AND_EVENT_MODEL.md`, `MVP_SECURITY_PRIVACY_AND_SAFEGUARDING_BOUNDARIES.md`, `R2_CONSENT_SAFEGUARDING_AND_PRIVACY.md`, `HOSTED_AUTHENTICATION_CONTROLS_DECISION.md`, `MVP_IMPLEMENTATION_ROADMAP.md`, synthetic rules in `lib/consent/`.

---

## Scope of this document

This records the authorised **physical-design shape** for AdultRelationship, ConsentRecord, the responsible-adult exception workflow, security placement and retention classes.

It does **not** authorise a migration, database application, live collection, registration or onboarding. `link_adult_relationship` remains in `ALWAYS_DENIED_ACTIONS`. The Safeguarding Lead is modelled as a **role**, not as the founder’s personal identity. The demonstration enquiry form remains unchanged and non-persistent.

Logical identifiers (`participant_person_id`, `adult_person_id`) are design handles. No Person, consent or relationship table is created in this pass.

---

## 1. AdultRelationship design

Separate from `RoleAssignment` (D3). A parent role grant does not create a child link. An AdultRelationship of kind `parent` does not grant programme-operations powers.

**Confirmed owner policy (not Ghana-qualified legal approval):** whenever a `parent` or `legal_guardian` protected role is granted, a matching verified and **active** AdultRelationship of that kind must exist. This is especially important for minors. The two facts remain distinct: the role answers what the account may do; the relationship answers which Person is linked to which participant. Persistence of this invariant remains blocked until the relationship schema, RLS and `link_adult_relationship` enablement gates close.

### Fields

| Field | Purpose |
|-------|---------|
| `id` | Opaque relationship identifier |
| `participant_person_id` | Participant Person |
| `adult_person_id` | Linked adult Person; must not equal the participant |
| `kind` | `parent` \| `legal_guardian` \| `approved_responsible_adult` — intentionally distinct |
| `status` | Lifecycle below |
| `exception_status` | `not_applicable` for parent and legal guardian; ARA uses `exception_pending` \| `exception_approved` \| `refused` |
| `exception_id` | Required for ARA; opaque reference to the restricted exception header. Null for parent and legal guardian |
| `accessibility_accommodation_id` | Optional opaque reference when identity or telephone reuse is independently verified. Null on the normal path |
| `effective_from` | When the relationship may be used |
| `effective_until` | Optional scheduled end |
| `review_at` | Required for `parent`, `legal_guardian` and ARA. Parent and legal-guardian relationships are reviewed annually and whenever relevant circumstances change |
| `created_at` | Insert time |
| `created_by_account_id` | Server-validated account that created the row |
| `created_by_role` | Protected role at creation |
| `approved_by_account_id` | Required when status becomes `active` for ARA; must hold `safeguarding_lead` at approval time |
| `approved_by_role` | `safeguarding_lead` for ARA; not applicable for ordinary parent / legal-guardian activation |
| `superseded_by_relationship_id` | Set when replaced |
| `revoked_at` / `revoked_by_account_id` / `revocation_reason_code` | Closed code only — never a case narrative |

Do **not** store safeguarding case narratives, third-party reports, medical detail, or sensitive exception reasons on this record.

### Kind rules

- `parent` and `legal_guardian` remain distinct protected roles and distinct relationship kinds (D1). That role decision is already resolved.
- Parent or legal guardian may be selected only with `exception_status = not_applicable` and `exception_id` null.
- A `parent` or `legal_guardian` RoleAssignment is valid only while a matching verified `active` AdultRelationship of that kind exists.
- `review_at` is required for parent, legal-guardian and ARA relationships. Parent and legal-guardian reviews run at least annually and whenever relevant circumstances change. Changed circumstances can revoke or supersede; they do not silently keep eligibility.
- `approved_responsible_adult` is eligible only with `exception_status = exception_approved`, a linked `exception_id`, and current required instruments. Pending, unknown and refused stay ineligible.
- ARA cannot be `active` for a participant while a parent or legal-guardian relationship is also `active` for that participant, unless the earlier relationship is revoked or superseded first.

### Status lifecycle

`proposed` → `pending_review` → `active` → `superseded` \| `revoked`\
`pending_review` → `refused` (ARA path)

| Status | Meaning |
|--------|---------|
| `proposed` | Draft link; not usable for instruments |
| `pending_review` | ARA path awaiting Safeguarding Lead decision |
| `active` | May be referenced by a ConsentRecord where an adult acts |
| `superseded` | Replaced by `superseded_by_relationship_id`; retained |
| `revoked` | Ended without replacement; retained |
| `refused` | ARA exception refused; retained |

Revocation and supersession do not delete history. A later link is a new row.

### Identity and telephone reuse

Fail closed.

- `adult_person_id` must not equal `participant_person_id`.
- Shared identity or telephone is permitted only when `accessibility_accommodation_id` points to an independently verified accommodation linked to both Persons.
- Non-boolean or missing reuse state is denied. Unverified accommodation is denied.
- Accommodation **detail** (health, disability narrative) is not stored here.

### Audit requirements

Every create, approve, refuse, revoke, supersede and identity-reuse accommodation write produces an append-only audit event (`RelationshipEstablished`, `RelationshipEnded`, `ConsentExceptionApproved` / refusal equivalent, `IdentityReuseAccommodationRecorded`). Actor, object id, timestamp and a non-reversible summary are required. These events must not be written as auth `event_class` values on `private.auth_audit_events`.

---

## 2. ConsentRecord design

Each instrument is its own record. Media is optional and separate. Adult acknowledgement never overrides 18–25 legal consent or withdrawal. Another adult cannot record, alter or withdraw an adult participant’s legal consent.

### Fields

| Field | Purpose |
|-------|---------|
| `id` | Opaque record identifier |
| `participant_person_id` | Participant |
| `consent_band` | `13_17` \| `18_25` |
| `instrument_kind` | `programme_consent` \| `participant_assent` \| `participant_legal_consent` \| `adult_acknowledgement` \| `media` \| `first_aid` \| `supervised_trips` \| `transport` \| `code_of_conduct` |
| `instrument_text_version` | Version identifier of the text shown; not free-text legal copy in the row |
| `status` | `requested` \| `granted` \| `withdrawn` \| `expired` \| `refused` |
| `actor_person_id` | Who recorded the current status |
| `actor_role` | Protected role at recording time |
| `recording_method` | Closed method code (hosted session, in-person digitised, or other approved method). Unapproved methods fail closed |
| `recorded_at` | When this row became the current instrument state |
| `withdrawn_at` | Set when status is `withdrawn` |
| `superseded_at` | Set when a later version supersedes this row |
| `expires_at` | Optional; expiry is not a substitute for withdrawal |
| `relationship_id` | Required when an adult acts (programme consent, adult acknowledgement, or adult-recorded media for 13–17). Null when the participant records assent, 18–25 legal consent, or their own media |
| `supersedes_record_id` | Previous row of the same participant + band + kind |

Do **not** persist `exception_pending` or `exception_approved` as ConsentRecord statuses. Those belong on AdultRelationship / the exception header. Synthetic 4C-V vocabulary may still list them; the physical consent row must not double as the exception workflow.

### Who may act

| Instrument | Band | Actor |
|------------|------|-------|
| Programme consent | 13–17 | Linked `parent` or `legal_guardian`, or SL-approved ARA |
| Participant assent | 13–17 | Participant only |
| Participant legal consent | 18–25 | Participant only |
| Adult acknowledgement | 18–25 | Linked parent, legal guardian or ARA — eligibility only, never a veto |
| Media | 13–17 | Linked adult; optional |
| Media | 18–25 | Participant; optional |
| First aid, trips, transport (when used), code of conduct | Reserved onboarding | Same adult/participant split as required instruments |

Withdrawal of a required non-media instrument ends eligibility for the current episode. It does not erase this row. A new version is a **new** ConsentRecord. Re-entry does not revive a withdrawn participation episode.

### Optional media

Media has no effect on programme eligibility. Refusal or withdrawal starts the approved restriction/removal workflow for photo, audio or video only. Media withdrawal does not void programme, assent, legal-consent or acknowledgement history. Withdrawal of a required instrument voids **current** media for eligibility-adjacent use; historical media rows are retained.

### Immutable history

- Insert-only application writes for new states. Do not mutate actor, band, kind, text version, `recorded_at` or `supersedes_record_id` after insert.
- Allowed later updates are limited to setting `withdrawn_at` / `superseded_at` / `expires_at` and the matching status, each audited.
- No application delete. Retention deletion, if ever approved, is a separate legal process, not a staff action.
- Current instrument = latest non-superseded, non-withdrawn, non-expired, `granted` row for that participant + band + kind.

---

## 3. Responsible-adult exception workflow

Only the Safeguarding Lead role may approve or refuse. Do not publish a public Safeguarding Lead contact. Do not use the demonstration enquiry form as this channel.

Professional ten-step process:

1. **Restricted referral.** A named, authorised referrer or operations actor submits through a restricted path — not a public form.
2. **No sensitive explanation in general enquiry.** General enquiry and the demonstration form must not collect why a parent cannot act, case facts, or health detail.
3. **Safeguarding Lead review.** The `safeguarding_lead` role reviews. Occupancy of that role (currently the founder) is a RoleAssignment fact, not a column of personal identity on the exception.
4. **Identity, relationship, suitability and independence verification.** Confirm the adult’s identity, the claimed relationship, suitability for the programme context, and independence from conflicting interests.
5. **Conflict and shared-contact checks.** Fail closed on identity or telephone reuse unless an independently verified accessibility accommodation is already recorded against both Persons.
6. **Recorded approval or refusal.** Decision is stored on the restricted exception header (`exception_approved` or `refused`) with actor role, account, timestamp and a closed reason **code**. Narrative stays out of AdultRelationship and out of ConsentRecord.
7. **Approval before participation.** ARA is ineligible until `exception_approved` and the relationship is `active`. No `enrolled` or `active` episode on this path beforehand.
8. **Separate participant consent or assent.** Exception approval does not replace 13–17 programme consent, 13–17 assent, or 18–25 legal consent.
9. **Review on changed circumstances.** ARA `review_at` requires a new review when identity, household, contact details or suitability change. Parent and legal-guardian relationships use the same change trigger **and** an annual review. Changed circumstances can revoke or supersede; they do not silently keep eligibility.
10. **Restricted, auditable access.** Exception headers and any later case narrative are not readable by general administrators, mentors, facilitators, partners, parents who are not the linked adult, or the public.

Exception **header** (same private schema, still not created in this pass): identifier, relationship id, status, referred-by, reviewed-by role `safeguarding_lead`, decided-at, closed reason code. Sensitive notes, if they exist later, belong in the segregated safeguarding case store (4I), not on this header.

---

## 4. Security design

Proposed placement matches the existing auth foundation. **No table in this document is authorised to be created yet.**

| Control | Design |
|---------|--------|
| Schema | `private` only. Not `public`. Not `booking_inquiries`. |
| RLS | `ENABLE ROW LEVEL SECURITY` and `FORCE ROW LEVEL SECURITY` on every relationship, consent, exception-header, accommodation and consent-audit table |
| Grants | `REVOKE ALL` from `public`, `anon` and `authenticated`. `GRANT` only to `service_role` for the server-owned operations that later survive review |
| Database access | Service-role from the trusted server only. No browser service-role. No `NEXT_PUBLIC_*` secret |
| Privileged actions | Server `authorize()` only. Every future consent/relationship privileged action **must enter authorization fail-closed**. New action names remain in `ALWAYS_DENIED_ACTIONS`, or an equivalently restrictive safeguard, until their exact role policy, server boundary, RLS, audit behaviour and migration have passed independent review. Proposed names (not added in this pass): record/withdraw instrument, link/revoke relationship, approve/refuse ARA, record identity-reuse accommodation |
| `link_adult_relationship` | Remains **always denied**, including for Safeguarding Lead, until a separately authorised migration, RLS review, D2 production apply, D4 enablement review and D5 hosted-auth gates exist |
| Client access | Deny by default. No PostgREST policy for `anon` or `authenticated` on these tables |
| Audit history | Append-only consent/relationship audit, **separate** from `private.auth_audit_events` (auth event classes stay auth-only) |
| Case segregation | No case narrative, concern body or break-glass case columns. Case read/write/break-glass stay always denied. Admin does not inherit case access |
| Who cannot read | General administrator, mentor, facilitator, institutional partner, public, and unassigned referrers |
| Identity / phone reuse | Fail closed unless independently verified accommodation is linked |

Hosted authentication remains disabled. Local environment files do not prove production identity or remote RLS.

---

## 5. Retention

Named classes only. Do not invent final periods for consent, relationship, safeguarding or programme records.

| Class | Scope | Period |
|-------|-------|--------|
| Abandoned enquiry / incomplete draft | Future live enquiry or incomplete draft only — **not** the current demonstration form, which stores nothing | **Proposed 14 days**, pending legal confirmation. Must not be applied to formal consent, relationship, safeguarding or programme records |
| Consent and relationship records | ConsentRecord, AdultRelationship, instrument versions, withdrawals, supersessions | **Unresolved** legal/privacy decision |
| Safeguarding exception details | Restricted exception notes and any later case-linked narrative | **Separate restricted class**; unresolved period; SL-owned; not mixed into programme retention |
| Audit history | Consent/relationship privileged log | **Unresolved** legal/privacy decision; not shorter than the records it explains once a period is set |

Withdrawal does not erase consent, relationship or audit history.

---

## 6. Decision and implementation gates

### Approved design decisions

- R2 architecture is formally accepted. Roadmap status: **Accepted specification** (`MVP_IMPLEMENTATION_ROADMAP.md`). R2 remains documentation and architecture only; that acceptance does not authorise migrations, live collection, recruitment, onboarding, personal-data processing or closure of Gate M.
- `parent` and `legal_guardian` are distinct protected roles and relationship kinds.
- AdultRelationship **schema design** is authorised (this document).
- The founder currently fulfils the Safeguarding Lead **role**; model the role, not personal identity.
- Youth aged 10–12 are not currently eligible for YDG.
- The demonstration enquiry form remains unchanged and non-persistent.
- Synthetic 4C-V eligibility remains the tested policy surface until persistence is separately approved.
- Adult legal consent cannot be overridden by acknowledgement or by another adult.
- No scoring, ranking or automated placement.
- No public Safeguarding Lead contact.
- Whenever a `parent` or `legal_guardian` protected role is granted, a matching verified and **active** AdultRelationship of that kind is required, especially for minors. Owner/Safeguarding Owner policy; not Ghana-qualified legal approval.
- Parent and legal-guardian `review_at` is required. Those relationships are reviewed annually and whenever relevant circumstances change.

### Provisional owner decisions

- The founder will perform the **initial owner review**. That review is an owner decision, not Ghana-qualified legal approval.
- Fourteen days is only a **proposed** retention period for abandoned enquiries or incomplete drafts.

### Legal / privacy decisions still required

- Ghana-qualified review before **live collection**, unless the founder is appropriately qualified. The initial owner review does not satisfy this gate.
- Lawful basis and privacy notice for Ghana operations.
- Final retention periods for consent/relationship records and for audit history.
- Legal review of instrument text versions.
- Data-residency / cross-border transfer for any hosted store holding PII.

### Safeguarding Owner decisions still required

- Youth aged 10–12 remain outside YDG eligibility, recruitment, consent and participant-facing programme bands.
- Closed reason-code vocabulary for ARA decisions (codes only; no sensitive narrative in the general record).
- 3A P4 concern channel, volunteer screening and the 4I case store remain out of 4C.

### Conditions blocking migrations

Do not draft, commit, apply or connect a consent/relationship migration until all of the following are true:

1. Independently reviewed SQL for AdultRelationship, ConsentRecord, exception header, accommodation reference and append-only consent audit.
2. D2 parent-role alignment applied to the **identified** Mecellino Haven Production project and verified (local SQL is not production apply).
3. FORCE RLS and revoke/grant metadata verified on that project (no row contents).
4. Explicit owner authorisation to **apply** a migration (schema design here is not that authorisation).
5. Hosted-project identity proven; Truth Smart Tips and any other organisation project remain out of scope.

This document does not satisfy those conditions.

### Conditions blocking live collection

- Ghana-qualified legal/privacy review (or confirmed equivalent qualification of the founder).
- Instrument text approved.
- Retention periods set for the classes that will actually be stored.
- D5 hosted-authentication enablement gates closed.
- Gate M closed before any 13–17 personal data.
- `link_adult_relationship` still denied until the reviewed relationship write path exists.
- Dormant `OnboardingConsentFoundation` remains unmounted.
- Demonstration enquiry remains non-persistent and is not consent capture.

### Ages 10–12

- Youth aged 10–12 are **not currently eligible** for Youth Discovery Gateway.
- They must not appear in active YDG recruitment, eligibility, consent or participant-facing programme bands.
- Gate M still applies before any 13–17 personal data.
- No 10–12 PII, family UI or live instruments.

---

## Explicit non-goals for this pass

- No new or modified SQL migrations.
- No Supabase connection or remote apply.
- No API routes, server actions or UI.
- No change to `ALWAYS_DENIED_ACTIONS` or authorization behaviour.
- No personal-information collection or storage.
- No mounting of the dormant consent component.
- No dependency install, commit or push.
