import {
  parseProtectedRoles,
  parseServerScopes,
  type AuthorizationScope,
  type ProgrammeRole,
} from "./roles";

export type ProtectedIdentity = {
  authenticated: true;
  roles: readonly ProgrammeRole[];
  scopes: readonly AuthorizationScope[];
  freshness: "user";
};

export type AnonymousIdentity = {
  authenticated: false;
};

export type AuthIdentity = ProtectedIdentity | AnonymousIdentity;

export function identityFromProtectedClaims(input: {
  appMetadata: unknown;
  serverScopes?: unknown;
  userMetadata?: unknown;
}): ProtectedIdentity {
  void input.userMetadata;

  return {
    authenticated: true,
    roles: parseProtectedRoles(input.appMetadata),
    scopes: parseServerScopes(input.serverScopes),
    freshness: "user",
  };
}

export function anonymousIdentity(): AnonymousIdentity {
  return { authenticated: false };
}

export function hasProtectedGrant(identity: AuthIdentity): boolean {
  return identity.authenticated && identity.roles.length > 0;
}
