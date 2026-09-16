"use server";

import { redirect } from "next/navigation";
import { emitNonDurableAuthAudit, emitRequiredAuthAudit } from "@/lib/auth/audit";
import { createPostgresAuthAuditSink } from "@/lib/auth/audit-postgres";
import { completePasswordSignIn, completeRecoveryRequest } from "@/lib/auth/credentials";
import { readLockoutPepperConfig } from "@/lib/auth/lockout-env";
import { createPostgresDistributedLockoutStore } from "@/lib/auth/lockout-postgres";
import { revokeServerSession } from "@/lib/auth/revoke-session";
import { sanitizeReturnPath } from "@/lib/auth/return-path";
import { createClient } from "@/lib/supabase/server";

async function unavailableAuthenticator(): Promise<{ ok: false }> {
  return { ok: false };
}

function serverLockoutOptions() {
  const peppers = readLockoutPepperConfig();
  return {
    peppers: peppers.ok ? peppers.peppers : null,
    store: createPostgresDistributedLockoutStore(),
  };
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
      lockout: serverLockoutOptions(),
      revokeAuthenticatedSession: async () => {
        await revokeServerSession(supabase);
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
    {
      requireDistributedLockout: true,
      lockout: serverLockoutOptions(),
    },
  );

  redirect("/auth/recovery?sent=1");
}

export async function signOutAction() {
  const supabase = await createClient();
  const auditSink = createPostgresAuthAuditSink();
  await revokeServerSession(supabase);

  if (auditSink) {
    await emitRequiredAuthAudit({ class: "sign_out", result: "success" }, auditSink);
  } else {
    emitNonDurableAuthAudit({ class: "sign_out", result: "success" });
  }
  redirect("/");
}
