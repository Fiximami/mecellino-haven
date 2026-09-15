import type { SiteConfig } from "@/types";
import { primaryNav } from "@/config/routes";

export const siteConfig: SiteConfig = {
  name: "Mecellino Haven",
  tagline: "Capacity, coaching, events and future amusement",
  description:
    "Mecellino Haven builds individual and institutional capacity through practical training, Youth Discovery Gateway programmes, lifestyle coaching, and inclusive events and entertainment, while developing safe amusement experiences that bring people together.",
  nav: primaryNav,
  social: [],
  contact: {
    email: "opheenana@gmail.com",
  },
};

export const organisationVision =
  "To be a trusted haven where individuals and institutions discover opportunities for growth, meaningful experiences and lasting positive impact.";

export const organisationMission = siteConfig.description;

export const publicEnquiryEmail = "opheenana@gmail.com";

export const programmeFacts = {
  ageRange: "10–25",
  discoveryGateway: "10–13",
  foundation: "14–15",
  direction: "16–17",
  executionProgression: "18–25",
  consentMinor: "10–17",
  consentAdult: "18–25",
} as const;

export const boundaryStatement =
  "YDG does not guarantee a job, a school place, an internship, a placement, investment, income, business success, or automatic movement to the next stage. It gives young people evidence about themselves and a plan they wrote.";

export const boundaryStatementShort =
  "No guarantee of employment, admission, placement, investment, income, business success or automatic progression.";

export const pilotFundingStatement =
  "The Foundation pilot is intended to be free to families, subject to confirmed sponsorship.";

export const recruitmentClosedStatement =
  "Recruitment and live application intake remain closed until safeguarding, privacy and insurance readiness gates are closed.";

export const selectionStatement =
  "Selection is through eligibility verification, a structured interview and documented panel rationale. There is no aptitude score, aggregate score, ranked list or displayed total — ever.";

export const girlsCommitmentStatement =
  "YDG commits to girls and young women being at least 70% of the total enrolled annual programme population. The Foundation pilot is included in that annual denominator. That is achieved through targeted outreach, accessible design, reserved capacity and barrier removal — never by treating gender as an individual merit factor. We report enrolment by cohort, track and age band, and disclose any variance with written reasons.";

export const ages1012SafeguardingNote =
  "Participants aged 10–12 sit within the Discovery Gateway track (ages 10–13). Age-specific safeguarding approval is required before recruitment of participants aged 10–12. Supervision ratios and operational provisions for that age band are not published here until that approval is recorded.";

export const demoEnquiryNotice =
  "This contact form is a design demonstration only. Nothing you enter is transmitted, stored or reviewed. Live enquiry handling will open only after a monitored contact channel and privacy controls are approved.";

export const publicEnquiryChannelNotice =
  `${publicEnquiryEmail} is the approved temporary address for general enquiries and service requests. It can receive those messages. The interactive form remains demonstration-only. This address is not an emergency contact and is not a safeguarding-reporting channel. Organisation concern routes will be published only after they are formally approved.`;

export const identitySafeguardStatement =
  "No participant and approver may use the same identity or telephone number unless this is independently verified through an approved accessibility accommodation.";

export const amusementDevelopmentStatement =
  "Permanent and mobile amusement are in development. Mecellino Haven does not currently operate a permanent amusement site. Visitors may register interest or request mobile-amusement information.";
