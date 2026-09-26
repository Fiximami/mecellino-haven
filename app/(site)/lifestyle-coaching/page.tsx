import type { Metadata } from "next";
import { EditorialPhoto } from "@/components/brand/EditorialPhoto";
import { IconBadge, LifestyleIcon } from "@/components/brand/ServiceIcons";
import { FlipCardGroup } from "@/components/motion/FlipCard";
import { RevealGroup } from "@/components/motion/RevealGroup";
import { Notice, PageHero, PageSection, PathCard, PrimaryButton, SectionHeading } from "@/components/ydg";
import { publicRoutes } from "@/config/routes";
import { demoEnquiryNotice, publicContactLabel } from "@/config/site";
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
    details: "Sessions help a person notice patterns and choose the next small practice. No outcome, job or income is promised.",
  },
  {
    title: "Confidence",
    description: "Practical support for self-trust, communication and showing up in everyday settings.",
    details: "Work may include speaking up, preparing for ordinary conversations and noticing what already works.",
  },
  {
    title: "Relationships",
    description: "Guidance for healthier family, peer and community relationships — not clinical therapy.",
    details: "The focus is everyday relationship skills. This is not couple therapy, family therapy or a clinical service.",
  },
  {
    title: "Wellbeing",
    description: "Everyday wellbeing practices. This is not a medical, counselling or clinical service.",
    details: "Practices stay in the ordinary range — rest, routine and asking for help. Medical or counselling needs are directed elsewhere.",
  },
  {
    title: "Purpose",
    description: "Help clarifying direction and meaning without employment or income promises.",
    details: "Purpose work helps a person name what matters now. It does not guarantee a job, course place or income.",
  },
  {
    title: "Family life",
    description: "Support for family rhythms, communication and care roles across households.",
    details: "Family-life coaching looks at rhythms and roles. It does not replace social care or legal advice.",
  },
  {
    title: "General life transitions",
    description: "Coaching through change — moving, study, family shifts and other ordinary turning points.",
    details: "Transitions coaching is conversational and time-bounded. Bookings are not taken through this website.",
  },
];

export default function LifestyleCoachingPage() {
  return (
    <>
      <PageSection tone="paper">
        <div className="mh-hero-split">
          <PageHero
            title="Personal growth through life's transitions"
            lede="Lifestyle Coaching at Mecellino Haven focuses on personal development, confidence, relationships, wellbeing, purpose, family life and general life transitions."
          />
          <div className="mh-hero-art">
            <EditorialPhoto imageId="lifestyle-hero" priority />
          </div>
        </div>
      </PageSection>

      <PageSection>
        <div className="ydg-stack-lg">
          <SectionHeading>What we coach</SectionHeading>
          <FlipCardGroup>
            <RevealGroup className="ydg-grid-2">
              {areas.map((area) => (
                <PathCard key={area.title} title={area.title} details={<p>{area.details}</p>}>
                  <p>{area.description}</p>
                </PathCard>
              ))}
            </RevealGroup>
          </FlipCardGroup>
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
            <PrimaryButton href={publicRoutes.contact}>{publicContactLabel}</PrimaryButton>
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
