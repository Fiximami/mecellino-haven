import type { Metadata } from "next";
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
} from "@/components/ydg";
import { publicRoutes } from "@/config/routes";
import { boundaryStatementShort, identitySafeguardStatement, programmeFacts } from "@/config/site";

export const metadata: Metadata = {
  title: "Youth Discovery Gateway",
  description:
    "Youth Discovery Gateway helps young people aged 10–25 build evidence about their interests, strengths and possible directions.",
};

export default function YdgOverviewPage() {
  return (
    <>
      <PageSection tone="navy">
        <div className="ydg-stack-lg">
          <PageHero
            eyebrow="Mecellino Haven · Flagship programme"
            title="Youth Discovery Gateway"
            lede={`An early interest is a hypothesis to test — not a label a young person carries for life. YDG gives ${programmeFacts.ageRange} year olds structured ways to test theirs.`}
            onNavy
          />
          <StatusBlock
            label="Current status"
            title="Applications are not open"
            description="One Foundation pilot is approved and in preparation for one Accra delivery area. We will publish dates when the safeguarding readiness checklist is closed."
          />
          <div className="ydg-grid-2">
            <div className="ydg-stack">
              <SectionHeading onNavy>What YDG does</SectionHeading>
              <p className="text-[15px] text-[#C9D4E6]">
                Helps young people build evidence about their interests, strengths, working preferences and possible
                directions — through age-appropriate discovery, guided exploration, practical experience, reflection
                and preparation.
              </p>
            </div>
            <div className="ydg-stack">
              <SectionHeading onNavy>What YDG is not</SectionHeading>
              <p className="text-[15px] text-[#C9D4E6]">
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
          <div className="ydg-grid-3">
            <PathCard title="A young person" variant="ydg">
              <p>{programmeFacts.ageRange}, wondering what you are good at.</p>
              <LinkArrow href={publicRoutes.howYdgWorks} variant="ydg">
                Start here →
              </LinkArrow>
            </PathCard>
            <PathCard title="A parent or guardian" variant="ydg">
              <p>Safety, consent, cost and collection — answered plainly.</p>
              <LinkArrow href={publicRoutes.parents} variant="ydg">
                Start here →
              </LinkArrow>
            </PathCard>
            <PathCard title="A school or partner" variant="ydg">
              <p>What you would be agreeing to, and what you would not.</p>
              <LinkArrow href={publicRoutes.schools} variant="ydg">
                Start here →
              </LinkArrow>
            </PathCard>
          </div>
        </div>
      </PageSection>

      <PageSection tone="cream2">
        <div className="ydg-stack-lg">
          <PageHero
            as="h2"
            eyebrow="Essential Life Capability Spine"
            title="Four capabilities run through every track"
            lede="Age-appropriate delivery, with recognition of learning a young person already has. Baseline checks guide personalisation — they are not punitive selection gates."
          />
          <div className="ydg-grid-4">
            <PathCard title="Digital safety">
              <p>Staying safe and in control online.</p>
            </PathCard>
            <PathCard title="Financial capability">
              <p>Basic money skills that apply now.</p>
            </PathCard>
            <PathCard title="Communication">
              <p>Being understood, and listening well.</p>
            </PathCard>
            <PathCard title="Self-management">
              <p>Time, follow-through, asking for help.</p>
            </PathCard>
          </div>
        </div>
      </PageSection>

      <PageSection tone="paper">
        <div className="ydg-grid-2">
          <div className="ydg-stack">
            <h2 className="ydg-h2">Families are part of this, not an afterthought</h2>
            <TickList
              items={[
                <>
                  Ages {programmeFacts.consentMinor}: a parent or legal guardian gives programme consent,{" "}
                  <em>and</em> the participant gives their own separate assent.
                </>,
                <>
                  Ages {programmeFacts.consentAdult}: the participant gives their own legal consent; a parent,
                  guardian or approved responsible adult also gives programme acknowledgement as an eligibility
                  condition — it never overrides the participant&apos;s own consent or right to withdraw.
                </>,
                <>Photography and video permission is separate and optional. Saying no changes nothing.</>,
                <>Every cohort includes a reflection and family-engagement session.</>,
                <>{identitySafeguardStatement}</>,
              ]}
            />
            <LinkArrow href={publicRoutes.parents}>Safety, supervision and consent in full →</LinkArrow>
          </div>
          <div className="ydg-stack">
            <BoundaryBlock>{boundaryStatementShort}</BoundaryBlock>
            <ButtonRow>
              <PrimaryButton href={publicRoutes.contact}>Preview programme enquiry form</PrimaryButton>
              <GhostButton href={publicRoutes.tracks}>See the four tracks</GhostButton>
            </ButtonRow>
          </div>
        </div>
      </PageSection>
    </>
  );
}
