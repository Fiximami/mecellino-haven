import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionTone = "default" | "navy" | "cream2" | "paper";

const toneClass: Record<SectionTone, string> = {
  default: "",
  navy: "ydg-on-navy",
  cream2: "ydg-on-cream2",
  paper: "ydg-on-paper",
};

export function PageSection({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: SectionTone;
  className?: string;
}) {
  return (
    <section className={cn("ydg-sec", toneClass[tone], className)}>
      <div className="ydg-wrap">{children}</div>
    </section>
  );
}

type HeadingLevel = "h1" | "h2" | "h3";

const headingClass: Record<HeadingLevel, string> = {
  h1: "ydg-h1",
  h2: "ydg-h2",
  h3: "ydg-h3",
};

export function PageHero({
  eyebrow,
  title,
  lede,
  onNavy = false,
  as = "h1",
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  onNavy?: boolean;
  as?: HeadingLevel;
  children?: ReactNode;
}) {
  const Heading = as;

  return (
    <div className="ydg-stack-lg ydg-measure">
      <div className="ydg-stack">
        <p className={cn("ydg-eyebrow", onNavy && "ydg-eyebrow-on-navy")}>{eyebrow}</p>
        <Heading className={cn(headingClass[as], onNavy && "text-[var(--mh-dark-text)]")}>{title}</Heading>
        {lede ? <p className={cn("ydg-lede", onNavy && "text-[var(--mh-dark-muted)]")}>{lede}</p> : null}
      </div>
      {children}
    </div>
  );
}

export function SectionHeading({
  children,
  as = "h2",
  onNavy = false,
  className,
}: {
  children: ReactNode;
  as?: "h2" | "h3";
  onNavy?: boolean;
  className?: string;
}) {
  const Heading = as;

  return (
    <Heading
      className={cn(headingClass[as], onNavy && "text-[var(--mh-dark-text)]", className)}
    >
      {children}
    </Heading>
  );
}

export function Eyebrow({
  children,
  onNavy = false,
}: {
  children: ReactNode;
  onNavy?: boolean;
}) {
  return (
    <p className={cn("ydg-eyebrow", onNavy && "ydg-eyebrow-on-navy")}>{children}</p>
  );
}

export function PathCard({
  title,
  children,
  variant = "default",
  href,
  chip,
}: {
  title: string;
  children: ReactNode;
  variant?: "default" | "ydg";
  href?: string;
  chip?: ReactNode;
}) {
  const body = (
    <>
      {chip}
      <h3 className="ydg-h3">{title}</h3>
      <div className="text-[15px] text-[var(--ink-2)] [&>p+p]:mt-2">{children}</div>
    </>
  );

  const className = cn("ydg-pathcard", variant === "ydg" && "ydg-pathcard-ydg");

  if (href) {
    return (
      <Link href={href} className={className}>
        {body}
      </Link>
    );
  }

  return <div className={className}>{body}</div>;
}

export function LinkArrow({
  href,
  children,
  onNavy = false,
  variant = "default",
}: {
  href: string;
  children: ReactNode;
  onNavy?: boolean;
  variant?: "default" | "ydg";
}) {
  return (
    <Link
      href={href}
      className={cn("ydg-linkarrow", variant === "ydg" && "text-[var(--mh-cyan)]", onNavy && "text-[var(--mh-cyan)]")}
    >
      {children}
    </Link>
  );
}

export function StatusBlock({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="ydg-status">
      <span className="ydg-status-dot" aria-hidden="true" />
      <div>
        <span className="ydg-status-label">{label}</span>
        <strong className="block text-[15.5px] text-[var(--mh-dark-text)]">{title}</strong>
        {description ? <p className="ydg-fine mt-1">{description}</p> : null}
      </div>
    </div>
  );
}

export function BoundaryBlock({
  title = "What we do not promise",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="ydg-boundary">
      <h3 className="ydg-h3">{title}</h3>
      <p>{children}</p>
    </div>
  );
}

export function Chip({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "default" | "pilot" | "planned";
}) {
  return (
    <span
      className={cn(
        "ydg-chip",
        variant === "pilot" && "ydg-chip-pilot",
        variant === "planned" && "ydg-chip-planned"
      )}
    >
      {children}
    </span>
  );
}

