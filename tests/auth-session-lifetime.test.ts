import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  evaluateSessionLifetime,
  parseServerTimestamp,
  PRIVILEGED_SESSION_ROLES,
  refreshIdleActivity,
  SESSION_LIFETIME,
  sessionClassForRoles,
} from "../lib/auth/session-lifetime.ts";
import { LOCKOUT_SCOPE } from "../lib/auth/lockout.ts";
import { programmeRoles } from "../lib/auth/roles.ts";

const NOW = 1_700_000_000_000;

const STANDARD_ROLES = [
  "participant",
  "parent",
  "legal_guardian",
  "approved_responsible_adult",
  "referrer",
  "mentor",
  "facilitator",
] as const;

function lifetime(input: {
  roles?: readonly unknown[];
  now?: unknown;
  startedAt?: unknown;
  lastActiveAt?: unknown;
}) {
  return evaluateSessionLifetime({
    now: input.now ?? NOW,
    startedAt: input.startedAt ?? NOW,
    lastActiveAt: input.lastActiveAt ?? NOW,
    roles: input.roles ?? ["parent"],
  });
}

describe("session lifetime classification", () => {
  it("uses standard timeouts unless a privileged protected role is present", () => {
    for (const role of STANDARD_ROLES) {
      assert.equal(sessionClassForRoles([role]), "standard");
    }
    assert.equal(sessionClassForRoles([]), "standard");
    assert.equal(sessionClassForRoles(["not_a_role", "parent"]), "standard");
  });

  it("uses privileged timeouts for every privileged protected role", () => {
    assert.deepEqual([...PRIVILEGED_SESSION_ROLES], [
      "programme_operations",
      "safeguarding_lead",
      "restricted_caseworker",
      "system_administrator",
      "auditor",
    ]);
    for (const role of PRIVILEGED_SESSION_ROLES) {
      assert.equal(sessionClassForRoles([role]), "privileged");
    }
  });

  it("selects the stricter privileged class when roles are mixed", () => {
    assert.equal(sessionClassForRoles(["parent", "system_administrator"]), "privileged");
    assert.equal(sessionClassForRoles(["auditor", "mentor"]), "privileged");
  });

  it("ignores client-looking labels that are not programme roles", () => {
    assert.equal(sessionClassForRoles(["System_Administrator", "admin"]), "standard");
    assert.equal(sessionClassForRoles([null, { role: "auditor" }, "parent"]), "standard");
  });

  it("covers every current programme role as standard or privileged", () => {
    for (const role of programmeRoles) {
      const expected = (PRIVILEGED_SESSION_ROLES as readonly string[]).includes(role)
        ? "privileged"
        : "standard";
      assert.equal(sessionClassForRoles([role]), expected);
    }
  });
});

describe("standard authenticated sessions", () => {
  it("permits activity inside the 30-minute idle and 12-hour absolute windows", () => {
    const result = lifetime({
      roles: ["parent"],
      startedAt: NOW - SESSION_LIFETIME.standard.absoluteMs + 1,
      lastActiveAt: NOW - SESSION_LIFETIME.standard.idleMs + 1,
    });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.class, "standard");
      assert.equal(result.absoluteExpiresAt, NOW + 1);
      assert.ok(result.idleExpiresAt <= result.absoluteExpiresAt);
    }
  });

  it("expires at the idle boundary even when the absolute window remains", () => {
    const result = lifetime({
      roles: ["legal_guardian"],
      startedAt: NOW - SESSION_LIFETIME.standard.idleMs,
      lastActiveAt: NOW - SESSION_LIFETIME.standard.idleMs,
    });
    assert.deepEqual(result, { ok: false, reason: "expired_idle" });
  });

  it("expires at the absolute boundary even when activity is current", () => {
    const result = lifetime({
      roles: ["mentor"],
      startedAt: NOW - SESSION_LIFETIME.standard.absoluteMs,
      lastActiveAt: NOW,
    });
    assert.deepEqual(result, { ok: false, reason: "expired_absolute" });
  });
});

