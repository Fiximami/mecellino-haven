import type { Metadata } from "next";
import Link from "next/link";
import { Notice, PageHero, PageSection } from "@/components/ydg";
import { publicRoutes } from "@/config/routes";
import { NEUTRAL_AUTH_ERROR } from "@/lib/auth/errors";
import { sanitizeReturnPath } from "@/lib/auth/return-path";
import { signInAction, signOutAction } from "@/app/auth/actions";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const next = sanitizeReturnPath(params.next);
  const showError = params.error === "1";

  return (
    <PageSection tone="paper">
      <PageHero
        eyebrow="Non-production access"
        title="Sign in"
        lede="This entry point is for synthetic or otherwise approved non-production accounts only. There is no public registration, and this page is not part of the Youth Discovery Gateway participant journey."
      />
      <Notice icon="!" variant="divert" className="mt-6">
        Hosted authentication stays disconnected until an approved non-production
        project is configured. Missing configuration fails closed. Public programme
        pages do not require an account.
      </Notice>
      {showError ? (
        <Notice icon="!" variant="divert" className="mt-4">
          {NEUTRAL_AUTH_ERROR}
        </Notice>
      ) : null}
      <form action={signInAction} className="ydg-stack mt-8 max-w-md" method="post">
        <input type="hidden" name="next" value={next} />
        <label className="ydg-stack" htmlFor="email">
          <span>Email</span>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            className="min-h-12 w-full rounded-lg border border-[var(--mh-dark-border)] bg-[var(--mh-dark-card)] px-3"
          />
        </label>
        <label className="ydg-stack" htmlFor="password">
          <span>Password</span>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="min-h-12 w-full rounded-lg border border-[var(--mh-dark-border)] bg-[var(--mh-dark-card)] px-3"
          />
        </label>
        <div className="mh-btnrow">
          <button type="submit" className="mh-btn mh-btn-primary">
            Sign in
          </button>
        </div>
      </form>
      <form action={signOutAction} className="mt-6" method="post">
        <button type="submit" className="mh-btn mh-btn-ghost">
          Sign out
        </button>
      </form>
      <p className="ydg-lede mt-8">
        <Link href="/auth/recovery" className="mh-link">
          Account recovery
        </Link>
        {" · "}
        <Link href={publicRoutes.home} className="mh-link">
          Return to the public site
        </Link>
      </p>
    </PageSection>
  );
}
