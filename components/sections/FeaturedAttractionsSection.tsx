"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const attractions = [
  {
    title: "Adventure Playground",
    description: "Climbing frames, slides, and safe play zones for little explorers.",
    icon: "🎢",
    href: "/attractions",
  },
  {
    title: "Family Rides",
    description: "Gentle rides and carousels the whole family can enjoy together.",
    icon: "🎠",
    href: "/attractions",
  },
  {
    title: "Creative Corner",
    description: "Arts, crafts, and interactive activities that spark imagination.",
    icon: "🎨",
    href: "/attractions",
  },
  {
    title: "Outdoor Fun",
    description: "Picnic areas, gardens, and seasonal events in the open air.",
    icon: "🌳",
    href: "/attractions",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function FeaturedAttractionsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="scroll-mt-16 border-t border-[var(--border)] bg-[var(--background)] px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Featured attractions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--muted)]">
            Something for everyone—from toddlers to grandparents.
          </p>
        </motion.div>
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {attractions.map((attraction, i) => (
            <motion.li
              key={attraction.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <Link
                href={attraction.href}
                className="group flex h-full flex-col rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--primary)]/20 hover:shadow-[var(--shadow-md)]"
              >
                <span
                  className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-2xl transition-transform group-hover:scale-110"
                  aria-hidden
                >
                  {attraction.icon}
                </span>
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  {attraction.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-[var(--muted)]">
                  {attraction.description}
                </p>
                <span className="mt-4 inline-flex items-center text-sm font-medium text-[var(--primary)]">
                  Learn more →
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mt-12 text-center"
        >
          <Link
            href="/attractions"
            className="inline-flex rounded-full border-2 border-[var(--primary)] bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-[var(--primary-foreground)] transition-all hover:bg-[var(--primary)]/90"
          >
            View all attractions
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
