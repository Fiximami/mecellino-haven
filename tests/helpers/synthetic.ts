import { identityFromProtectedClaims, type ProtectedIdentity } from "../../lib/auth/identity.ts";

export const SYNTHETIC_STAFF_WITHOUT_GRANT: ProtectedIdentity = identityFromProtectedClaims({
  appMetadata: {},
  userMetadata: { role: "system_administrator", name: "Synthetic Unauthorised Staff" },
});

export const SYNTHETIC_OPERATIONS: ProtectedIdentity = identityFromProtectedClaims({
  appMetadata: { roles: ["programme_operations"] },
  userMetadata: { role: "system_administrator" },
});

export const SYNTHETIC_ADMINISTRATOR: ProtectedIdentity = identityFromProtectedClaims({
  appMetadata: { roles: ["system_administrator"] },
  userMetadata: { role: "restricted_caseworker" },
});

export const SYNTHETIC_SESSION_NOW = 1_700_000_000_000;

export function syntheticSessionTimestamps(overrides: {
  now?: number;
  startedAt?: number;
  lastActiveAt?: number;
} = {}) {
  const now = overrides.now ?? SYNTHETIC_SESSION_NOW;
  return {
    now,
    startedAt: overrides.startedAt ?? now,
    lastActiveAt: overrides.lastActiveAt ?? now,
  };
}
