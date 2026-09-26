import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { redactAuditDetails } from "../lib/auth/audit.ts";
import { authorize } from "../lib/auth/authorize.ts";
import {
  clearDistributedLockout,
  createMemoryDistributedLockoutStore,
  inspectDistributedLockout,
  recordDistributedLockoutFailure,
} from "../lib/auth/lockout-distributed.ts";
import {
  deriveLockoutHmacs,
  hmacLockoutIdentifier,
  LOCKOUT_HMAC_PURPOSE_EMAIL,
  LOCKOUT_IDENTIFIER_MAX_CHARS,
  LOCKOUT_PEPPER_MIN_BYTES,
  LOCKOUT_PEPPER_ROTATION_DAYS,
  normalizeLockoutIdentifier,
  parseLockoutPepperMaterial,
  type LockoutPepperMaterial,
} from "../lib/auth/lockout-identifier.ts";
import {
  applyLockoutFailure,
  LOCKOUT_DURATION_MS,
  LOCKOUT_FAILURE_THRESHOLD,
  LOCKOUT_WINDOW_MS,
  type LockoutRowState,
} from "../lib/auth/lockout-state.ts";
import { unlockDistributedAuthLockout } from "../lib/auth/lockout-unlock.ts";
import { LOCKOUT_SCOPE } from "../lib/auth/lockout.ts";
import { identityFromProtectedClaims } from "../lib/auth/identity.ts";
import {
  SYNTHETIC_ADMINISTRATOR,
  SYNTHETIC_OPERATIONS,
  syntheticSessionTimestamps,
} from "./helpers/synthetic.ts";

const NOW = 1_700_000_000_000;
const IDENTIFIER = "Staff.User@Example.TEST";
const PEPPERS: LockoutPepperMaterial = {
  current: { version: 2, secret: "c".repeat(LOCKOUT_PEPPER_MIN_BYTES) },
  previous: { version: 1, secret: "p".repeat(LOCKOUT_PEPPER_MIN_BYTES) },
};

function row(overrides: Partial<LockoutRowState> = {}): LockoutRowState {
  return {
    hmac: "ab".repeat(32),
    pepperVersion: 2,
    failureCount: 1,
    windowStartedAt: NOW,
    lockedUntil: null,
    lastEventAt: NOW,
    ...overrides,
  };
}

describe("lockout identifier normalization", () => {
  it("applies NFKC, trim and locale-independent lowercase", () => {
    assert.equal(normalizeLockoutIdentifier("  STAFF.USER@EXAMPLE.TEST  "), "staff.user@example.test");
    assert.equal(normalizeLockoutIdentifier("\uFB01@example.test"), "fi@example.test");
    assert.equal(normalizeLockoutIdentifier("I@EXAMPLE.TEST"), "i@example.test");
  });

  it("rejects empty, non-string and over-long identifiers", () => {
    assert.equal(normalizeLockoutIdentifier(""), null);
    assert.equal(normalizeLockoutIdentifier("   "), null);
    assert.equal(normalizeLockoutIdentifier(null), null);
    assert.equal(normalizeLockoutIdentifier(1), null);
    assert.equal(normalizeLockoutIdentifier("a".repeat(LOCKOUT_IDENTIFIER_MAX_CHARS + 1)), null);
    assert.equal(
      normalizeLockoutIdentifier("a".repeat(LOCKOUT_IDENTIFIER_MAX_CHARS))?.length,
      LOCKOUT_IDENTIFIER_MAX_CHARS,
    );
  });
});

