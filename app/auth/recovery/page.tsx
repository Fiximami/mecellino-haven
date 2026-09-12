import type { Metadata } from "next";
import Link from "next/link";
import { Notice, PageHero, PageSection } from "@/components/ydg";
import { NEUTRAL_RECOVERY_MESSAGE } from "@/lib/auth/errors";
import { recoverAction } from "@/app/auth/actions";

export const metadata: Metadata = {
  title: "Account recovery",
  robots: { index: false, follow: false },
};

export default async function RecoveryPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const params = await searchParams;
  const sent = params.sent === "1";

  return (
    <PageSection tone="paper">
      <PageHero
        eyebrow="Non-production access"
        title="Account recovery"
        lede="Recovery never confirms whether an account exists and never changes roles."
      />
      {sent ? (
        <Notice icon="i" variant="privacy" className="mt-6">
          {NEUTRAL_RECOVERY_MESSAGE}
        </Notice>
      ) : null}
      <form action={recoverAction} className="ydg-stack mt-8 max-w-md" method="post">
        <label className="ydg-stack" htmlFor="recovery-email">
          <span>Email</span>
          <input
            id="recovery-email"
            name="email"
            type="email"
            autoComplete="username"
            required
            className="min-h-12 w-full rounded-lg border border-[var(--mh-dark-border)] bg-[var(--mh-dark-card)] px-3"
          />
        </label>
        <button type="submit" className="mh-btn mh-btn-primary">
          Request recovery
        </button>
      </form>
      <p className="ydg-lede mt-8">
        <Link href="/auth/sign-in" className="mh-link">
          Back to sign in
        </Link>
      </p>
    </PageSection>
  );
}
