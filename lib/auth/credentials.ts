import { emitNonDurableAuthAudit } from "./audit";
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

export type RecoverySender = (input: { email: string }) => Promise<void>;

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function completePasswordSignIn(
  request: SignInRequest,
  authenticate: PasswordAuthenticator,
): Promise<SignInResult | SignInSuccess> {
  const email = asTrimmedString(request.email);
  const password = typeof request.password === "string" ? request.password : "";
  const redirectTo = sanitizeReturnPath(request.next);

  if (!email || !password) {
    emitNonDurableAuthAudit({ class: "sign_in", result: "failure" });
    return { ok: false, message: NEUTRAL_AUTH_ERROR };
  }

  if (isIdentifierLocked(email)) {
    emitNonDurableAuthAudit({ class: "sign_in", result: "denied" });
    return { ok: false, message: NEUTRAL_AUTH_ERROR };
  }

  const outcome = await authenticate({ email, password });
  if (!outcome.ok) {
    recordFailedAttempt(email);
    emitNonDurableAuthAudit({ class: "sign_in", result: "failure" });
    return { ok: false, message: NEUTRAL_AUTH_ERROR };
  }

  clearFailedAttempts(email);
  emitNonDurableAuthAudit({ class: "sign_in", result: "success" });
  return { ok: true, redirectTo };
}

export async function completeRecoveryRequest(
  identifier: unknown,
  sendRecovery: RecoverySender | null,
): Promise<{ message: string }> {
  const email = asTrimmedString(identifier);

  if (email && sendRecovery) {
    try {
      await sendRecovery({ email });
    } catch {
      // Neutral response whether the identifier exists or the provider failed.
    }
  }

  emitNonDurableAuthAudit({ class: "recovery", result: "success" });
  return { message: NEUTRAL_RECOVERY_MESSAGE };
}
