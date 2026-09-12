import { sessionCookieOptions } from "../auth/cookies";

export function supabaseAuthClientOptions() {
  return {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce" as const,
    },
    realtime: {
      timeout: 1,
      heartbeatIntervalMs: 0,
      params: {
        eventsPerSecond: 0,
      },
    },
    cookieOptions: sessionCookieOptions(),
  };
}
