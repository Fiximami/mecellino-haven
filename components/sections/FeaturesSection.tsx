"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    title: "Family-friendly fun",
    description: "Attractions and activities designed for all ages, from toddlers to grandparents.",
  },
  {
    title: "Safe & welcoming",
    description: "We prioritize safety and a welcoming environment so everyone can play with peace of mind.",
  },
  {
    title: "Events & memories",
    description: "Seasonal events and special occasions to make every visit memorable.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

export function FeaturesSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="border-t border-[var(--border)] bg-[var(--background)] px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="text-center text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl"
        >
          Why Mecellino Haven?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mx-auto mt-4 max-w-2xl text-center text-[var(--muted)]"
        >
          A place where every family can create lasting memories.
        </motion.p>
        <ul className="mt-16 grid gap-8 sm:grid-cols-3">
          {features.map((feature, i) => (
            <motion.li
              key={feature.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-[var(--foreground)]">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--muted)]">
                {feature.description}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