export function Notice({
  children,
  icon = "i",
  variant = "default",
  className,
}: {
  children: ReactNode;
  icon?: string;
  variant?: "default" | "divert" | "privacy";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "ydg-notice",
        variant === "divert" && "ydg-notice-divert",
        variant === "privacy" && "ydg-notice-privacy",
        className
      )}
    >
      <span className="ydg-notice-ic">{icon}</span>
      <div>{children}</div>
    </div>
  );
}

export function TickList({
  items,
  cross = false,
}: {
  items: ReactNode[];
  cross?: boolean;
}) {
  return (
    <ul className={cn("ydg-tick", cross && "ydg-tick-cross")}>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

export function KeyValueList({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <ul className="ydg-kvlist">
      {items.map((item) => (
        <li key={item.label}>
          {item.label} <b>{item.value}</b>
        </li>
      ))}
    </ul>
  );
}

export function TrackRow({
  age,
  title,
  description,
  chip,
}: {
  age: string;
  title: ReactNode;
  description: ReactNode;
  chip?: ReactNode;
}) {
  return (
    <div className="ydg-trackrow">
      <span className="ydg-trackrow-age">{age}</span>
      <h3 className="ydg-h3">
        {title} {chip}
      </h3>
      <p>{description}</p>
    </div>
  );
}

export function LeaderCard({
  initials,
  name,
  role,
}: {
  initials: string;
  name: string;
  role: string;
}) {
  return (
    <div className="ydg-leader">
      <span className="ydg-leader-av" aria-hidden="true">
        {initials}
      </span>
      <div>
        <b>{name}</b>
        <span>{role}</span>
      </div>
    </div>
  );
}

export function UnfoldSequence({
  steps,
}: {
  steps: { label: string; description: string }[];
}) {
  return (
    <div className="ydg-unfold">
      {steps.map((step, index) => (
        <div className="ydg-ustep" key={step.label}>
          <span className="ydg-ustep-n">{String(index + 1).padStart(2, "0")}</span>
          <div>
            <b>{step.label}</b>
            <p>{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function FaqAccordion({
  items,
}: {
  items: { question: string; answer: ReactNode }[];
}) {
  return (
    <div className="ydg-faq">
      {items.map((item) => (
        <details key={item.question}>
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

export function ImagePlaceholder({ children }: { children: ReactNode }) {
  return <div className="ydg-imgph">{children}</div>;
}

export function ButtonRow({ children }: { children: ReactNode }) {
  return <div className="ydg-btnrow">{children}</div>;
}

export function PrimaryButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className="ydg-btn ydg-btn-primary">
      {children}
    </Link>
  );
}

export function GhostButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className="ydg-btn ydg-btn-ghost">
      {children}
    </Link>
  );
}

export const unfoldSteps = [
  { label: "Play", description: "Low-pressure first contact." },
  { label: "Discover", description: "What interests them." },
  { label: "Explore", description: "Trying things out." },
  { label: "Experience", description: "Supervised practical work." },
  { label: "Prepare", description: "Capability and next steps." },
  { label: "Execute", description: "Applying what they built." },
  { label: "Mentor", description: "Guided support, and later giving back." },
] as const;

export const unfoldStepsDetailed = [
  {
    label: "Play",
    description: "Safe, low-pressure engagement. Often where a family first meets us — at an event stand.",
  },
  {
    label: "Discover",
    description: "Structured activities that surface what a young person is drawn to.",
  },
  {
    label: "Explore",
    description: "Trying career clusters out rather than reading about them.",
  },
  {
    label: "Experience",
    description: "Supervised practical activity in groups. Never an individual placement.",
  },
  {
    label: "Prepare",
    description: "Capability spine work, and a next-step plan the young person writes.",
  },
  {
    label: "Execute",
    description: "Applying it — projects and applied work in later tracks.",
  },
  {
    label: "Mentor",
    description: "Guided support. Alumni aged 26+ may apply to mentor, subject to screening and training.",
  },
] as const;

export const leadershipTeam = [
  {
    initials: "RBN",
    name: "Rev. Bennet Nyansah",
    role: "Programme Lead — delivery, facilitators, schedule and learning quality",
  },
  {
    initials: "ONS",
    name: "Mrs. Ophelia Nana Ama Sarsah",
    role: "Programme Director & Safeguarding Lead — governance, safeguarding decisions, escalation",
  },
  {
    initials: "MJB",
    name: "Mualen Jerry Baada",
    role: "Technology & Operations Head, Deputy Safeguarding Focal Person",
  },
] as const;
