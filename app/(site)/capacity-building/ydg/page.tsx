import type { Metadata } from "next";
import { EditorialPhoto } from "@/components/brand/EditorialPhoto";
import { FlipCardGroup } from "@/components/motion/FlipCard";
import { LivingGateway } from "@/components/motion/LivingGateway";
import { RevealGroup } from "@/components/motion/RevealGroup";
import {
  BoundaryBlock,
  ButtonRow,
  GhostButton,
  LinkArrow,
  PageHero,
  PageSection,
  PathCard,
  PrimaryButton,
  SectionHeading,
  StatusBlock,
  TickList,
  UnfoldSequence,
  unfoldSteps,
} from "@/components/ydg";
import { publicRoutes } from "@/config/routes";
import {
  boundaryStatementShort,
  eligibilityAgeStatement,
  identitySafeguardStatement,
  ineligibleUnder13Statement,
  publicContactLabel,
  transportResponsibilityStatement,
} from "@/config/site";
import { publicPageMetadata } from "@/lib/public-metadata";

export const metadata: Metadata = publicPageMetadata({
  title: "Youth Discovery Gateway",
  description:
    "Youth Discovery Gateway helps individuals and institutions build evidence about interests and possible directions. Recruitment and applications are not open.",
  path: publicRoutes.ydg,
});