describe("lockout HMAC derivation", () => {
  it("is deterministic for the same pepper and purpose", () => {
    const first = hmacLockoutIdentifier(IDENTIFIER, PEPPERS.current);
    const second = hmacLockoutIdentifier("  STAFF.USER@EXAMPLE.TEST  ", PEPPERS.current);
    assert.equal(typeof first, "string");
    assert.equal(first, second);
    assert.match(first ?? "", /^[0-9a-f]{64}$/);
  });

  it("separates purposes and peppers", () => {
    const email = hmacLockoutIdentifier(IDENTIFIER, PEPPERS.current, LOCKOUT_HMAC_PURPOSE_EMAIL);
    const phone = hmacLockoutIdentifier(IDENTIFIER, PEPPERS.current, "phone");
    const otherPepper = hmacLockoutIdentifier(IDENTIFIER, PEPPERS.previous!);
    assert.notEqual(email, phone);
    assert.notEqual(email, otherPepper);
  });

  it("rejects short peppers and missing previous material", () => {
    assert.equal(parseLockoutPepperMaterial({ current: { version: 1, secret: "short" } }), null);
    assert.equal(
      parseLockoutPepperMaterial({
        current: PEPPERS.current,
        previous: { version: 2, secret: PEPPERS.previous!.secret },
      }),
      null,
    );
    assert.equal(LOCKOUT_PEPPER_ROTATION_DAYS, 90);
  });

  it("supports current and previous versions without requiring previous indefinitely", () => {
    const rotated = deriveLockoutHmacs(IDENTIFIER, PEPPERS);
    const currentOnly = deriveLockoutHmacs(IDENTIFIER, { current: PEPPERS.current });
    assert.equal(rotated?.current.version, 2);
    assert.equal(rotated?.previous?.version, 1);
    assert.notEqual(rotated?.current.hmac, rotated?.previous?.hmac);
    assert.equal(currentOnly?.previous, undefined);
    assert.equal(currentOnly?.current.hmac, rotated?.current.hmac);
  });
});

describe("lockout thresholds and expiry", () => {
  it("locks on the fifth failure inside the window", () => {
    let current: LockoutRowState | null = null;
    let locked = false;
    for (let index = 0; index < LOCKOUT_FAILURE_THRESHOLD; index += 1) {
      const applied = applyLockoutFailure(current, NOW + index * 1_000, "ab".repeat(32), 2);
      current = applied.row;
      locked = applied.locked;
    }
    assert.equal(locked, true);
    assert.equal(current?.failureCount, 5);
    assert.equal(current?.lockedUntil, NOW + 4_000 + LOCKOUT_DURATION_MS);
  });

  it("does not increment or extend while locked", () => {
    const lockedRow = row({
      failureCount: 5,
      lockedUntil: NOW + LOCKOUT_DURATION_MS,
    });
    const again = applyLockoutFailure(lockedRow, NOW + 60_000, lockedRow.hmac, 2);
    assert.equal(again.locked, true);
    assert.equal(again.row.failureCount, 5);
    assert.equal(again.row.lockedUntil, lockedRow.lockedUntil);
    assert.equal(again.row.lastEventAt, NOW + 60_000);
  });

  it("starts a new window at count 1 after lock expiry", () => {
    const expired = row({
      failureCount: 5,
      windowStartedAt: NOW,
      lockedUntil: NOW + LOCKOUT_DURATION_MS,
    });
    const next = applyLockoutFailure(expired, NOW + LOCKOUT_DURATION_MS, expired.hmac, 2);
    assert.equal(next.locked, false);
    assert.equal(next.row.failureCount, 1);
    assert.equal(next.row.windowStartedAt, NOW + LOCKOUT_DURATION_MS);
    assert.equal(next.row.lockedUntil, null);
  });

  it("resets after the observation window without locking", () => {
    const stale = row({ failureCount: 4, windowStartedAt: NOW });
    const next = applyLockoutFailure(stale, NOW + LOCKOUT_WINDOW_MS, stale.hmac, 2);
    assert.equal(next.locked, false);
    assert.equal(next.row.failureCount, 1);
  });
});

