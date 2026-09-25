import type { Metadata } from "next";
import { EditorialPhoto } from "@/components/brand/EditorialPhoto";
import { FlipCardGroup } from "@/components/motion/FlipCard";
import { RevealGroup } from "@/components/motion/RevealGroup";
import { CapacityIcon, YdgIcon } from "@/components/brand/ServiceIcons";
import { ServiceJourneyCard } from "@/components/brand/ServiceJourneyCard";
import { ButtonRow, GhostButton, PageHero, PageSection, PrimaryButton, SectionHeading } from "@/components/ydg";
import { publicRoutes } from "@/config/routes";
import { recruitmentClosedStatement, publicContactLabel } from "@/config/site";
import { publicPageMetadata } from "@/lib/public-metadata";

export const metadata: Metadata = publicPageMetadata({
  title: "Capacity Building",
  description:
    "Mecellino Haven Capacity Building includes Youth Discovery Gateway, Retirement Life Preparedness, individual training and institutional training. Recruitment is not open.",
  path: publicRoutes.capacityBuilding,
});

export default function CapacityBuildingPage() {
  return (
    <>
      <PageSection tone="paper">
        <div className="mh-hero-split">
          <PageHero
            title="Practical training for people and institutions"
            lede="Mecellino Haven builds capability through Youth Discovery Gateway, Retirement Life Preparedness, individual training and institutional training. Live applications are not open."
          />
          <div className="mh-hero-art">
            <EditorialPhoto imageId="capacity-hero" priority />
          </div>
        </div>
      </PageSection>

      <PageSection>
        <div className="ydg-stack-lg">
          <SectionHeading>Four Capacity Building pathways</SectionHeading>
          <FlipCardGroup>
            <RevealGroup className="mh-grid-2">
              <ServiceJourneyCard
                href={publicRoutes.ydg}
                title="Youth Discovery Gateway"
                description="A structured programme for individuals and institutions. Participants test interests, build evidence and write their own next-step plan."
                details="YDG helps people test interests, build evidence and write a next-step plan. Recruitment is not open and no employment, admission or placement is promised."
                chip="Flagship programme"
                icon={<YdgIcon />}
                imageId="capacity-ydg"
              />
              <ServiceJourneyCard
                href={publicRoutes.retirementLife}
                title="Retirement Life Preparedness"
                description="Capacity-building preparation for later-life transitions, without income or placement promises."
                details="Preparation for later-life transitions. This pathway does not promise income, placement or a particular retirement outcome."
                icon={<CapacityIcon />}
                imageId="capacity-retirement"
              />
              <ServiceJourneyCard
                href={publicRoutes.contact}
                title="Individual training"
                description="Practical training for individuals. Dates, eligibility and delivery details will be published when a cohort is approved."
                details="Individual training dates and delivery details will appear when a cohort is approved. Enquiry remains a demonstration until then."
                chip="Foundation"
                icon={<CapacityIcon />}
                imageId="capacity-individual"
              />
              <ServiceJourneyCard
                href={publicRoutes.contact}
                title="Institutional training"
                description="Training designed with schools, workplaces and community organisations. Dates, eligibility and delivery details will be published when a cohort is approved."
                details="Institutional training is designed with organisations. Named partners appear only when a relationship is verified."
                chip="Foundation"
                icon={<CapacityIcon />}
                imageId="capacity-institutional"
              />
            </RevealGroup>
          </FlipCardGroup>
        </div>
      </PageSection>

      <PageSection tone="cream2">
        <div className="ydg-stack-lg ydg-measure">
          <SectionHeading>What this page does not do</SectionHeading>
          <p className="text-[15px] text-[var(--ink-2)]">{recruitmentClosedStatement}</p>
          <p className="text-[15px] text-[var(--ink-2)]">
            Enquiry remains a demonstration. No live participant applications, payments or confirmed bookings are
            available here.
          </p>
          <ButtonRow>
            <PrimaryButton href={publicRoutes.ydg}>Youth Discovery Gateway</PrimaryButton>
            <GhostButton href={publicRoutes.contact}>{publicContactLabel}</GhostButton>
          </ButtonRow>
        </div>
      </PageSection>
    </>
  );
}
