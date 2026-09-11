import type { Metadata } from "next";
import { EnquiryForm } from "@/components/ydg/EnquiryForm";
import { Notice, PageHero, PageSection } from "@/components/ydg";
import { demoEnquiryNotice } from "@/config/site";

export const metadata: Metadata = {
  title: "Enquiry preview",
  description:
    "Design demonstration of the programme enquiry form. Nothing entered is transmitted in this milestone.",
};

export default function ContactPage() {
  return (
    <>
      <PageSection tone="paper">
        <PageHero
          eyebrow="Contact"
          title="Programme enquiry preview"
          lede="This page shows how segmented enquiry will look when live intake is approved. Nothing you enter here is transmitted or retained in this milestone."
        />
        <Notice icon="!" variant="divert" className="mt-6">
          {demoEnquiryNotice}
        </Notice>
      </PageSection>
      <PageSection>
        <EnquiryForm />
      </PageSection>
    </>
  );
}
