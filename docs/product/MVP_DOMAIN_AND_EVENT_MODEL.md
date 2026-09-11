# MVP domain and event model

**Milestone 4A — technology-neutral specification.** No schemas, migrations or persistence are created here.

Cross-reference: roles in `MVP_ROLE_AND_JOURNEY_BOUNDARIES.md`; architecture in `MVP_TECHNICAL_ARCHITECTURE.md`; consent and access in `MVP_SECURITY_PRIVACY_AND_SAFEGUARDING_BOUNDARIES.md`.

---

## Modelling rules

- Age, education stage, track, cohort, UNFOLD stage, evidence, assignments, consent and participation status are **separate**.
- Not every participant begins at Play or in Discovery Gateway. Entry point is recorded, not assumed.
- Mobile amusement enquiries are a different offering from YDG enrolment. They may share an enquiry envelope with a type flag.
- Finishing a track or UNFOLD stage does not create a right to the next one.
- No employment, admission, placement, income or impact outcome is stored as a promised result.

---

## Canonical entities

### Identity and role assignment

| Entity | Meaning |
|--------|---------|
| **Person** | Human identity used across programme, volunteer and adult-approver records |
| **Account** | Optional login bound to one Person. Minors may participate without an Account |
| **RoleAssignment** | Server-owned grant: role, scope, start/end, grantor. Never taken from editable profile fields |

A Person may hold more than one role over time (for example adult participant, later screened mentor). Concurrent conflicting roles require explicit policy, not implicit inheritance.

### Participant profile

| Field group | Notes |
|-------------|-------|
| Linked Person | Required |
| Age at cohort start | Date-derived; not a substitute for education stage |
| Education stage | `upper_primary` \| `jhs` \| `shs` \| `tertiary` \| `other` |
| Participation status | See vocabulary below |
| Current track and cohort | Optional until enrolment |
| Current UNFOLD stage | Assigned; may differ from track typical stage |
| Entry path | Enquiry, referral, family, school, amusement, other |

### Guardian and responsible-adult relationship

| Entity | Meaning |
|--------|---------|
| **AdultRelationship** | Person ↔ Participant with type `legal_guardian` \| `parent` \| `approved_responsible_adult` |
| Authority | Consent, acknowledgement, collection, emergency — granted per type, not as a bundle |
| Approval | ARA requires documented approval; Safeguarding Lead may approve an alternative adult via exception |

Guardian visibility does not automatically transfer to an ARA.

### Consent, assent and acknowledgement

Each instrument is its own **ConsentRecord**:

| Instrument | Who records | Required for participation |
|------------|-------------|----------------------------|
| Programme consent (10–17) | Parent or legal guardian, or approved alternative adult | Yes |
| Participant assent (10–17) | Participant | Yes |
| Participant legal consent (18–25) | Participant | Yes |
| Adult acknowledgement (18–25) | Parent, guardian or approved responsible adult | Yes (eligibility condition) |
| Media | Separate, optional | No |
| First aid / emergency care | Per `/parents` public model | Yes |
| Supervised group trips | Per `/parents` | Yes |
| Transport | Per `/parents` | Yes when used |
| Code of conduct | Per `/parents` | Yes |

Records carry band, version of the text shown, timestamp, actor, method, and withdrawal state. Adult acknowledgement **never** overrides 18–25 consent or withdrawal.

**Identity safeguard:** participant and approver must not share the same identity or telephone number unless an independently verified accessibility accommodation is linked to both Persons.

### Referral

School or community nomination of a Person or prospective participant. Does not create enrolment and does not replace consent. Education stage may be supplied by the referrer and remains independent of age.

### Enquiry

Pre-intake message with audience type (family, school, help-applying, sponsor, mentor/facilitator, amusement event). Live persistence is out of scope until the enquiry milestone and privacy gate. The current public form must not be treated as this entity.

### Cohort and enrolment

| Entity | Meaning |
|--------|---------|
| **Cohort** | Named delivery window, location/area when approved, intended track |
| **Enrolment** | Participant in a Cohort with track assignment and start/end |

A participant who reaches the next track’s age during a cohort may finish that cohort. A participant who turns 26 may finish the active cohort and cannot begin another standard participant cohort (public `/tracks` rule).

### Track assignment

Explicit Enrolment attribute. Age-eligible tracks:

- Discovery Gateway — 10–13
- Foundation — 14–15
- Direction — 16–17
- Execution & Progression — 18–25

Track is not inferred from education stage.

### UNFOLD progression

Current stage on the participant or enrolment: Play → Discover → Explore → Experience → Prepare → Execute → Mentor.

Stage changes are events. A later-track entrant may start at Explore, Experience or Prepare when that entry is recorded. The Mentor stage as “giving back” is not automatic and, for alumni 26+, is a screened volunteer path — not a participant entitlement.

### Milestones and evidence

