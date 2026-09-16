# R2 — Experience, phases and implementation sequence

**Milestone:** Reconstruction R2 — accepted specification.\
**Status:** Owner-accepted as the planning and architecture baseline. This acceptance does not authorize production implementation, persistence, recruitment or personal-data collection.\
**Does not implement** authentication screens, dashboards, forms, APIs or migrations.\
**Preserves** the approved public UI. Authenticated surfaces are future work after the gates in this document and `R2_CONSENT_SAFEGUARDING_AND_PRIVACY.md`.

Domain and roles: `R2_YDG_LONGITUDINAL_JOURNEY.md`.

---

## 7. Dashboard information architecture by role

Shared chrome for authenticated users (when built): organisation mark, role label, sign out, link back to the public Capacity Building / YDG pages. No public-nav redesign.

**My Journey** is the participant spine: a visual timeline of UNFOLD stages with the current stage emphasised, completed milestones marked, next actions listed, and transition goals shown as exploratory (never as guaranteed outcomes).

| Role | Primary home | May see | Must not see |
|------|--------------|---------|--------------|
| Participant 10–17 | My Journey | Own stage, assigned activities, own evidence, family-visible items, approved showcases | Other participants’ private work, rankings, cases, staff notes beyond structured reviews written to them |
| Participant 18–25 | My Journey | As above, plus own legal-consent status and adult-acknowledgement status | Same exclusions; guardian tools; other adults’ acknowledgement documents in full |
| Parent / legal guardian | Linked young person (redacted) | Enrolment/track/cohort, attendance summary, family-visible evidence, consent instrument status, next session facts | Private reflections, case notes, other families, unrestricted mentor chat |
| Approved responsible adult | Scoped task list | Only the authorities granted (consent, acknowledgement, collection/pickup) | Full guardian dashboard unless policy says so |
| Mentor | Assigned work | Assigned roster first names/preferred names as policy, activities, attendance, structured reviews | Private reflections, cases, screening files of peers, unassigned cohorts |
| Facilitator | Session board | Assigned sessions, materials, attendance, activity evidence, showcase queue for those sessions | Cases, family contact details beyond operational need, unassigned cohorts |
| Programme operations | Cohort operations | Intake pipeline, enrolments, assignments, operational reports, showcase approval | Case bodies; private reflections by default |
| Safeguarding Lead | Safeguarding home (separate app area) | Exceptions, restriction markers, cases, org safeguarding reports | Mixing case lists into the ops cohort board |
| School / institutional partner | Nominations | Own nominations and coarse status (`received` / `not_progressed` / `enrolled`) | Evidence libraries, reflections, rosters, cases |
| Approved alumni contributor | Alumni tasks | Assigned alumni activity, own showcase submissions | Current participants’ private work, cases, ops reports |

Empty states must stay honest: recruitment closed, no invented cohort dates, no “messages waiting” from a social inbox.

Visual guidance (when implemented): reuse YDG pathway colour, UNFOLD sequence and track chips already on the public site. Do not introduce a separate “admin grey” aesthetic for participants.

---

## 8. Initial engagement model

First authenticated release is **five tightly scoped loops**:

| Loop | Behaviour |
|------|-----------|
| Personal journey | Read My Journey; see current UNFOLD stage, track, education stage, completed milestones, next actions, transition goal |
| Assignments | Complete assigned activities; submit activity evidence; receive structured reviews |
| Moderated cohort activities | Join only assigned group tasks; facilitator-led; attendance recorded |
| Structured mentor interaction | Prompted, activity-tied, auditable notes between assigned mentor and participant. Not chat, not matching |
| Approved showcases | Participant (or alumni) submits a candidate; ops/facilitator approve audience; identifiable media needs current media consent |

**Out of this model:** comments-as-feed, likes, follower graphs, mentor marketplace, automated matching, automated placements, applicant ranking, public leaderboards, broadcast chat.

