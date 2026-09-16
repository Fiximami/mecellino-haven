import type { AuthAuditEvent, AuthAuditSink } from "./audit";

export type AuthAuditInsert = {
  event_class: AuthAuditEvent["class"];
  result: AuthAuditEvent["result"];
  action: string;
};

/**
 * Narrow database port for the private append-only audit store.
 *
 * The concrete adapter must use a server-only direct PostgreSQL connection.
 * Do not expose the private schema through the Data API and do not replace
 * this port with a browser Supabase client or an exposed SECURITY DEFINER RPC.
 */
export interface AuthAuditDatabaseWriter {
  insert(event: AuthAuditInsert): Promise<void>;
}

export function createDatabaseAuthAuditSink(writer: AuthAuditDatabaseWriter): AuthAuditSink {
  return {
    async emit(event) {
      await writer.insert({
        event_class: event.class,
        result: event.result,
        action: event.action ?? event.class,
      });
    },
  };
}
