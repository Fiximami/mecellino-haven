# Milestone 4C — legal, privacy and safeguarding review brief

**Audience:** Ghana-qualified legal/privacy reviewer.\
**Status:** Documentation only. This brief does **not** authorise implementation or collection.\
**Architecture:** `MILESTONE_4C_ADULT_RELATIONSHIP_AND_CONSENT_ARCHITECTURE.md`\
**Roadmap / Gate M:** `MVP_IMPLEMENTATION_ROADMAP.md`

---

## 1. Purpose and status

External Ghana-qualified review is **required before live collection**. Founder review is **owner approval**, not legal approval, and does not close this gate.

R2 is an **accepted specification** and planning baseline only. Acceptance does not authorise production implementation, persistence, recruitment or personal-data collection.

| Item | Status |
|------|--------|
| 4C consent and relationship model | Incomplete and gated |
| Gate M (minor personal data) | Open |
| Recruitment | Closed |
| Live onboarding | Not started |

No personal information is currently collected or persisted. Hosted authentication remains disabled. `link_adult_relationship` remains denied. The demonstration enquiry form is non-persistent.

---

## 2. Proposed processing (not yet live)

Intended **future** processing, if later approved:

| Activity | Future purpose |
|----------|----------------|
| Versioned programme consent | Current 13–17 programme consent, with instrument-text version |
| Participant assent | Separate 13–17 assent; not replaceable by adult consent |
| Adult legal consent | 18–25 participant legal consent; cannot be overridden by another adult |
| Programme acknowledgement | Organisational eligibility for 18–25; never a veto of adult consent or withdrawal |
| Optional media consent | Photo/audio/video; not required for participation |
| Parent / legal-guardian relationships | Distinct AdultRelationship kinds, separate from RoleAssignment |
| Approved responsible-adult exceptions | Safeguarding Lead role only; closed reason codes; no public SL contact |
| Identity / telephone-reuse accommodation | Fail-closed unless independently verified |
| Immutable audit history | Append-only privileged log of consent, relationship, exception and reuse events |

None of the above is collected or stored today. Schema design exists; migrations and live forms do not.

---

## 3. Confirmed owner decisions

These are owner/product and Safeguarding Owner decisions for the reviewer to assess, not Ghana-qualified legal conclusions. External legal/privacy review remains required before live collection.

- Whenever a `parent` or `legal_guardian` protected role is granted, a matching verified and **active** AdultRelationship of that kind is required, especially for minors. A role grant is not a child link and does not create the relationship row.
- Parent and legal-guardian `review_at` is required. Those relationships are reviewed **annually** and whenever relevant circumstances change.
- Approved responsible-adult exceptions use **closed reason codes** only (section 6). Sensitive explanations do not belong on the general relationship or consent record.
- Youth aged **10–12 are not currently eligible** for YDG. They must not appear in recruitment, eligibility, consent or participant-facing programme bands.
- **Fourteen days** applies only to abandoned enquiries or incomplete drafts. It must not be applied to consent, relationship, safeguarding or programme records.
- Cross-border or hosted storage is **provisional** and subject to Ghana privacy/legal approval. It is not authorised by this brief.
- No public Safeguarding Lead contact is invented. The founder currently occupies the Safeguarding Lead **role**; model the role, not personal identity.

---

## 4. Questions requiring legal/privacy determination

Please give a **written** decision on each item (use section 7). Do not infer approval from owner decisions above.

1. **Lawful basis** for each activity in section 2, including children’s data where relevant.
2. **Privacy-notice wording** required before any collection (Ghana operations, including Act 843 / children’s data as applicable).
3. **Consent-instrument wording and versioning** for programme consent, assent, adult legal consent, acknowledgement and media.
4. Whether organisational **programme acknowledgement** may lawfully be an adult-eligibility condition **without weakening** 18–25 legal consent or withdrawal.
5. **Retention periods** for consent records, AdultRelationship records, exception headers, and audit history. (Fourteen days is out of scope for those classes.)
6. **Withdrawal, correction, deletion and restriction** rights, and how they apply to current vs historical instrument rows.
7. **Cross-border transfer and data-residency** conditions for any hosted store holding personal data.
8. **Processors / subprocessors** and contractual requirements.
9. **Handling of children’s information** (13–17; 10–12 are not eligible), including whether Gate M’s bar is sufficient or must be tightened.
10. **Minimum data** required to operate each activity (what must not be collected).
11. **Breach-notification and data-subject-request** procedures, including who may act and within what bounds.
12. Whether **immutable audit history** requires lawful exceptions for deletion or correction, and how those exceptions must be recorded.

---

## 5. Safeguarding decisions (ages 10–12)

Youth aged **10–12 are not currently eligible** for Youth Discovery Gateway. They must not appear in active YDG recruitment, eligibility, consent or participant-facing programme bands.

Gate M still applies before any 13–17 personal data. No 10–12 PII, family UI or live instruments are authorised by this brief.

---

## 6. ARA reason codes

Accepted **non-narrative** codes for the restricted exception header. Sensitive explanations belong only in a **future segregated safeguarding process** (4I), not in AdultRelationship, ConsentRecord, general enquiry or this brief.

| Code | Meaning |
|------|---------|
| `parent_involvement_impossible` | Parent involvement impossible |
| `parent_involvement_unsafe_or_inappropriate` | Parent involvement unsafe or inappropriate |
| `verification_incomplete` | Verification incomplete |
| `suitability_requirements_not_met` | Suitability requirements not met |
| `conflict_of_interest_identified` | Conflict of interest identified |
| `participant_withdrew_request` | Participant withdrew request |
| `approval_superseded_or_revoked` | Approval superseded or revoked |

Do not invent additional free-text reasons in general records.

---

## 7. Reviewer response

Leave Reviewer, Qualification and Date blank until the Ghana-qualified reviewer completes this table. Do not insert a name, qualification or approval here.

| Decision area | Approved / Approved with conditions / Not approved | Required correction | Reviewer | Qualification | Date |
|---------------|----------------------------------------------------|---------------------|----------|---------------|------|
| Lawful basis by activity | | | | | |
| Privacy-notice wording | | | | | |
| Consent-instrument wording and versioning | | | | | |
| Adult programme acknowledgement as eligibility | | | | | |
| Retention: consent and relationships | | | | | |
| Retention: exception details | | | | | |
| Retention: audit history | | | | | |
| Withdrawal, correction, deletion, restriction | | | | | |
| Cross-border transfer and data residency | | | | | |
| Processors / subprocessors | | | | | |
| Information submitted by an ineligible person aged 10–12 — prevention, deletion, redirection and safeguarding handling | | | | | |
| Minimum data requirements | | | | | |
| Breach notification and data-subject requests | | | | | |
| Immutable audit vs lawful deletion/correction | | | | | |
| Safeguarding response when a person aged 10–12 attempts to apply or is referred, without creating YDG eligibility | | | | | |

Review of accidental contact or information relating to a person aged 10–12 does not create programme eligibility, recruitment authority or permission to retain their information.

A completed row is not an implementation instruction. Persistence and live collection still require the gates in the architecture and roadmap.

---

## 8. Explicit prohibitions

This brief does **not** authorise:

- migrations or database application;
- Supabase connection or remote changes;
- live forms, registration or onboarding;
- hosted-authentication enablement;
- recruitment, including ages 10–12;
- collection or storage of personal information;
- file uploads;
- safeguarding case storage or case-note access.

Until Ghana-qualified written approval and the remaining owner/safeguarding gates close, 4C remains design-only.
