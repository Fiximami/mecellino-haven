import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { emitNonDurableAuthAudit } from "@/lib/auth/audit";
import { isAuthCookieName, sessionCookieOptions } from "@/lib/auth/cookies";
import { isTrustedMutationOrigin } from "@/lib/auth/origin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isTrustedMutationOrigin(request)) {
    return new NextResponse(null, { status: 403 });
  }

  const supabase = await createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }

  const store = await cookies();
  for (const cookie of store.getAll()) {
    if (isAuthCookieName(cookie.name)) {
      store.set(cookie.name, "", { ...sessionCookieOptions(), maxAge: 0 });
    }
  }

  emitNonDurableAuthAudit({ class: "sign_out", result: "success" });
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}

export async function GET() {
  return new NextResponse(null, { status: 405 });
}