describe("privileged sessions", () => {
  it("permits activity inside the 15-minute idle and 4-hour absolute windows", () => {
    const result = lifetime({
      roles: ["safeguarding_lead"],
      startedAt: NOW - SESSION_LIFETIME.privileged.absoluteMs + 1,
      lastActiveAt: NOW - SESSION_LIFETIME.privileged.idleMs + 1,
    });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.class, "privileged");
    }
  });

  it("expires privileged idle earlier than the standard idle window", () => {
    const elapsed = SESSION_LIFETIME.privileged.idleMs;
    const privileged = lifetime({
      roles: ["system_administrator"],
      startedAt: NOW - elapsed,
      lastActiveAt: NOW - elapsed,
    });
    const standard = lifetime({
      roles: ["parent"],
      startedAt: NOW - elapsed,
      lastActiveAt: NOW - elapsed,
    });
    assert.deepEqual(privileged, { ok: false, reason: "expired_idle" });
    assert.equal(standard.ok, true);
  });

  it("expires privileged absolute earlier than the standard absolute window", () => {
    const elapsed = SESSION_LIFETIME.privileged.absoluteMs;
    const privileged = lifetime({
      roles: ["auditor"],
      startedAt: NOW - elapsed,
      lastActiveAt: NOW,
    });
    const standard = lifetime({
      roles: ["facilitator"],
      startedAt: NOW - elapsed,
      lastActiveAt: NOW,
    });
    assert.deepEqual(privileged, { ok: false, reason: "expired_absolute" });
    assert.equal(standard.ok, true);
  });
});

describe("malformed, missing and clock-order timestamps", () => {
  it("denies missing timestamps", () => {
    assert.deepEqual(
      evaluateSessionLifetime({
        now: undefined,
        startedAt: NOW,
        lastActiveAt: NOW,
        roles: ["parent"],
      }),
      { ok: false, reason: "invalid_session_lifetime" },
    );
    assert.deepEqual(
      evaluateSessionLifetime({
        now: NOW,
        startedAt: null,
        lastActiveAt: NOW,
        roles: ["parent"],
      }),
      { ok: false, reason: "invalid_session_lifetime" },
    );
    assert.deepEqual(
      evaluateSessionLifetime({
        now: NOW,
        startedAt: NOW,
        lastActiveAt: undefined,
        roles: ["parent"],
      }),
      { ok: false, reason: "invalid_session_lifetime" },
    );
    assert.deepEqual(
      evaluateSessionLifetime({
        now: NOW,
        startedAt: NOW,
        lastActiveAt: NOW,
        roles: "system_administrator" as unknown as readonly unknown[],
      }),
      { ok: false, reason: "invalid_session_lifetime" },
    );
  });

  it("denies malformed timestamps", () => {
    const malformed = [NaN, Infinity, -Infinity, -1, 1.5, "1700000000000", {}, [], true, false];
    for (const value of malformed) {
      assert.deepEqual(
        lifetime({ now: value }),
        { ok: false, reason: "invalid_session_lifetime" },
        `now=${String(value)}`,
      );
      assert.deepEqual(
        lifetime({ startedAt: value }),
        { ok: false, reason: "invalid_session_lifetime" },
        `startedAt=${String(value)}`,
      );
      assert.deepEqual(
        lifetime({ lastActiveAt: value }),
        { ok: false, reason: "invalid_session_lifetime" },
        `lastActiveAt=${String(value)}`,
      );
    }
    assert.equal(parseServerTimestamp("2024-01-01T00:00:00.000Z"), null);
    assert.equal(parseServerTimestamp(Number.MAX_SAFE_INTEGER + 1), null);
    assert.equal(parseServerTimestamp(new Date(Number.NaN)), null);
  });

  it("accepts server Date objects with a safe epoch", () => {
    const started = new Date(NOW - 1_000);
    const active = new Date(NOW - 500);
    const now = new Date(NOW);
    const result = evaluateSessionLifetime({
      now,
      startedAt: started,
      lastActiveAt: active,
      roles: ["parent"],
    });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.lastActiveAt, NOW - 500);
    }
  });

  it("denies reversed or future clock order", () => {
    assert.deepEqual(
      lifetime({ startedAt: NOW, lastActiveAt: NOW - 1 }),
      { ok: false, reason: "invalid_session_lifetime" },
    );
    assert.deepEqual(
      lifetime({ lastActiveAt: NOW + 1 }),
      { ok: false, reason: "invalid_session_lifetime" },
    );
    assert.deepEqual(
      lifetime({ startedAt: NOW + 1, lastActiveAt: NOW + 1 }),
      { ok: false, reason: "invalid_session_lifetime" },
    );
  });

  it("permits equal started, active and now timestamps", () => {
    const result = lifetime({ startedAt: NOW, lastActiveAt: NOW, now: NOW });
    assert.equal(result.ok, true);
  });
});

