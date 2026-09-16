/**
 * Local, single-process lockout only. The map lives in this Node process
 * and is lost on restart, and it is not shared across instances.
 * Use this store only for synthetic and local flows. It is never a fallback
 * for hosted or privileged authentication.
 */
import { createHash } from "node:crypto";

export const LOCKOUT_SCOPE = "local_single_process" as const;

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;
const MAX_TRACKED = 256;

type Bucket = {
  failures: number;
  firstFailureAt: number;
};

const buckets = new Map<string, Bucket>();

export function hashAuthIdentifier(identifier: string): string {
  return createHash("sha256").update(identifier.trim().toLowerCase()).digest("hex");
}

function prune(now: number) {
  for (const [key, bucket] of buckets) {
    if (now - bucket.firstFailureAt > WINDOW_MS) {
      buckets.delete(key);
    }
  }

  if (buckets.size <= MAX_TRACKED) {
    return;
  }

  const oldest = [...buckets.entries()].sort((a, b) => a[1].firstFailureAt - b[1].firstFailureAt);
  for (const [key] of oldest.slice(0, buckets.size - MAX_TRACKED)) {
    buckets.delete(key);
  }
}

export function isIdentifierLocked(identifier: string, now = Date.now()): boolean {
  prune(now);
  const bucket = buckets.get(hashAuthIdentifier(identifier));
  if (!bucket) {
    return false;
  }
  if (now - bucket.firstFailureAt > WINDOW_MS) {
    buckets.delete(hashAuthIdentifier(identifier));
    return false;
  }
  return bucket.failures >= MAX_FAILURES;
}

export function recordFailedAttempt(identifier: string, now = Date.now()): void {
  prune(now);
  const key = hashAuthIdentifier(identifier);
  const existing = buckets.get(key);
  if (!existing || now - existing.firstFailureAt > WINDOW_MS) {
    buckets.set(key, { failures: 1, firstFailureAt: now });
    return;
  }
  existing.failures += 1;
}

export function clearFailedAttempts(identifier: string): void {
  buckets.delete(hashAuthIdentifier(identifier));
}

export function resetLockoutStoreForTests(): void {
  buckets.clear();
}