Execute-stage activities are labelled **Execute**. Mentor-stage “giving back” is not automatic; alumni contributor is a screened grant.

---

## 9. Phase boundaries

| Phase | Name | In | Out |
|-------|------|----|-----|
| **R2** | Planning (this milestone) | Documents only | Code, UI, data, recruitment |
| **A** | First authenticated release | Invitation-only accounts; My Journey; assignments; moderated cohort activities; structured mentor interaction; approved showcases; consent/relationship once 4C exists | Direct messaging; community feeds; self-registration; live minor intake until Gate M; file uploads until file-handling approval; `/admin` case browser |
| **B** | Later community (separate approval) | Broader cohort presence, additional showcase audiences, alumni contribution at scale | Mentorship marketplace; public social network; automated matching/placements; ranking |
| **C** | Restricted safeguarding operations (roadmap 4I) | Segregated case store, concern channel after P4, break-glass | Case content on programme dashboards |

Public site remains unauthenticated. `/admin` remains 404 until a later RBAC-proven operations surface is separately approved. Amusement stays a different offering and is not a YDG cohort.

---

## 10. Backend, API and domain boundaries

Target: existing Next.js modular monolith + intended Supabase Auth/Postgres/RLS (4B0). **No migrations or database changes in R2.**

```
Public (site) — unchanged
        │
Next.js server — session, authorize(), audit
        │
┌───────┼────────────┬──────────────┬────────────────┐
Identity   Consent      Programme       Safeguarding
(4B exists)  / relationships  journey + engagement   casework (later 4I)
```

| Boundary | Owns | Must not own | Likely later surface |
|----------|------|--------------|----------------------|
| Identity and access | Accounts, session, protected roles | Journey evidence, cases | Existing `lib/auth/*`; no architecture change in R2 |
| Consent and relationship | Instruments, `AdultRelationship`, identity-reuse exceptions | Case body, track assignment | Server actions / route handlers after 4C |
| Programme journey | Participant, enrolment episodes, track, UNFOLD, education stage, transition goal, milestones, `TransitionReviewCompleted` | Promised employment/admission outcomes; in-place overwrite of an enrolment | `programme` schema or equivalent, strict RLS |
| Engagement | Activities, assignments, reviews, showcase workflow, structured mentor notes | Direct messages, feeds, matching | Same database, separate tables; no Realtime unless separately justified |
| Enquiry / referral | Pre-intake interest, institutional nominations, amusement-type flag | Enrolment, consent completion | After 4D; not `booking_inquiries` |
| Safeguarding casework | Concerns, cases, restricted notes | Ordinary CRUD | Separate schema or project; general `authenticated` and `admin` have no default select |
| Reporting | Role-scoped aggregates | Unredacted identifiers or case bodies | After 4H |
| Audit | Append-only privileged log | Business workflow | Durable sink is a 4B hosted prerequisite |

Logical resources (contracts, not tables): `Person`, `Account`, `RoleAssignment`, `Participant`, `Journey`, `Enrolment` (current plus historical), `Cohort`, `ConsentRecord`, `AdultRelationship`, `Activity`, `Assignment`, `EvidenceItem`, `Review`, `TransitionReview`, `ShowcaseItem`, `DeliveryAssignment`, `RestrictionMarker`, `SafeguardingCase`, `AuditEvent`.

Programme events that later implementations must honour (no schema in R2): `ParticipationStatusChanged`, `EnrolmentCreated`, `EnrolmentEnded`, `EnrolmentTransferred`, `TransitionReviewCompleted`, plus the 4A catalogue (`TrackAssigned`, `UnfoldStageChanged`, `WithdrawalConfirmed`, and others).

**Education stage and age stay separate columns/fields on the contract**, never a single “year group” enum. Implemented education-stage values remain the 4A set until the owner confirms `tvet`.

Authorization continues to evaluate session + protected claim + scope + resource state + context isolation + audit. Mentors write only within `DeliveryAssignment`. Showcase approval is an ops/facilitator mutation with an audit event. Enrolment end, transfer, deferred status changes and transition reviews are privileged, fail-closed mutations.

