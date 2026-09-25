import type { SiteConfig } from "@/types";
import { primaryNav } from "@/config/routes";

export const siteConfig: SiteConfig = {
  name: "Mecellino Haven",
  tagline: "Capacity, coaching, events and mobile amusement",
  description:
    "Mecellino Haven builds individual and institutional capacity through practical training, Youth Discovery Gateway programmes, lifestyle coaching, and inclusive events and entertainment, and currently provides mobile amusement through temporary event stands.",
  nav: primaryNav,
  social: [],
  contact: {
    email: "info@mecellinohaven.com",
  },
};

export const organisationVision =
  "To be a trusted haven where individuals and institutions discover opportunities for growth, meaningful experiences and lasting positive impact.";

export const organisationMission = siteConfig.description;

export const publicEnquiryEmail = "info@mecellinohaven.com";

export const publicContactLabel = "Contact Us";

export const ydgPartnerAudiences = [
  "schools",
  "institutions",
  "parents",
  "entrepreneurs",
  "governments",
  "NGOs",
] as const;

export const programmeFacts = {
  ageRange: "13–25",
  ageCalculation: "official cohort start date",
  consentMinor: "13–17",
  consentAdult: "18–25",
} as const;

export const boundaryStatement =
  "YDG does not guarantee a job, a school place, an internship, a placement, investment, income, business success, or automatic movement to the next stage. It gives young people evidence about themselves and a plan they wrote.";

export const boundaryStatementShort =
  "No guarantee of employment, admission, placement, investment, income, business success or automatic progression.";

export const pilotFundingStatement =
  "The Foundation pilot is intended to be free to families, subject to confirmed sponsorship.";

export const recruitmentClosedStatement =
  "Recruitment and live application intake remain closed until programme and operational, privacy and insurance readiness gates are closed.";

export const selectionStatement =
  "Selection is through eligibility verification, a structured interview and documented panel rationale. There is no aptitude score, aggregate score, ranked list or displayed total — ever.";

export const girlsCommitmentStatement =
  "YDG commits to girls and young women being at least 70% of the total enrolled annual programme population. The Foundation pilot is included in that annual denominator. That is achieved through targeted outreach, accessible design, reserved capacity and barrier removal — never by treating gender as an individual merit factor. We report enrolment by cohort, track and age band, and disclose any variance with written reasons.";

export const ineligibleUnder13Statement =
  "Youth aged 10–12 are not currently eligible for Youth Discovery Gateway. They must not appear in active YDG recruitment, eligibility, consent or participant-facing programme bands.";

export const eligibilityAgeStatement =
  "Eligible ages are 13–25, calculated at the official cohort start date. Age is used only for eligibility and consent bands — not for aptitude scoring, ranking or automatic selection.";

export const demoEnquiryNotice =
  "This contact form is a design demonstration only. Nothing you enter is transmitted, stored or reviewed. Live enquiry handling will open only after a monitored contact channel and privacy controls are approved.";

export const publicEnquiryChannelNotice =
  `${publicEnquiryEmail} is the public address for general enquiries and service requests. It can receive those messages. The interactive form remains demonstration-only. This address is not an emergency contact. This is not an emergency or incident-reporting channel. Organisation concern routes will be published only after they are formally approved.`;

export const identitySafeguardStatement =
  "No participant and approver may use the same identity or telephone number unless this is independently verified through an approved accessibility accommodation.";

export const transportResponsibilityStatement =
  "Pilot participant transport is arranged and funded by parents or guardians. Official Mecellino Haven transport, when used, is arranged and funded by the Company.";

export const programmeLeadName = "Rev. Bennet Nyansah";
export const programmeDirectorName = "Mrs. Ophelia Nana Ama Sarsah";
export const technologyOperationsName = "Mualen Jerry Baada";

export const amusementDevelopmentStatement =
  "Current mobile-amusement operations use temporary event stands. Mecellino Haven does not operate a permanent amusement park, fixed public venue, admission passes or regular opening hours.";
