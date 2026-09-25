# MVP security, privacy and safeguarding boundaries

**Milestone 4A — specification only.** Extends `MVP_ROLE_AND_JOURNEY_BOUNDARIES.md` with canonical consent, least-privilege access, audit and retention. No implementation.

Public-site limits remain: no live organisational reporting channel; emergency services for immediate danger (`/parents`, `PHASE1_LIMITATIONS.md`).

---

## Canonical consent rules

1. **Ages 13–17:** parent or legal guardian gives programme consent **and** the participant gives separate assent. The participant may decline or withdraw assent without penalty.
2. **Ages 18–25:** the participant gives their own legal consent **and** a parent, guardian or approved responsible adult gives a separate acknowledgement/approval as an organisational eligibility condition.
3. **Adult acknowledgement never overrides** an 18–25 participant’s consent or withdrawal.
4. **Alternative responsible adult:** where involving a parent would be impossible, unsafe or inappropriate, the Safeguarding Lead may approve an alternative adult through a **documented exception** before participation, once required safeguarding governance exists. Do not invent a public contact route for this.
5. **Media consent** is a separate, optional instrument. Refusal or withdrawal does not affect place. Withdrawal of media consent starts an approved restriction/removal workflow for photo, audio or video evidence; it does not by itself erase the rest of the programme record.
6. **Identity / telephone reuse:** participant and approver must not share the same identity or phone number unless an independently verified accessibility accommodation is recorded.
7. **Ages 10–12:** not currently eligible for YDG. They must not appear in recruitment, eligibility, consent or participant-facing programme bands (`PHASE1_LIMITATIONS.md`).
8. **No personal information from minors** is collected until the roadmap gates in `MVP_IMPLEMENTATION_ROADMAP.md` are closed.

Required non-media instruments follow the public `/parents` list (taking part, first aid, supervised trips, transport when used, code of conduct).

---

## Authorization check (every server mutation)

Evaluate **all** of the following. Fail closed.

1. Valid server-side session (when the action is not an approved public write).
2. Role claim from **protected** app metadata or a server-owned role table — not editable user metadata.
3. Relationship or assignment scope (linked minor, assigned cohort, assigned case).
4. Resource state (participation, consent instruments, enrolment).
5. Context isolation (programme vs safeguarding casework vs volunteer screening).
6. Audit write for privileged actions.

“Any authenticated user” is not a permission (`PHASE1_LIMITATIONS.md`).

---

## Role-permission matrix (least privilege)

Legend: **Y** allow · **N** deny by default · **L** linked minor or approved relationship only · **A** assigned cohort/participant/case only · **E** documented exception · **M** marker only, no case body · **P** explicit policy grant.

Roles: **Pt** participant · **Gd** parent/legal guardian · **ARA** approved responsible adult · **Rf** school/community referrer · **Mn** mentor · **Fc** facilitator · **Ops** programme operations · **SL** Safeguarding Lead · **CW** restricted caseworker · **Ad** system administrator.

| Capability | Pt | Gd | ARA | Rf | Mn | Fc | Ops | SL | CW | Ad |
|------------|:--:|:--:|:---:|:--:|:--:|:--:|:---:|:--:|:--:|:--:|
| Use public information site | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| Hold an account | P | Y | Y | Y | Y | Y | Y | Y | Y | Y |
| View own participant profile | Y | N | N | N | N | N | N | N | N | N |
| View linked participant (redacted) | N | L | P | N | A | A | Y | N | N | N |
| Submit live enquiry (after gate) | Y | Y | Y | Y | Y | Y | Y | N | N | N |
| Submit referral | N | N | N | Y | N | N | Y | N | N | N |
| Record 13–17 programme consent | N | L | E | N | N | N | N | E | N | N |
| Record 13–17 assent | Y | N | N | N | N | N | N | N | N | N |
| Record 18–25 legal consent | Y | N | N | N | N | N | N | N | N | N |
| Record 18–25 acknowledgement | N | L | L | N | N | N | N | E | N | N |
| Approve alternative responsible adult | N | N | N | N | N | N | N | Y | N | N |
| Record or withdraw media consent | Y | L | P | N | N | N | N | N | N | N |
| Assign track, cohort, UNFOLD stage | N | N | N | N | N | A | Y | N | N | N |
| Record milestones / evidence | Y | N | N | N | A | A | Y | N | N | N |
| Assign mentor / facilitator | N | N | N | N | N | N | Y | N | N | N |
| Record attendance | N | N | N | N | A | A | Y | N | N | N |
| View assigned delivery roster | N | N | N | N | A | A | Y | N | N | N |
| View programme reports | N | N | N | N | N | N | Y | P | N | N |
| Provision users and roles | N | N | N | N | N | N | N | N | N | Y |
| Manage integration secrets | N | N | N | N | N | N | N | N | N | Y |
| See safeguarding restriction **marker** | P | N | N | N | A | A | M | Y | Y | N |
| Open or read safeguarding **case** | N | N | N | N | N | N | N | Y | A | N |
| Write safeguarding case notes | N | N | N | N | N | N | N | Y | A | N |
| Break-glass case access | N | N | N | N | N | N | N | P | N | P |
| Read full audit log | N | N | N | N | N | N | P | P | N | Y |

