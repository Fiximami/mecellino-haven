"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const tiles = [
  { color: "from-amber-200/80 to-orange-300/80", label: "Play areas" },
  { color: "from-sky-200/80 to-cyan-300/80", label: "Rides" },
  { color: "from-emerald-200/80 to-teal-300/80", label: "Events" },
  { color: "from-violet-200/80 to-purple-300/80", label: "Family fun" },
  { color: "from-rose-200/80 to-pink-300/80", label: "Memories" },
  { color: "from-lime-200/80 to-green-300/80", label: "Outdoors" },
];

const tileVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function GalleryPreviewSection() {
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
            A glimpse of the fun
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--muted)]">
            See what a day at Mecellino Haven looks like—and imagine your family
            here.
          </p>
        </motion.div>
        <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {tiles.map((tile, i) => (
            <motion.div
              key={tile.label}
              custom={i}
              variants={tileVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className={`aspect-[4/3] rounded-[var(--radius-lg)] bg-gradient-to-br ${tile.color} flex items-end justify-center p-4 dark:opacity-90`}
            >
              <span className="text-sm font-medium text-black/70">
                {tile.label}
              </span>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="mt-10 text-center"
        >
          <Link
            href="/visit"
            className="inline-flex rounded-full border-2 border-[var(--border)] bg-[var(--card)] px-6 py-3 text-sm font-semibold text-[var(--foreground)] shadow-[var(--shadow-sm)] transition-all hover:border-[var(--primary)]/30 hover:shadow-[var(--shadow-md)]"
          >
            View full gallery
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
