import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ServiceJourneyCardProps = {
  href: string;
  title: string;
  description: string;
  action: string;
  chip?: string;
  icon: ReactNode;
  visual: "capacity" | "lifestyle" | "events" | "amusement";
};

export function ServiceJourneyCard({
  href,
  title,
  description,
  action,
  chip,
  icon,
  visual,
}: ServiceJourneyCardProps) {
  return (
    <article className={cn("mh-card mh-journey", `mh-journey-${visual}`)}>
      <IconWrap>{icon}</IconWrap>
      {chip ? <span className={chip === "Coming soon" ? "mh-chip mh-chip-soon" : "mh-chip mh-chip-pilot"}>{chip}</span> : null}
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-[15px] leading-relaxed text-[var(--mh-dark-muted)]">{description}</p>
      <Link href={href} className="mh-link mt-auto">
        {action}
      </Link>
    </article>
  );
}

function IconWrap({ children }: { children: ReactNode }) {
  return (
    <span className="mh-icon-badge text-[var(--mh-terracotta)]" aria-hidden="true">
      {children}
    </span>
  );
}
