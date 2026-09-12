export const programmeRoles = [
  "participant",
  "parent",
  "legal_guardian",
  "approved_responsible_adult",
  "referrer",
  "mentor",
  "facilitator",
  "programme_operations",
  "safeguarding_lead",
  "restricted_caseworker",
  "system_administrator",
  "auditor",
] as const;

export type ProgrammeRole = (typeof programmeRoles)[number];

export const privilegedActions = [
  "provision_users",
  "invite_account",
  "assign_protected_role",
  "revoke_protected_role",
  "deactivate_account",
  "manage_integration_secrets",
  "read_safeguarding_case",
  "write_safeguarding_case",
  "break_glass_case_access",
  "link_adult_relationship",
  "link_delivery_assignment",
] as const;

export type PrivilegedAction = (typeof privilegedActions)[number];

export const ALWAYS_DENIED_ACTIONS = [
  "read_safeguarding_case",
  "write_safeguarding_case",
  "break_glass_case_access",
  "link_adult_relationship",
  "link_delivery_assignment",
] as const satisfies readonly PrivilegedAction[];

const ROLE_SET = new Set<string>(programmeRoles);

export function isProgrammeRole(value: unknown): value is ProgrammeRole {
  return typeof value === "string" && ROLE_SET.has(value);
}

export function parseProtectedRoles(appMetadata: unknown): ProgrammeRole[] {
  if (!appMetadata || typeof appMetadata !== "object") {
    return [];
  }

  const record = appMetadata as Record<string, unknown>;
  const collected: unknown[] = [];

  if (Array.isArray(record.roles)) {
    collected.push(...record.roles);
  }

  if (typeof record.role === "string") {
    collected.push(record.role);
  }

  const unique = new Set<ProgrammeRole>();
  for (const value of collected) {
    if (isProgrammeRole(value)) {
      unique.add(value);
    }
  }

  return [...unique];
}

export type AuthorizationScope = {
  type: "person" | "cohort" | "delivery_assignment" | "case";
  id: string;
};

export function parseServerScopes(value: unknown): AuthorizationScope[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const scopes: AuthorizationScope[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") {
      continue;
    }
    const record = item as Record<string, unknown>;
    if (
      (record.type === "person" ||
        record.type === "cohort" ||
        record.type === "delivery_assignment" ||
        record.type === "case") &&
      typeof record.id === "string" &&
      record.id.length > 0
    ) {
      scopes.push({ type: record.type, id: record.id });
    }
  }
  return scopes;
}
