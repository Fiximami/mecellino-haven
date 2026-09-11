import type { Metadata } from "next";
import {
  BoundaryBlock,
  FaqAccordion,
  KeyValueList,
  Notice,
  PageHero,
  PageSection,
  PathCard,
  SectionHeading,
  TickList,
} from "@/components/ydg";
import {
  ages1012SafeguardingNote,
  identitySafeguardStatement,
  pilotFundingStatement,
  programmeFacts,
  recruitmentClosedStatement,
} from "@/config/site";

export const metadata: Metadata = {
  title: "Parents, safety & safeguarding",
  description:
    "Programme safeguarding information for parents and guardians. Live reporting routes are not open in this milestone.",
};

const parentFaqs = [
  {
    question: "Will families pay a fee?",
    answer: pilotFundingStatement,
  },
  {
    question: "Will you photograph my child?",
    answer:
      "Only if you give separate written permission, and only for the uses you tick. You can allow some uses and refuse others. Refusing entirely would not affect your child's place when intake opens.",
  },
  {
    question: "My child has a disability or finds reading hard. Can they still apply?",
    answer:
      "Yes. Disability, limited literacy, no formal schooling or lack of interview polish is not an automatic exclusion. We consider reasonable accommodation first, and support needs never count against an applicant.",
  },
  {
    question: "Do we need to be in a particular school?",
    answer:
      "No. Some places come through selected schools and some through a community route that is open to young people who are not in school at all.",
  },
  {
    question: "What happens if we are not selected?",
    answer:
      "You would receive a written reason, and a route to ask for the decision to be reviewed by someone who was not involved in making it.",
  },
  {
    question: "Can we change our mind after agreeing?",
    answer:
      "Yes, at any time, by any channel, without giving a reason. We stop, and there is no penalty of any kind.",
  },
];

