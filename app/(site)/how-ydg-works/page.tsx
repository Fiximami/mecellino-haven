import type { Metadata } from "next";
import {
  Chip,
  KeyValueList,
  PageHero,
  PageSection,
  PathCard,
  UnfoldSequence,
  unfoldStepsDetailed,
} from "@/components/ydg";

export const metadata: Metadata = {
  title: "How YDG works",
  description:
    "UNFOLD is the seven-stage method behind Youth Discovery Gateway. Each cohort cycle runs for at least five working days.",
};

export default function HowYdgWorksPage() {
  return (
    <>
      <PageSection tone="paper">
        <PageHero
          eyebrow="How YDG works"
          title="Seven stages, five days at a time"
          lede="UNFOLD is the method behind every track. A structured cohort cycle or module runs for at least five working days; individual activities may be shorter."
        />
      </PageSection>

      <PageSection tone="navy">
        <UnfoldSequence steps={[...unfoldStepsDetailed]} />
      </PageSection>

      <PageSection>
        <div className="ydg-grid-2">
          <div className="ydg-stack">
            <h2 className="ydg-h2">A five-day cycle, in practice</h2>
            <KeyValueList
              items={[
                { label: "Day 1", value: "Orientation, digital safety, first discovery activity" },
                { label: "Day 2", value: "Career-cluster experience one" },
                { label: "Day 3", value: "Communication and self-management" },
                { label: "Day 4", value: "Career-cluster experience two" },
                { label: "Day 5", value: "Basic financial capability, next-step planning" },
                { label: "Plus", value: "Reflection and family-engagement session" },
              ]}
            />
            <p className="ydg-fine">
              <Chip variant="pilot">Pilot in preparation</Chip> This shape is the approved Foundation pilot schedule. Other tracks
              are not yet scheduled.
            </p>
          </div>
          <div className="ydg-stack">
            <h2 className="ydg-h2">Two layers, always running</h2>
            <PathCard title="Discovery & Direction Pathway" variant="ydg">
              <p>
                Self-discovery, practical challenges and work samples, screened exposure, reflection and portfolio.
              </p>
            </PathCard>
            <PathCard title="Essential Life Capability Spine" variant="ydg">
              <p>
                Digital safety, basic financial capability, communication and self-management — with optional modules
                such as problem-solving, teamwork and career navigation.
              </p>
            </PathCard>
          </div>
        </div>
      </PageSection>
    </>
  );
}
