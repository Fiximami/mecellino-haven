"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { emitNonDurableAuthAudit, emitRequiredAuthAudit } from "@/lib/auth/audit";
import { createPostgresAuthAuditSink } from "@/lib/auth/audit-postgres";
import { sessionCookieOptions, isAuthCookieName } from "@/lib/auth/cookies";
import { completePasswordSignIn, completeRecoveryRequest } from "@/lib/auth/credentials";
import { sanitizeReturnPath } from "@/lib/auth/return-path";
import { createClient } from "@/lib/supabase/server";

async function unavailableAuthenticator(): Promise<{ ok: false }> {
  return { ok: false };
}

export async function signInAction(formData: FormData) {
  const next = sanitizeReturnPath(formData.get("next"));
  const supabase = await createClient();
  const auditSink = createPostgresAuthAuditSink();

  const result = await completePasswordSignIn(
    {
      email: formData.get("email"),
      password: formData.get("password"),
      next,
    },
    supabase
      ? async ({ email, password }) => {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          return error ? { ok: false } : { ok: true };
        }
      : unavailableAuthenticator,
    {
      auditSink,
      requireDurableAudit: true,
      revokeAuthenticatedSession: async () => {
        await supabase?.auth.signOut();
      },
    },
  );

  if (!result.ok) {
    redirect(`/auth/sign-in?error=1&next=${encodeURIComponent(next)}`);
  }

  redirect(result.redirectTo);
}

export async function recoverAction(formData: FormData) {
  const supabase = await createClient();
  const auditSink = createPostgresAuthAuditSink();
  await completeRecoveryRequest(
    formData.get("email"),
    supabase
      ? async ({ email }) => {
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
          if (siteUrl) {
            await supabase.auth.resetPasswordForEmail(email, {
              redirectTo: `${siteUrl}/auth/callback`,
            });
            return;
          }
          await supabase.auth.resetPasswordForEmail(email);
        }
      : null,
    auditSink,
  );

  redirect("/auth/recovery?sent=1");
}

export async function signOutAction() {
  const supabase = await createClient();
  const auditSink = createPostgresAuthAuditSink();
  if (supabase) {
    await supabase.auth.signOut();
  }

  const store = await cookies();
  for (const cookie of store.getAll()) {
    if (isAuthCookieName(cookie.name)) {
      store.set(cookie.name, "", { ...sessionCookieOptions(), maxAge: 0 });
    }
  }

  if (auditSink) {
    await emitRequiredAuthAudit({ class: "sign_out", result: "success" }, auditSink);
  } else {
    emitNonDurableAuthAudit({ class: "sign_out", result: "success" });
  }
  redirect("/");
}
