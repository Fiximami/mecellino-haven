import type { Metadata } from "next";
import {
  BoundaryBlock,
  InfoVisualCard,
  LinkArrow,
  Notice,
  PageHero,
  PageSection,
  PathCard,
  TickList,
} from "@/components/ydg";
import { publicRoutes } from "@/config/routes";
import { publicPageMetadata } from "@/lib/public-metadata";

export const metadata: Metadata = publicPageMetadata({
  title: "Mobile amusement",
  description:
    "Temporary mobile amusement stands at selected community, school, corporate and public events in Ghana. No permanent park. No event listings or bookings on this site.",
  path: publicRoutes.mobileAmusement,
});

export default function MobileAmusementPage() {
  return (
    <>
      <PageSection tone="paper">
        <PageHero
          eyebrow="Currently operating"
          title="Mobile amusement and family experiences"
          lede="We bring temporary event stands to selected community, school, corporate and public events. Mecellino Haven does not have a permanent park, and there are no passes, memberships or opening hours."
        />
      </PageSection>

      <PageSection>
        <div className="ydg-grid-2">
          <div className="ydg-stack">
            <h2 className="ydg-h2">Where we will be</h2>
            <Notice icon="i">
              <b>No confirmed events to show right now.</b> Event listings appear here once a host has confirmed and
              given permission for us to publish.
            </Notice>
            <h2 className="ydg-h2">Safety at our stands</h2>
            <TickList
              items={[
                "Children remain the responsibility of the adult who brings them.",
                "We do not collect children's details at a stand.",
                "No photography of children without approved separate consent.",
              ]}
            />
          </div>
          <div className="ydg-stack">
            <InfoVisualCard icon="⛺" title="Temporary event stand">
              <p>
                Mecellino Haven brings a mobile stand to selected events — setup, supervised operation and pack-down.
                Approved photography of stands and activities will appear here only after assets are commissioned and
                rights are confirmed. No fabricated participants or impact imagery is shown.
              </p>
            </InfoVisualCard>
            <PathCard title="Invite us to your event">
              <p>
                Schools, companies and community organisers can ask us to bring a stand. Tell us the date, the place
                and roughly how many families you expect.
              </p>
              <LinkArrow href={publicRoutes.contact}>Preview event enquiry form →</LinkArrow>
            </PathCard>
            <Notice icon="→">
              Meeting us at a stand may introduce your family to YDG, but it is <b>not</b> a requirement for joining
              the programme. When intake opens, recruitment will happen through schools and the community route.
            </Notice>
          </div>
        </div>
      </PageSection>

      <PageSection tone="cream2">
        <BoundaryBlock title="What you will not find on this page">
          No partner logos, no sponsor names, no testimonials and no impact figures. None have been verified yet, so
          none are shown. When they exist and are evidenced, they will appear here with the period and denominator
          they relate to.
        </BoundaryBlock>
      </PageSection>
    </>
  );
}
