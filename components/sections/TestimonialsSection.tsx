"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const testimonials = [
  {
    quote:
      "We've been coming here for two years. The staff remember our kids' names and the place is always spotless. Best family day out in the area.",
    author: "Sarah M.",
    role: "Parent of two",
  },
  {
    quote:
      "My daughter has special needs and the team went out of their way to make her feel included. She had the time of her life. Thank you!",
    author: "James T.",
    role: "Dad",
  },
  {
    quote:
      "Season pass was worth every penny. We pop in after school sometimes and on weekends. The kids never get bored—so much to do.",
    author: "Priya & Alex",
    role: "Family of four",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="border-t border-[var(--border)] bg-[var(--card)] px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Loved by families
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--muted)]">
            Here’s what visitors are saying about their time at Mecellino Haven.
          </p>
        </motion.div>
        <ul className="mt-14 grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.li
              key={t.author}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="flex flex-col rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--background)] p-6 shadow-[var(--shadow-sm)]"
            >
              <p className="flex-1 text-[var(--foreground)]">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-6 border-t border-[var(--border)] pt-4">
                <p className="font-semibold text-[var(--foreground)]">{t.author}</p>
                <p className="text-sm text-[var(--muted)]">{t.role}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
