import Link from "next/link";
import { publicRoutes } from "@/config/routes";
import { boundaryStatementShort, demoEnquiryNotice, programmeFacts } from "@/config/site";

const experiences = [
  {
    icon: "🎪",
    title: "Community gatherings",
    description:
      "Temporary stands at selected community events — supervised family fun without a permanent park.",
    href: publicRoutes.mobileAmusement,
  },
  {
    icon: "🏫",
    title: "School and youth events",
    description:
      "Mobile amusement brought to school fairs and youth programmes when a host has confirmed arrangements.",
    href: publicRoutes.mobileAmusement,
  },
  {
    icon: "🎉",
    title: "Corporate and public events",
    description:
      "Family-friendly stands for company days and public celebrations — always mobile, always temporary.",
    href: publicRoutes.mobileAmusement,
  },
] as const;

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
    description: "Governance, accountability and how the two pathways fit together.",
    href: publicRoutes.about,
  },
] as const;

export function HomePageContent() {
  return (
    <div className="mh-home">
      <section className="mh-section">
        <div className="mh-wrap mx-auto flex flex-col items-center gap-6 text-center">
          <p className="mh-eyebrow">Fun for the whole family</p>
          <h1 className="mh-h1">
            Where families <span className="mh-accent">play</span> together
          </h1>
          <p className="mh-lede mx-auto">
            Mecellino Haven brings mobile amusement to selected events in Ghana — and runs the Youth Discovery
            Gateway, our flagship programme helping young people aged {programmeFacts.ageRange} explore what comes
            next.
          </p>
          <div className="mh-btnrow justify-center">
            <Link href={publicRoutes.mobileAmusement} className="mh-btn mh-btn-primary">
              Explore mobile amusement
            </Link>
            <Link href={publicRoutes.ydg} className="mh-btn mh-btn-ghost">
              Discover YDG
            </Link>
          </div>
        </div>
      </section>

      <section className="mh-section pt-0">
        <div className="mh-wrap mx-auto flex flex-col gap-5">
          <div className="text-center">
            <h2 className="mh-h2">Two pathways under one name</h2>
            <p className="mh-lede mx-auto mt-3">
              Play at events today. Prepare for tomorrow through structured youth discovery when intake opens.
            </p>
          </div>
          <div className="mh-grid-2">
            <article className="mh-card mh-card-ydg">
              <span className="mh-chip mh-chip-pilot">Pilot in preparation</span>
              <h3 className="text-lg font-semibold">Youth Discovery Gateway</h3>
              <p className="text-[15px] leading-relaxed text-[var(--mh-dark-muted)]">
                Helps young people build evidence about their interests, strengths and possible directions — through
                discovery, guided exploration, practical experience and reflection.
              </p>
              <Link href={publicRoutes.ydg} className="mh-link mt-auto">
                About YDG →
              </Link>
            </article>
            <article className="mh-card">
              <span className="mh-chip mh-chip-live">Currently operating</span>
              <h3 className="text-lg font-semibold">Mobile Amusement &amp; Events</h3>
              <p className="text-[15px] leading-relaxed text-[var(--mh-dark-muted)]">
                We bring temporary event stands to selected community, school, corporate and public events. No
                permanent park, passes or opening hours.
              </p>
              <Link href={publicRoutes.mobileAmusement} className="mh-link mt-auto">
                Where we will be →
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="mh-section bg-[var(--mh-dark-surface)]">
        <div className="mh-wrap mx-auto flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="mh-eyebrow text-[var(--mh-cyan)]">Youth Discovery Gateway</p>
            <h2 className="mh-h2 mt-2">Structured discovery for ages {programmeFacts.ageRange}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--mh-dark-muted)]">
              YDG is not a job scheme or a test with a pass mark. It helps young people test interests safely, build
              evidence and write their own next-step plan — with families involved throughout.
            </p>
          </div>
          <Link href={publicRoutes.ydg} className="mh-link">
            Explore the programme →
          </Link>
        </div>
      </section>

      <section className="mh-section">
        <div className="mh-wrap mx-auto flex flex-col gap-6">
          <div className="text-center">
            <h2 className="mh-h2">Selected mobile experiences</h2>
            <p className="mh-lede mx-auto mt-3">
              We set up where hosts invite us — always temporary, always supervised.
            </p>
          </div>
          <div className="mh-grid-3">
            {experiences.map((item) => (
              <article key={item.title} className="mh-card">
                <span className="mh-icon-badge" aria-hidden="true">
                  {item.icon}
                </span>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-[15px] leading-relaxed text-[var(--mh-dark-muted)]">{item.description}</p>
                <Link href={item.href} className="mh-link mt-auto">
                  Learn more →
                </Link>
              </article>
            ))}
          </div>
          <div className="flex justify-center">
            <Link href={publicRoutes.mobileAmusement} className="mh-btn mh-btn-primary">
              View mobile amusement
            </Link>
          </div>
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
            <h2 className="mh-h2">Preview a programme enquiry</h2>
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