Realtime stays disabled. Service-role secrets stay off the browser. File-backed `EvidenceItem` remains a reference after file-handling approval, not an open upload slot.

---

## 12. Acceptance criteria and proposed implementation sequence

### R2 (this milestone) is complete when

| ID | Criterion |
|----|-----------|
| A1 | Role/permission matrix, lifecycle (including `deferred` and terminal `withdrawn`), age/education split, and journey concepts are written and internally consistent with 4A/4B |
| A2 | Consent and safeguarding segregation preserve 10–17 consent+assent, 18–25 consent+acknowledgement, optional media, and case isolation |
| A3 | First authenticated release is defined without DMs, feeds, ranking, matching, placements or guarantees |
| A4 | Backend boundaries fit Next.js + Supabase without requiring a migration in R2 |
| A5 | Roadmap shows R2’s position and dependencies |
| A6 | Public application source, lockfiles, env files and Supabase migrations are unchanged |
| A7 | No personal data collected; recruitment remains closed |
| A8 | `TransitionReviewCompleted`, `EnrolmentEnded` and `EnrolmentTransferred` are specified; re-entry is a new episode, not `withdrawn` → `enrolled` |
| A9 | 4A education stages remain `upper_primary \| jhs \| shs \| tertiary \| other`; `tvet` as an education-stage value stays an explicit pending owner decision |

### Must not be treated as R2 success

Enabling dashboards, adding roles in `lib/auth/roles.ts`, creating journey tables, opening enquiry persistence, or publishing a concern channel.

### Sequence after R2 approval (small, reviewable)

Each slice needs its existing gate. None start from this document alone.

| Slice | Outcome | Depends on | Must not include |
|-------|---------|------------|------------------|
| **4C** | Consent instruments + `AdultRelationship` on synthetic adult identities; 10–17/18–25 rules testable without live collection | R2 accepted; legal review of instruments; durable audit for privileged writes | Minor PII; UI for families |
| **R2-V** | Types-only journey vocabulary in code (`EducationStage` as the 4A set plus pending `tvet` comment, `TransitionGoal`, `UnfoldStage`, `ParticipationStatus`, evidence visibility classes, enrolment-event names) with tests, **no persistence** | R2 accepted | Migrations, pages, env; treating `tvet` education-stage as approved |
| **4D** | Authenticated enquiry / register-interest for approved audiences | Privacy notice; monitored channel; recruitment may stay closed | Automatic enrolment |
| **4E** | Onboarding: education stage captured separately from age using the 4A set; track/cohort assignment; `EnrolmentCreated` | **Gate M** if any 10–17 data; 10–12 approval if that band is in scope | Guarantees; inferred stage from age; silent `tvet` enum |
| **4F-A** | My Journey read model + assignments + structured reviews (text evidence); `TransitionReviewCompleted` at boundaries | 4E; delivery safeguarding ratios | Files; DMs; rankings; automatic progression |
| **4F-E** | `EnrolmentEnded` / `EnrolmentTransferred` with historical preservation and consent revalidation | 4E; transition review | In-place overwrite; `withdrawn` → `enrolled` |
| **4G** | Mentor/facilitator assignment UI within scope | Volunteer screening policy | Marketplace; unassigned roster access |
| **A-show** | Showcase approval workflow | Media-consent instrument live; identity safeguard | Public comparisons |
| **4H** | Role-scoped aggregates | Data exist | Case bodies |
| **4I** | Segregated case store | Safeguarding manual; P4 channel; independent escalation | Ops dashboard case lists |
| **B** | Later community features | Separate product approval | Matching, ranking, guaranteed placements |

### Recommended first implementation slice

**4C consent and relationship model**, run in parallel with **R2-V types-only vocabulary tests**.

That is the smallest slice that makes age band vs education stage enforceable later, without collecting personal information, touching the public UI, or opening recruitment.
