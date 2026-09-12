export type DatabaseConnectionConfig =
  | { ok: true; connectionString: string }
  | { ok: false; reason: "missing" | "invalid" | "project_mismatch" };

function trimEnv(value: string | undefined): string {
  return value?.trim() ?? "";
}

export function readDatabaseConnectionConfig(
  env: Record<string, string | undefined> = process.env,
): DatabaseConnectionConfig {
  const connectionString = trimEnv(env.SUPABASE_DATABASE_URL);
  const expectedProjectRef = trimEnv(env.SUPABASE_PROJECT_REF);

  if (!connectionString || !expectedProjectRef) {
    return { ok: false, reason: "missing" };
  }

  let parsed: URL;
  try {
    parsed = new URL(connectionString);
  } catch {
    return { ok: false, reason: "invalid" };
  }

  if (
    !["postgres:", "postgresql:"].includes(parsed.protocol) ||
    !parsed.hostname ||
    !parsed.username ||
    !parsed.password ||
    !parsed.pathname
  ) {
    return { ok: false, reason: "invalid" };
  }

  const authority = `${parsed.hostname} ${decodeURIComponent(parsed.username)}`;
  if (!authority.includes(expectedProjectRef)) {
    if (
      parsed.hostname.includes(".pooler.supabase.com") &&
      decodeURIComponent(parsed.username) === "postgres"
    ) {
      parsed.username = `postgres.${expectedProjectRef}`;
    } else {
      return { ok: false, reason: "project_mismatch" };
    }
  }

  try {
    parsed.password = decodeURIComponent(parsed.password);
  } catch {
    return { ok: false, reason: "invalid" };
  }

  return { ok: true, connectionString: parsed.toString() };
}
