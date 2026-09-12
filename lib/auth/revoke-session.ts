import { cookies } from "next/headers";
import { revokeSession, type SessionRevocationClient } from "./revoke-session-core";

/**
 * Removes the browser's Supabase session even when the provider-side sign-out
 * request fails. This is used whenever a newly established session must be
 * rolled back because its durable audit event could not be recorded.
 */
export async function revokeServerSession(
  client: SessionRevocationClient | null,
): Promise<void> {
  await revokeSession(client, await cookies());
}
