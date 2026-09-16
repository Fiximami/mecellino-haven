import Link from "next/link";
import { ServiceArtwork } from "@/components/brand/ServiceArtwork";
import {
  AmusementIcon,
  CapacityIcon,
  EventsIcon,
  LifestyleIcon,
} from "@/components/brand/ServiceIcons";
import { ServiceJourneyCard } from "@/components/brand/ServiceJourneyCard";
import { publicRoutes } from "@/config/routes";
import {
  amusementDevelopmentStatement,
  boundaryStatementShort,
  demoEnquiryNotice,
  organisationVision,
  publicContactLabel,
  ydgPartnerAudiences,
} from "@/config/site";

const services = [
  {
    title: "Capacity Building",
    description:
      "Practical training for individuals and institutions, including Youth Discovery Gateway and Retirement Life Preparedness.",
    href: publicRoutes.capacityBuilding,
    icon: <CapacityIcon />,
    visual: "capacity" as const,
    chip: "Four pathways",
  },
  {
    title: "Lifestyle Coaching",
    description:
      "Personal development, confidence, relationships, wellbeing, purpose, family life and general life transitions.",
    href: publicRoutes.lifestyleCoaching,
    icon: <LifestyleIcon />,
    visual: "lifestyle" as const,
  },
  {
    title: "Events and Entertainment",
    description:
      "Youth and wider-audience events with developmental, recreational and entertainment experiences. Age limits and guardian consent apply.",
    href: publicRoutes.eventsEntertainment,
    icon: <EventsIcon />,
    visual: "events" as const,
  },
  {
    title: "Amusement",
    description: amusementDevelopmentStatement,
    href: publicRoutes.amusement,
    icon: <AmusementIcon />,
    visual: "amusement" as const,
    chip: "Coming soon",
  },
];

const safetyPoints = [
  {
    title: "Supervision and consent",
    description: "Programme consent, assent and safeguarding rules are published for parents and guardians.",
  },
  {
    title: "No live reporting yet",
    description: "Organisation safeguarding routes open only after monitored channels are verified.",
  },
  {
    title: "Emergency first",
    description: "If a child is in immediate danger, contact emergency services before anything else.",
  },
] as const;

const communityLinks = [
  {
    title: "Parents and guardians",
    description: "Safety, consent, collection and what YDG is — and is not.",
    href: publicRoutes.parents,
  },
  {
    title: "Schools and partners",
    description: `Audience relationships with ${ydgPartnerAudiences.join(", ")} — never unsupervised contact with young people.`,
    href: publicRoutes.schools,
  },
  {
    title: "About Mecellino Haven",
    description: "Mission, vision, leadership and how the four service areas fit together.",
    href: publicRoutes.about,
  },
] as const;

export function HomePageContent() {
  return (
    <div className="mh-home">
      <section className="mh-section">
        <div className="mh-wrap mx-auto">
          <div className="mh-hero-panel mh-hero-home mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-[1.15fr_0.85fr] md:text-left">
            <div className="flex flex-col items-center gap-6 text-center md:items-start md:text-left">
              <p className="mh-eyebrow">Mecellino Haven</p>
              <h1 className="mh-h1">
                A trusted <span className="mh-accent-brand">haven</span> for growth and meaningful experiences
              </h1>
              <p className="mh-lede mx-auto md:mx-0">{organisationVision}</p>
              <div className="mh-btnrow justify-center md:justify-start">
                <Link href={publicRoutes.capacityBuilding} className="mh-btn mh-btn-primary">
                  Explore Capacity Building
                </Link>
                <Link href={publicRoutes.contact} className="mh-btn mh-btn-ghost">
                  {publicContactLabel}
                </Link>
              </div>
            </div>
            <div className="mh-hero-art mx-auto max-w-sm text-[var(--mh-terracotta)]">
              <ServiceArtwork visual="haven" />
            </div>
          </div>
        </div>
      </section>

      <section className="mh-section pt-0">
        <div className="mh-wrap mx-auto flex flex-col gap-5">
          <div className="text-center">
            <h2 className="mh-h2">Four service areas, one organisation</h2>
            <p className="mh-lede mx-auto mt-3">
              Capacity Building, Lifestyle Coaching, Events and Entertainment, and amusement that is still in
              development.
            </p>
          </div>
          <div className="mh-grid-4">
            {services.map((item) => (
              <ServiceJourneyCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="mh-section bg-[var(--mh-dark-surface)]">
        <div className="mh-wrap mx-auto flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="mh-eyebrow text-[var(--mh-link)]">Youth Discovery Gateway</p>
            <h2 className="mh-h2 mt-2">A Capacity Building programme for individuals and institutions</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--mh-dark-muted)]">
              YDG sits under Capacity Building. It is not a job scheme or a test with a pass mark. It helps people test
              interests safely, build evidence and write their own next-step plan — with families involved throughout.
            </p>
          </div>
          <Link href={publicRoutes.ydg} className="mh-link">
            About Youth Discovery Gateway
          </Link>
        </div>
      </section>

      <section className="mh-section bg-[var(--mh-dark-surface)]">
        <div className="mh-wrap mx-auto flex flex-col gap-6">
          <div className="text-center">
            <h2 className="mh-h2">
              <Link href={publicRoutes.parents} className="mh-safety-heading">
                Safety first, always
              </Link>
            </h2>
            <p className="mh-lede mx-auto mt-3">
              Programme safeguarding information is published for families. Live reporting routes are not open in this
              milestone.
            </p>
          </div>
          <div className="mx-auto grid max-w-3xl gap-5">
            {safetyPoints.map((item) => (
              <Link key={item.title} href={publicRoutes.parents} className="mh-safety-item">
                <span className="mh-icon-badge shrink-0" aria-hidden="true">
                  ✓
                </span>
                <div>
                  <span className="font-semibold text-[var(--mh-dark-text)]">{item.title}</span>
                  <p>{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex justify-center">
            <Link href={publicRoutes.parents} className="mh-btn mh-btn-ghost">
              Read safeguarding information
            </Link>
          </div>
        </div>
      </section>

      <section className="mh-section">
        <div className="mh-wrap mx-auto flex flex-col gap-6">
          <div className="text-center">
            <h2 className="mh-h2">Schools, institutions, parents and partners</h2>
            <p className="mh-lede mx-auto mt-3">
              YDG works with {ydgPartnerAudiences.join(", ")}. Different relationships, different controls — none
              involve unsupervised contact with young people. Named organisations are shown only when a relationship is
              verified.
            </p>
          </div>
          <div className="mh-grid-3">
            {communityLinks.map((item) => {
              const titleId = `community-${item.title.replace(/\s+/g, "-").toLowerCase()}`;
              return (
                <Link key={item.title} href={item.href} className="mh-card mh-card-link" aria-labelledby={titleId}>
                  <h3 id={titleId} className="text-lg font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-[var(--mh-dark-muted)]">{item.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mh-section pt-0">
        <div className="mh-wrap mx-auto">
          <div className="mh-cta-panel flex flex-col items-center gap-4">
            <h2 className="mh-h2">{publicContactLabel}</h2>
            <p className="mh-lede mx-auto max-w-xl">
              See how segmented enquiry will look when live intake is approved. {demoEnquiryNotice}
            </p>
            <p className="mh-demo-note max-w-xl">{boundaryStatementShort}</p>
            <div className="mh-btnrow justify-center">
              <Link href={publicRoutes.contact} className="mh-btn mh-btn-ghost bg-white/85">
                {publicContactLabel}
              </Link>
              <Link href={publicRoutes.parents} className="mh-btn mh-btn-ghost">
                Read as a parent or guardian
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
