import type { Metadata } from "next";
import {
  ButtonRow,
  GhostButton,
  LeaderCard,
  Notice,
  PageHero,
  PageSection,
  PrimaryButton,
  SectionHeading,
  TickList,
  leadershipTeam,
} from "@/components/ydg";
import { publicRoutes } from "@/config/routes";
import {
  girlsCommitmentStatement,
  pilotFundingStatement,
  programmeFacts,
  recruitmentClosedStatement,
  selectionStatement,
} from "@/config/site";
import { publicPageMetadata } from "@/lib/public-metadata";

export const metadata: Metadata = publicPageMetadata({
  title: "About",
  description:
    "About Mecellino Haven and Youth Discovery Gateway — governance, pilot scope, and recruitment status. Applications are not open.",
  path: publicRoutes.about,
});

export default function AboutPage() {
  return (
    <>
      <PageSection tone="paper">
        <PageHero
          eyebrow="About"
          title="Mecellino Haven"
          lede="A Ghanaian organisation working with children, young people and families — currently through mobile amusement at selected events, and through the Youth Discovery Gateway for ages 10–25."
        />
      </PageSection>

      <PageSection>
        <div className="ydg-grid-2">
          <div className="ydg-stack">
            <SectionHeading>Leadership and accountability</SectionHeading>
            {leadershipTeam.map((leader) => (
              <LeaderCard key={leader.initials} {...leader} />
            ))}
          </div>
          <div className="ydg-stack">
            <SectionHeading>How we decide, and how we report</SectionHeading>
            <TickList
              items={[
                "Material changes to programme name, age rules, consent, the gender commitment, safeguarding, pilot scope or outcome claims require written approval by the Programme Director and are recorded in a decision log.",
                "We separate intended outcomes, pilot targets, delivered activities and verified results — and publish denominators, time periods and evidence sources.",
                "We do not imply national scale, employment impact or established success before evidence exists.",
              ]}
            />
            <SectionHeading as="h3">Girls and young women</SectionHeading>
            <p className="text-[15px] text-[var(--ink-2)]">{girlsCommitmentStatement}</p>
            <p className="ydg-fine">
              The 70% figure is stated as a programme commitment with its method and measurement. No achieved
              percentage is shown, because no annual enrolment cycle has been completed and verified.
            </p>
          </div>
        </div>
      </PageSection>

      <PageSection tone="cream2">
        <div className="ydg-stack-lg ydg-measure">
          <SectionHeading>Mecellino Haven and Youth Discovery Gateway</SectionHeading>
          <p className="text-[15px] text-[var(--ink-2)]">
            Mecellino Haven operates mobile amusement at selected events and runs Youth Discovery Gateway (YDG), a
            structured programme for young people aged {programmeFacts.ageRange}. YDG helps participants build evidence
            about their interests, strengths and possible directions. It does not replace school, clinical assessment,
            counselling or regulated training.
          </p>
          <SectionHeading as="h3">Selection</SectionHeading>
          <p className="text-[15px] text-[var(--ink-2)]">{selectionStatement}</p>
          <SectionHeading as="h3">Foundation pilot funding</SectionHeading>
          <p className="text-[15px] text-[var(--ink-2)]">{pilotFundingStatement}</p>
          <Notice icon="i">
            {recruitmentClosedStatement} No partner logos, sponsor names, testimonials or impact figures appear here
            until they are verified and evidenced.
          </Notice>
          <ButtonRow>
            <PrimaryButton href={publicRoutes.ydg}>Youth Discovery Gateway programme</PrimaryButton>
            <GhostButton href={publicRoutes.parents}>Safeguarding information</GhostButton>
          </ButtonRow>
        </div>
      </PageSection>
    </>
  );
}
