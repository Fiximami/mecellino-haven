import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import { readPublicSupabaseConfig } from "../auth/env";
import { supabaseAuthClientOptions } from "./options";

/**
 * Server client using the official @supabase/ssr cookie pattern.
 * Authorization must use a validated user record from this client, never
 * browser state. The service-role key is never passed here.
 */
export async function createClient(): Promise<SupabaseClient | null> {
  const config = readPublicSupabaseConfig();
  if (!config.ok) {
    return null;
  }

  const cookieStore = await cookies();
  const options = supabaseAuthClientOptions();

  return createServerClient(config.url, config.publishableKey, {
    ...options,
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options: cookieOptions }) =>
            cookieStore.set(name, value, { ...options.cookieOptions, ...cookieOptions }),
          );
        } catch {
          // Called from a Server Component. Proxy refreshes the session cookies.
        }
      },
    },
  });
}
