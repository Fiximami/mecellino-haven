import Link from "next/link";
import { EditorialPhoto } from "@/components/brand/EditorialPhoto";
import { LivingGateway } from "@/components/motion/LivingGateway";
import { FlipCardGroup } from "@/components/motion/FlipCard";
import { RevealGroup } from "@/components/motion/RevealGroup";
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
    details:
      "YDG is the flagship pathway. Retirement Life Preparedness, individual training and institutional training sit alongside it. Live applications are not open.",
    href: publicRoutes.capacityBuilding,
    icon: <CapacityIcon />,
    imageId: "home-capacity" as const,
    chip: "Four pathways",
  },
  {
    title: "Lifestyle Coaching",
    description:
      "Personal development, confidence, relationships, wellbeing, purpose, family life and general life transitions.",
    details:
      "Coaching conversations stay developmental. This is not a medical, counselling or clinical service, and no sessions are booked through this website.",
    href: publicRoutes.lifestyleCoaching,
    icon: <LifestyleIcon />,
    imageId: "home-lifestyle" as const,
  },
  {
    title: "Events and Entertainment",
    description:
      "Youth and wider-audience events with developmental, recreational and entertainment experiences. Age limits and guardian consent apply.",
    details:
      "Each event will publish its own age limit. This website does not sell tickets or confirm bookings. Children remain the responsibility of the adult who brings them.",
    href: publicRoutes.eventsEntertainment,
    icon: <EventsIcon />,
    imageId: "home-events" as const,
  },
  {
    title: "Amusement",
    description: amusementDevelopmentStatement,
    details:
      "Current operations use temporary event stands only. A permanent park, fixed venue, admission passes or regular opening hours are not offered today.",
    href: publicRoutes.amusement,
    icon: <AmusementIcon />,
    imageId: "home-amusement" as const,
    chip: "Temporary stands",
  },
];

const communityLinks = [
  {
    title: "Contact Us",
    description: "See how a segmented enquiry will look when live intake is approved.",
    href: publicRoutes.contact,
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
            <LivingGateway variant="haven" />
            <div className="flex flex-col items-center gap-6 text-center md:items-start md:text-left">
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
            <div className="mh-hero-art mx-auto max-w-md">
              <EditorialPhoto imageId="home-hero" priority />
            </div>
          </div>
        </div>
      </section>

      <section className="mh-section pt-0">
        <div className="mh-wrap mx-auto flex flex-col gap-5">
          <div className="text-center">
            <p className="mh-eyebrow">Start here</p>
            <h2 className="mh-h2">Two clear pathways</h2>
            <p className="mh-lede mx-auto mt-3">
              Youth Discovery Gateway is the flagship programme. Mobile amusement currently uses temporary event
              stands.
            </p>
          </div>
          <RevealGroup className="mh-pathway-grid">
            <Link href={publicRoutes.ydg} className="mh-pathway mh-pathway-ydg mh-reveal-item" aria-labelledby="pathway-ydg-title">
              <EditorialPhoto imageId="home-pathway-ydg" />
              <p className="mh-eyebrow">Capacity Building</p>
              <h3 id="pathway-ydg-title" className="mh-h3">
                Youth Discovery Gateway
              </h3>
              <p>
                Structured discovery for individuals and institutions. Applications are not open. No employment,
                admission or placement is promised.
              </p>
            </Link>
            <Link
              href={publicRoutes.amusement}
              className="mh-pathway mh-pathway-amusement mh-reveal-item"
              aria-labelledby="pathway-amusement-title"
            >
              <EditorialPhoto imageId="home-pathway-amusement" />
              <p className="mh-eyebrow">Current operations</p>
              <h3 id="pathway-amusement-title" className="mh-h3">
                Mobile amusement
              </h3>
              <p>{amusementDevelopmentStatement}</p>
            </Link>
          </RevealGroup>
        </div>
      </section>

      <section className="mh-section pt-0">
        <div className="mh-wrap mx-auto flex flex-col gap-5">
          <div className="text-center">
            <h2 className="mh-h2">Four service areas, one organisation</h2>
            <p className="mh-lede mx-auto mt-3">
              Capacity Building, Lifestyle Coaching, Events and Entertainment, and current mobile amusement through
              temporary event stands.
            </p>
          </div>
          <FlipCardGroup>
            <RevealGroup className="mh-grid-4">
              {services.map((item) => (
                <ServiceJourneyCard key={item.title} {...item} />
              ))}
            </RevealGroup>
          </FlipCardGroup>
        </div>
      </section>

      <section className="mh-section mh-ydg-cta-band bg-[var(--mh-dark-surface)]">
        <LivingGateway variant="cta" />
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
            <h2 className="mh-h2">Schools, institutions, parents and partners</h2>
            <p className="mh-lede mx-auto mt-3">
              YDG works with {ydgPartnerAudiences.join(", ")}. Different relationships, different controls — none
              involve unsupervised contact with young people. Named organisations are shown only when a relationship is
              verified.
            </p>
          </div>
          <RevealGroup className="mh-grid-3">
            {communityLinks.map((item) => {
              const titleId = `community-${item.title.replace(/\s+/g, "-").toLowerCase()}`;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="mh-card mh-card-link mh-reveal-item"
                  aria-labelledby={titleId}
                >
                  <h3 id={titleId} className="text-lg font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-[var(--mh-dark-muted)]">{item.description}</p>
                </Link>
              );
            })}
          </RevealGroup>
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
