import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { readPublicSupabaseConfig } from "../auth/env";
import { supabaseAuthClientOptions } from "./options";

/**
 * Browser client for authentication transport only.
 * Do not authorize from this client or from browser session state.
 */
export function createClient(): SupabaseClient | null {
  const config = readPublicSupabaseConfig();
  if (!config.ok) {
    return null;
  }

  return createBrowserClient(config.url, config.publishableKey, supabaseAuthClientOptions());
}
