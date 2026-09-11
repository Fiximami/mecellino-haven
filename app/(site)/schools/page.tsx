import type { Metadata } from "next";
import {
  BoundaryBlock,
  LinkArrow,
  PageHero,
  PageSection,
  PathCard,
  SectionHeading,
  TickList,
} from "@/components/ydg";
import { publicRoutes } from "@/config/routes";

export const metadata: Metadata = {
  title: "Schools & partners",
  description:
    "How schools, sponsors, mentors and facilitators work with Mecellino Haven and Youth Discovery Gateway.",
};

export default function SchoolsPage() {
  return (
    <>
      <PageSection tone="paper">
        <PageHero
          eyebrow="Schools, partners and mentors"
          title="What working with us actually involves"
          lede="Three different relationships, three different sets of controls. None of them involve unsupervised contact with young people."
        />
      </PageSection>

      <PageSection>
        <div className="ydg-stack-lg">
          <SectionHeading>Three relationships</SectionHeading>
          <div className="ydg-grid-3">
          <PathCard title="Schools">
            <p>
              <b>You do:</b> nominate students, provide an observable room for the discovery interview, release
              timetable, confirm the transport arrangement.
            </p>
            <p>
              <b>You do not:</b> screen students for suitability, hold our safeguarding responsibility, or send us
              files of student data.
            </p>
            <LinkArrow href={publicRoutes.contact}>Preview school enquiry form →</LinkArrow>
          </PathCard>
          <PathCard title="Companies and sponsors">
            <p>
              <b>Honest scale:</b> one approved pilot in preparation, 20–30 participants, one Accra delivery area,
              intended to be free to families subject to confirmed sponsorship.
            </p>
            <p>
              <b>Visibility</b> is tied to approved, verified delivery, and is designed around non-identifying
              evidence — because participant media consent is optional and is never pressured.
            </p>
            <LinkArrow href={publicRoutes.contact}>Preview sponsorship enquiry form →</LinkArrow>
          </PathCard>
          <PathCard title="Mentors and facilitators">
            <p>
              <b>Before anything else,</b> read the conduct rules. Expressing interest is not an offer and gives no
              access to young people.
            </p>
            <p>Screening, training and recorded vetting come first, always.</p>
            <LinkArrow href={publicRoutes.contact}>Preview mentor enquiry form →</LinkArrow>
          </PathCard>
          </div>
        </div>
      </PageSection>

      <PageSection tone="navy">
        <div className="ydg-stack-lg">
          <PageHero
            as="h2"
            eyebrow="Non-negotiable"
            title="Conduct rules for every adult, including partner staff"
            onNavy
          />
          <div className="ydg-grid-2">
            <TickList
              items={[
                "Interactions stay observable and interruptible. No isolated one-to-one contact.",
                "No private messaging with a young person, and no exchanging personal contact details.",
                "No gifts, cash, employment promises, private opportunities or secret arrangements.",
              ]}
            />
            <TickList
              items={[
                "No photography or recording without approved separate consent and a legitimate programme purpose.",
                "No alcohol or impairing substances on duty.",
                "Report boundary concerns, disclosures and policy breaches immediately.",
              ]}
            />
          </div>
        </div>
      </PageSection>

      <PageSection>
        <BoundaryBlock title="What you will not find on this page">
          No partner logos, no sponsor names, no testimonials and no impact figures. None have been verified yet, so
          none are shown. When they exist and are evidenced, they will appear here with the period and denominator
          they relate to.
        </BoundaryBlock>
      </PageSection>
    </>
  );
}
