"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const packages = [
  {
    name: "Day Pass",
    description: "Full access for one day. Perfect for a spontaneous family outing.",
    highlight: "Best for first-time visitors",
    cta: "View details",
    href: "/visit",
    featured: false,
  },
  {
    name: "Family Bundle",
    description: "Save when you visit together. Includes perks and discounts on food and merch.",
    highlight: "Most popular",
    cta: "View details",
    href: "/visit",
    featured: true,
  },
  {
    name: "Season Pass",
    description: "Unlimited visits all season. Early access to events and member-only areas.",
    highlight: "Best value",
    cta: "View details",
    href: "/visit",
    featured: false,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function PackagesPreviewSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="border-t border-[var(--border)] bg-[var(--background)] px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Tickets & packages
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--muted)]">
            Choose the option that fits your family—from a single day to a full
            season of fun.
          </p>
        </motion.div>
        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {packages.map((pkg, i) => (
            <motion.li
              key={pkg.name}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <div
                className={`flex h-full flex-col rounded-[var(--radius-xl)] border-2 p-6 sm:p-8 ${
                  pkg.featured
                    ? "border-[var(--primary)] bg-[var(--primary)]/5 shadow-[var(--shadow-md)]"
                    : "border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-sm)]"
                }`}
              >
                {pkg.highlight && (
                  <span
                    className={`inline-block w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                      pkg.featured
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                        : "bg-[var(--border)] text-[var(--muted)]"
                    }`}
                  >
                    {pkg.highlight}
                  </span>
                )}
                <h3 className="mt-4 text-xl font-bold text-[var(--foreground)]">
                  {pkg.name}
                </h3>
                <p className="mt-3 flex-1 text-sm text-[var(--muted)]">
                  {pkg.description}
                </p>
                <Link
                  href={pkg.href}
                  className={`mt-6 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                    pkg.featured
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90"
                      : "bg-[var(--foreground)]/5 text-[var(--foreground)] hover:bg-[var(--foreground)]/10"
                  }`}
                >
                  {pkg.cta}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </motion.li>
          ))}
        </ul>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.35 }}
          className="mt-10 text-center"
        >
          <Link
            href="/visit"
            className="text-sm font-semibold text-[var(--primary)] hover:underline"
          >
            Compare all options
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