export default function YdgOverviewPage() {
  return (
    <>
      <PageSection tone="navy">
        <div className="ydg-stack-lg">
          <div className="mh-hero-split mh-hero-ydg">
            <LivingGateway variant="ydg" />
            <PageHero
              title="Youth Discovery Gateway"
              lede="An early interest is a hypothesis to test — not a label a person carries for life. YDG gives individuals and institutions structured ways to test theirs."
              onNavy
            />
            <div className="mh-hero-art">
              <EditorialPhoto imageId="ydg-hero" priority onNavy />
            </div>
          </div>
          <StatusBlock
            label="Current status"
            title="Applications are not open"
            description="One Foundation pilot is approved and in preparation for one Accra delivery area. We will publish dates when the programme and operational readiness checklist is closed. This page does not collect applications, guardian data or participant data."
          />
          <p className="text-[15px] text-[var(--mh-navy-section-muted)]">{eligibilityAgeStatement}</p>
          <p className="text-[15px] text-[var(--mh-navy-section-muted)]">{ineligibleUnder13Statement}</p>
          <p className="text-[15px] text-[var(--mh-navy-section-muted)]">{transportResponsibilityStatement}</p>
          <UnfoldSequence steps={[...unfoldSteps]} compact />
          <LinkArrow href={publicRoutes.howYdgWorks} variant="ydg">
            Open the full UNFOLD method
          </LinkArrow>
          <div className="ydg-grid-2">
            <div className="ydg-stack">
              <SectionHeading onNavy>What YDG does</SectionHeading>
              <p className="text-[15px] text-[var(--mh-navy-section-muted)]">
                Helps young people build evidence about their interests, strengths, working preferences and possible
                directions — through early discovery, guided exploration, practical experience, reflection and
                preparation.
              </p>
            </div>
            <div className="ydg-stack">
              <SectionHeading onNavy>What YDG is not</SectionHeading>
              <p className="text-[15px] text-[var(--mh-navy-section-muted)]">
                It does not replace school, clinical assessment, professional counselling, employment services or
                regulated training. It complements them.
              </p>
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection>
        <div className="ydg-stack-lg">
          <PageHero as="h2" eyebrow="Choose your way in" title="Who are you?" />
          <FlipCardGroup>
          <RevealGroup className="ydg-grid-2">
            <PathCard
              title="A parent or guardian"
              variant="ydg"
              href={publicRoutes.contact}
              details={
                <p>
                  Ask about consent, cost and collection when a monitored enquiry channel is approved. Eligibility and
                  consent rules stay on this page — they are not hidden behind this card.
                </p>
              }
            >
              <p>Consent, cost and collection questions can be asked through Contact Us when intake is approved.</p>
            </PathCard>
            <PathCard
              title="A school or partner"
              variant="ydg"
              href={publicRoutes.schools}
              details={
                <p>
                  Partner pages explain what a school or organisation would be agreeing to, and what it would not. Named
                  organisations appear only when a relationship is verified.
                </p>
              }
            >
              <p>What you would be agreeing to, and what you would not.</p>
            </PathCard>
          </RevealGroup>
          </FlipCardGroup>

          <div className="ydg-stack">
            <SectionHeading as="h3">If you are a participant</SectionHeading>
            <p className="text-[15px] text-[var(--ink-2)]">
              Eligible ages are 13–25 at the official cohort start date. Programme tracks are organised by
              developmental stage, with education stage recorded separately. Consent rules depend on the age band:
              13–17 require guardian consent plus participant assent; 18–25 require the participant’s own consent plus
              parent or guardian approval that never replaces that consent.
            </p>
            <RevealGroup className="ydg-grid-2">
              <PathCard title="Where a parent or legal guardian is responsible" variant="ydg" href={publicRoutes.tracks}>
                <p>
                  Early discovery, foundation development or direction building may apply, depending on the cohort first
                  day. A parent or legal guardian gives programme consent; you give your own separate assent.
                </p>
              </PathCard>
              <PathCard title="Where you give your own legal consent" variant="ydg" href={publicRoutes.tracks}>
                <p>
                  Execution and progression. You give your own legal consent. A parent, guardian or approved
                  responsible adult also gives programme acknowledgement — it never overrides your consent or right to
                  withdraw.
                </p>
              </PathCard>
            </RevealGroup>
            <LinkArrow href={publicRoutes.howYdgWorks} variant="ydg">
              How YDG works
            </LinkArrow>
          </div>
        </div>
      </PageSection>

      <PageSection tone="cream2">
        <div className="ydg-stack-lg">
          <PageHero
            as="h2"
            eyebrow="Essential Life Capability Spine"
            title="Four capabilities run through every track"
            lede="Stage-appropriate delivery, with recognition of learning a young person already has. Baseline checks guide personalisation — they are not punitive selection gates."
          />
            <FlipCardGroup>
            <RevealGroup className="ydg-grid-4">
            <PathCard
              title="Digital safety"
              details={<p>Stage-appropriate online habits, privacy awareness and asking for help when something feels wrong.</p>}
            >
              <p>Staying safe and in control online.</p>
            </PathCard>
            <PathCard
              title="Financial capability"
              details={<p>Everyday money language, planning and making choices that fit a young person’s current stage.</p>}
            >
              <p>Basic money skills that apply now.</p>
            </PathCard>
            <PathCard
              title="Communication"
              details={<p>Speaking clearly, listening well and working with others in supervised group settings.</p>}
            >
              <p>Being understood, and listening well.</p>
            </PathCard>
            <PathCard
              title="Self-management"
              details={<p>Time, follow-through and knowing when to ask for help — practised in programme activities, not as a test.</p>}
            >
              <p>Time, follow-through, asking for help.</p>
            </PathCard>
          </RevealGroup>
            </FlipCardGroup>
        </div>
      </PageSection>

      <PageSection tone="paper">
        <div className="ydg-grid-2">
          <div className="ydg-stack">
            <h2 className="ydg-h2">Families are part of this, not an afterthought</h2>
            <TickList
              items={[
                <>
                  Where a parent or legal guardian is legally responsible: that adult gives programme consent,{" "}
                  <em>and</em> the participant gives their own separate assent.
                </>,
                <>
                  Where the participant gives their own legal consent: a parent, guardian or approved responsible adult
                  also gives programme acknowledgement as an eligibility condition — it never overrides the
                  participant&apos;s own consent or right to withdraw.
                </>,
                <>Photography and video permission is separate and optional. Saying no changes nothing.</>,
                <>Every cohort includes a reflection and family-engagement session.</>,
                <>{identitySafeguardStatement}</>,
              ]}
            />
            <LinkArrow href={publicRoutes.howYdgWorks} variant="ydg">
              How supervision and consent sit in UNFOLD
            </LinkArrow>
          </div>
          <div className="ydg-stack">
            <BoundaryBlock>{boundaryStatementShort}</BoundaryBlock>
            <ButtonRow>
              <PrimaryButton href={publicRoutes.contact}>{publicContactLabel}</PrimaryButton>
              <GhostButton href={publicRoutes.tracks}>See the four tracks</GhostButton>
            </ButtonRow>
          </div>
        </div>
      </PageSection>
    </>
  );
}
