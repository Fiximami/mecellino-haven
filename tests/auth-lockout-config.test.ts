import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  AUTH_LOCKOUT_PEPPER_CURRENT,
  AUTH_LOCKOUT_PEPPER_CURRENT_VERSION,
  AUTH_LOCKOUT_PEPPER_PREVIOUS,
  AUTH_LOCKOUT_PEPPER_PREVIOUS_VERSION,
  LOCKOUT_PEPPER_PUBLIC_ENV_NAMES,
  readLockoutPepperConfig,
} from "../lib/auth/lockout-env.ts";
import { LOCKOUT_PEPPER_MIN_BYTES } from "../lib/auth/lockout-identifier.ts";

const CURRENT = "c".repeat(LOCKOUT_PEPPER_MIN_BYTES);
const PREVIOUS = "p".repeat(LOCKOUT_PEPPER_MIN_BYTES);

describe("lockout pepper configuration", () => {
  it("rejects missing, malformed and public pepper names", () => {
    assert.deepEqual(readLockoutPepperConfig({}), { ok: false, reason: "missing" });
    assert.deepEqual(
      readLockoutPepperConfig({ [AUTH_LOCKOUT_PEPPER_CURRENT]: CURRENT }),
      { ok: false, reason: "invalid" },
    );
    assert.deepEqual(
      readLockoutPepperConfig({
        [AUTH_LOCKOUT_PEPPER_CURRENT]: "short",
        [AUTH_LOCKOUT_PEPPER_CURRENT_VERSION]: "1",
      }),
      { ok: false, reason: "invalid" },
    );
    assert.deepEqual(
      readLockoutPepperConfig({
        [AUTH_LOCKOUT_PEPPER_CURRENT]: CURRENT,
        [AUTH_LOCKOUT_PEPPER_CURRENT_VERSION]: "0",
      }),
      { ok: false, reason: "invalid" },
    );
    assert.deepEqual(
      readLockoutPepperConfig({
        [AUTH_LOCKOUT_PEPPER_CURRENT]: CURRENT,
        [AUTH_LOCKOUT_PEPPER_CURRENT_VERSION]: "1",
        NEXT_PUBLIC_AUTH_LOCKOUT_PEPPER_CURRENT: CURRENT,
      }),
      { ok: false, reason: "public_secret_misconfigured" },
    );
    assert.equal(
      LOCKOUT_PEPPER_PUBLIC_ENV_NAMES.every((name) => name.startsWith("NEXT_PUBLIC_")),
      true,
    );
  });

  it("rejects incomplete or duplicate-version rotation material", () => {
    assert.deepEqual(
      readLockoutPepperConfig({
        [AUTH_LOCKOUT_PEPPER_CURRENT]: CURRENT,
        [AUTH_LOCKOUT_PEPPER_CURRENT_VERSION]: "2",
        [AUTH_LOCKOUT_PEPPER_PREVIOUS]: PREVIOUS,
      }),
      { ok: false, reason: "incomplete_rotation" },
    );
    assert.deepEqual(
      readLockoutPepperConfig({
        [AUTH_LOCKOUT_PEPPER_CURRENT]: CURRENT,
        [AUTH_LOCKOUT_PEPPER_CURRENT_VERSION]: "2",
        [AUTH_LOCKOUT_PEPPER_PREVIOUS_VERSION]: "1",
      }),
      { ok: false, reason: "incomplete_rotation" },
    );
    assert.deepEqual(
      readLockoutPepperConfig({
        [AUTH_LOCKOUT_PEPPER_CURRENT]: CURRENT,
        [AUTH_LOCKOUT_PEPPER_CURRENT_VERSION]: "2",
        [AUTH_LOCKOUT_PEPPER_PREVIOUS]: PREVIOUS,
        [AUTH_LOCKOUT_PEPPER_PREVIOUS_VERSION]: "2",
      }),
      { ok: false, reason: "duplicate_version" },
    );
  });

  it("accepts current material and optional previous material", () => {
    assert.deepEqual(
      readLockoutPepperConfig({
        [AUTH_LOCKOUT_PEPPER_CURRENT]: CURRENT,
        [AUTH_LOCKOUT_PEPPER_CURRENT_VERSION]: "2",
      }),
      {
        ok: true,
        peppers: { current: { version: 2, secret: CURRENT } },
      },
    );
    assert.deepEqual(
      readLockoutPepperConfig({
        [AUTH_LOCKOUT_PEPPER_CURRENT]: CURRENT,
        [AUTH_LOCKOUT_PEPPER_CURRENT_VERSION]: "2",
        [AUTH_LOCKOUT_PEPPER_PREVIOUS]: PREVIOUS,
        [AUTH_LOCKOUT_PEPPER_PREVIOUS_VERSION]: "1",
      }),
      {
        ok: true,
        peppers: {
          current: { version: 2, secret: CURRENT },
          previous: { version: 1, secret: PREVIOUS },
        },
      },
    );
  });

  it("documents empty server-only pepper names", () => {
    const example = readFileSync(join(import.meta.dirname, "..", ".env.example"), "utf8");
    assert.match(example, /^AUTH_LOCKOUT_PEPPER_CURRENT=$/m);
    assert.match(example, /^AUTH_LOCKOUT_PEPPER_CURRENT_VERSION=$/m);
    assert.match(example, /^AUTH_LOCKOUT_PEPPER_PREVIOUS=$/m);
    assert.match(example, /^AUTH_LOCKOUT_PEPPER_PREVIOUS_VERSION=$/m);
    assert.match(example, /Never prefix with NEXT_PUBLIC_/);
    assert.match(example, /32 cryptographically random bytes/);
    assert.doesNotMatch(example, /NEXT_PUBLIC_AUTH_LOCKOUT/);
    const envModule = readFileSync(join(import.meta.dirname, "..", "lib", "auth", "lockout-env.ts"), "utf8");
    assert.doesNotMatch(envModule, /env\.NEXT_PUBLIC_AUTH_LOCKOUT_PEPPER_CURRENT\b/);
    assert.doesNotMatch(envModule, /console\.(log|info|debug|error)/);
  });
});
