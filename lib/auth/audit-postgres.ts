import { createDatabaseAuthAuditSink } from "./audit-database";
import { getDatabaseClient } from "../database/client";

/**
 * Creates the durable audit sink only when the server has a validated
 * Mecellino database connection. Missing or mismatched configuration fails
 * closed and never falls back to a browser client or public table.
 */
export function createPostgresAuthAuditSink() {
  const database = getDatabaseClient();
  if (!database) {
    return null;
  }

  return createDatabaseAuthAuditSink({
    async insert(event) {
      await database`
        insert into private.auth_audit_events (event_class, result, action)
        values (${event.event_class}, ${event.result}, ${event.action})
      `;
    },
  });
}
