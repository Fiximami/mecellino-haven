import type { Metadata } from "next";
import { PageBreadcrumb } from "@/components/brand/PageBreadcrumb";
import { ServiceArtwork } from "@/components/brand/ServiceArtwork";
import {
  BoundaryBlock,
  Chip,
  Notice,
  PageHero,
  PageSection,
  PrimaryButton,
  SectionHeading,
  StatusBlock,
  TrackRow,
} from "@/components/ydg";
import { publicRoutes } from "@/config/routes";
import { publicContactLabel, recruitmentClosedStatement } from "@/config/site";
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
          <PageBreadcrumb
            items={[
              { href: publicRoutes.home, label: "Home" },
              { href: publicRoutes.capacityBuilding, label: "Capacity Building" },
              { href: publicRoutes.ydg, label: "Youth Discovery Gateway" },
              { label: "Tracks" },
            ]}
          />
          <div className="mh-hero-split">
            <PageHero
              eyebrow="Capacity Building · Tracks"
              title="Four developmental tracks"
              lede="Each track is a developmental stage, not a label a person carries for life. Education stage — such as school year or training context — is recorded separately when intake opens. Entry is possible directly at the stage that fits."
            />
            <div className="mh-hero-art text-[var(--mh-terracotta)]">
              <ServiceArtwork visual="ydg" />
            </div>
          </div>
          <div className="ydg-stack-lg ydg-measure">
            <StatusBlock
              label="Recruitment status"
              title="Recruitment and applications are not open"
              description={recruitmentClosedStatement}
            />
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
          <TrackRow
            href={publicRoutes.howYdgWorks}
            stage="Early discovery"
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
            href={publicRoutes.howYdgWorks}
            stage="Foundation development"
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
            href={publicRoutes.howYdgWorks}
            stage="Direction building"
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
            href={publicRoutes.howYdgWorks}
            stage="Execution and progression"
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
          <PrimaryButton href={publicRoutes.contact}>{publicContactLabel}</PrimaryButton>
        </div>
      </PageSection>
    </>
  );
}
