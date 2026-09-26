import { getDatabaseClient } from "../database/client";
import type { DistributedLockoutStore } from "./lockout-distributed";
import { isLockoutHmac } from "./lockout-identifier";

/**
 * Server-only adapter for private.auth_lockouts. Not used by live sign-in.
 * Production lock timing uses the database clock. This adapter never sends
 * an application timestamp into SQL.
 */
export function createPostgresDistributedLockoutStore(): DistributedLockoutStore | null {
  const database = getDatabaseClient();
  if (!database) {
    return null;
  }

  return {
    async isLocked(currentHmac, previousHmac) {
      if (!isLockoutHmac(currentHmac) || (previousHmac !== undefined && !isLockoutHmac(previousHmac))) {
        throw new Error("unavailable");
      }
      const rows = await database<Array<{ locked: boolean }>>`
        select private.auth_lockout_is_locked(
          ${currentHmac}::text,
          ${previousHmac ?? null}::text
        ) as locked
      `;
      const locked = rows[0]?.locked;
      if (typeof locked !== "boolean") {
        throw new Error("unavailable");
      }
      return locked;
    },
    async recordFailure(currentHmac, pepperVersion) {
      if (!isLockoutHmac(currentHmac) || !Number.isInteger(pepperVersion) || pepperVersion < 1) {
        throw new Error("unavailable");
      }
      const rows = await database<Array<{ locked: boolean }>>`
        select private.auth_lockout_record_failure(
          ${currentHmac}::text,
          ${pepperVersion}::smallint
        ) as locked
      `;
      const locked = rows[0]?.locked;
      if (typeof locked !== "boolean") {
        throw new Error("unavailable");
      }
      return locked;
    },
    async clear(currentHmac, previousHmac) {
      if (!isLockoutHmac(currentHmac) || (previousHmac !== undefined && !isLockoutHmac(previousHmac))) {
        throw new Error("unavailable");
      }
      await database`
        select private.auth_lockout_clear(
          ${currentHmac}::text,
          ${previousHmac ?? null}::text
        )
      `;
    },
    async unlockAndAudit(currentHmac, previousHmac) {
      if (!isLockoutHmac(currentHmac) || (previousHmac !== undefined && !isLockoutHmac(previousHmac))) {
        throw new Error("unavailable");
      }
      const rows = await database<Array<{ unlocked: boolean }>>`
        select private.auth_lockout_unlock_and_audit(
          ${currentHmac}::text,
          ${previousHmac ?? null}::text
        ) as unlocked
      `;
      const unlocked = rows[0]?.unlocked;
      if (typeof unlocked !== "boolean") {
        throw new Error("unavailable");
      }
      return unlocked;
    },
  };
}
