import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  hasPublicSecretMisconfiguration,
  isAuthConfigured,
  readPublicSupabaseConfig,
  readServiceRoleKey,
} from "../lib/auth/env.ts";

describe("environment validation", () => {
  it("fails closed when configuration is missing", () => {
    const env = {};
    assert.equal(readPublicSupabaseConfig(env).ok, false);
    assert.equal(isAuthConfigured(env), false);
    assert.equal(readServiceRoleKey(env), null);
  });

  it("fails closed for placeholders", () => {
    const env = {
      NEXT_PUBLIC_SUPABASE_URL: "your-project-url",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "your-anon-key",
    };
    assert.deepEqual(readPublicSupabaseConfig(env), { ok: false, reason: "invalid" });
  });

  it("rejects a service-role value exposed as NEXT_PUBLIC_", () => {
    const env = {
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.x",
      NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY: "should-never-be-public",
    };
    assert.equal(hasPublicSecretMisconfiguration(env), true);
    assert.deepEqual(readPublicSupabaseConfig(env), {
      ok: false,
      reason: "public_secret_misconfigured",
    });
    assert.equal(readServiceRoleKey(env), null);
  });

  it("accepts a valid public URL and publishable key without using the service role", () => {
    const env = {
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_local_test_only",
      SUPABASE_SERVICE_ROLE_KEY: "server-only-must-not-be-read-for-ordinary-requests",
    };
    assert.deepEqual(readPublicSupabaseConfig(env), {
      ok: true,
      url: "https://example.supabase.co",
      publishableKey: "sb_publishable_local_test_only",
    });
    assert.equal(readServiceRoleKey(env), "server-only-must-not-be-read-for-ordinary-requests");
  });
});
