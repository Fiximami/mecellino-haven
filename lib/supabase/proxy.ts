import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { readPublicSupabaseConfig } from "../auth/env";
import { supabaseAuthClientOptions } from "./options";

/**
 * Refresh a cookie session when public Auth configuration is valid.
 * Missing or placeholder configuration fails closed and does not alter the request.
 * Never used to authorize `/admin`.
 */
export async function refreshAuthSession(request: NextRequest): Promise<NextResponse> {
  const config = readPublicSupabaseConfig();
  if (!config.ok) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });
  const options = supabaseAuthClientOptions();

  const supabase = createServerClient(config.url, config.publishableKey, {
    ...options,
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options: cookieOptions }) =>
          response.cookies.set(name, value, { ...options.cookieOptions, ...cookieOptions }),
        );
      },
    },
  });

  try {
    if (typeof supabase.auth.getClaims === "function") {
      await supabase.auth.getClaims();
    } else {
      await supabase.auth.getUser();
    }
  } catch {
    return NextResponse.next({ request });
  }

  return response;
}
