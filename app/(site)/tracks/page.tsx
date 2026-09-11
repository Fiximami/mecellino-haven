import type { Metadata } from "next";
import {
  BoundaryBlock,
  Chip,
  Notice,
  PageHero,
  PageSection,
  PrimaryButton,
  SectionHeading,
  TrackRow,
} from "@/components/ydg";
import { publicRoutes } from "@/config/routes";
import { programmeFacts } from "@/config/site";

export const metadata: Metadata = {
  title: "The four tracks",
  description:
    "Youth Discovery Gateway has four age-based tracks: Discovery Gateway, Foundation, Direction, and Execution & Progression.",
};

export default function TracksPage() {
  return (
    <>
      <PageSection tone="paper">
        <div className="ydg-stack-lg ydg-measure">
          <PageHero
            eyebrow="Tracks"
            title="Four tracks, by age at cohort start"
            lede="Age is counted on the official first day of the cohort — not on the day you register interest. Entry is possible directly at the age-appropriate track."
          />
          <Notice icon="i">
            A young person who turns the next track&apos;s age during a cohort may finish that cohort. A participant
            who turns 26 may complete the active cohort but cannot begin another standard participant cohort.
          </Notice>
        </div>
      </PageSection>

      <PageSection>
        <div className="ydg-stack-lg">
          <SectionHeading>Each track at a glance</SectionHeading>
          <TrackRow
            age={`Ages ${programmeFacts.discoveryGateway}`}
            title="Discovery Gateway"
            chip={<Chip variant="planned">Not yet scheduled</Chip>}
            description={
              <>
                <b>Purpose:</b> broad, supervised discovery without premature specialisation.
                <br />
                <b>Typical evidence:</b> initial discovery profile, reflections, group work samples.
              </>
            }
          />
          <TrackRow
            age={`Ages ${programmeFacts.foundation}`}
            title="Foundation"
            chip={<Chip variant="pilot">Pilot in preparation</Chip>}
            description={
              <>
                <b>Purpose:</b> guided exploration, communication, teamwork and core life capabilities.
                <br />
                <b>Typical evidence:</b> career-cluster activity evidence and a next-step exploration plan.
              </>
            }
          />
          <TrackRow
            age={`Ages ${programmeFacts.direction}`}
            title="Direction"
            chip={<Chip variant="planned">Not yet scheduled</Chip>}
            description={
              <>
                <b>Purpose:</b> deeper testing of possible paths, portfolios and supervised institutional exposure.
                <br />
                <b>Typical evidence:</b> projects, portfolio evidence, mentor feedback and a pathway plan.
              </>
            }
          />
          <TrackRow
            age={`Ages ${programmeFacts.executionProgression}`}
            title="Execution & Progression"
            chip={<Chip variant="planned">Not yet scheduled</Chip>}
            description={
              <>
                <b>Purpose:</b> career readiness, enterprise exploration, projects and separately approved placements.
                <br />
                <b>Typical evidence:</b> applied work, portfolio, feedback and a progression record.
              </>
            }
          />
          <BoundaryBlock title="Movement between tracks is not automatic">
            Finishing one track does not entitle a young person to the next. Progression is evidence-informed,
            discussed with the family, and depends on a cohort being open.
          </BoundaryBlock>
          <PrimaryButton href={publicRoutes.contact}>Preview programme enquiry form</PrimaryButton>
        </div>
      </PageSection>
    </>
  );
}
