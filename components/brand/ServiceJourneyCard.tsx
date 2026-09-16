import Link from "next/link";
import type { ReactNode } from "react";
import { ServiceArtwork } from "@/components/brand/ServiceArtwork";
import { cn } from "@/lib/utils";

type ServiceJourneyCardProps = {
  href: string;
  title: string;
  description: string;
  chip?: string;
  icon: ReactNode;
  visual: "capacity" | "lifestyle" | "events" | "amusement" | "ydg";
};

export function ServiceJourneyCard({
  href,
  title,
  description,
  chip,
  icon,
  visual,
}: ServiceJourneyCardProps) {
  const titleId = `service-card-${title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <Link
      href={href}
      className={cn("mh-card mh-journey mh-card-link", `mh-journey-${visual}`)}
      aria-labelledby={titleId}
    >
      <IconWrap>{icon}</IconWrap>
      {chip ? <span className={chip === "Coming soon" ? "mh-chip mh-chip-soon" : "mh-chip mh-chip-pilot"}>{chip}</span> : null}
      <h3 id={titleId} className="text-lg font-semibold">
        {title}
      </h3>
      <p className="text-[15px] leading-relaxed text-[var(--mh-dark-muted)]">{description}</p>
      <ServiceArtwork visual={visual} />
    </Link>
  );
}

function IconWrap({ children }: { children: ReactNode }) {
  return (
    <span className="mh-icon-badge text-[var(--mh-terracotta)]" aria-hidden="true">
      {children}
    </span>
  );
}
