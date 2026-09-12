import { isAuthConfigured } from "./env";

const PLACEHOLDER_SITE_HOSTS = new Set(["your-production-domain.example"]);

type EnvMap = Record<string, string | undefined>;

function trimEnv(value: string | undefined): string {
  return value?.trim() ?? "";
}

function originFromUrl(value: string): string | null {
  try {
    const parsed = new URL(value);
    if (parsed.username || parsed.password) {
      return null;
    }
    return parsed.origin;
  } catch {
    return null;
  }
}

function isPlaceholderSiteHost(hostname: string): boolean {
  return PLACEHOLDER_SITE_HOSTS.has(hostname.toLowerCase());
}

function isLoopbackHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
}

export function readCanonicalSiteOrigin(env: EnvMap = process.env): string | null {
  const raw = trimEnv(env.NEXT_PUBLIC_SITE_URL);
  if (!raw) {
    return null;
  }

  const origin = originFromUrl(raw);
  if (!origin) {
    return null;
  }

  const hostname = new URL(origin).hostname;
  if (isPlaceholderSiteHost(hostname)) {
    return null;
  }

  return origin;
}

/**
 * Hosted authentication is not ready unless public Auth configuration is
 * valid and an approved HTTPS canonical origin is set. Request Host and
 * X-Forwarded-Host headers are never used for this decision.
 */
export function isHostedAuthenticationReady(env: EnvMap = process.env): boolean {
  const origin = readCanonicalSiteOrigin(env);
  if (!origin || !origin.startsWith("https://")) {
    return false;
  }

  const hostname = new URL(origin).hostname;
  if (isLoopbackHost(hostname) || isPlaceholderSiteHost(hostname)) {
    return false;
  }

  return isAuthConfigured(env);
}

export function isTrustedMutationOrigin(request: Request, env: EnvMap = process.env): boolean {
  void request.headers.get("host");
  void request.headers.get("x-forwarded-host");
  void request.headers.get("x-forwarded-proto");

  const allowed = readCanonicalSiteOrigin(env);
  if (!allowed) {
    return false;
  }

  const origin = request.headers.get("origin");
  if (origin) {
    return origin === allowed;
  }

  const referer = request.headers.get("referer");
  if (!referer) {
    return false;
  }

  return originFromUrl(referer) === allowed;
}
