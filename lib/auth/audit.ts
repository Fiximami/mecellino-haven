export const auditEventClasses = [
  "sign_in",
  "sign_out",
  "recovery",
  "authorize",
  "invite",
  "role_write",
  "link_attempt",
  "service_role_refused",
  "session_refresh",
] as const;

export type AuditEventClass = (typeof auditEventClasses)[number];

export type AuditResult = "success" | "failure" | "denied" | "fail_closed";

export type AuthAuditEvent = {
  class: AuditEventClass;
  result: AuditResult;
  at: string;
};

export interface AuthAuditSink {
  emit(event: AuthAuditEvent): Promise<void>;
}

export type RequiredAuditResult =
  | { persisted: true; event: AuthAuditEvent }
  | { persisted: false; reason: "audit_unavailable" };

const SENSITIVE_KEY = /(password|token|secret|authorization|cookie|email|phone|name|dob|birth|school)/i;

export function redactAuditDetails(value: unknown): unknown {
  if (value == null) {
    return undefined;
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return undefined;
  }

  if (Array.isArray(value)) {
    return undefined;
  }

  if (typeof value !== "object") {
    return undefined;
  }

  const redacted: Record<string, string> = {};
  for (const key of Object.keys(value as Record<string, unknown>)) {
    redacted[key] = SENSITIVE_KEY.test(key) ? "[redacted]" : "[omitted]";
  }
  return redacted;
}

export function buildAuthAuditEvent(event: Omit<AuthAuditEvent, "at">): AuthAuditEvent {
  return {
    class: event.class,
    result: event.result,
    at: new Date().toISOString(),
  };
}

/**
 * Local sink only. Events are discarded.
 * This is not an operational audit trail and does not persist.
 * This sink remains available only for local synthetic flows. Hosted
 * authentication and privileged role changes must use emitRequiredAuthAudit
 * with a durable server-side sink.
 */
export const localNonDurableAuditSink: AuthAuditSink = {
  async emit() {},
};

export function emitNonDurableAuthAudit(event: Omit<AuthAuditEvent, "at">): AuthAuditEvent {
  const built = buildAuthAuditEvent(event);
  void localNonDurableAuditSink.emit(built);
  return built;
}

/**
 * Privileged operations must call this path and stop when persistence fails.
 * The caller decides how to surface the neutral failure; this function never
 * logs the event payload or the persistence error.
 */
export async function emitRequiredAuthAudit(
  event: Omit<AuthAuditEvent, "at">,
  sink: AuthAuditSink,
): Promise<RequiredAuditResult> {
  const built = buildAuthAuditEvent(event);

  try {
    await sink.emit(built);
    return { persisted: true, event: built };
  } catch {
    return { persisted: false, reason: "audit_unavailable" };
  }
}
