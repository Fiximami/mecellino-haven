export const onboardingConsentFoundationStatus = "dormant" as const;

export type OnboardingConsentAudience = "under_18" | "adult";

export const onboardingConsentFoundation = {
  status: onboardingConsentFoundationStatus,
  publicExposure: "not_mounted",
  collection: "none",
  storage: "none",
  submission: "none",
  accounts: "none",
  belongsIn: "future_registration_onboarding_step",
  globalPopup: false,
  mediaConsent: {
    required: false,
    separate: true,
    optional: true,
  },
  alternativeResponsibleAdult: {
    publicSelfService: false,
    owner: "safeguarding_lead",
  },
  under18: {
    programmeConsent: "parent_or_legal_guardian_required",
    participantAssent: "required_separate",
    participantLegalConsent: "not_used",
    guardianLegalConsent: "covered_by_programme_consent",
    organisationalAcknowledgement: "not_used",
  },
  adult: {
    participantLegalConsent: "mandatory",
    guardianLegalConsent: "skipped",
    organisationalAcknowledgement: "required",
    participantAssent: "not_used",
    programmeConsent: "not_used",
  },
} as const;

export function onboardingConsentStepsFor(audience: OnboardingConsentAudience) {
  if (audience === "under_18") {
    return {
      audience,
      programmeConsent: onboardingConsentFoundation.under18.programmeConsent,
      participantAssent: onboardingConsentFoundation.under18.participantAssent,
      guardianLegalConsent: onboardingConsentFoundation.under18.guardianLegalConsent,
      participantLegalConsent: onboardingConsentFoundation.under18.participantLegalConsent,
      organisationalAcknowledgement: onboardingConsentFoundation.under18.organisationalAcknowledgement,
      mediaConsent: onboardingConsentFoundation.mediaConsent,
      alternativeResponsibleAdult: onboardingConsentFoundation.alternativeResponsibleAdult,
    } as const;
  }

  return {
    audience,
    programmeConsent: onboardingConsentFoundation.adult.programmeConsent,
    participantAssent: onboardingConsentFoundation.adult.participantAssent,
    guardianLegalConsent: onboardingConsentFoundation.adult.guardianLegalConsent,
    participantLegalConsent: onboardingConsentFoundation.adult.participantLegalConsent,
    organisationalAcknowledgement: onboardingConsentFoundation.adult.organisationalAcknowledgement,
    mediaConsent: onboardingConsentFoundation.mediaConsent,
    alternativeResponsibleAdult: onboardingConsentFoundation.alternativeResponsibleAdult,
  } as const;
}
