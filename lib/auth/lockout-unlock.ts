/**
 * Privileged lockout unlock. Not a public route. Hosted authentication stays disabled.
 */
import { emitRequiredAuthAudit, type AuthAuditSink } from "./audit";
import { authorize, type AuthorizationDecision, type AuthorizeInput } from "./authorize";
import type { DistributedLockoutStore } from "./lockout-distributed";
import { deriveLockoutHmacs, parseLockoutPepperMaterial, type LockoutPepperMaterial } from "./lockout-identifier";
import type { AuthIdentity } from "./identity";

export type UnlockLockoutResult =
  | { unlocked: true }
  | {
      unlocked: false;
      reason:
        | AuthorizationDecision["reason"]
        | "unavailable"
        | "invalid_identifier"
        | "invalid_pepper"
        | "audit_unavailable"
        | "not_locked";
    };

class UnlockAuditUnavailableError extends Error {
  readonly reason = "audit_unavailable" as const;
}

export async function unlockDistributedAuthLockout(input: {
  identity: AuthIdentity | null;
  fresh: boolean;
  session?: AuthorizeInput["session"];
  identifier: unknown;
  peppers: LockoutPepperMaterial | null | undefined;
  store: DistributedLockoutStore | null | undefined;
  auditSink: AuthAuditSink | null | undefined;
  clientRole?: unknown;
}): Promise<UnlockLockoutResult> {
  void input.clientRole;

  const decision = authorize({
    identity: input.identity,
    action: "unlock_auth_lockout",
    fresh: input.fresh,
    session: input.session,
    clientRole: input.clientRole,
  });
  if (!decision.allowed) {
    return { unlocked: false, reason: decision.reason };
  }

  if (!parseLockoutPepperMaterial(input.peppers ?? null)) {
    return { unlocked: false, reason: "invalid_pepper" };
  }
  const derived = deriveLockoutHmacs(input.identifier, input.peppers);
  if (!derived) {
    return { unlocked: false, reason: "invalid_identifier" };
  }
  if (!input.store) {
    return { unlocked: false, reason: "unavailable" };
  }
  const auditSink = input.auditSink;
  if (!auditSink) {
    return { unlocked: false, reason: "audit_unavailable" };
  }

  try {
    const unlocked = await input.store.unlockAndAudit(
      derived.current.hmac,
      derived.previous?.hmac,
      async () => {
        const audited = await emitRequiredAuthAudit(
          { class: "lockout", result: "success", action: "unlock_auth_lockout" },
          auditSink,
        );
        if (!audited.persisted) {
          throw new UnlockAuditUnavailableError();
        }
      },
    );
    if (!unlocked) {
      return { unlocked: false, reason: "not_locked" };
    }
  } catch (error) {
    if (error instanceof UnlockAuditUnavailableError) {
      return { unlocked: false, reason: "audit_unavailable" };
    }
    return { unlocked: false, reason: "unavailable" };
  }

  return { unlocked: true };
}
