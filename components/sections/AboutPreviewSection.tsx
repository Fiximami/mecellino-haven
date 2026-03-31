"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function AboutPreviewSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="border-t border-[var(--border)] bg-[var(--card)] px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">
              Our story
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
              Built for families, by families
            </h2>
            <p className="mt-6 text-[var(--muted)]">
              Mecellino Haven started with a simple idea: create a place where
              parents can relax while kids run, play, and discover. We&apos;ve
              grown into a destination that blends classic amusement with
              modern comfort—clean facilities, trained staff, and attractions
              designed for every age.
            </p>
            <p className="mt-4 text-[var(--muted)]">
              Every visit is a chance to make memories that last. We can&apos;t
              wait to welcome you.
            </p>
            <Link
              href="/visit"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] transition-colors hover:underline"
            >
              Learn more about us
              <span aria-hidden>→</span>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative overflow-hidden rounded-[var(--radius-xl)] bg-gradient-to-br from-[var(--primary)]/15 via-[var(--accent)]/10 to-[var(--primary)]/10 p-12 sm:p-16"
          >
            <div className="absolute -right-8 -top-8 text-8xl opacity-20" aria-hidden>
              ✨
            </div>
            <div className="relative">
              <p className="text-lg font-medium text-[var(--foreground)]">
                &ldquo;A day at Mecellino Haven feels like a mini holiday—the
                kids are happy, we&apos;re relaxed, and we always leave
                planning the next visit.&rdquo;
              </p>
              <p className="mt-4 text-sm text-[var(--muted)]">
                — The Mecellino Haven family
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
