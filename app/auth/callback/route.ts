import { NextResponse } from "next/server";
import { emitNonDurableAuthAudit, emitRequiredAuthAudit } from "@/lib/auth/audit";
import { createPostgresAuthAuditSink } from "@/lib/auth/audit-postgres";
import { revokeServerSession } from "@/lib/auth/revoke-session";
import { sanitizeReturnPath } from "@/lib/auth/return-path";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = sanitizeReturnPath(url.searchParams.get("next"));
  const signIn = new URL("/auth/sign-in?error=1", url.origin);

  const supabase = await createClient();
  const auditSink = createPostgresAuthAuditSink();
  if (!supabase || !code) {
    emitNonDurableAuthAudit({ class: "sign_in", result: "fail_closed" });
    return NextResponse.redirect(signIn);
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    emitNonDurableAuthAudit({ class: "sign_in", result: "failure" });
    return NextResponse.redirect(signIn);
  }

  if (!auditSink) {
    await revokeServerSession(supabase);
    emitNonDurableAuthAudit({ class: "sign_in", result: "fail_closed" });
    return NextResponse.redirect(signIn);
  }

  const auditResult = await emitRequiredAuthAudit(
    { class: "sign_in", result: "success" },
    auditSink,
  );
  if (!auditResult.persisted) {
    await revokeServerSession(supabase);
    return NextResponse.redirect(signIn);
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