| Entity | Meaning |
|--------|---------|
| **Milestone** | Named checkpoint (discovery profile, plan, portfolio item) |
| **EvidenceItem** | Structured observation, staff note, or a later **file reference** linked to a milestone |

Evidence informs discussion. It is not an aptitude score, ranked list or displayed total.

**EvidenceItem does not imply unrestricted uploads.** Most early evidence can be text or structured fields. A file-backed item is only a reference to an authorised object, never a user-chosen path or an open upload slot.

Before any file-based evidence is implemented, the principle-level controls in `MVP_SECURITY_PRIVACY_AND_SAFEGUARDING_BOUNDARIES.md` and the file-handling approval on the roadmap must be closed. This document does not define an upload API, schema or storage provider.

| File-backed evidence rule | Requirement |
|---------------------------|-------------|
| Scope | Programme evidence only; **safeguarding-case files are a separate store** |
| Access | Bound to the owning participant and cohort; no cross-participant or cross-cohort read |
| Media | Photo, audio or video require separate, current media consent |
| Withdrawal | `MediaConsentWithdrawn` starts an approved restriction/removal workflow; it does not delete programme history silently |
| Minors | No file from a person aged 10–17 until Gate M **and** file-handling approval close |

Lifecycle events (when file evidence exists): `EvidenceAttached`, `EvidenceAccessed`, `EvidenceReplaced`, `EvidenceDeleted`.

### Mentor and facilitator assignment

| Entity | Meaning |
|--------|---------|
| **VolunteerRecord** | Screening/training status — separate from participant profile APIs |
| **DeliveryAssignment** | Mentor or facilitator ↔ cohort or participant, with dates |

Screening notes are not visible to participants, families or referrers.

### Attendance

Session occurrence plus presence/absence for assigned participants. Mentors and facilitators write only for assigned sessions.

### Reports

Derived views (enrolment by cohort, track and age band; attendance; girls’ enrolment commitment reporting). Reports consume programme facts, not safeguarding case bodies.

### Safeguarding restriction marker

A **minimal operational flag** (for example “do not release to named person”, “do not assign named adult”) that programme operations may need in order to run a session safely.

The marker is not the case. Case narrative, third-party reports and child identifiers in case context live only in the safeguarding casework context.

### Audit events

Append-only **AuditEvent**: actor, action, object type/id, timestamp, previous/new summary, source IP/session id when available. Privileged actions always produce one.

---

## Participation and consent vocabularies

**Participation status:** `prospect` → `referred` → `consent_pending` → `enrolled` → `active` \| `paused` \| `withdrawn` \| `completed` \| `deferred`.

**Consent record status:** `requested` \| `granted` \| `withdrawn` \| `expired` \| `exception_pending` \| `exception_approved` \| `refused`.

Withdrawal of required programme consent or 18–25 legal consent stops participation. Refusal of media consent does not.

---

## Event catalogue

Shared programme events (safe to project into ordinary dashboards):

| Event | Typical emitters |
|-------|------------------|
| `EnquiryCreated` | Enquiry service (when live) |
| `ReferralSubmitted` | Referrer, operations |
| `RelationshipEstablished` / `RelationshipEnded` | Consent/relationship |
| `ConsentRecorded` / `ConsentWithdrawn` / `AssentRecorded` | Consent/relationship |
| `AcknowledgementRecorded` | Consent/relationship |
| `MediaConsentRecorded` / `MediaConsentWithdrawn` | Consent/relationship |
| `IdentityReuseAccommodationRecorded` | Safeguarding Lead / operations under policy |
| `CohortOpened` / `EnrolmentCreated` / `TrackAssigned` | Operations |
| `UnfoldStageChanged` | Operations, facilitator (assigned) |
| `MilestoneRecorded` / `EvidenceAttached` / `EvidenceAccessed` / `EvidenceReplaced` / `EvidenceDeleted` | Operations, facilitator (assigned); file evidence only after approval |
| `DeliveryAssigned` / `AttendanceRecorded` | Operations, mentor, facilitator |
| `WithdrawalRequested` / `WithdrawalConfirmed` | Participant, guardian, operations |
| `RestrictionMarkerSet` / `RestrictionMarkerCleared` | Safeguarding Lead (marker only) |

Safeguarding case events (**must not** fan out to facilitator, mentor, referrer or general operations dashboards):

| Event | Typical emitters |
|-------|------------------|
| `ConcernReceived` | Approved concern channel (not the demo enquiry form) |
| `CaseOpened` / `CaseAssigned` / `CaseNoteAdded` / `CaseClosed` | Safeguarding Lead, restricted caseworker |
| `ConsentExceptionApproved` | Safeguarding Lead |
| `BreakGlassUsed` | Named privileged actor |

---

## Shared versus isolated journeys

Reuse the shared event backbone for intake interest → consent → enrolment → delivery → withdrawal, as already scoped in `MVP_ROLE_AND_JOURNEY_BOUNDARIES.md`.

Keep isolated: safeguarding casework, volunteer screening files, system-administration secrets, and break-glass reviews.
