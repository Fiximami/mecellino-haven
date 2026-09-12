import { NextResponse } from "next/server";
import { emitNonDurableAuthAudit, emitRequiredAuthAudit } from "@/lib/auth/audit";
import { createPostgresAuthAuditSink } from "@/lib/auth/audit-postgres";
import { isTrustedMutationOrigin } from "@/lib/auth/origin";
import { revokeServerSession } from "@/lib/auth/revoke-session";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isTrustedMutationOrigin(request)) {
    return new NextResponse(null, { status: 403 });
  }

  const supabase = await createClient();
  const auditSink = createPostgresAuthAuditSink();
  await revokeServerSession(supabase);

  if (auditSink) {
    await emitRequiredAuthAudit({ class: "sign_out", result: "success" }, auditSink);
  } else {
    emitNonDurableAuthAudit({ class: "sign_out", result: "success" });
  }
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}

export async function GET() {
  return new NextResponse(null, { status: 405 });
}
