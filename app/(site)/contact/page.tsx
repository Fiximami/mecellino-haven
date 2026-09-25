import type { Metadata } from "next";
import { EnquiryForm } from "@/components/ydg/EnquiryForm";
import { Notice, PageHero, PageSection } from "@/components/ydg";
import { publicRoutes } from "@/config/routes";
import {
  demoEnquiryNotice,
  publicEnquiryChannelNotice,
  publicEnquiryEmail,
} from "@/config/site";
import { publicPageMetadata } from "@/lib/public-metadata";

export const metadata: Metadata = publicPageMetadata({
  title: "Contact Us",
  description:
    "Public address for general enquiries and service requests, plus a design preview of the Mecellino Haven enquiry form. The form is demonstration-only. This is not an emergency or incident-reporting channel.",
  path: publicRoutes.contact,
});

export default function ContactPage() {
  return (
    <>
      <PageSection tone="paper">
        <PageHero
          title="General enquiries and service requests"
          lede={`${publicEnquiryEmail} is the public address for general enquiries and service requests. It can receive those messages. The interactive form below remains a demonstration only.`}
        />
        <p className="mt-6 text-[15px] text-[var(--ink-2)]">
          Write to{" "}
          <a className="mh-email" href={`mailto:${publicEnquiryEmail}`}>
            {publicEnquiryEmail}
          </a>
          .
        </p>
        <Notice icon="i" className="mt-6">
          {publicEnquiryChannelNotice}
        </Notice>
        <Notice icon="!" variant="divert" className="mt-6">
          {demoEnquiryNotice} This is not a ticket desk, payment page or application portal. This is not an emergency
          or incident-reporting channel.
        </Notice>
      </PageSection>
      <PageSection>
        <EnquiryForm />
      </PageSection>
    </>
  );
}
