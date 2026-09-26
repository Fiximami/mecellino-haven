import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { ALWAYS_DENIED_ACTIONS } from "../lib/auth/roles.ts";

const MIGRATIONS_DIR = join(import.meta.dirname, "..", "supabase", "migrations");
const ALIGNED_ROLES = [
  "participant",
  "legal_guardian",
  "approved_responsible_adult",
  "referrer",
  "mentor",
  "facilitator",
  "programme_operations",
  "safeguarding_lead",
  "restricted_caseworker",
  "system_administrator",
  "auditor",
] as const;
const PERMITTED_ROLES_AFTER_PARENT = [
  "participant",
  "parent",
  "legal_guardian",
  "approved_responsible_adult",
  "referrer",
  "mentor",
  "facilitator",
  "programme_operations",
  "safeguarding_lead",
  "restricted_caseworker",
  "system_administrator",
  "auditor",
] as const;

const draft = readFileSync(
  join(MIGRATIONS_DIR, "20260912134813_auth_rbac_audit_foundation.sql"),
  "utf8",
);
const alignment = readFileSync(
  join(MIGRATIONS_DIR, "20260912155902_align_legal_guardian_role.sql"),
  "utf8",
);
const parentRoleMigrationName = readdirSync(MIGRATIONS_DIR)
  .filter((name) => name.endsWith("_permit_parent_role.sql"))
  .sort()
  .at(-1);
const parentRole = parentRoleMigrationName
  ? readFileSync(join(MIGRATIONS_DIR, parentRoleMigrationName), "utf8")
  : "";

function quotedRoles(inner: string): string[] {
  return [...inner.matchAll(/'([a-z_]+)'/g)].map((item) => item[1]);
}

function namedRoleCheck(sql: string): string[] | null {
  const match = sql.match(
    /add constraint role_assignments_role_check check \(\s*role in \(([\s\S]*?)\)\s*\)/i,
  );
  return match ? quotedRoles(match[1]) : null;
}

function effectiveRoleCheck(files: string[]): string[] | null {
  let current: string[] | null = null;
  for (const name of files) {
    const extracted = namedRoleCheck(readFileSync(join(MIGRATIONS_DIR, name), "utf8"));
    if (extracted) {
      current = extracted;
    }
  }
  return current;
}

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
    assert.match(alignment, /disable trigger role_assignments_preserve_history/i);
    assert.match(alignment, /enable trigger role_assignments_preserve_history/i);
    assert.doesNotMatch(alignment, /grant|create table|create policy/i);
  });
});

describe("parent role permission migration", () => {
  it("is a later local migration after the legal_guardian alignment", () => {
    assert.equal(typeof parentRoleMigrationName, "string");
    assert.match(parentRoleMigrationName ?? "", /^\d{14}_permit_parent_role\.sql$/);
    assert.ok((parentRoleMigrationName ?? "") > "20260912155902_align_legal_guardian_role.sql");
  });

  it("fails closed unless the expected table and constraint are present", () => {
    assert.match(parentRole, /private\.role_assignments is absent/);
    assert.match(parentRole, /role_assignments_role_check is absent/);
    assert.match(parentRole, /drop constraint role_assignments_role_check/);
    assert.match(parentRole, /add constraint role_assignments_role_check/);
    assert.match(parentRole, /relrowsecurity/);
    assert.match(parentRole, /relforcerowsecurity/);
    assert.match(parentRole, /must keep RLS and FORCE RLS/);
  });

  it("permits parent and legal_guardian as distinct values without dropping existing roles", () => {
    const aligned = namedRoleCheck(alignment);
    const next = namedRoleCheck(parentRole);
    const effective = effectiveRoleCheck(
      readdirSync(MIGRATIONS_DIR).filter((name) => name.endsWith(".sql")).sort(),
    );

    assert.deepEqual(aligned, [...ALIGNED_ROLES]);
    assert.deepEqual(next, [...PERMITTED_ROLES_AFTER_PARENT]);
    assert.deepEqual(effective, [...PERMITTED_ROLES_AFTER_PARENT]);
    assert.ok(next?.includes("parent"));
    assert.ok(next?.includes("legal_guardian"));
    assert.notEqual(next?.indexOf("parent"), next?.indexOf("legal_guardian"));
    for (const role of ALIGNED_ROLES) {
      assert.ok(next?.includes(role), `missing retained role ${role}`);
    }
  });

  it("does not introduce policies, grants, tables, or unrelated subsystems", () => {
    assert.doesNotMatch(parentRole, /\bgrant\b/i);
    assert.doesNotMatch(parentRole, /create policy/i);
    assert.doesNotMatch(parentRole, /create table/i);
    assert.doesNotMatch(parentRole, /create publication|replica identity/i);
    assert.doesNotMatch(parentRole, /storage\.objects|booking_inquiries/i);
    assert.doesNotMatch(parentRole, /create schema|drop schema/i);
    assert.doesNotMatch(parentRole, /disable row level security|no force row level security/i);
    assert.doesNotMatch(parentRole, /to anon|to authenticated/i);
    assert.doesNotMatch(parentRole, /with check \(true\)|using \(true\)/i);
  });

  it("does not enable link_adult_relationship", () => {
    assert.equal(
      (ALWAYS_DENIED_ACTIONS as readonly string[]).includes("link_adult_relationship"),
      true,
    );
  });
});
