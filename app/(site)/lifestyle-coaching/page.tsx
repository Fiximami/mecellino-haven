import type { Metadata } from "next";
import { PageBreadcrumb } from "@/components/brand/PageBreadcrumb";
import { IconBadge, LifestyleIcon } from "@/components/brand/ServiceIcons";
import { Notice, PageHero, PageSection, PathCard, PrimaryButton, SectionHeading } from "@/components/ydg";
import { publicRoutes } from "@/config/routes";
import { demoEnquiryNotice } from "@/config/site";
import { publicPageMetadata } from "@/lib/public-metadata";

export const metadata: Metadata = publicPageMetadata({
  title: "Lifestyle Coaching",
  description:
    "Mecellino Haven Lifestyle Coaching covers personal development, confidence, relationships, wellbeing, purpose, family life and general life transitions.",
  path: publicRoutes.lifestyleCoaching,
});

const areas = [
  {
    title: "Personal development",
    description: "Space to notice habits, strengths and the kind of growth that fits a person’s season of life.",
  },
  {
    title: "Confidence",
    description: "Practical support for self-trust, communication and showing up in everyday settings.",
  },
  {
    title: "Relationships",
    description: "Guidance for healthier family, peer and community relationships — not clinical therapy.",
  },
  {
    title: "Wellbeing",
    description: "Everyday wellbeing practices. This is not a medical, counselling or clinical service.",
  },
  {
    title: "Purpose",
    description: "Help clarifying direction and meaning without employment or income promises.",
  },
  {
    title: "Family life",
    description: "Support for family rhythms, communication and care roles across households.",
  },
  {
    title: "General life transitions",
    description: "Coaching through change — moving, study, family shifts and other ordinary turning points.",
  },
];

export default function LifestyleCoachingPage() {
  return (
    <>
      <PageSection tone="paper">
        <PageBreadcrumb
          items={[
            { href: publicRoutes.home, label: "Home" },
            { label: "Lifestyle Coaching" },
          ]}
        />
        <PageHero
          eyebrow="Lifestyle Coaching"
          title="Personal growth through life's transitions"
          lede="Lifestyle Coaching at Mecellino Haven focuses on personal development, confidence, relationships, wellbeing, purpose, family life and general life transitions."
        />
      </PageSection>

      <PageSection>
        <div className="ydg-stack-lg">
          <SectionHeading>What we coach</SectionHeading>
          <div className="ydg-grid-2">
            {areas.map((area) => (
              <PathCard key={area.title} title={area.title}>
                <p>{area.description}</p>
              </PathCard>
            ))}
          </div>
        </div>
      </PageSection>

      <PageSection tone="cream2">
        <div className="ydg-grid-2">
          <div className="ydg-stack">
            <IconBadge>
              <LifestyleIcon />
            </IconBadge>
            <SectionHeading>How to ask a question</SectionHeading>
            <p className="text-[15px] text-[var(--ink-2)]">{demoEnquiryNotice}</p>
            <PrimaryButton href={publicRoutes.contact}>Preview lifestyle enquiry</PrimaryButton>
          </div>
          <Notice icon="i">
            Coaching conversations will not be booked, paid for or confirmed through this website in this milestone.
            There are no live applications and no online payments.
          </Notice>
        </div>
      </PageSection>
    </>
  );
}
