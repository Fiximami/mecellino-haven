/**
 * Distributed lockout store port. Hosted sign-in must not fall back to the
 * process-local map when this store is unavailable.
 */
import {
  deriveLockoutHmacs,
  parseLockoutPepperMaterial,
  type DerivedLockoutHmacs,
  type LockoutHmacPurpose,
  type LockoutPepperMaterial,
} from "./lockout-identifier";
import {
  applyLockoutFailure,
  lockoutIsActive,
  type LockoutRowState,
} from "./lockout-state";

export const DISTRIBUTED_LOCKOUT_SCOPE = "distributed_postgres" as const;

export type DistributedLockoutDenial = {
  ok: false;
  reason: "unavailable" | "invalid_identifier" | "invalid_pepper";
};

export type DistributedLockoutSuccess = {
  ok: true;
  locked: boolean;
};

export type DistributedLockoutResult = DistributedLockoutSuccess | DistributedLockoutDenial;

export interface DistributedLockoutStore {
  isLocked(currentHmac: string, previousHmac?: string, now?: number): Promise<boolean>;
  recordFailure(currentHmac: string, pepperVersion: number, now?: number): Promise<boolean>;
  clear(currentHmac: string, previousHmac?: string): Promise<void>;
  /**
   * Remove a lockout row and persist lockout/success together.
   * Returns true only when at least one row was removed and success was recorded.
   * A missing lock is a no-op: false, and no success audit.
   * Production SQL performs both in one statement and must not invoke persistSuccessAudit.
   */
  unlockAndAudit(
    currentHmac: string,
    previousHmac: string | undefined,
    persistSuccessAudit: () => Promise<void>,
  ): Promise<boolean>;
}

export function createMemoryDistributedLockoutStore(): DistributedLockoutStore {
  const rows = new Map<string, LockoutRowState>();

  const store: DistributedLockoutStore = {
    async isLocked(currentHmac, previousHmac, now = Date.now()) {
      return (
        lockoutIsActive(rows.get(currentHmac) ?? null, now) ||
        lockoutIsActive(previousHmac ? rows.get(previousHmac) ?? null : null, now)
      );
    },
    async recordFailure(currentHmac, pepperVersion, now = Date.now()) {
      const applied = applyLockoutFailure(
        rows.get(currentHmac) ?? null,
        now,
        currentHmac,
        pepperVersion,
      );
      rows.set(currentHmac, applied.row);
      return applied.locked;
    },
    async clear(currentHmac, previousHmac) {
      rows.delete(currentHmac);
      if (previousHmac) {
        rows.delete(previousHmac);
      }
    },
    async unlockAndAudit(currentHmac, previousHmac, persistSuccessAudit) {
      const currentRow = rows.get(currentHmac);
      const previousRow = previousHmac ? rows.get(previousHmac) : undefined;
      if (currentRow === undefined && previousRow === undefined) {
        return false;
      }
      await store.clear(currentHmac, previousHmac);
      try {
        await persistSuccessAudit();
      } catch (error) {
        if (currentRow !== undefined) {
          rows.set(currentHmac, currentRow);
        }
        if (previousHmac !== undefined && previousRow !== undefined) {
          rows.set(previousHmac, previousRow);
        }
        throw error;
      }
      return true;
    },
  };

  return store;
}

function deriveOrDeny(
  identifier: unknown,
  peppers: LockoutPepperMaterial | null | undefined,
  purpose?: LockoutHmacPurpose,
): DerivedLockoutHmacs | DistributedLockoutDenial {
  if (!parseLockoutPepperMaterial(peppers ?? null)) {
    return { ok: false, reason: "invalid_pepper" };
  }
  const derived = deriveLockoutHmacs(identifier, peppers, purpose);
  if (!derived) {
    return { ok: false, reason: "invalid_identifier" };
  }
  return derived;
}

function isDenial(
  value: DerivedLockoutHmacs | DistributedLockoutDenial,
): value is DistributedLockoutDenial {
  return "ok" in value && value.ok === false;
}

export async function inspectDistributedLockout(
  identifier: unknown,
  peppers: LockoutPepperMaterial | null | undefined,
  store: DistributedLockoutStore | null | undefined,
  purpose?: LockoutHmacPurpose,
  now?: number,
): Promise<DistributedLockoutResult> {
  const derived = deriveOrDeny(identifier, peppers, purpose);
  if (isDenial(derived)) {
    return derived;
  }
  if (!store) {
    return { ok: false, reason: "unavailable" };
  }

  try {
    const locked = await store.isLocked(derived.current.hmac, derived.previous?.hmac, now);
    return { ok: true, locked };
  } catch {
    return { ok: false, reason: "unavailable" };
  }
}

export async function recordDistributedLockoutFailure(
  identifier: unknown,
  peppers: LockoutPepperMaterial | null | undefined,
  store: DistributedLockoutStore | null | undefined,
  now?: number,
  purpose?: LockoutHmacPurpose,
): Promise<DistributedLockoutResult> {
  const derived = deriveOrDeny(identifier, peppers, purpose);
  if (isDenial(derived)) {
    return derived;
  }
  if (!store) {
    return { ok: false, reason: "unavailable" };
  }

  try {
    const locked = await store.recordFailure(derived.current.hmac, derived.current.version, now);
    return { ok: true, locked };
  } catch {
    return { ok: false, reason: "unavailable" };
  }
}

export async function clearDistributedLockout(
  identifier: unknown,
  peppers: LockoutPepperMaterial | null | undefined,
  store: DistributedLockoutStore | null | undefined,
  purpose?: LockoutHmacPurpose,
): Promise<DistributedLockoutResult> {
  const derived = deriveOrDeny(identifier, peppers, purpose);
  if (isDenial(derived)) {
    return derived;
  }
  if (!store) {
    return { ok: false, reason: "unavailable" };
  }

  try {
    await store.clear(derived.current.hmac, derived.previous?.hmac);
    return { ok: true, locked: false };
  } catch {
    return { ok: false, reason: "unavailable" };
  }
}
