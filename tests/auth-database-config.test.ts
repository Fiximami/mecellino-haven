import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readDatabaseConnectionConfig } from "../lib/database/config.ts";

const VALID = {
  SUPABASE_PROJECT_REF: "mecellino-ref",
  SUPABASE_DATABASE_URL:
    "postgresql://postgres.mecellino-ref:password@example.pooler.supabase.com:6543/postgres",
};

describe("database connection boundary", () => {
  it("requires an explicit project reference and connection URL", () => {
    assert.deepEqual(readDatabaseConnectionConfig({}), { ok: false, reason: "missing" });
    assert.deepEqual(
      readDatabaseConnectionConfig({ SUPABASE_PROJECT_REF: "mecellino-ref" }),
      { ok: false, reason: "missing" },
    );
  });

  it("accepts a valid project-matched pooled connection", () => {
    assert.deepEqual(readDatabaseConnectionConfig(VALID), {
      ok: true,
      connectionString: VALID.SUPABASE_DATABASE_URL,
    });
  });

  it("qualifies a plain postgres username for Supavisor transaction pooling", () => {
    const config = readDatabaseConnectionConfig({
      ...VALID,
      SUPABASE_DATABASE_URL:
        "postgresql://postgres:password@example.pooler.supabase.com:6543/postgres",
    });
    assert.equal(config.ok, true);
    if (config.ok) {
      assert.match(config.connectionString, /postgres\.mecellino-ref:/i);
    }
  });

  it("normalizes reserved characters in pooled credentials", () => {
    const config = readDatabaseConnectionConfig({
      ...VALID,
      SUPABASE_DATABASE_URL:
        "postgresql://postgres.mecellino-ref:p@ss@word@example.pooler.supabase.com:6543/postgres",
    });
    assert.equal(config.ok, true);
    if (config.ok) {
      assert.match(config.connectionString, /p%40ss%40word/i);
    }
  });

  it("rejects malformed or wrong-project connection values", () => {
    assert.deepEqual(
      readDatabaseConnectionConfig({
        ...VALID,
        SUPABASE_DATABASE_URL: "not-a-database-url",
      }),
      { ok: false, reason: "invalid" },
    );
    assert.deepEqual(
      readDatabaseConnectionConfig({
        ...VALID,
        SUPABASE_DATABASE_URL:
          "postgresql://postgres.other-ref:password@example.pooler.supabase.com:6543/postgres",
      }),
      { ok: false, reason: "project_mismatch" },
    );
  });

  it("does not accept public environment names as a database connection", () => {
    assert.deepEqual(
      readDatabaseConnectionConfig({
        ...VALID,
        NEXT_PUBLIC_SUPABASE_DATABASE_URL: VALID.SUPABASE_DATABASE_URL,
        SUPABASE_DATABASE_URL: undefined,
      }),
      { ok: false, reason: "missing" },
    );
  });
});
