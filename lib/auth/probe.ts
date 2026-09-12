export type SessionProbeResponse = {
  authenticated: boolean;
};

export function sessionProbeBody(authenticated: boolean): SessionProbeResponse {
  return { authenticated };
}

export function sessionProbeHasSensitiveFields(body: unknown): boolean {
  if (!body || typeof body !== "object") {
    return true;
  }

  const keys = Object.keys(body);
  if (keys.length !== 1 || keys[0] !== "authenticated") {
    return true;
  }

  return typeof (body as SessionProbeResponse).authenticated !== "boolean";
}
