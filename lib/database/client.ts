import postgres, { type Sql } from "postgres";
import { readDatabaseConnectionConfig } from "./config";

const globalForDatabase = globalThis as typeof globalThis & {
  mecellinoDatabase?: Sql<Record<string, never>>;
};

/**
 * Server-only pooled connection for narrowly scoped database adapters.
 *
 * This connection must use the Supabase transaction pooler URL. Prepared
 * statements are disabled because transaction poolers do not preserve session
 * state between requests. The URL and password never enter browser bundles.
 */
export function getDatabaseClient(): Sql<Record<string, never>> | null {
  const config = readDatabaseConnectionConfig();
  if (!config.ok) {
    return null;
  }

  if (!globalForDatabase.mecellinoDatabase) {
    globalForDatabase.mecellinoDatabase = postgres(config.connectionString, {
      ssl: "require",
      prepare: false,
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
    });
  }

  return globalForDatabase.mecellinoDatabase;
}