**System administrators do not automatically receive safeguarding-case access.** Break-glass, if ever allowed, is a time-bounded, dual-controlled, audited grant — not a standing admin privilege.

Parents and ARAs do not read internal case notes. A future family concern channel is a separate submission view, not the case table (3A P4 remains a policy decision).

---

## Safeguarding data segregation

| Store / context | Contents | Default accessors |
|-----------------|----------|-------------------|
| Programme records | Profile, enrolment, attendance, evidence, ordinary notes | Role matrix above |
| Restriction markers | Minimal safety flags only | Ops / assigned delivery as **M** |
| Safeguarding casework | Concern, case, restricted notes, third-party reports, case-context identifiers | SL and assigned CW only |
| Volunteer screening | Checks, interview notes | Ops HR-equivalent and SL as policy |
| Audit | Privileged actions | Ad + policy readers |

Case events must not appear on mentor, facilitator, referrer or general operations dashboards.

---

## Evidence files and upload principles

`EvidenceItem` may later include a file reference. That **does not** authorise unrestricted, user-directed or executable uploads. This section is principle-level only: it does not design a production upload API, schema or storage provider.

File-based programme evidence must not be implemented until all of the following are specified and owner-approved:

| Control | Principle |
|---------|-----------|
| Permitted types | An explicit allow-list only |
| Volume | File-size and count limits per participant, cohort and action |
| Validation | Server-side MIME **and** file-signature checks; client type is not trusted |
| Keys | Storage keys are generated by the server; user-controlled paths are rejected |
| Default visibility | Private storage; no public bucket or guessable URL |
| Access | Short-lived, authorization-checked reads (session + role + participant/cohort scope) |
| Malware | Scan or quarantine before staff access |
| Metadata | Strip embedded metadata where appropriate (for example image EXIF) |
| Forbidden formats | No executable or active-content types |
| Encryption | In transit and at rest |
| Audit | Events for upload, access, replacement and deletion |
| Retention | Deletion and retention rules applied to the file and its reference |
| Isolation | No cross-participant or cross-cohort access |
| Case files | Safeguarding-case files live in the casework store, never beside programme evidence |
| Media | Photo, audio or video require separate, current media consent |
| Withdrawal | Media-consent withdrawal starts an approved restriction/removal workflow |
| Minors | No uploads by or of a person aged 13–17 until Gate M **and** file-handling approval close |

Structured text evidence may proceed in later programme increments without file storage. Mentors and facilitators still write only within assigned scope.

---

## Audit requirements

Always audit: role grant/revoke, consent exception, identity-reuse accommodation, enrolment override, export of personal data, restriction marker changes, case open/assign/close, break-glass, any use of a service-role credential on a server, and — once file evidence exists — upload, access, replacement and deletion of stored objects.

Audit records are append-only. They include actor, action, object, time and a non-reversible summary. They do not replace the case file.

---

## Retention boundaries

Retention periods are **owner and legal decisions** and are not invented here. Implement as labelled classes:

| Class | Examples | Boundary |
|-------|----------|----------|
| Transient pre-intake | Live enquiry before enrolment | Short; delete or anonymise if not progressed |
| Programme record | Enrolment, attendance, evidence | Held for the approved programme retention period |
| Programme evidence files | Authorised file-backed EvidenceItems only | Same class as the linked programme record, plus explicit deletion after media-consent withdrawal or retention expiry |
| Safeguarding case files | Case attachments | Separate store and retention from programme evidence; SL-owned |
| Consent evidence | Instruments, versions, withdrawals | Held at least as long as the participation they authorised |
| Volunteer screening | Checks and notes | Separate HR retention |
| Safeguarding case | Case file | Separate, usually longer; SL-owned |
| Audit | Privileged log | Not shorter than the records it explains |

Public demonstration enquiry stores nothing.

---

## Server, client and secrets

- Authorize on the server only.
- No service-role or admin secret in browser code or `NEXT_PUBLIC_*`.
- Session cookies: httpOnly, secure (after HTTPS), same-site as approved.
- HSTS and a restrictive CSP remain **deployment gates**, not this milestone (`PHASE1_LIMITATIONS.md`).

If Supabase is later approved, apply the six controls in `MVP_TECHNICAL_ARCHITECTURE.md`.
