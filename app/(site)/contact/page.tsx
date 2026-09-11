import type { Metadata } from "next";
import { EnquiryForm } from "@/components/ydg/EnquiryForm";
import { Notice, PageHero, PageSection } from "@/components/ydg";
import { publicRoutes } from "@/config/routes";
import { demoEnquiryNotice } from "@/config/site";
import { publicPageMetadata } from "@/lib/public-metadata";

export const metadata: Metadata = publicPageMetadata({
  title: "Enquiry preview",
  description:
    "Design preview of the programme enquiry form. Nothing entered is transmitted or stored. Recruitment and applications are not open.",
  path: publicRoutes.contact,
});

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
