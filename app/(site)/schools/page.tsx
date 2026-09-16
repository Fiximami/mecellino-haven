import type { Metadata } from "next";
import {
  BoundaryBlock,
  Notice,
  PageHero,
  PageSection,
  PathCard,
  SectionHeading,
  TickList,
} from "@/components/ydg";
import { publicRoutes } from "@/config/routes";
import { ydgPartnerAudiences } from "@/config/site";
import { publicPageMetadata } from "@/lib/public-metadata";

export const metadata: Metadata = publicPageMetadata({
  title: "Schools & partners",
  description:
    "How schools, institutions, parents, entrepreneurs, governments and NGOs may work with Mecellino Haven. Mentor participation is planned but not publicly open. No live referral portal.",
  path: publicRoutes.schools,
});

export default function SchoolsPage() {
  return (
    <>
      <PageSection tone="paper">
        <PageHero
          eyebrow="Schools, institutions, parents and partners"
          title="What working with us actually involves"
          lede="YDG partners with schools, institutions, parents, entrepreneurs, governments and NGOs. These are audience relationships, not a list of signed organisations. Youth Discovery Gateway sits under Capacity Building. None of these relationships involve unsupervised contact with young people."
        />
      </PageSection>

      <PageSection>
        <div className="ydg-stack-lg">
          <SectionHeading>Who we work with</SectionHeading>
          <p className="text-[15px] text-[var(--ink-2)]">
            Partner audiences are {ydgPartnerAudiences.join(", ")}. Named organisations appear only when a relationship
            is verified and approved. None are listed in this milestone.
          </p>
          <SectionHeading>Three relationships</SectionHeading>
          <div className="ydg-grid-3">
          <PathCard title="Schools" href={publicRoutes.contact}>
            <p>
              <b>You do:</b> nominate students, provide an observable room for the discovery interview, release
              timetable, confirm the transport arrangement.
            </p>
            <p>
              <b>You do not:</b> screen students for suitability, hold our safeguarding responsibility, or send us
              files of student data.
            </p>
          </PathCard>
          <PathCard title="Companies and sponsors" href={publicRoutes.contact}>
            <p>
              <b>Honest scale:</b> one approved pilot in preparation, 20–30 participants, one Accra delivery area,
              intended to be free to families subject to confirmed sponsorship.
            </p>
            <p>
              <b>Visibility</b> is tied to approved, verified delivery, and is designed around non-identifying
              evidence — because participant media consent is optional and is never pressured.
            </p>
          </PathCard>
          <PathCard title="Mentors and facilitators" href={publicRoutes.contact}>
            <p>
              <b>Before anything else,</b> read the conduct rules. Expressing interest is not an offer and gives no
              access to young people.
            </p>
            <p>Screening, training and recorded vetting come first, always.</p>
          </PathCard>
          </div>
        </div>
      </PageSection>

      <PageSection tone="cream2">
        <div className="ydg-stack-lg ydg-measure">
          <SectionHeading>Mentors and facilitators — planned, not open</SectionHeading>
          <p className="text-[15px] text-[var(--ink-2)]">
            Mentor and facilitator participation is planned for future programme delivery, but it is{" "}
            <b>not publicly open</b> today. Different roles carry different responsibilities and will have separate
            future permissions — facilitators lead approved sessions; mentors provide narrower guided support under
            screening.
          </p>
          <TickList
            items={[
              "Screening, safeguarding training and recorded vetting are required before any access to programme delivery.",
              "Role definition and written approval come before assignment to a cohort or session.",
              "Expressing interest through the demonstration enquiry form does not create a volunteer record or offer.",
            ]}
          />
          <Notice icon="!">
            <b>No open mentor or facilitator registration exists on this website.</b> There is no mentor portal,
            application workflow or operational intake for volunteers in this milestone.
          </Notice>
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
