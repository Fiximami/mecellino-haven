import {
  emitNonDurableAuthAudit,
  emitRequiredAuthAudit,
  type AuthAuditSink,
} from "./audit";
import { NEUTRAL_AUTH_ERROR, NEUTRAL_RECOVERY_MESSAGE } from "./errors";
import {
  clearFailedAttempts,
  isIdentifierLocked,
  recordFailedAttempt,
} from "./lockout";
import { sanitizeReturnPath } from "./return-path";

export type SignInRequest = {
  email: unknown;
  password: unknown;
  next?: unknown;
};

export type SignInResult = {
  ok: false;
  message: string;
  redirectTo?: undefined;
};

export type SignInSuccess = {
  ok: true;
  redirectTo: string;
};

export type PasswordAuthenticator = (input: {
  email: string;
  password: string;
}) => Promise<{ ok: true } | { ok: false }>;

export type AuthenticatedSessionRevoker = () => Promise<void>;

export type RecoverySender = (input: { email: string }) => Promise<void>;

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function completePasswordSignIn(
  request: SignInRequest,
  authenticate: PasswordAuthenticator,
  options: {
    auditSink?: AuthAuditSink | null;
    requireDurableAudit?: boolean;
    revokeAuthenticatedSession?: AuthenticatedSessionRevoker;
  } = {},
): Promise<SignInResult | SignInSuccess> {
  const email = asTrimmedString(request.email);
  const password = typeof request.password === "string" ? request.password : "";
  const redirectTo = sanitizeReturnPath(request.next);

  if (!email || !password) {
    await persistAudit({ class: "sign_in", result: "failure" }, options.auditSink);
    return { ok: false, message: NEUTRAL_AUTH_ERROR };
  }

  if (isIdentifierLocked(email)) {
    await persistAudit({ class: "sign_in", result: "denied" }, options.auditSink);
    return { ok: false, message: NEUTRAL_AUTH_ERROR };
  }

  const outcome = await authenticate({ email, password });
  if (!outcome.ok) {
    recordFailedAttempt(email);
    await persistAudit({ class: "sign_in", result: "failure" }, options.auditSink);
    return { ok: false, message: NEUTRAL_AUTH_ERROR };
  }

  clearFailedAttempts(email);
  const auditPersisted = await persistAudit(
    { class: "sign_in", result: "success" },
    options.auditSink,
    options.requireDurableAudit === true,
  );
  if (!auditPersisted) {
    await options.revokeAuthenticatedSession?.();
    return { ok: false, message: NEUTRAL_AUTH_ERROR };
  }

  return { ok: true, redirectTo };
}

export async function completeRecoveryRequest(
  identifier: unknown,
  sendRecovery: RecoverySender | null,
  auditSink?: AuthAuditSink | null,
): Promise<{ message: string }> {
  const email = asTrimmedString(identifier);

  if (email && sendRecovery) {
    try {
      await sendRecovery({ email });
    } catch {
      // Neutral response whether the identifier exists or the provider failed.
    }
  }

  await persistAudit({ class: "recovery", result: "success" }, auditSink);
  return { message: NEUTRAL_RECOVERY_MESSAGE };
}

async function persistAudit(
  event: Parameters<typeof emitNonDurableAuthAudit>[0],
  auditSink?: AuthAuditSink | null,
  required = false,
): Promise<boolean> {
  if (!auditSink) {
    if (required) {
      return false;
    }
    emitNonDurableAuthAudit(event);
    return true;
  }

  const result = await emitRequiredAuthAudit(event, auditSink);
  return result.persisted;
}