describe("distributed lockout store behaviour", () => {
  it("records failures, locks, ignores locked attempts and clears on success", async () => {
    const store = createMemoryDistributedLockoutStore();
    for (let index = 0; index < 4; index += 1) {
      const result = await recordDistributedLockoutFailure(IDENTIFIER, PEPPERS, store, NOW + index);
      assert.deepEqual(result, { ok: true, locked: false });
    }
    const fifth = await recordDistributedLockoutFailure(IDENTIFIER, PEPPERS, store, NOW + 4);
    assert.deepEqual(fifth, { ok: true, locked: true });

    const lockedAttempt = await recordDistributedLockoutFailure(IDENTIFIER, PEPPERS, store, NOW + 5);
    assert.deepEqual(lockedAttempt, { ok: true, locked: true });

    const inspect = await inspectDistributedLockout(IDENTIFIER, PEPPERS, store, undefined, NOW + 5);
    assert.deepEqual(inspect, { ok: true, locked: true });

    const cleared = await clearDistributedLockout(IDENTIFIER, PEPPERS, store);
    assert.deepEqual(cleared, { ok: true, locked: false });
    const after = await inspectDistributedLockout(IDENTIFIER, PEPPERS, store, undefined, NOW + 6);
    assert.deepEqual(after, { ok: true, locked: false });
  });

  it("treats a previous-pepper lock as locked during rotation", async () => {
    const store = createMemoryDistributedLockoutStore();
    const previousOnly = { current: PEPPERS.previous! };
    for (let index = 0; index < LOCKOUT_FAILURE_THRESHOLD; index += 1) {
      await recordDistributedLockoutFailure(IDENTIFIER, previousOnly, store, NOW + index);
    }
    const rotated = await inspectDistributedLockout(IDENTIFIER, PEPPERS, store, undefined, NOW + 10);
    assert.deepEqual(rotated, { ok: true, locked: true });
  });

  it("fails closed when the store or pepper is unavailable", async () => {
    assert.deepEqual(
      await inspectDistributedLockout(IDENTIFIER, PEPPERS, null),
      { ok: false, reason: "unavailable" },
    );
    assert.deepEqual(
      await inspectDistributedLockout(IDENTIFIER, null, createMemoryDistributedLockoutStore()),
      { ok: false, reason: "invalid_pepper" },
    );
    assert.deepEqual(
      await recordDistributedLockoutFailure("", PEPPERS, createMemoryDistributedLockoutStore()),
      { ok: false, reason: "invalid_identifier" },
    );

    const failing = {
      async isLocked() {
        throw new Error("synthetic store outage");
      },
      async recordFailure() {
        throw new Error("synthetic store outage");
      },
      async clear() {
        throw new Error("synthetic store outage");
      },
      async unlockAndAudit() {
        throw new Error("synthetic store outage");
      },
    };
    assert.deepEqual(await inspectDistributedLockout(IDENTIFIER, PEPPERS, failing), {
      ok: false,
      reason: "unavailable",
    });
  });

  it("serializes concurrent increments fail-closed on the fifth attempt", () => {
    const snapshot = row({ failureCount: 4, windowStartedAt: NOW });
    const first = applyLockoutFailure(snapshot, NOW + 1, snapshot.hmac, 2);
    const second = applyLockoutFailure(first.row, NOW + 2, snapshot.hmac, 2);
    assert.equal(first.locked, true);
    assert.equal(second.locked, true);
    assert.equal(second.row.failureCount, 5);
  });
});

