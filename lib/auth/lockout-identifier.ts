/**
 * Server-only lockout identifier derivation.
 * Does not read environment values, persist cookies, or import a framework.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

export const LOCKOUT_IDENTIFIER_MAX_CHARS = 320;
export const LOCKOUT_PEPPER_MIN_BYTES = 32;
export const LOCKOUT_PEPPER_ROTATION_DAYS = 90;
export const LOCKOUT_HMAC_PURPOSE_EMAIL = "email" as const;

export type LockoutHmacPurpose = typeof LOCKOUT_HMAC_PURPOSE_EMAIL | "phone";

export type LockoutPepperVersion = {
  version: number;
  secret: string | Uint8Array;
};

export type LockoutPepperMaterial = {
  current: LockoutPepperVersion;
  previous?: LockoutPepperVersion;
};

export type DerivedLockoutHmacs = {
  current: { version: number; hmac: string };
  previous?: { version: number; hmac: string };
};

const HMAC_HEX = /^[0-9a-f]{64}$/;
const PURPOSE_TOKEN = /^[a-z_]+$/;

export function normalizeLockoutIdentifier(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.normalize("NFKC").trim().toLowerCase();
  if (!normalized || Array.from(normalized).length > LOCKOUT_IDENTIFIER_MAX_CHARS) {
    return null;
  }

  return normalized;
}

function pepperBytes(secret: string | Uint8Array): Buffer | null {
  const bytes = typeof secret === "string" ? Buffer.from(secret, "utf8") : Buffer.from(secret);
  if (bytes.length < LOCKOUT_PEPPER_MIN_BYTES) {
    return null;
  }
  return bytes;
}

function isValidVersion(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 1;
}

export function parseLockoutPepperMaterial(
  value: LockoutPepperMaterial | null | undefined,
): LockoutPepperMaterial | null {
  if (!value || !isValidVersion(value.current?.version)) {
    return null;
  }
  if (!pepperBytes(value.current.secret)) {
    return null;
  }
  if (!value.previous) {
    return { current: value.current };
  }
  if (
    !isValidVersion(value.previous.version) ||
    value.previous.version === value.current.version ||
    !pepperBytes(value.previous.secret)
  ) {
    return null;
  }
  return { current: value.current, previous: value.previous };
}

export function hmacLockoutIdentifier(
  identifier: unknown,
  pepper: LockoutPepperVersion,
  purpose: LockoutHmacPurpose = LOCKOUT_HMAC_PURPOSE_EMAIL,
): string | null {
  const normalized = normalizeLockoutIdentifier(identifier);
  const key = pepperBytes(pepper.secret);
  if (!normalized || !key || !PURPOSE_TOKEN.test(purpose) || !isValidVersion(pepper.version)) {
    return null;
  }

  return createHmac("sha256", key)
    .update(`v1|${purpose}|${normalized}`)
    .digest("hex");
}

export function deriveLockoutHmacs(
  identifier: unknown,
  peppers: LockoutPepperMaterial | null | undefined,
  purpose: LockoutHmacPurpose = LOCKOUT_HMAC_PURPOSE_EMAIL,
): DerivedLockoutHmacs | null {
  const material = parseLockoutPepperMaterial(peppers);
  if (!material) {
    return null;
  }

  const current = hmacLockoutIdentifier(identifier, material.current, purpose);
  if (!current) {
    return null;
  }

  const derived: DerivedLockoutHmacs = {
    current: { version: material.current.version, hmac: current },
  };

  if (!material.previous) {
    return derived;
  }

  const previous = hmacLockoutIdentifier(identifier, material.previous, purpose);
  if (!previous) {
    return null;
  }
  derived.previous = { version: material.previous.version, hmac: previous };
  return derived;
}

export function isLockoutHmac(value: unknown): value is string {
  return typeof value === "string" && HMAC_HEX.test(value);
}

export function hmacsEqual(left: string, right: string): boolean {
  if (!isLockoutHmac(left) || !isLockoutHmac(right)) {
    return false;
  }
  const a = Buffer.from(left, "hex");
  const b = Buffer.from(right, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}
