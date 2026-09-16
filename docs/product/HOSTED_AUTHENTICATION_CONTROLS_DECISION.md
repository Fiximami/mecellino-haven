# Hosted authentication controls

**Architecture decision — documentation only.**\
**Branch context:** `feat/ydg-authenticated-mvp`.\
**Does not:** implement Auth, connect a hosted project, apply migrations, collect personal data, or change dependencies.

Cross-reference: `AUTH_PROVIDER_DECISION.md`, `AUTHENTICATION_AND_AUTHORIZATION_SPECIFICATION.md`, `MVP_SECURITY_PRIVACY_AND_SAFEGUARDING_BOUNDARIES.md`, `MVP_DOMAIN_AND_EVENT_MODEL.md`, `R2_CONSENT_SAFEGUARDING_AND_PRIVACY.md`, `MVP_IMPLEMENTATION_ROADMAP.md`.

---

## Status

Hosted authentication remains **disabled**. Local fail-closed foundation and synthetic 4C-V policy are not production go-live. Local environment files do not prove hosted-project identity or remote RLS.

An unrelated organisation project named Truth Smart Tips must **never** be accessed, inspected or modified. The only permitted future remote target, once positively identified, is Mecellino Haven Production in the MualenTech organisation. Project references, URLs and credentials are not recorded here.

---

## Decisions

### D1 — `parent` and `legal_guardian` stay distinct

Do not merge, alias or replace these labels. They remain separate in:

- programme authorization vocabulary (`lib/auth/roles.ts`);
- AdultRelationship kinds (`parent` \| `legal_guardian` \| `approved_responsible_adult`);
- consent eligibility (either kind may satisfy the adult instrument when the rest of the policy holds).

The current protected-role store check after the alignment migration accepts `legal_guardian` and does **not** accept `parent`. That mismatch is recorded, not resolved in application code.

### D2 — Role-store alignment is a reviewed migration, not a code shortcut

A future, independently reviewed SQL migration must extend `private.role_assignments` so its role check accepts **both** `parent` and `legal_guardian` (and the rest of the existing programme roles). Until that migration is reviewed, applied to the identified production project, and verified, `link_adult_relationship` stays denied.

The alignment migration that relabelled `guardian` → `legal_guardian` must not be rewritten in place as a substitute for that review.

### D3 — Authorization is not a relationship

Do **not** treat a role grant as proof that an adult is linked to a participant, and do **not** treat an AdultRelationship row as a permission grant.

| Concept | Store | Answers |
|---------|--------|---------|
| Authorization | `private.role_assignments` (and protected claims derived from it) | What this **account** may do, with grant/revocation provenance and scope |
| Adult relationship | Separate safeguarding-aware `AdultRelationship` structure (not yet persisted) | Which **Person** is linked to which participant, under which kind and exception state |

`parent` and `legal_guardian` appear in **both** vocabularies because a parent account may need a parent **role** *and* a parent **relationship** to a named participant. Those are different facts:

- RoleAssignment of `parent` does not create a link to a child.
- AdultRelationship of kind `parent` does not assign programme-operations powers.
- `approved_responsible_adult` remains an exception path: relationship plus Safeguarding Lead approval, not a self-asserted role.

**Implementation direction:** keep both labels in the role check so invited parent and legal-guardian accounts can be granted. Persist links only in AdultRelationship (kinds, participant scope, alternative-adult exception status). `link_adult_relationship` writes the relationship structure, not a role row. Enabling it requires D2 **and** a reviewed relationship schema with RLS; D2 alone is not enough.

### D4 — `link_adult_relationship` stays fail-closed

The action remains in `ALWAYS_DENIED_ACTIONS`. No page, API, server action or migration in this slice may enable it. Authorization tests must continue to deny it even for a Safeguarding Lead.

### D5 — Hosted authentication enablement gates

All of the following must be true before hosted authentication is treated as enabled. Local configuration is not a substitute.

1. The connected Supabase project is **positively identified** as Mecellino Haven Production in the MualenTech organisation. If identity cannot be proven, do not connect.
2. Remote migration history, FORCE RLS, and grants/revocations for `anon`, `authenticated`, `public` and privileged database roles are verified with read-only metadata (no row contents of participants, users, enquiries, tokens or cases).
3. Application-owned distributed lockout exists and is verified (D8). Provider rate limiting is defence in depth, not a substitute. The current in-process map (`LOCKOUT_SCOPE = local_single_process`) is not sufficient.
4. Idle and absolute session timeout values are approved (D7). Approving those durations does not enable hosted authentication.
5. Safeguarding, privacy and insurance readiness gates that permit personal-data processing are closed (including Gate M before any 10–17 personal data). Lawful basis and retention are not invented here.

Until all remaining gates close: public routes stay available; sign-in stays fail-closed without a durable audit sink; `/admin` stays 404; invitation, protected-claim writes and deactivation stay fail-closed stubs. Hosted authentication remains **disabled**.

### D6 — Preserve dormant booking infrastructure and keep Realtime off

Do not reuse `booking_inquiries` for YDG, consent or casework. Realtime stays disabled (no `.channel(` / subscribe). Transitive `ws` presence is not permission to open Realtime.

### D7 — Session idle and absolute lifetimes are approved

Owner-approved values:

| Class | Idle timeout | Absolute lifetime |
|-------|--------------|-------------------|
| Standard | 30 minutes | 12 hours |
| Privileged | 15 minutes | 4 hours |

The privileged class applies when protected claims include any of `programme_operations`, `safeguarding_lead`, `restricted_caseworker`, `system_administrator` or `auditor`. Mixed roles use the privileged class.

Absolute lifetime cannot be extended by activity. Idle refresh cannot pass the absolute deadline.

These values do not enable hosted authentication. Distributed lockout remains unimplemented in hosted sign-in.

### D8 — Distributed lockout is an application-owned store

The process-local map is not a production control and must not be a hosted fallback. Owner-approved policy and a local `private.auth_lockouts` foundation are recorded in `DISTRIBUTED_AUTHENTICATION_LOCKOUT_DECISION.md`. The migration is not applied. Live sign-in still uses the in-memory map.

Supabase Auth provider rate limiting remains an independent control. It does not replace the application store.

This decision does **not** enable hosted authentication.

---

## Unresolved owner decisions

These are **not** settled here and must not be guessed in code:

| Item | Notes |
|------|--------|
| Distributed lockout remote verification | Local foundation exists; D5.3 remains open until applied and verified on Mecellino Haven Production |
| Lawful basis / privacy notice / Gate M / insurance readiness | Required before personal-data processing |
| Positive production-project identification | Operational proof, not a value stored in this repository |
| AdultRelationship physical schema | Table/RLS shape when 4C persistence is separately approved |
| Whether a `parent` or `legal_guardian` role grant requires a matching AdultRelationship | Recommended invariant; safeguarding owner confirms before persistence |

---

## What this pass does not do

- Does not apply or draft SQL.
- Does not change `lib/auth/roles.ts` or enable `link_adult_relationship`.
- Does not connect Supabase, start authentication, or collect personal data.
- Does not record secrets, project references or environment values.