describe("privileged unlock", () => {
  it("allows only a system administrator and audits without identifiers", async () => {
    const store = createMemoryDistributedLockoutStore();
    for (let index = 0; index < LOCKOUT_FAILURE_THRESHOLD; index += 1) {
      await recordDistributedLockoutFailure(IDENTIFIER, PEPPERS, store, NOW + index);
    }

    const events: unknown[] = [];
    const operations = await unlockDistributedAuthLockout({
      identity: SYNTHETIC_OPERATIONS,
      fresh: true,
      session: syntheticSessionTimestamps({ now: NOW }),
      identifier: IDENTIFIER,
      peppers: PEPPERS,
      store,
      auditSink: {
        async emit(event) {
          events.push(event);
        },
      },
    });
    assert.equal(operations.unlocked, false);
    assert.equal(events.length, 0);

    const unlocked = await unlockDistributedAuthLockout({
      identity: SYNTHETIC_ADMINISTRATOR,
      fresh: true,
      session: syntheticSessionTimestamps({ now: NOW }),
      identifier: IDENTIFIER,
      peppers: PEPPERS,
      store,
      clientRole: "system_administrator",
      auditSink: {
        async emit(event) {
          events.push(event);
        },
      },
    });
    assert.equal(unlocked.unlocked, true);
    assert.equal(events.length, 1);
    const event = events[0] as { class: string; result: string; action?: string; at: string };
    assert.deepEqual(event, {
      class: "lockout",
      result: "success",
      action: "unlock_auth_lockout",
      at: event.at,
    });
    assert.equal("hmac" in event, false);
    assert.equal("email" in event, false);
    assert.equal("identifier" in event, false);

    const after = await inspectDistributedLockout(IDENTIFIER, PEPPERS, store, undefined, NOW);
    assert.deepEqual(after, { ok: true, locked: false });
  });

  it("does not unlock when durable audit is unavailable", async () => {
    const store = createMemoryDistributedLockoutStore();
    for (let index = 0; index < LOCKOUT_FAILURE_THRESHOLD; index += 1) {
      await recordDistributedLockoutFailure(IDENTIFIER, PEPPERS, store, NOW + index);
    }
    const events: unknown[] = [];
    const result = await unlockDistributedAuthLockout({
      identity: SYNTHETIC_ADMINISTRATOR,
      fresh: true,
      session: syntheticSessionTimestamps({ now: NOW }),
      identifier: IDENTIFIER,
      peppers: PEPPERS,
      store,
      auditSink: {
        async emit() {
          throw new Error("synthetic audit outage");
        },
      },
    });
    assert.deepEqual(result, { unlocked: false, reason: "audit_unavailable" });
    assert.equal(events.length, 0);
    assert.deepEqual(await inspectDistributedLockout(IDENTIFIER, PEPPERS, store, undefined, NOW), {
      ok: true,
      locked: true,
    });
  });

  it("does not record success when the lock cannot be cleared", async () => {
    const store = createMemoryDistributedLockoutStore();
    for (let index = 0; index < LOCKOUT_FAILURE_THRESHOLD; index += 1) {
      await recordDistributedLockoutFailure(IDENTIFIER, PEPPERS, store, NOW + index);
    }
    store.clear = async () => {
      throw new Error("synthetic clear failure");
    };

    const events: unknown[] = [];
    const result = await unlockDistributedAuthLockout({
      identity: SYNTHETIC_ADMINISTRATOR,
      fresh: true,
      session: syntheticSessionTimestamps({ now: NOW }),
      identifier: IDENTIFIER,
      peppers: PEPPERS,
      store,
      auditSink: {
        async emit(event) {
          events.push(event);
        },
      },
    });
    assert.deepEqual(result, { unlocked: false, reason: "unavailable" });
    assert.equal(events.length, 0);
    assert.equal(events.some((event) => (event as { result?: string }).result === "success"), false);
    assert.deepEqual(await inspectDistributedLockout(IDENTIFIER, PEPPERS, store, undefined, NOW), {
      ok: true,
      locked: true,
    });
  });

  it("does not label a missing lock as successful", async () => {
    const events: unknown[] = [];
    const result = await unlockDistributedAuthLockout({
      identity: SYNTHETIC_ADMINISTRATOR,
      fresh: true,
      session: syntheticSessionTimestamps({ now: NOW }),
      identifier: IDENTIFIER,
      peppers: PEPPERS,
      store: createMemoryDistributedLockoutStore(),
      auditSink: {
        async emit(event) {
          events.push(event);
        },
      },
    });
    assert.deepEqual(result, { unlocked: false, reason: "not_locked" });
    assert.equal(events.length, 0);
    assert.equal(events.some((event) => (event as { result?: string }).result === "success"), false);
  });

  it("unlocks a previous-pepper lock and records one success audit", async () => {
    const store = createMemoryDistributedLockoutStore();
    const previousOnly = { current: PEPPERS.previous! };
    for (let index = 0; index < LOCKOUT_FAILURE_THRESHOLD; index += 1) {
      await recordDistributedLockoutFailure(IDENTIFIER, previousOnly, store, NOW + index);
    }

    const events: unknown[] = [];
    const unlocked = await unlockDistributedAuthLockout({
      identity: SYNTHETIC_ADMINISTRATOR,
      fresh: true,
      session: syntheticSessionTimestamps({ now: NOW }),
      identifier: IDENTIFIER,
      peppers: PEPPERS,
      store,
      auditSink: {
        async emit(event) {
          events.push(event);
        },
      },
    });
    assert.equal(unlocked.unlocked, true);
    assert.equal(events.length, 1);
    const event = events[0] as { class: string; result: string; action?: string };
    assert.equal(event.class, "lockout");
    assert.equal(event.result, "success");
    assert.equal(event.action, "unlock_auth_lockout");
    assert.deepEqual(await inspectDistributedLockout(IDENTIFIER, PEPPERS, store, undefined, NOW), {
      ok: true,
      locked: false,
    });
  });

  it("does not label denied unlock attempts as success", async () => {
    const events: unknown[] = [];
    const result = await unlockDistributedAuthLockout({
      identity: SYNTHETIC_OPERATIONS,
      fresh: true,
      session: syntheticSessionTimestamps({ now: NOW }),
      identifier: IDENTIFIER,
      peppers: PEPPERS,
      store: createMemoryDistributedLockoutStore(),
      auditSink: {
        async emit(event) {
          events.push(event);
        },
      },
    });
    assert.equal(result.unlocked, false);
    assert.equal(events.length, 0);
  });
});

