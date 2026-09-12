import { getDatabaseClient } from "../database/client";
import { isProgrammeRole, type ProgrammeRole } from "./roles";

type RoleAssignmentRow = {
  role: string;
};

export type ProtectedRoleResult = {
  available: boolean;
  roles: ProgrammeRole[];
};

/**
 * Reads active role assignments through the server-only database connection.
 * A configured database that cannot be read fails closed to no roles. The
 * legacy `guardian` database label is normalized to the canonical application
 * role `legal_guardian` until the migration label is formally aligned.
 */
export async function loadProtectedRoles(accountId: string): Promise<ProtectedRoleResult> {
  const database = getDatabaseClient();
  if (!database) {
    return { available: false, roles: [] };
  }

  try {
    const rows = await database<RoleAssignmentRow[]>`
      select role
      from private.role_assignments
      where account_id = ${accountId}::uuid
        and revoked_at is null
        and valid_from <= now()
        and (valid_until is null or valid_until > now())
    `;

    const roles = new Set<ProgrammeRole>();
    for (const row of rows) {
      const role = row.role === "guardian" ? "legal_guardian" : row.role;
      if (isProgrammeRole(role)) {
        roles.add(role);
      }
    }

    return { available: true, roles: [...roles] };
  } catch {
    return { available: true, roles: [] };
  }
}
