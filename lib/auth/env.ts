const PLACEHOLDER_URLS = new Set([
  "your-project-url",
  "supabase_project_url",
  "https://your-project-url",
  "https://your-project.supabase.co",
]);

const PLACEHOLDER_KEYS = new Set([
  "your-anon-key",
  "your-publishable-key",
  "supabase_publishable_key",
  "supabase-anon-key",
]);

const FORBIDDEN_PUBLIC_SECRET_NAMES = [
  "NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_SUPABASE_SECRET_KEY",
] as const;

export type PublicSupabaseConfig =
  | { ok: true; url: string; publishableKey: string }
  | { ok: false; reason: "missing" | "invalid" | "public_secret_misconfigured" };

function trimEnv(value: string | undefined): string {
  return value?.trim() ?? "";
}

function isPlaceholderUrl(value: string): boolean {
  return PLACEHOLDER_URLS.has(value.toLowerCase());
}

function isPlaceholderKey(value: string): boolean {
  return PLACEHOLDER_KEYS.has(value.toLowerCase());
}

function isHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function looksLikePublishableKey(value: string): boolean {
  if (value.startsWith("sb_publishable_")) {
    return value.length > "sb_publishable_".length;
  }

  const parts = value.split(".");
  return parts.length === 3 && parts.every((part) => part.length > 0);
}

type EnvMap = Record<string, string | undefined>;

export function hasPublicSecretMisconfiguration(
  env: EnvMap = process.env,
): boolean {
  return FORBIDDEN_PUBLIC_SECRET_NAMES.some((name) => trimEnv(env[name]).length > 0);
}

export function readPublicSupabaseConfig(
  env: EnvMap = process.env,
): PublicSupabaseConfig {
  if (hasPublicSecretMisconfiguration(env)) {
    return { ok: false, reason: "public_secret_misconfigured" };
  }

  const url = trimEnv(env.NEXT_PUBLIC_SUPABASE_URL);
  const publishableKey = trimEnv(
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  if (!url && !publishableKey) {
    return { ok: false, reason: "missing" };
  }

  if (
    !url ||
    !publishableKey ||
    isPlaceholderUrl(url) ||
    isPlaceholderKey(publishableKey) ||
    !isHttpUrl(url) ||
    !looksLikePublishableKey(publishableKey)
  ) {
    return { ok: false, reason: "invalid" };
  }

  return { ok: true, url, publishableKey };
}

export function readServiceRoleKey(env: EnvMap = process.env): string | null {
  if (hasPublicSecretMisconfiguration(env)) {
    return null;
  }

  const value = trimEnv(env.SUPABASE_SERVICE_ROLE_KEY);
  if (!value || isPlaceholderKey(value)) {
    return null;
  }

  return value;
}

export function isAuthConfigured(env: EnvMap = process.env): boolean {
  return readPublicSupabaseConfig(env).ok;
}

export const PUBLIC_SECRET_ENV_NAMES = FORBIDDEN_PUBLIC_SECRET_NAMES;
