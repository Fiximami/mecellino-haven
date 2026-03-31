"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[var(--primary)]/8 via-[var(--background)] to-[var(--background)] px-4 pt-16 pb-24 sm:px-6 sm:pt-20 sm:pb-32 lg:px-8">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[var(--primary)]/10 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)]/5 blur-3xl"
          aria-hidden
        />
      </div>
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-6"
        >
          <motion.span
            variants={item}
            className="inline-block rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-1.5 text-sm font-medium text-[var(--muted)] shadow-[var(--shadow-sm)]"
          >
            Family fun for all ages
          </motion.span>
          <motion.h1
            variants={item}
            className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl lg:leading-[1.1]"
          >
            Where families{" "}
            <span className="text-[var(--primary)]">play together</span>
          </motion.h1>
          <motion.p
            variants={item}
            className="max-w-2xl text-lg text-[var(--muted)] sm:text-xl"
          >
            Mecellino Haven is your destination for safe, joyful adventures.
            Rides, play areas, and memories waiting for you.
          </motion.p>
          <motion.div
            variants={item}
            className="mt-2 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              href="/attractions"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-6 py-3.5 text-sm font-semibold text-[var(--primary-foreground)] shadow-[var(--shadow-md)] transition-all hover:scale-[1.02] hover:shadow-[var(--shadow-lg)] active:scale-[0.98]"
            >
              Explore attractions
            </Link>
            <Link
              href="/visit"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--border)] bg-[var(--card)] px-6 py-3.5 text-sm font-semibold text-[var(--foreground)] shadow-[var(--shadow-sm)] transition-all hover:border-[var(--primary)]/30 hover:bg-[var(--primary)]/5 active:scale-[0.98]"
            >
              Plan your visit
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
