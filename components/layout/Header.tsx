"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const bookNowHref = "/visit";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/80">
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
        aria-label="Main"
      >
        <Link
          href="/"
          className="shrink-0 text-xl font-semibold tracking-tight text-[var(--foreground)] transition-opacity hover:opacity-80"
        >
          {siteConfig.name}
        </Link>

        <ul className="hidden items-center gap-6 lg:flex lg:gap-8">
          {siteConfig.nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 lg:flex">
          <Link
            href={bookNowHref}
            className="rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] shadow-[var(--shadow-sm)] transition-opacity hover:opacity-90"
          >
            Book Now
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg lg:hidden [&>span]:block [&>span]:h-0.5 [&>span]:w-5 [&>span]:bg-current [&>span]:transition-all"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          <span className={cn(mobileOpen && "translate-y-2 rotate-45")} />
          <span className={cn(mobileOpen && "opacity-0")} />
          <span className={cn(mobileOpen && "-translate-y-2 -rotate-45")} />
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-[var(--border)] lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-4 py-4">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--muted)] hover:bg-[var(--border)] hover:text-[var(--foreground)]"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2 border-t border-[var(--border)] pt-2">
                <Link
                  href={bookNowHref}
                  className="block rounded-lg bg-[var(--primary)] px-3 py-2.5 text-center text-sm font-semibold text-[var(--primary-foreground)] hover:opacity-90"
                  onClick={() => setMobileOpen(false)}
                >
                  Book Now
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
