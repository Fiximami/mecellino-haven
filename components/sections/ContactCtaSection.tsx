"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function ContactCtaSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="border-t border-[var(--border)] px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[var(--radius-xl)] bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/90 p-10 text-center shadow-[var(--shadow-lg)] sm:p-14"
        >
          <div
            className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10"
            aria-hidden
          />
          <div
            className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10"
            aria-hidden
          />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to make memories?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
              Get in touch for group bookings, accessibility questions, or
              anything else. We’re here to help you plan the perfect visit.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-base font-semibold text-[var(--primary)] shadow-[var(--shadow-md)] transition-all hover:scale-[1.02] hover:shadow-[var(--shadow-lg)] active:scale-[0.98]"
              >
                Contact us
              </Link>
              <Link
                href="/visit"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/80 bg-transparent px-7 py-4 text-base font-semibold text-white transition-all hover:bg-white/15 active:scale-[0.98]"
              >
                Visit & hours
              </Link>
            </div>
            <p className="mt-8 text-sm text-white/80">
              Questions? Email us or give us a call—we’d love to hear from you.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
