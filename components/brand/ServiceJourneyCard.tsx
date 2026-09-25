import Link from "next/link";
import type { ReactNode } from "react";
import { EditorialPhoto, type EditorialImageId } from "@/components/brand/EditorialPhoto";
import { FlipCard } from "@/components/motion/FlipCard";

type ServiceJourneyCardProps = {
  href: string;
  title: string;
  description: string;
  details: string;
  chip?: string;
  icon: ReactNode;
  imageId: EditorialImageId;
};

export function ServiceJourneyCard({
  href,
  title,
  description,
  details,
  chip,
  icon,
  imageId,
}: ServiceJourneyCardProps) {
  const titleId = `service-card-${title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <FlipCard
      id={titleId}
      title={title}
      className="mh-card mh-journey"
      front={
        <>
          <EditorialPhoto imageId={imageId} />
          <IconWrap>{icon}</IconWrap>
          {chip ? <span className="mh-chip mh-chip-pilot">{chip}</span> : null}
          <h3 id={titleId} className="text-lg font-semibold">
            {title}
          </h3>
          <p className="text-[15px] leading-relaxed text-[var(--mh-dark-muted)]">{description}</p>
        </>
      }
      back={
        <>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-[15px] leading-relaxed text-[var(--mh-dark-muted)]">{details}</p>
          <Link href={href} className="mh-link">
            Open {title}
          </Link>
        </>
      }
    />
  );
}

function IconWrap({ children }: { children: ReactNode }) {
  return (
    <span className="mh-icon-badge text-[var(--mh-terracotta)]" aria-hidden="true">
      {children}
    </span>
  );
}
