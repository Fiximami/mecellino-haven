"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function RevealGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    root.classList.add("mh-motion-enabled");

    const reveal = () => {
      root.classList.add("is-inview");
    };

    const rect = root.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          reveal();
          observer.disconnect();
        }
      },
      { threshold: 0.14 },
    );
    observer.observe(root);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("mh-reveal-group", className)}>
      {children}
    </div>
  );
}
