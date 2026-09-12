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
