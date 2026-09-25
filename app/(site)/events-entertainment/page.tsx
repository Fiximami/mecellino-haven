import type { Metadata } from "next";
import { EditorialPhoto } from "@/components/brand/EditorialPhoto";
import { EventsIcon, IconBadge } from "@/components/brand/ServiceIcons";
import { Notice, PageHero, PageSection, PathCard, PrimaryButton, SectionHeading, TickList } from "@/components/ydg";
import { publicRoutes } from "@/config/routes";
import { demoEnquiryNotice, publicContactLabel } from "@/config/site";
import { publicPageMetadata } from "@/lib/public-metadata";

export const metadata: Metadata = publicPageMetadata({
  title: "Events and Entertainment",
  description:
    "Mecellino Haven events include youth and wider-audience experiences that are developmental, recreational or entertainment-led. Event-specific age limits apply. Guardian consent is required for minors. No ticket sales on this site.",
  path: publicRoutes.eventsEntertainment,
});

export default function EventsEntertainmentPage() {
  return (
    <>
      <PageSection tone="paper">
        <div className="mh-hero-split">
          <PageHero
            title="Experiences that bring people together"
            lede="Mecellino Haven hosts and supports youth and wider-audience events. Some are developmental, some recreational, and some are entertainment. Each event will publish its own age limit."
          />
          <div className="mh-hero-art">
            <EditorialPhoto imageId="events-hero" priority />
          </div>
        </div>
      </PageSection>

      <PageSection>
        <div className="ydg-grid-2">
          <div className="ydg-stack">
            <IconBadge>
              <EventsIcon />
            </IconBadge>
            <SectionHeading>What events can include</SectionHeading>
            <TickList
              items={[
                "Youth-focused gatherings with published age bands.",
                "Wider-audience experiences for families and communities.",
                "Developmental, recreational and entertainment formats.",
                "Guardian consent before a minor takes part.",
              ]}
            />
          </div>
          <div className="ydg-stack">
            <SectionHeading>Age limits and adult responsibility</SectionHeading>
            <PathCard title="Event-specific age limits">
              <p>
                Age limits are set per event, not as a single house rule. If a minor is welcome, a parent or legal
                guardian must give consent before participation.
              </p>
            </PathCard>
            <Notice icon="i">
              Children remain the responsibility of the adult who brings them. Organisation reporting routes are not
              open in this milestone. If a child is in immediate danger, contact emergency services first.
            </Notice>
          </div>
        </div>
      </PageSection>

      <PageSection tone="cream2">
        <div className="ydg-stack-lg ydg-measure">
          <SectionHeading>No tickets or bookings here</SectionHeading>
          <p className="text-[15px] text-[var(--ink-2)]">
            This website does not sell tickets, take payments or confirm event bookings. When an event is approved for
            public listing, details will appear here. Until then, you can preview how an enquiry will look.
          </p>
          <p className="ydg-fine">{demoEnquiryNotice}</p>
          <PrimaryButton href={publicRoutes.contact}>{publicContactLabel}</PrimaryButton>
        </div>
      </PageSection>
    </>
  );
}
