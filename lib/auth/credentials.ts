import {
  emitNonDurableAuthAudit,
  emitRequiredAuthAudit,
  type AuthAuditSink,
} from "./audit";
import { NEUTRAL_AUTH_ERROR, NEUTRAL_RECOVERY_MESSAGE } from "./errors";
import {
  clearDistributedLockout,
  inspectDistributedLockout,
  recordDistributedLockoutFailure,
  type DistributedLockoutStore,
} from "./lockout-distributed";
import { LOCKOUT_HMAC_PURPOSE_EMAIL, type LockoutPepperMaterial } from "./lockout-identifier";
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

export type DistributedLockoutOptions = {
  peppers: LockoutPepperMaterial | null | undefined;
  store: DistributedLockoutStore | null | undefined;
};

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function requiresDistributedLockout(options: {
  requireDurableAudit?: boolean;
  requireDistributedLockout?: boolean;
  lockout?: DistributedLockoutOptions;
}): boolean {
  return (
    options.requireDurableAudit === true ||
    options.requireDistributedLockout === true ||
    options.lockout !== undefined
  );
}

async function inspectRequiredLockout(
  email: string,
  lockout: DistributedLockoutOptions | undefined,
): Promise<"ok" | "denied" | "fail_closed"> {
  const inspected = await inspectDistributedLockout(
    email,
    lockout?.peppers,
    lockout?.store,
    LOCKOUT_HMAC_PURPOSE_EMAIL,
  );
  if (!inspected.ok) {
    return "fail_closed";
  }
  return inspected.locked ? "denied" : "ok";
}

export async function completePasswordSignIn(
  request: SignInRequest,
  authenticate: PasswordAuthenticator,
  options: {
    auditSink?: AuthAuditSink | null;
    requireDurableAudit?: boolean;
    revokeAuthenticatedSession?: AuthenticatedSessionRevoker;
    lockout?: DistributedLockoutOptions;
  } = {},
): Promise<SignInResult | SignInSuccess> {
  const email = asTrimmedString(request.email);
  const password = typeof request.password === "string" ? request.password : "";
  const redirectTo = sanitizeReturnPath(request.next);
  const distributed = requiresDistributedLockout(options);

  if (!email || !password) {
    await persistAudit({ class: "sign_in", result: "failure" }, options.auditSink);
    return { ok: false, message: NEUTRAL_AUTH_ERROR };
  }

  if (distributed) {
    const gate = await inspectRequiredLockout(email, options.lockout);
    if (gate !== "ok") {
      await persistAudit({ class: "sign_in", result: gate }, options.auditSink);
      return { ok: false, message: NEUTRAL_AUTH_ERROR };
    }
  } else if (isIdentifierLocked(email)) {
    await persistAudit({ class: "sign_in", result: "denied" }, options.auditSink);
    return { ok: false, message: NEUTRAL_AUTH_ERROR };
  }

  const outcome = await authenticate({ email, password });
  if (!outcome.ok) {
    if (distributed) {
      const recorded = await recordDistributedLockoutFailure(
        email,
        options.lockout?.peppers,
        options.lockout?.store,
        undefined,
        LOCKOUT_HMAC_PURPOSE_EMAIL,
      );
      const result = !recorded.ok ? "fail_closed" : recorded.locked ? "denied" : "failure";
      await persistAudit({ class: "sign_in", result }, options.auditSink);
    } else {
      recordFailedAttempt(email);
      await persistAudit({ class: "sign_in", result: "failure" }, options.auditSink);
    }
    return { ok: false, message: NEUTRAL_AUTH_ERROR };
  }

  if (distributed) {
    const cleared = await clearDistributedLockout(
      email,
      options.lockout?.peppers,
      options.lockout?.store,
      LOCKOUT_HMAC_PURPOSE_EMAIL,
    );
    if (!cleared.ok) {
      await options.revokeAuthenticatedSession?.();
      await persistAudit({ class: "sign_in", result: "fail_closed" }, options.auditSink);
      return { ok: false, message: NEUTRAL_AUTH_ERROR };
    }
  } else {
    clearFailedAttempts(email);
  }

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
  options: {
    lockout?: DistributedLockoutOptions;
    requireDistributedLockout?: boolean;
  } = {},
): Promise<{ message: string }> {
  const email = asTrimmedString(identifier);
  const distributed = requiresDistributedLockout(options);

  if (distributed) {
    if (!email) {
      await persistAudit({ class: "recovery", result: "success" }, auditSink);
      return { message: NEUTRAL_RECOVERY_MESSAGE };
    }
    const gate = await inspectRequiredLockout(email, options.lockout);
    if (gate !== "ok") {
      await persistAudit({ class: "recovery", result: gate }, auditSink);
      return { message: NEUTRAL_RECOVERY_MESSAGE };
    }
  }

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
