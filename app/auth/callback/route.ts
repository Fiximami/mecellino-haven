import { NextResponse } from "next/server";
import { emitNonDurableAuthAudit } from "@/lib/auth/audit";
import { sanitizeReturnPath } from "@/lib/auth/return-path";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = sanitizeReturnPath(url.searchParams.get("next"));
  const signIn = new URL("/auth/sign-in?error=1", url.origin);

  const supabase = await createClient();
  if (!supabase || !code) {
    emitNonDurableAuthAudit({ class: "sign_in", result: "fail_closed" });
    return NextResponse.redirect(signIn);
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    emitNonDurableAuthAudit({ class: "sign_in", result: "failure" });
    return NextResponse.redirect(signIn);
  }

  emitNonDurableAuthAudit({ class: "sign_in", result: "success" });
  return NextResponse.redirect(new URL(next, url.origin));
}
