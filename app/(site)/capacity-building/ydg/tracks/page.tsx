import type { Metadata } from "next";
import { EditorialPhoto } from "@/components/brand/EditorialPhoto";
import {
  BoundaryBlock,
  Chip,
  Notice,
  PageHero,
  PageSection,
  PrimaryButton,
  SectionHeading,
  StatusBlock,
} from "@/components/ydg";
import { TrackRevealList } from "@/components/ydg/TrackRevealList";
import { publicRoutes } from "@/config/routes";
import { eligibilityAgeStatement, ineligibleUnder13Statement, publicContactLabel, recruitmentClosedStatement } from "@/config/site";
import { publicPageMetadata } from "@/lib/public-metadata";

export const metadata: Metadata = publicPageMetadata({
  title: "The four tracks",
  description:
    "Four Youth Discovery Gateway developmental tracks: early discovery, foundation development, direction building, and execution and progression. Recruitment and applications are not open.",
  path: publicRoutes.tracks,
});

export default function TracksPage() {
  return (
    <>
      <PageSection tone="paper">
        <div className="ydg-stack-lg">
          <div className="mh-hero-split">
            <PageHero
              title="Four developmental tracks"
              lede="Each track is a developmental stage, not a label a person carries for life. Education stage — such as school year or training context — is recorded separately when intake opens. Entry is possible directly at the stage that fits."
            />
            <div className="mh-hero-art">
              <EditorialPhoto imageId="ydg-tracks" priority />
            </div>
          </div>
          <div className="ydg-stack-lg ydg-measure">
            <StatusBlock
              label="Recruitment status"
              title="Recruitment and applications are not open"
              description={recruitmentClosedStatement}
            />
            <Notice icon="i">
              {eligibilityAgeStatement} {ineligibleUnder13Statement}
            </Notice>
            <Notice icon="!">
              <b>&quot;Register interest&quot; describes future approved functionality — not a service operating today.</b>{" "}
              When live intake is approved, interest registration will open through an authenticated process. This page
              explains tracks only; it does not accept registrations.
            </Notice>
            <Notice icon="i">
              Programme tracks follow developmental stage. <b>Education stage is separate</b> — such as school year or
              training context — and is recorded independently when intake opens. Stage alone does not determine
              education stage.
            </Notice>
            <Notice icon="i">
              A participant who moves into the next developmental stage during a cohort may finish that cohort. Completing
              a later-stage cohort does not open another standard participant cohort automatically.
            </Notice>
          </div>
        </div>
      </PageSection>

      <PageSection>
        <div className="ydg-stack-lg">
          <SectionHeading>Each track at a glance</SectionHeading>
          <p className="text-[15px] text-[var(--ink-2)]">
            Use View details to read a track. Eligibility, consent and application status stay visible above — they
            are never hidden inside a card.
          </p>
          <TrackRevealList
            tracks={[
              {
                id: "discovery",
                stage: "Early discovery",
                title: "Discovery Gateway",
                chip: <Chip variant="planned">Not yet scheduled</Chip>,
                summary: "Broad, supervised discovery without premature specialisation.",
                description: (
                  <>
                    <b>Purpose:</b> broad, supervised discovery without premature specialisation.
                    <br />
                    <b>Typical evidence:</b> initial discovery profile, reflections, group work samples.
                  </>
                ),
              },
              {
                id: "foundation",
                stage: "Foundation development",
                title: "Foundation",
                chip: <Chip variant="pilot">Pilot in preparation</Chip>,
                summary: "Guided exploration, communication, teamwork and core life capabilities.",
                description: (
                  <>
                    <b>Purpose:</b> guided exploration, communication, teamwork and core life capabilities.
                    <br />
                    <b>Typical evidence:</b> career-cluster activity evidence and a next-step exploration plan.
                  </>
                ),
              },
              {
                id: "direction",
                stage: "Direction building",
                title: "Direction",
                chip: <Chip variant="planned">Not yet scheduled</Chip>,
                summary: "Deeper testing of possible paths, portfolios and supervised institutional exposure.",
                description: (
                  <>
                    <b>Purpose:</b> deeper testing of possible paths, portfolios and supervised institutional exposure.
                    <br />
                    <b>Typical evidence:</b> projects, portfolio evidence, mentor feedback and a pathway plan.
                  </>
                ),
              },
              {
                id: "execution",
                stage: "Execution and progression",
                title: "Execution & Progression",
                chip: <Chip variant="planned">Not yet scheduled</Chip>,
                summary: "Career readiness, enterprise exploration, projects and separately approved placements.",
                description: (
                  <>
                    <b>Purpose:</b> career readiness, enterprise exploration, projects and separately approved placements.
                    <br />
                    <b>Typical evidence:</b> applied work, portfolio, feedback and a progression record.
                  </>
                ),
              },
            ]}
          />
          <BoundaryBlock title="Movement between tracks is not automatic">
            Finishing one track does not entitle a young person to the next. Progression is evidence-informed,
            discussed with the family, and depends on a cohort being open.
          </BoundaryBlock>
          <PrimaryButton href={publicRoutes.contact}>{publicContactLabel}</PrimaryButton>
        </div>
      </PageSection>
    </>
  );
}
