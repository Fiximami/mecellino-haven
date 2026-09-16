import type { Metadata } from "next";
import { PageBreadcrumb } from "@/components/brand/PageBreadcrumb";
import { ServiceArtwork } from "@/components/brand/ServiceArtwork";
import { AmusementIcon, IconBadge } from "@/components/brand/ServiceIcons";
import {
  BoundaryBlock,
  Notice,
  PageHero,
  PageSection,
  PathCard,
  PrimaryButton,
  SectionHeading,
  TickList,
} from "@/components/ydg";
import { publicRoutes } from "@/config/routes";
import { amusementDevelopmentStatement, demoEnquiryNotice, publicContactLabel, publicEnquiryEmail } from "@/config/site";
import { publicPageMetadata } from "@/lib/public-metadata";

export const metadata: Metadata = publicPageMetadata({
  title: "Amusement",
  description:
    "Mecellino Haven amusement is coming soon. Permanent and mobile amusement remain in development. No permanent amusement site currently exists. Register interest or request mobile-amusement information.",
  path: publicRoutes.amusement,
});

export default function AmusementPage() {
  return (
    <>
      <PageSection tone="paper">
        <PageBreadcrumb
          items={[
            { href: publicRoutes.home, label: "Home" },
            { label: "Amusement" },
          ]}
        />
        <div className="mh-hero-split">
          <PageHero
            eyebrow="Coming soon"
            title="Amusement is in development"
            lede={amusementDevelopmentStatement}
          />
          <div className="mh-hero-art text-[var(--mh-terracotta)]">
            <ServiceArtwork visual="amusement" />
          </div>
        </div>
        <Notice icon="i" className="mt-6">
          Mecellino Haven does not currently operate a permanent amusement site, park, pass system or public opening
          hours.
        </Notice>
      </PageSection>

      <PageSection>
        <div className="ydg-grid-2">
          <div className="ydg-stack">
            <IconBadge>
              <AmusementIcon />
            </IconBadge>
            <SectionHeading>What you can do today</SectionHeading>
            <TickList
              items={[
                "Register interest in future amusement experiences.",
                "Request information about mobile amusement once it is approved for public offering.",
                "Read safeguarding information if you are a parent or guardian.",
              ]}
            />
            <p className="text-[15px] text-[var(--ink-2)]">
              General enquiries and service requests can be sent to{" "}
              <a className="mh-email" href={`mailto:${publicEnquiryEmail}`}>
                {publicEnquiryEmail}
              </a>
              . That address is not an emergency contact and is not a safeguarding-reporting channel.
            </p>
          </div>
          <div className="ydg-stack">
            <PathCard title="Permanent amusement">
              <p>In development. No claim is made that a site exists today.</p>
            </PathCard>
            <PathCard title="Mobile amusement">
              <p>
                Also in development. When information can be shared, it will appear here. You may request to be told
                when that happens.
              </p>
            </PathCard>
          </div>
        </div>
      </PageSection>

      <PageSection tone="cream2">
        <div className="ydg-stack-lg ydg-measure">
          <BoundaryBlock title="What you will not find on this page">
            No event listings, ticket sales, confirmed bookings, partner logos, testimonials or impact figures. None of
            those are operating or verified here.
          </BoundaryBlock>
          <p className="ydg-fine">{demoEnquiryNotice}</p>
          <PrimaryButton href={publicRoutes.contact}>{publicContactLabel}</PrimaryButton>
        </div>
      </PageSection>
    </>
  );
}
