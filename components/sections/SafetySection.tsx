"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const points = [
  {
    title: "Clean & maintained",
    description: "Rides and play areas are inspected and cleaned regularly so every visit feels fresh and safe.",
    icon: "✓",
  },
  {
    title: "Trained staff",
    description: "Our team is trained in first aid and child safety. You’ll see friendly faces everywhere you go.",
    icon: "✓",
  },
  {
    title: "Age-appropriate zones",
    description: "Clear areas for different age groups so little ones and older kids can play at their own pace.",
    icon: "✓",
  },
  {
    title: "Accessible for all",
    description: "We’re committed to accessibility so every family can enjoy the fun.",
    icon: "✓",
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

export function SafetySection() {
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
            Safety first, always
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--muted)]">
            Your peace of mind matters. We follow strict standards so families
            can focus on having fun.
          </p>
        </motion.div>
        <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((point, i) => (
            <motion.li
              key={point.title}
              custom={i}
              variants={itemVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="flex flex-col items-center text-center"
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)]/15 text-lg font-bold text-[var(--primary)]"
                aria-hidden
              >
                {point.icon}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">
                {point.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--muted)]">
                {point.description}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
