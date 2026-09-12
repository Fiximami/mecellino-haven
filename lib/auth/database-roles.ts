import { getDatabaseClient } from "../database/client";
import { isProgrammeRole, type ProgrammeRole } from "./roles";

type RoleAssignmentRow = {
  role: string;
  scope_type: "global" | "programme" | "cohort" | "participant";
  scope_id: string | null;
};

export type ProtectedRoleResult = {
  available: boolean;
  roles: ProgrammeRole[];
  scopes: { type: Exclude<RoleAssignmentRow["scope_type"], "global">; id: string }[];
};

/**
 * Reads active role assignments through the server-only database connection.
 * A configured database that cannot be read fails closed to no roles. The
 * The legacy `guardian` database label is accepted only as a compatibility
 * read for databases that have not yet applied the alignment migration.
 */
export async function loadProtectedRoles(accountId: string): Promise<ProtectedRoleResult> {
  const database = getDatabaseClient();
  if (!database) {
    return { available: false, roles: [], scopes: [] };
  }

  try {
    const rows = await database<RoleAssignmentRow[]>`
      select role
        , scope_type
        , scope_id
      from private.role_assignments
      where account_id = ${accountId}::uuid
        and revoked_at is null
        and valid_from <= now()
        and (valid_until is null or valid_until > now())
    `;

    const roles = new Set<ProgrammeRole>();
    const scopes = new Map<string, { type: Exclude<RoleAssignmentRow["scope_type"], "global">; id: string }>();
    for (const row of rows) {
      const role = row.role === "guardian" ? "legal_guardian" : row.role;
      if (isProgrammeRole(role)) {
        roles.add(role);
      }
      if (row.scope_type !== "global" && row.scope_id) {
        scopes.set(`${row.scope_type}:${row.scope_id}`, {
          type: row.scope_type,
          id: row.scope_id,
        });
      }
    }

    return { available: true, roles: [...roles], scopes: [...scopes.values()] };
  } catch {
    return { available: true, roles: [], scopes: [] };
  }
}
