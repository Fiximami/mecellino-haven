const PUBLIC_RETURN_PATHS = new Set([
  "/",
  "/about",
  "/capacity-building",
  "/capacity-building/ydg",
  "/capacity-building/ydg/how-it-works",
  "/capacity-building/ydg/tracks",
  "/capacity-building/retirement-life-preparedness",
  "/lifestyle-coaching",
  "/events-entertainment",
  "/amusement",
  "/parents",
  "/schools",
  "/contact",
  "/auth/sign-in",
]);

export const DEFAULT_RETURN_PATH = "/";

function stripDangerousCharacters(value: string): string {
  return value.replace(/[\0\r\n\\]/g, "");
}

export function sanitizeReturnPath(value: unknown): string {
  if (typeof value !== "string") {
    return DEFAULT_RETURN_PATH;
  }

  const trimmed = stripDangerousCharacters(value.trim());
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.includes("://")) {
    return DEFAULT_RETURN_PATH;
  }

  if (trimmed.includes("\\") || trimmed.includes("@")) {
    return DEFAULT_RETURN_PATH;
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed, "https://ydg.invalid");
  } catch {
    return DEFAULT_RETURN_PATH;
  }

  if (parsed.username || parsed.password || parsed.host !== "ydg.invalid") {
    return DEFAULT_RETURN_PATH;
  }

  if (!PUBLIC_RETURN_PATHS.has(parsed.pathname)) {
    return DEFAULT_RETURN_PATH;
  }

  return parsed.pathname;
}

export function isSafeReturnPath(value: unknown): boolean {
  if (typeof value !== "string") {
    return false;
  }

  const trimmed = stripDangerousCharacters(value.trim());
  return sanitizeReturnPath(trimmed) === trimmed;
}
