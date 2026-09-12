import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { publicRoutes } from "@/config/routes";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="ydg-page flex min-h-screen flex-col">
      <header className="border-b border-[var(--mh-dark-border)] px-[18px] py-4">
        <Link href={publicRoutes.home} className="mh-link text-sm">
          Back to Mecellino Haven
        </Link>
      </header>
      <main id="main-content" className="mh-page flex-1">
        {children}
      </main>
    </div>
  );
}
