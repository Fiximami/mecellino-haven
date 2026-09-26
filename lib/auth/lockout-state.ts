export const LOCKOUT_FAILURE_THRESHOLD = 5;
export const LOCKOUT_WINDOW_MS = 15 * 60 * 1000;
export const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

export type LockoutRowState = {
  hmac: string;
  pepperVersion: number;
  failureCount: number;
  windowStartedAt: number;
  lockedUntil: number | null;
  lastEventAt: number;
};

export type LockoutMutation = {
  row: LockoutRowState;
  locked: boolean;
};

function isCurrentlyLocked(row: LockoutRowState, now: number): boolean {
  return row.lockedUntil !== null && row.lockedUntil > now;
}

function lockHasExpired(row: LockoutRowState, now: number): boolean {
  return row.lockedUntil !== null && row.lockedUntil <= now;
}

function windowHasExpired(row: LockoutRowState, now: number): boolean {
  return now >= row.windowStartedAt + LOCKOUT_WINDOW_MS;
}

export function lockoutIsActive(row: LockoutRowState | null, now: number): boolean {
  return row !== null && isCurrentlyLocked(row, now);
}

export function applyLockoutFailure(
  row: LockoutRowState | null,
  now: number,
  hmac: string,
  pepperVersion: number,
): LockoutMutation {
  if (row && isCurrentlyLocked(row, now)) {
    return {
      row: { ...row, lastEventAt: now },
      locked: true,
    };
  }

  if (!row || lockHasExpired(row, now) || windowHasExpired(row, now)) {
    const next: LockoutRowState = {
      hmac,
      pepperVersion,
      failureCount: 1,
      windowStartedAt: now,
      lockedUntil: null,
      lastEventAt: now,
    };
    return { row: next, locked: false };
  }

  const failureCount = row.failureCount + 1;
  const locked = failureCount >= LOCKOUT_FAILURE_THRESHOLD;
  const next: LockoutRowState = {
    hmac,
    pepperVersion,
    failureCount,
    windowStartedAt: row.windowStartedAt,
    lockedUntil: locked ? now + LOCKOUT_DURATION_MS : null,
    lastEventAt: now,
  };
  return { row: next, locked };
}
