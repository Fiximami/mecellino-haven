import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const draft = readFileSync(
  join(
    import.meta.dirname,
    "..",
    "supabase",
    "migrations",
    "20260912134813_auth_rbac_audit_foundation.sql",
  ),
  "utf8",
);
const alignment = readFileSync(
  join(
    import.meta.dirname,
    "..",
    "supabase",
    "migrations",
    "20260912150000_align_legal_guardian_role.sql",
  ),
  "utf8",
);

describe("authentication database foundation migration", () => {
  it("records its reviewed staging scope", () => {
    assert.match(draft, /applied to the designated Mecellino staging project/i);
    assert.match(draft, /no participant, guardian, consent, upload, or safeguarding case data/i);
  });

  it("keeps role and audit records in an unexposed schema", () => {
    assert.match(draft, /create schema if not exists private/i);
    assert.match(draft, /revoke all on schema private from anon/i);
    assert.match(draft, /revoke all on schema private from authenticated/i);
    assert.match(draft, /alter table private\.role_assignments force row level security/i);
    assert.match(draft, /alter table private\.auth_audit_events force row level security/i);
    assert.doesNotMatch(draft, /create policy/i);
    assert.doesNotMatch(draft, /grant all/i);
  });

  it("uses protected server ownership and excludes public writes", () => {
    assert.match(
      draft,
      /grant select, insert, update on table private\.role_assignments to service_role/i,
    );
    assert.match(
      draft,
      /grant select, insert on table private\.auth_audit_events to service_role/i,
    );
    assert.doesNotMatch(draft, /grant\s+(insert|update|delete).*\s+to\s+(anon|authenticated)/i);
    assert.doesNotMatch(draft, /user_metadata/i);
  });

  it("makes audit events append-only without a security-definer function", () => {
    assert.match(draft, /before update or delete on private\.auth_audit_events/i);
    assert.match(draft, /auth audit events are append-only/i);
    assert.match(draft, /security invoker/i);
    assert.doesNotMatch(draft, /security definer/i);
    assert.doesNotMatch(
      draft,
      /grant\s+(update|delete).*private\.auth_audit_events/i,
    );
  });

  it("preserves role grant identity, provenance, and revocation history", () => {
    assert.match(draft, /role grant identity and provenance are immutable/i);
    assert.match(draft, /role revocation history is immutable/i);
    assert.match(draft, /before update on private\.role_assignments/i);
    assert.match(draft, /new\.account_id is distinct from old\.account_id/i);
    assert.match(draft, /new\.granted_by is distinct from old\.granted_by/i);
  });

  it("does not introduce programme, consent, upload, or case records", () => {
    assert.doesNotMatch(draft, /create table\s+.*(participant|guardian|consent|evidence|case|storage)/i);
    assert.doesNotMatch(draft, /storage\.objects/i);
    assert.doesNotMatch(draft, /booking_inquiries/i);
  });

  it("aligns the protected guardian label without opening public access", () => {
    assert.match(alignment, /update private\.role_assignments/i);
    assert.match(alignment, /guardian/);
    assert.match(alignment, /legal_guardian/);
    assert.match(alignment, /drop constraint role_assignments_role_check/i);
    assert.match(alignment, /add constraint role_assignments_role_check/i);
    assert.doesNotMatch(alignment, /grant|create table|create policy/i);
  });
});
