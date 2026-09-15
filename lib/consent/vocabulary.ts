function createGuard<T extends string>(
  values: readonly T[],
): (value: unknown) => value is T {
  const set = new Set<string>(values);
  return (value: unknown): value is T => typeof value === "string" && set.has(value);
}

export const consentAgeBands = ["10_17", "18_25"] as const;

export type ConsentAgeBand = (typeof consentAgeBands)[number];

export const isConsentAgeBand = createGuard(consentAgeBands);

export const consentInstrumentKinds = [
  "programme_consent",
  "participant_assent",
  "participant_legal_consent",
  "adult_acknowledgement",
  "media",
  "first_aid",
  "supervised_trips",
  "transport",
  "code_of_conduct",
] as const;

export type ConsentInstrumentKind = (typeof consentInstrumentKinds)[number];

export const isConsentInstrumentKind = createGuard(consentInstrumentKinds);

export const consentRecordStatuses = [
  "requested",
  "granted",
  "withdrawn",
  "expired",
  "exception_pending",
  "exception_approved",
  "refused",
] as const;

export type ConsentRecordStatus = (typeof consentRecordStatuses)[number];

export const isConsentRecordStatus = createGuard(consentRecordStatuses);

/* AdultRelationship kinds follow the 4A domain model. Persistence stays blocked: link_adult_relationship is always denied until parent vs legal_guardian is reconciled in the protected-role store. */
export const adultRelationshipKinds = [
  "parent",
  "legal_guardian",
  "approved_responsible_adult",
] as const;

export type AdultRelationshipKind = (typeof adultRelationshipKinds)[number];

export const isAdultRelationshipKind = createGuard(adultRelationshipKinds);

export const alternativeAdultExceptionStatuses = [
  "not_applicable",
  "exception_pending",
  "exception_approved",
  "refused",
] as const;

export type AlternativeAdultExceptionStatus = (typeof alternativeAdultExceptionStatuses)[number];

export const isAlternativeAdultExceptionStatus = createGuard(alternativeAdultExceptionStatuses);

export const accessibilityAccommodationStatuses = [
  "none",
  "unverified",
  "independently_verified",
] as const;

export type AccessibilityAccommodationStatus = (typeof accessibilityAccommodationStatuses)[number];

export const isAccessibilityAccommodationStatus = createGuard(accessibilityAccommodationStatuses);

export const programmeEligibilityReasons = [
  "eligible",
  "invalid_age_band",
  "invalid_relationship_state",
  "invalid_identity_reuse_state",
  "missing_programme_consent",
  "missing_assent",
  "missing_legal_consent",
  "missing_acknowledgement",
  "participant_withdrawal",
  "pending_exception",
  "exception_refused",
  "identity_reuse_denied",
] as const;

export type ProgrammeEligibilityReason = (typeof programmeEligibilityReasons)[number];

export const isProgrammeEligibilityReason = createGuard(programmeEligibilityReasons);

export function isInstrumentCurrent(status: ConsentRecordStatus): boolean {
  switch (status) {
    case "granted":
      return true;
    case "requested":
    case "withdrawn":
    case "expired":
    case "exception_pending":
    case "exception_approved":
    case "refused":
      return false;
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

export function isParticipantWithdrawalStatus(status: ConsentRecordStatus): boolean {
  switch (status) {
    case "withdrawn":
    case "refused":
      return true;
    case "requested":
    case "granted":
    case "expired":
    case "exception_pending":
    case "exception_approved":
      return false;
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}