describe("idle refresh versus absolute lifetime", () => {
  it("refreshes only the idle deadline and never extends the absolute deadline", () => {
    const startedAt = NOW - 60_000;
    const current = lifetime({
      roles: ["restricted_caseworker"],
      startedAt,
      lastActiveAt: NOW - 30_000,
    });
    assert.equal(current.ok, true);
    if (!current.ok) {
      return;
    }

    const refreshed = refreshIdleActivity({
      now: NOW,
      startedAt,
      lastActiveAt: NOW - 30_000,
      roles: ["restricted_caseworker"],
    });
    assert.equal(refreshed.ok, true);
    if (refreshed.ok) {
      assert.equal(refreshed.absoluteExpiresAt, current.absoluteExpiresAt);
      assert.equal(refreshed.absoluteExpiresAt, startedAt + SESSION_LIFETIME.privileged.absoluteMs);
      assert.equal(refreshed.lastActiveAt, NOW);
      assert.equal(
        refreshed.idleExpiresAt,
        Math.min(NOW + SESSION_LIFETIME.privileged.idleMs, refreshed.absoluteExpiresAt),
      );
      assert.ok(refreshed.idleExpiresAt <= refreshed.absoluteExpiresAt);
    }
  });

  it("caps a late idle refresh at the absolute deadline", () => {
    const startedAt = NOW - SESSION_LIFETIME.standard.absoluteMs + 1_000;
    const refreshed = refreshIdleActivity({
      now: NOW,
      startedAt,
      lastActiveAt: NOW,
      roles: ["parent"],
    });
    assert.equal(refreshed.ok, true);
    if (refreshed.ok) {
      assert.equal(refreshed.absoluteExpiresAt, NOW + 1_000);
      assert.equal(refreshed.idleExpiresAt, NOW + 1_000);
      assert.equal(refreshed.idleExpiresAt, refreshed.absoluteExpiresAt);
    }
  });

  it("does not revive an expired idle or absolute session", () => {
    const idleExpired = refreshIdleActivity({
      now: NOW,
      startedAt: NOW - SESSION_LIFETIME.privileged.idleMs,
      lastActiveAt: NOW - SESSION_LIFETIME.privileged.idleMs,
      roles: ["programme_operations"],
    });
    const absoluteExpired = refreshIdleActivity({
      now: NOW,
      startedAt: NOW - SESSION_LIFETIME.privileged.absoluteMs,
      lastActiveAt: NOW,
      roles: ["programme_operations"],
    });
    assert.deepEqual(idleExpired, { ok: false, reason: "expired_idle" });
    assert.deepEqual(absoluteExpired, { ok: false, reason: "expired_absolute" });
  });

  it("does not let activity extend an absolute lifetime that has already ended", () => {
    const result = lifetime({
      roles: ["parent"],
      startedAt: NOW - SESSION_LIFETIME.standard.absoluteMs,
      lastActiveAt: NOW,
    });
    assert.deepEqual(result, { ok: false, reason: "expired_absolute" });
  });
});

describe("session lifetime module boundary", () => {
  it("does not treat local lockout as distributed session control", () => {
    assert.equal(LOCKOUT_SCOPE, "local_single_process");
  });

  it("stays framework-independent and does not persist sessions", () => {
    const source = readFileSync(
      join(import.meta.dirname, "..", "lib", "auth", "session-lifetime.ts"),
      "utf8",
    );
    assert.doesNotMatch(source, /from ["']next|from ["']@supabase|cookies\(|createClient/);
    assert.doesNotMatch(source, /create table|booking_inquiries|\.channel\(/i);
  });
});
