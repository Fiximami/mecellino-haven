/**
 * Application-level idle and absolute session lifetime policy.
 * Does not persist cookies, enable hosted authentication, or implement
 * cross-instance throttling.
 *
 * Timeouts are derived from server-controlled timestamps and protected
 * programme roles only. Client metadata is ignored by callers.
 */
import { isProgrammeRole, type ProgrammeRole } from "./roles";

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;

export const SESSION_LIFETIME = {
  standard: {
    idleMs: 30 * MINUTE_MS,
    absoluteMs: 12 * HOUR_MS,
  },
  privileged: {
    idleMs: 15 * MINUTE_MS,
    absoluteMs: 4 * HOUR_MS,
  },
} as const;

export const PRIVILEGED_SESSION_ROLES = [
  "programme_operations",
  "safeguarding_lead",
  "restricted_caseworker",
  "system_administrator",
  "auditor",
] as const satisfies readonly ProgrammeRole[];

export type SessionLifetimeClass = keyof typeof SESSION_LIFETIME;

const PRIVILEGED_SESSION_ROLE_SET = new Set<string>(PRIVILEGED_SESSION_ROLES);

export type SessionLifetimeInput = {
  now: unknown;
  startedAt: unknown;
  lastActiveAt: unknown;
  roles: readonly unknown[];
};

export type SessionLifetimeDenial = {
  ok: false;
  reason: "invalid_session_lifetime" | "expired_idle" | "expired_absolute";
};

export type SessionLifetimeSuccess = {
  ok: true;
  class: SessionLifetimeClass;
  lastActiveAt: number;
  idleExpiresAt: number;
  absoluteExpiresAt: number;
};

export type SessionLifetimeResult = SessionLifetimeSuccess | SessionLifetimeDenial;

export function sessionClassForRoles(roles: readonly unknown[]): SessionLifetimeClass {
  if (!Array.isArray(roles)) {
    return "standard";
  }

  for (const value of roles) {
    if (typeof value === "string" && PRIVILEGED_SESSION_ROLE_SET.has(value) && isProgrammeRole(value)) {
      return "privileged";
    }
  }
  return "standard";
}

export function parseServerTimestamp(value: unknown): number | null {
  if (typeof value === "number") {
    if (!Number.isSafeInteger(value) || value < 0) {
      return null;
    }
    return value;
  }

  if (value instanceof Date) {
    const milliseconds = value.getTime();
    if (!Number.isSafeInteger(milliseconds) || milliseconds < 0) {
      return null;
    }
    return milliseconds;
  }

  return null;
}

function capIdleExpiry(lastActiveAt: number, idleMs: number, absoluteExpiresAt: number): number {
  return Math.min(lastActiveAt + idleMs, absoluteExpiresAt);
}

export function evaluateSessionLifetime(input: SessionLifetimeInput): SessionLifetimeResult {
  const now = parseServerTimestamp(input.now);
  const startedAt = parseServerTimestamp(input.startedAt);
  const lastActiveAt = parseServerTimestamp(input.lastActiveAt);

  if (now === null || startedAt === null || lastActiveAt === null || !Array.isArray(input.roles)) {
    return { ok: false, reason: "invalid_session_lifetime" };
  }

  if (startedAt > lastActiveAt || lastActiveAt > now) {
    return { ok: false, reason: "invalid_session_lifetime" };
  }

  const sessionClass = sessionClassForRoles(input.roles);
  const limits = SESSION_LIFETIME[sessionClass];
  const absoluteExpiresAt = startedAt + limits.absoluteMs;

  if (now >= absoluteExpiresAt) {
    return { ok: false, reason: "expired_absolute" };
  }

  const idleExpiresAt = capIdleExpiry(lastActiveAt, limits.idleMs, absoluteExpiresAt);
  if (now >= idleExpiresAt) {
    return { ok: false, reason: "expired_idle" };
  }

  return {
    ok: true,
    class: sessionClass,
    lastActiveAt,
    idleExpiresAt,
    absoluteExpiresAt,
  };
}

/**
 * Activity may move only the idle deadline, and never past the absolute
 * deadline. Expired or malformed sessions cannot be refreshed.
 */
export function refreshIdleActivity(input: SessionLifetimeInput): SessionLifetimeResult {
  const current = evaluateSessionLifetime(input);
  if (!current.ok) {
    return current;
  }

  const now = parseServerTimestamp(input.now);
  if (now === null) {
    return { ok: false, reason: "invalid_session_lifetime" };
  }

  const limits = SESSION_LIFETIME[current.class];
  return {
    ok: true,
    class: current.class,
    lastActiveAt: now,
    idleExpiresAt: capIdleExpiry(now, limits.idleMs, current.absoluteExpiresAt),
    absoluteExpiresAt: current.absoluteExpiresAt,
  };
}
