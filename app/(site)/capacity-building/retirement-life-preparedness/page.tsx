import type { Metadata } from "next";
import { PageBreadcrumb } from "@/components/brand/PageBreadcrumb";
import { Notice, PageHero, PageSection, PathCard, PrimaryButton, SectionHeading } from "@/components/ydg";
import { publicRoutes } from "@/config/routes";
import { boundaryStatementShort, publicContactLabel, recruitmentClosedStatement } from "@/config/site";
import { publicPageMetadata } from "@/lib/public-metadata";

export const metadata: Metadata = publicPageMetadata({
  title: "Retirement Life Preparedness",
  description:
    "Retirement Life Preparedness is a Capacity Building pathway at Mecellino Haven. No live enrolment or income promises.",
  path: publicRoutes.retirementLife,
});

export default function RetirementLifePreparednessPage() {
  return (
    <>
      <PageSection tone="paper">
        <PageBreadcrumb
          items={[
            { href: publicRoutes.home, label: "Home" },
            { href: publicRoutes.capacityBuilding, label: "Capacity Building" },
            { label: "Retirement Life Preparedness" },
          ]}
        />
        <PageHero
          eyebrow="Capacity Building"
          title="Retirement Life Preparedness"
          lede="A Capacity Building pathway that helps adults prepare for later-life transitions through practical learning. It is not an investment scheme or a promise of income."
        />
      </PageSection>

      <PageSection>
        <div className="ydg-grid-2">
          <div className="ydg-stack">
            <SectionHeading>What this pathway is for</SectionHeading>
            <p className="text-[15px] text-[var(--ink-2)]">
              Retirement Life Preparedness sits under Capacity Building. It is intended to help people think about
              routine, contribution, relationships and practical planning as they approach later-life change.
            </p>
            <p className="text-[15px] text-[var(--ink-2)]">
              Delivery details, eligibility and dates will be published only when a cohort is approved. Nothing on this
              page enrols a participant.
            </p>
          </div>
          <div className="ydg-stack">
            <SectionHeading>Clear limits</SectionHeading>
            <PathCard title="Later-life preparation as training">
              <p>
                This pathway belongs under Capacity Building. It helps people think about routine, contribution,
                relationships and practical planning as they approach later-life change.
              </p>
            </PathCard>
            <Notice icon="i">{recruitmentClosedStatement}</Notice>
            <p className="ydg-fine">{boundaryStatementShort}</p>
          </div>
        </div>
      </PageSection>

      <PageSection tone="cream2">
        <div className="ydg-stack ydg-measure">
          <SectionHeading>Next step</SectionHeading>
          <p className="text-[15px] text-[var(--ink-2)]">
            Preview how an enquiry will look when a monitored channel is approved. Nothing you enter is sent or stored.
          </p>
          <PrimaryButton href={publicRoutes.contact}>{publicContactLabel}</PrimaryButton>
        </div>
      </PageSection>
    </>
  );
}
