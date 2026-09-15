import Link from "next/link";
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
  programmeFacts,
} from "@/config/site";

const services = [
  {
    title: "Capacity Building",
    description:
      "Practical training for people and institutions, including Youth Discovery Gateway for ages 10–25 and Retirement Life Preparedness.",
    href: publicRoutes.capacityBuilding,
    action: "Explore Capacity Building →",
    icon: <CapacityIcon />,
    visual: "capacity" as const,
    chip: "Four pathways",
  },
  {
    title: "Lifestyle Coaching",
    description:
      "Personal development, confidence, relationships, wellbeing, purpose, family life and general life transitions.",
    href: publicRoutes.lifestyleCoaching,
    action: "Explore Lifestyle Coaching →",
    icon: <LifestyleIcon />,
    visual: "lifestyle" as const,
  },
  {
    title: "Events and Entertainment",
    description:
      "Youth and wider-audience events with developmental, recreational and entertainment experiences. Age limits and guardian consent apply.",
    href: publicRoutes.eventsEntertainment,
    action: "Explore events →",
    icon: <EventsIcon />,
    visual: "events" as const,
  },
  {
    title: "Amusement",
    description: amusementDevelopmentStatement,
    href: publicRoutes.amusement,
    action: "Register amusement interest →",
    icon: <AmusementIcon />,
    visual: "amusement" as const,
    chip: "Coming soon",
  },
];

const safetyPoints = [
  {
    title: "Supervision and consent",
    description: "Programme consent, assent and safeguarding rules are published for parents and guardians.",
    href: publicRoutes.parents,
  },
  {
    title: "No live reporting yet",
    description: "Organisation safeguarding routes open only after monitored channels are verified.",
    href: publicRoutes.parents,
  },
  {
    title: "Emergency first",
    description: "If a child is in immediate danger, contact emergency services before anything else.",
    href: publicRoutes.parents,
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
    description: "What collaboration involves — and what it never includes.",
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
          <div className="mh-hero-panel mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
            <p className="mh-eyebrow">Mecellino Haven</p>
            <h1 className="mh-h1">
              A trusted <span className="mh-accent-brand">haven</span> for growth and meaningful experiences
            </h1>
            <p className="mh-lede mx-auto">{organisationVision}</p>
            <div className="mh-btnrow justify-center">
              <Link href={publicRoutes.capacityBuilding} className="mh-btn mh-btn-primary">
                Explore Capacity Building
              </Link>
              <Link href={publicRoutes.contact} className="mh-btn mh-btn-ghost">
                Preview an enquiry
              </Link>
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
            <p className="mh-eyebrow text-[var(--mh-cyan)]">Youth Discovery Gateway</p>
            <h2 className="mh-h2 mt-2">A Capacity Building programme for ages {programmeFacts.ageRange}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--mh-dark-muted)]">
              YDG sits under Capacity Building. It is not a job scheme or a test with a pass mark. It helps young
              people test interests safely, build evidence and write their own next-step plan — with families involved
              throughout.
            </p>
          </div>
          <Link href={publicRoutes.ydg} className="mh-link">
            About Youth Discovery Gateway →
          </Link>
        </div>
      </section>

      <section className="mh-section bg-[var(--mh-dark-surface)]">
        <div className="mh-wrap mx-auto flex flex-col gap-6">
          <div className="text-center">
            <h2 className="mh-h2">Safety first, always</h2>
            <p className="mh-lede mx-auto mt-3">
              Programme safeguarding information is published for families. Live reporting routes are not open in this
              milestone.
            </p>
          </div>
          <div className="mx-auto grid max-w-3xl gap-5">
            {safetyPoints.map((item) => (
              <div key={item.title} className="mh-safety-item">
                <span className="mh-icon-badge shrink-0" aria-hidden="true">
                  ✓
                </span>
                <div>
                  <Link href={item.href} className="mh-link min-h-0 font-semibold text-[var(--mh-dark-text)]">
                    {item.title}
                  </Link>
                  <p>{item.description}</p>
                </div>
              </div>
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
            <h2 className="mh-h2">Schools, parents and community</h2>
            <p className="mh-lede mx-auto mt-3">
              Different relationships, different controls — none involve unsupervised contact with young people.
            </p>
          </div>
          <div className="mh-grid-3">
            {communityLinks.map((item) => (
              <article key={item.title} className="mh-card">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-[15px] leading-relaxed text-[var(--mh-dark-muted)]">{item.description}</p>
                <Link href={item.href} className="mh-link mt-auto">
                  Find out more →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mh-section pt-0">
        <div className="mh-wrap mx-auto">
          <div className="mh-cta-panel flex flex-col items-center gap-4">
            <h2 className="mh-h2">Preview an enquiry</h2>
            <p className="mh-lede mx-auto max-w-xl text-[#083344]">
              See how segmented enquiry will look when live intake is approved. {demoEnquiryNotice}
            </p>
            <p className="mh-demo-note max-w-xl">{boundaryStatementShort}</p>
            <div className="mh-btnrow justify-center">
              <Link href={publicRoutes.contact} className="mh-btn mh-btn-ghost bg-white/85">
                Preview enquiry form
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
