/**
 * Server-only lockout pepper configuration. Never prefix these names with
 * NEXT_PUBLIC_. This module does not log, print or embed pepper material.
 */
import {
  parseLockoutPepperMaterial,
  type LockoutPepperMaterial,
} from "./lockout-identifier";

export const AUTH_LOCKOUT_PEPPER_CURRENT = "AUTH_LOCKOUT_PEPPER_CURRENT";
export const AUTH_LOCKOUT_PEPPER_CURRENT_VERSION = "AUTH_LOCKOUT_PEPPER_CURRENT_VERSION";
export const AUTH_LOCKOUT_PEPPER_PREVIOUS = "AUTH_LOCKOUT_PEPPER_PREVIOUS";
export const AUTH_LOCKOUT_PEPPER_PREVIOUS_VERSION = "AUTH_LOCKOUT_PEPPER_PREVIOUS_VERSION";

const FORBIDDEN_PUBLIC_LOCKOUT_NAMES = [
  `NEXT_PUBLIC_${AUTH_LOCKOUT_PEPPER_CURRENT}`,
  `NEXT_PUBLIC_${AUTH_LOCKOUT_PEPPER_CURRENT_VERSION}`,
  `NEXT_PUBLIC_${AUTH_LOCKOUT_PEPPER_PREVIOUS}`,
  `NEXT_PUBLIC_${AUTH_LOCKOUT_PEPPER_PREVIOUS_VERSION}`,
] as const;

export type LockoutPepperConfig =
  | { ok: true; peppers: LockoutPepperMaterial }
  | {
      ok: false;
      reason:
        | "missing"
        | "invalid"
        | "incomplete_rotation"
        | "duplicate_version"
        | "public_secret_misconfigured";
    };

type EnvMap = Record<string, string | undefined>;

function trimEnv(value: string | undefined): string {
  return value?.trim() ?? "";
}

function parseVersion(value: string): number | null {
  if (!/^[1-9][0-9]*$/.test(value)) {
    return null;
  }
  const version = Number(value);
  if (!Number.isInteger(version) || version < 1) {
    return null;
  }
  return version;
}

export function hasPublicLockoutPepperMisconfiguration(env: EnvMap = process.env): boolean {
  return FORBIDDEN_PUBLIC_LOCKOUT_NAMES.some((name) => trimEnv(env[name]).length > 0);
}

export function readLockoutPepperConfig(env: EnvMap = process.env): LockoutPepperConfig {
  if (hasPublicLockoutPepperMisconfiguration(env)) {
    return { ok: false, reason: "public_secret_misconfigured" };
  }

  const currentSecret = trimEnv(env[AUTH_LOCKOUT_PEPPER_CURRENT]);
  const currentVersionRaw = trimEnv(env[AUTH_LOCKOUT_PEPPER_CURRENT_VERSION]);
  const previousSecret = trimEnv(env[AUTH_LOCKOUT_PEPPER_PREVIOUS]);
  const previousVersionRaw = trimEnv(env[AUTH_LOCKOUT_PEPPER_PREVIOUS_VERSION]);

  if (!currentSecret && !currentVersionRaw && !previousSecret && !previousVersionRaw) {
    return { ok: false, reason: "missing" };
  }

  if (!currentSecret || !currentVersionRaw) {
    return { ok: false, reason: currentSecret || currentVersionRaw ? "invalid" : "missing" };
  }

  const currentVersion = parseVersion(currentVersionRaw);
  if (currentVersion === null) {
    return { ok: false, reason: "invalid" };
  }

  const previousPresent = previousSecret.length > 0 || previousVersionRaw.length > 0;
  if (previousPresent && (!previousSecret || !previousVersionRaw)) {
    return { ok: false, reason: "incomplete_rotation" };
  }

  const previousVersion = previousPresent ? parseVersion(previousVersionRaw) : null;
  if (previousPresent && previousVersion === null) {
    return { ok: false, reason: "invalid" };
  }
  if (previousVersion === currentVersion) {
    return { ok: false, reason: "duplicate_version" };
  }

  const material = parseLockoutPepperMaterial({
    current: { version: currentVersion, secret: currentSecret },
    previous:
      previousSecret && previousVersion !== null
        ? { version: previousVersion, secret: previousSecret }
        : undefined,
  });
  if (!material) {
    return { ok: false, reason: "invalid" };
  }

  return { ok: true, peppers: material };
}

export const LOCKOUT_PEPPER_PUBLIC_ENV_NAMES = FORBIDDEN_PUBLIC_LOCKOUT_NAMES;
