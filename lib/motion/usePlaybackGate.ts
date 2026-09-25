"use client";

import { useEffect, useState, type RefObject } from "react";

export function usePlaybackGate(ref: RefObject<HTMLElement | null>) {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const root = ref.current;
    if (!root) {
      return;
    }

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = true;

    const sync = () => {
      setPaused(motion.matches || document.hidden || !inView);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = Boolean(entry?.isIntersecting);
        sync();
      },
      { threshold: 0.08 },
    );
    observer.observe(root);

    const onVisibility = () => sync();
    const onMotion = () => sync();
    document.addEventListener("visibilitychange", onVisibility);
    motion.addEventListener("change", onMotion);
    sync();

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      motion.removeEventListener("change", onMotion);
    };
  }, [ref]);

  return paused;
}
