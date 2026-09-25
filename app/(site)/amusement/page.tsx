import type { Metadata } from "next";
import { EditorialPhoto } from "@/components/brand/EditorialPhoto";
import { FlipCardGroup } from "@/components/motion/FlipCard";
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
    "Current mobile-amusement operations use temporary event stands. Mecellino Haven does not operate a permanent amusement park, fixed public venue, admission passes or regular opening hours.",
  path: publicRoutes.amusement,
});

export default function AmusementPage() {
  return (
    <>
      <PageSection tone="paper">
        <div className="mh-hero-split">
          <PageHero
            title="Mobile amusement at temporary event stands"
            lede={amusementDevelopmentStatement}
          />
          <div className="mh-hero-art">
            <EditorialPhoto imageId="amusement-hero" priority />
          </div>
        </div>
        <Notice icon="i" className="mt-6">
          Current operations use temporary event stands only. Mecellino Haven does not operate a permanent amusement
          park, fixed public venue, admission passes or regular opening hours.
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
                "Send a general enquiry about current mobile-amusement event stands.",
                "A permanent park, fixed venue, admission passes or regular opening hours would be an unconfirmed aspiration — not a current offering.",
                "This address is not an emergency contact.",
              ]}
            />
            <p className="text-[15px] text-[var(--ink-2)]">
              General enquiries and service requests can be sent to{" "}
              <a className="mh-email" href={`mailto:${publicEnquiryEmail}`}>
                {publicEnquiryEmail}
              </a>
              . That address is not an emergency contact and is not an emergency or incident-reporting channel.
            </p>
          </div>
          <FlipCardGroup>
          <div className="ydg-stack">
            <PathCard
              title="Permanent amusement"
              details={
                <p>
                  A later permanent site would be an unconfirmed aspiration. Nothing on this page lists dates, tickets or
                  opening hours for a park.
                </p>
              }
            >
              <p>
                Not a current operation. Any later permanent site would be an unconfirmed aspiration and is not offered
                today.
              </p>
            </PathCard>
            <PathCard
              title="Mobile amusement"
              details={
                <p>
                  Temporary stands appear only at events where they are booked. This page does not sell tickets or
                  confirm attendance.
                </p>
              }
            >
              <p>
                Current operations use temporary event stands. This page does not sell tickets, list dates or imply a
                permanent venue.
              </p>
            </PathCard>
          </div>
          </FlipCardGroup>
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