export default function ParentsPage() {
  return (
    <>
      <PageSection tone="paper">
        <PageHero
          eyebrow="For parents and guardians"
          title="Safety, consent and who is responsible for your child"
          lede="Programme safeguarding information for adults responsible for a young person. This page describes rules the programme is designed to work to — not live reporting routes."
        />
        <Notice icon="i" className="mt-6">
          {recruitmentClosedStatement} Organisation safeguarding reporting contact details are not published until
          monitored channels are verified and approved.
        </Notice>
      </PageSection>

      <PageSection>
        <div className="ydg-grid-2">
          <div className="ydg-stack">
            <SectionHeading>What YDG is</SectionHeading>
            <TickList
              items={[
                "A structured programme where your child tries things, reflects, and writes their own next-step plan.",
                "At least five working days per cycle, supervised throughout.",
                pilotFundingStatement,
                "Your child keeps what they produce.",
              ]}
            />
          </div>
          <div className="ydg-stack">
            <SectionHeading>What YDG is not</SectionHeading>
            <TickList
              cross
              items={[
                "Not a job, internship or placement scheme.",
                "Not a replacement for school, counselling or medical assessment.",
                "Not a test with a pass mark, and not an aptitude score.",
                "Not a guarantee of anything — including a place on the next track.",
              ]}
            />
          </div>
        </div>
      </PageSection>

      <PageSection tone="navy">
        <div className="ydg-stack-lg">
          <PageHero
            as="h2"
            eyebrow="Supervision"
            title="Who is with your child, and how many of them"
            lede="The ratios below apply to approved Foundation pilot delivery (ages 14–15) and broader programme delivery once age-specific approvals are recorded."
            onNavy
          />
          <div className="ydg-grid-3">
            <PathCard title="1 adult : 8 young people" variant="ydg">
              <p>The maximum in normal workshop sessions.</p>
            </PathCard>
            <PathCard title="1 : 6 or stricter" variant="ydg">
              <p>Practical demonstrations or an unfamiliar venue, after risk assessment.</p>
            </PathCard>
            <PathCard title="1 : 4 or stricter" variant="ydg">
              <p>Higher-risk activity, water, machinery, crowded events or transport transitions.</p>
            </PathCard>
          </div>
          <TickList
            items={[
              "At least two authorised adults are present for any activity with under-18s. Never one adult alone.",
              "Only adults who are trained, physically present and actively supervising are counted. Registration, photography, driving and admin do not count.",
              "A 30-participant day requires at least four active supervising adults, plus accessible safeguarding support.",
              "Every adult is screened and trained before working with young people.",
            ]}
          />
          <BoundaryBlock title="Ages 10–12">
            {ages1012SafeguardingNote}
          </BoundaryBlock>
        </div>
      </PageSection>

      <PageSection>
        <div className="ydg-grid-2">
          <div className="ydg-stack">
            <SectionHeading>Consent and your child&apos;s own agreement</SectionHeading>
            <KeyValueList
              items={[
                { label: "Taking part", value: "Required" },
                { label: "First aid and emergency care", value: "Required" },
                { label: "Supervised group trips", value: "Required" },
                { label: "Transport arrangement", value: "Required" },
                { label: "Code of conduct", value: "Required" },
                { label: "Photographs and video", value: "Optional" },
              ]}
            />
            <Notice icon="✓">
              <b>Saying no to photographs would not affect your child&apos;s place.</b> Media permission is asked
              separately, on its own screen, and you can change your mind at any time.
            </Notice>
            <p className="ydg-fine">
              For ages {programmeFacts.consentMinor} we need your programme consent <em>and</em> your child&apos;s own
              assent, recorded separately. Your child can decline, and nothing bad happens if they do.
            </p>
            <p className="ydg-fine">
              For participants aged {programmeFacts.consentAdult}, the young person gives their own legal consent. A
              parent, guardian or approved responsible adult still gives programme acknowledgement as an eligibility
              condition, but this never overrides the participant&apos;s own consent or their right to withdraw.
            </p>
            <p className="ydg-fine">
              Where involving a parent would be impossible, unsafe or inappropriate, the Safeguarding Lead may approve
              an alternative responsible adult through a documented exception process before participation, once the
              required safeguarding governance is in place.
            </p>
            <p className="ydg-fine">{identitySafeguardStatement}</p>
          </div>
          <div className="ydg-stack">
            <SectionHeading>Arrival and collection</SectionHeading>
            <TickList
              items={[
                "You arrange and pay for arrival and collection, unless we agree something else in writing.",
                "We record who is allowed to collect your child, and we check them at sign-out.",
                "We will not release your child to anyone who is not on that list.",
                "Any official Mecellino Haven transport is separately consented, risk-assessed, recorded and insured.",
              ]}
            />
            <Notice icon="!" variant="divert">
              Late or failed collection: two adults keep supervising while we contact you and your emergency contacts.
            </Notice>
          </div>
        </div>
      </PageSection>

      <PageSection tone="cream2">
        <div className="ydg-stack-lg ydg-measure">
          <SectionHeading>If a child is in immediate danger</SectionHeading>
          <Notice icon="!" variant="divert">
            <b>Contact emergency services first.</b> Do not wait for us. Organisation safeguarding reporting routes are
            not open in this milestone.
          </Notice>
          <BoundaryBlock title="Publication readiness">
            Safeguarding reporting contact details, including routes to raise concerns with the organisation, will be
            published only after the safeguarding manual is adopted, monitored channels are verified, and recruitment
            readiness gates are closed. Until then, this page provides programme information only.
          </BoundaryBlock>
          <TickList
            items={[
              "When reporting routes open, concerns will be recorded in your words.",
              "Secrecy cannot be promised. Information is shared only with people who can help keep someone safe.",
              "Allegations are referred to the appropriate authority — not investigated solely by programme staff.",
              "Nobody is punished for raising a concern.",
            ]}
          />
        </div>
      </PageSection>

      <PageSection tone="paper">
        <div className="ydg-stack">
          <SectionHeading>Questions parents ask</SectionHeading>
          <FaqAccordion items={parentFaqs} />
        </div>
      </PageSection>
    </>
  );
}
