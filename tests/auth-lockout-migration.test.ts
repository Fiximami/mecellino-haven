import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { ALWAYS_DENIED_ACTIONS } from "../lib/auth/roles.ts";

const MIGRATIONS_DIR = join(import.meta.dirname, "..", "supabase", "migrations");
const lockoutMigrationName = readdirSync(MIGRATIONS_DIR)
  .filter((name) => name.endsWith("_create_auth_lockouts.sql"))
  .sort()
  .at(-1);
const sql = lockoutMigrationName
  ? readFileSync(join(MIGRATIONS_DIR, lockoutMigrationName), "utf8")
  : "";

describe("distributed lockout migration", () => {
  it("is a later local migration after the parent role permission change", () => {
    assert.equal(typeof lockoutMigrationName, "string");
    assert.match(lockoutMigrationName ?? "", /^\d{14}_create_auth_lockouts\.sql$/);
    assert.ok((lockoutMigrationName ?? "") > "20260915183512_permit_parent_role.sql");
  });

  it("creates a privacy-safe private table with RLS and FORCE RLS", () => {
    assert.match(sql, /create table private\.auth_lockouts/i);
    assert.match(sql, /identifier_hmac char\(64\) primary key/i);
    assert.match(sql, /pepper_version smallint not null/i);
    assert.match(sql, /alter table private\.auth_lockouts enable row level security/i);
    assert.match(sql, /alter table private\.auth_lockouts force row level security/i);
    assert.doesNotMatch(sql, /email|phone|password|token|user.agent|source_ip|account_id/i);
    assert.doesNotMatch(sql, /create policy/i);
  });

  it("revokes browser roles and grants only service_role", () => {
    assert.match(sql, /revoke all on table private\.auth_lockouts from public/i);
    assert.match(sql, /revoke all on table private\.auth_lockouts from anon/i);
    assert.match(sql, /revoke all on table private\.auth_lockouts from authenticated/i);
    assert.match(
      sql,
      /grant select, insert, update, delete on table private\.auth_lockouts to service_role/i,
    );
    assert.doesNotMatch(sql, /grant[\s\S]*?\sto\s+(anon|authenticated|public)\b/i);
  });

  it("adds invoker atomic helpers without security definer", () => {
    assert.match(sql, /create function private\.auth_lockout_is_locked/i);
    assert.match(sql, /create function private\.auth_lockout_record_failure/i);
    assert.match(sql, /create function private\.auth_lockout_clear/i);
    assert.match(sql, /create function private\.auth_lockout_unlock_and_audit/i);
    assert.match(sql, /on conflict \(identifier_hmac\) do update/i);
    assert.match(sql, /security invoker/i);
    assert.doesNotMatch(sql, /security definer/i);
    assert.match(sql, /revoke all on function private\.auth_lockout_is_locked\(text, text\) from public/i);
    assert.match(sql, /revoke all on function private\.auth_lockout_is_locked\(text, text\) from anon/i);
    assert.match(
      sql,
      /revoke all on function private\.auth_lockout_is_locked\(text, text\) from authenticated/i,
    );
    assert.match(
      sql,
      /revoke all on function private\.auth_lockout_unlock_and_audit\(text, text\) from public/i,
    );
    assert.match(
      sql,
      /revoke all on function private\.auth_lockout_unlock_and_audit\(text, text\) from anon/i,
    );
    assert.match(
      sql,
      /revoke all on function private\.auth_lockout_unlock_and_audit\(text, text\) from authenticated/i,
    );
    assert.match(
      sql,
      /grant execute on function private\.auth_lockout_unlock_and_audit\(text, text\) to service_role/i,
    );
  });

  it("keeps production lock timing on the database clock", () => {
    const match = sql.match(
      /create function private\.auth_lockout_record_failure\([\s\S]*?\$\$;/,
    );
    const body = match?.[0] ?? "";
    assert.match(body, /p_hmac text,\s*p_pepper_version smallint\s*\)/i);
    assert.doesNotMatch(body, /\bp_now\b/);
    assert.match(body, /v_now timestamptz := pg_catalog\.now\(\)/);
    assert.doesNotMatch(body, /\([^)]*timestamptz[^)]*\)\s*returns boolean/i);
  });

  it("clears a lock and records success in one invoker statement", () => {
    const match = sql.match(
      /create function private\.auth_lockout_unlock_and_audit\([\s\S]*?\$\$;/,
    );
    assert.equal(typeof match?.[0], "string");
    const body = match?.[0] ?? "";
    const deleteAt = body.search(/delete from private\.auth_lockouts/i);
    const insertAt = body.search(/insert into private\.auth_audit_events/i);
    assert.ok(deleteAt >= 0);
    assert.ok(insertAt > deleteAt);
    assert.match(body, /returns boolean/i);
    assert.match(body, /get diagnostics v_removed = row_count/i);
    assert.match(body, /if v_removed < 1 then/i);
    assert.match(body, /security invoker/i);
    assert.match(body, /set search_path = ''/);
    assert.match(body, /values \(\s*'lockout',\s*'success',\s*'unlock_auth_lockout'\s*\)/);
    const insert = body.match(/insert into private\.auth_audit_events[\s\S]*?;/i)?.[0] ?? "";
    assert.doesNotMatch(insert, /p_hmac|object_id|actor_user_id|source_ip/i);
    assert.ok(body.search(/if v_removed < 1 then/i) < insertAt);
  });

  it("adds lockout audit class without identifier columns", () => {
    assert.match(sql, /'lockout'/);
    assert.match(sql, /auth_audit_events_event_class_check is absent/);
    assert.doesNotMatch(sql, /add column[\s\S]*(email|hmac|ip)/i);
  });

  it("does not enable live authentication or always-denied linking", () => {
    assert.doesNotMatch(sql, /booking_inquiries|create publication|realtime/i);
    assert.equal(
      (ALWAYS_DENIED_ACTIONS as readonly string[]).includes("link_adult_relationship"),
      true,
    );
  });
});