describe("lockout module boundaries", () => {
  it("keeps the local map only for synthetic use and does not embed secrets", () => {
    assert.equal(LOCKOUT_SCOPE, "local_single_process");
    const credentials = readFileSync(join(import.meta.dirname, "..", "lib", "auth", "credentials.ts"), "utf8");
    assert.match(credentials, /lockout-distributed/);
    assert.doesNotMatch(credentials, /lockout-postgres|lockout-unlock|createMemoryDistributedLockoutStore/);
    const actions = readFileSync(join(import.meta.dirname, "..", "app", "auth", "actions.ts"), "utf8");
    assert.match(actions, /createPostgresDistributedLockoutStore/);
    assert.match(actions, /readLockoutPepperConfig/);
    assert.doesNotMatch(actions, /createMemoryDistributedLockoutStore/);
    assert.doesNotMatch(credentials, /Retry-After/);
    assert.doesNotMatch(actions, /Retry-After/);
    const identifier = readFileSync(
      join(import.meta.dirname, "..", "lib", "auth", "lockout-identifier.ts"),
      "utf8",
    );
    assert.doesNotMatch(identifier, /process\.env|NEXT_PUBLIC_|from ["']next|from ["']@supabase/);
    assert.deepEqual(
      redactAuditDetails({ hmac: "ab".repeat(32), pepper: "x", identifier: IDENTIFIER, ip: "1.1.1.1" }),
      {
        hmac: "[redacted]",
        pepper: "[redacted]",
        identifier: "[redacted]",
        ip: "[redacted]",
      },
    );
  });

  it("does not let client roles authorize unlock", () => {
    const result = authorize({
      identity: SYNTHETIC_OPERATIONS,
      action: "unlock_auth_lockout",
      fresh: true,
      clientRole: "system_administrator",
      session: syntheticSessionTimestamps({ now: NOW }),
    });
    assert.equal(result.allowed, false);
  });

  it("keeps safeguarding leads from unlocking", () => {
    const result = authorize({
      identity: identityFromProtectedClaims({ appMetadata: { roles: ["safeguarding_lead"] } }),
      action: "unlock_auth_lockout",
      fresh: true,
      session: syntheticSessionTimestamps({ now: NOW }),
    });
    assert.equal(result.allowed, false);
  });

  it("keeps production SQL timing and unlock audit on the database adapter", () => {
    const adapter = readFileSync(join(import.meta.dirname, "..", "lib", "auth", "lockout-postgres.ts"), "utf8");
    assert.doesNotMatch(adapter, /\bp_now\b|occurredAt|toISOString\(|::timestamptz/);
    assert.match(
      adapter,
      /auth_lockout_record_failure\(\s*\$\{currentHmac\}::text,\s*\$\{pepperVersion\}::smallint\s*\)/,
    );
    assert.match(adapter, /auth_lockout_unlock_and_audit\(/);
    assert.match(adapter, /as unlocked/);
    assert.doesNotMatch(adapter, /emitRequiredAuthAudit|persistSuccessAudit\(/);

    const unlock = readFileSync(join(import.meta.dirname, "..", "lib", "auth", "lockout-unlock.ts"), "utf8");
    const fn = unlock.slice(unlock.indexOf("export async function unlockDistributedAuthLockout"));
    assert.ok(fn.indexOf("unlockAndAudit") < fn.indexOf("emitRequiredAuthAudit"));
    assert.match(fn, /action: "unlock_auth_lockout"/);
    assert.match(fn, /reason: "not_locked"/);
  });
});
