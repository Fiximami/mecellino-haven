import { ALWAYS_DENIED_ACTIONS, type PrivilegedAction, type ProgrammeRole } from "./roles";
import { hasProtectedGrant, type AuthIdentity } from "./identity";
import { evaluateSessionLifetime } from "./session-lifetime";

export type AuthorizationDecision = {
  allowed: false;
  reason:
    | "unauthenticated"
    | "missing_protected_grant"
    | "insufficient_role"
    | "safeguarding_isolated"
    | "stale_identity"
    | "client_supplied_claims_ignored"
    | "invalid_session_lifetime"
    | "expired_idle"
    | "expired_absolute"
    | "fail_closed";
};

export type AuthorizationSuccess = {
  allowed: true;
};

export type AuthorizationResult = AuthorizationSuccess | AuthorizationDecision;

const ROLE_FOR_ACTION: Partial<Record<PrivilegedAction, readonly ProgrammeRole[]>> = {
  provision_users: ["system_administrator"],
  invite_account: ["system_administrator"],
  assign_protected_role: ["system_administrator"],
  revoke_protected_role: ["system_administrator"],
  deactivate_account: ["system_administrator"],
  manage_integration_secrets: ["system_administrator"],
  unlock_auth_lockout: ["system_administrator"],
};

export type AuthorizeInput = {
  identity: AuthIdentity | null;
  action: PrivilegedAction;
  fresh: boolean;
  clientRole?: unknown;
  clientScope?: unknown;
  userMetadata?: unknown;
  session?: {
    now?: unknown;
    startedAt?: unknown;
    lastActiveAt?: unknown;
    clientRole?: unknown;
    roles?: unknown;
    userMetadata?: unknown;
  };
};

/**
 * Server-only authorization. Fail closed.
 *
 * Roles are taken only from a freshly validated ProtectedIdentity, which must
 * be built from the server-owned RoleAssignment record. Client and JWT
 * metadata are never used as a fallback for privileged authorization.
 * `user_metadata`, URL parameters, form fields and other client state are
 * ignored even if present on this input.
 *
 * Privileged actions require `fresh: true` (Auth `getUser()`, not cookie
 * `getSession()` and not an unverified browser session). Role and scope data
 * are loaded from the protected server-side assignment store. Session idle
 * and absolute lifetime use server timestamps and protected roles only.
 */
export function authorize(input: AuthorizeInput): AuthorizationResult {
  void input.clientRole;
  void input.clientScope;
  void input.userMetadata;
  void input.session?.clientRole;
  void input.session?.roles;
  void input.session?.userMetadata;

  if (!input.fresh) {
    return { allowed: false, reason: "stale_identity" };
  }

  if (!input.identity || !input.identity.authenticated) {
    return { allowed: false, reason: "unauthenticated" };
  }

  if ((ALWAYS_DENIED_ACTIONS as readonly PrivilegedAction[]).includes(input.action)) {
    return { allowed: false, reason: "safeguarding_isolated" };
  }

  if (!hasProtectedGrant(input.identity)) {
    return { allowed: false, reason: "missing_protected_grant" };
  }

  const lifetime = evaluateSessionLifetime({
    now: input.session?.now,
    startedAt: input.session?.startedAt,
    lastActiveAt: input.session?.lastActiveAt,
    roles: input.identity.roles,
  });
  if (!lifetime.ok) {
    return { allowed: false, reason: lifetime.reason };
  }

  const permitted = ROLE_FOR_ACTION[input.action];
  if (!permitted) {
    return { allowed: false, reason: "fail_closed" };
  }

  const allowed = input.identity.roles.some((role) => permitted.includes(role));
  if (!allowed) {
    return { allowed: false, reason: "insufficient_role" };
  }

  return { allowed: true };
}

export function denyClientSuppliedElevation(): AuthorizationDecision {
  return { allowed: false, reason: "client_supplied_claims_ignored" };
}
