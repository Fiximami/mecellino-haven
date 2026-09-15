import { ALWAYS_DENIED_ACTIONS, type ProgrammeRole } from "../auth/roles";
import {
  isAdultRelationshipKind,
  isAlternativeAdultExceptionStatus,
  isConsentAgeBand,
  isConsentRecordStatus,
  isInstrumentCurrent,
  isParticipantWithdrawalStatus,
  type AdultRelationshipKind,
  type ProgrammeEligibilityReason,
} from "./vocabulary";

export type ProgrammeEligibilityDecision =
  | { eligible: true; reason: "eligible" }
  | { eligible: false; reason: Exclude<ProgrammeEligibilityReason, "eligible"> };

export type ProgrammeEligibilityInput = {
  ageBand: unknown;
  programmeConsent: unknown;
  assent: unknown;
  legalConsent: unknown;
  acknowledgement: unknown;
  mediaConsent: unknown;
  consentingAdultKind: unknown;
  alternativeAdultException: unknown;
  identityOrPhoneReuse: unknown;
  accessibilityAccommodation: unknown;
};

export type SelectedAdultRelationshipResult =
  | { ok: true; kind: AdultRelationshipKind }
  | {
      ok: false;
      code: "invalid_relationship_state" | "pending_exception" | "exception_refused" | "unknown_kind";
    };

export function canApproveAlternativeAdultException(role: ProgrammeRole): boolean {
  switch (role) {
    case "safeguarding_lead":
      return true;
    case "participant":
    case "parent":
    case "legal_guardian":
    case "approved_responsible_adult":
    case "referrer":
    case "mentor":
    case "facilitator":
    case "programme_operations":
    case "restricted_caseworker":
    case "system_administrator":
    case "auditor":
      return false;
    default: {
      const _exhaustive: never = role;
      return _exhaustive;
    }
  }
}

export function isIdentityOrPhoneReusePermitted(input: {
  identityOrPhoneReuse: unknown;
  accommodation: unknown;
}): boolean {
  if (input.identityOrPhoneReuse === false) {
    return true;
  }
  if (input.identityOrPhoneReuse === true) {
    return input.accommodation === "independently_verified";
  }
  return false;
}

export function evaluateSelectedAdultRelationship(
  consentingAdultKind: unknown,
  alternativeAdultException: unknown,
): SelectedAdultRelationshipResult {
  if (!isAdultRelationshipKind(consentingAdultKind)) {
    return { ok: false, code: "unknown_kind" };
  }

  const exception = isAlternativeAdultExceptionStatus(alternativeAdultException)
    ? alternativeAdultException
    : null;

  switch (consentingAdultKind) {
    case "parent":
    case "legal_guardian":
      if (exception === "not_applicable") {
        return { ok: true, kind: consentingAdultKind };
      }
      return { ok: false, code: "invalid_relationship_state" };
    case "approved_responsible_adult":
      if (exception === null) {
        return { ok: false, code: "pending_exception" };
      }
      switch (exception) {
        case "exception_approved":
          return { ok: true, kind: "approved_responsible_adult" };
        case "refused":
          return { ok: false, code: "exception_refused" };
        case "exception_pending":
        case "not_applicable":
          return { ok: false, code: "pending_exception" };
        default: {
          const _exhaustive: never = exception;
          return _exhaustive;
        }
      }
    default: {
      const _exhaustive: never = consentingAdultKind;
      return _exhaustive;
    }
  }
}

function denial(
  reason: Exclude<ProgrammeEligibilityReason, "eligible">,
): ProgrammeEligibilityDecision {
  return { eligible: false, reason };
}

function relationshipDecision(
  result: SelectedAdultRelationshipResult,
  unknownKindReason: "missing_programme_consent" | "missing_acknowledgement",
): ProgrammeEligibilityDecision | null {
  if (result.ok) {
    return null;
  }
  if (result.code === "unknown_kind") {
    return denial(unknownKindReason);
  }
  return denial(result.code);
}

function evaluateMinorEligibility(input: {
  programmeConsent: unknown;
  assent: unknown;
  consentingAdultKind: unknown;
  alternativeAdultException: unknown;
}): ProgrammeEligibilityDecision {
  const relationship = evaluateSelectedAdultRelationship(
    input.consentingAdultKind,
    input.alternativeAdultException,
  );
  const blocked = relationshipDecision(relationship, "missing_programme_consent");
  if (blocked) {
    return blocked;
  }

  if (!isConsentRecordStatus(input.programmeConsent) || !isInstrumentCurrent(input.programmeConsent)) {
    return denial("missing_programme_consent");
  }

  if (!isConsentRecordStatus(input.assent)) {
    return denial("missing_assent");
  }
  if (isParticipantWithdrawalStatus(input.assent)) {
    return denial("participant_withdrawal");
  }
  if (!isInstrumentCurrent(input.assent)) {
    return denial("missing_assent");
  }

  return { eligible: true, reason: "eligible" };
}

function evaluateAdultEligibility(input: {
  legalConsent: unknown;
  acknowledgement: unknown;
  consentingAdultKind: unknown;
  alternativeAdultException: unknown;
}): ProgrammeEligibilityDecision {
  if (!isConsentRecordStatus(input.legalConsent)) {
    return denial("missing_legal_consent");
  }
  if (isParticipantWithdrawalStatus(input.legalConsent)) {
    return denial("participant_withdrawal");
  }
  if (!isInstrumentCurrent(input.legalConsent)) {
    return denial("missing_legal_consent");
  }

  const relationship = evaluateSelectedAdultRelationship(
    input.consentingAdultKind,
    input.alternativeAdultException,
  );
  const blocked = relationshipDecision(relationship, "missing_acknowledgement");
  if (blocked) {
    return blocked;
  }

  if (
    !isConsentRecordStatus(input.acknowledgement) ||
    !isInstrumentCurrent(input.acknowledgement)
  ) {
    return denial("missing_acknowledgement");
  }

  return { eligible: true, reason: "eligible" };
}

export function evaluateProgrammeEligibility(
  input: ProgrammeEligibilityInput,
): ProgrammeEligibilityDecision {
  void input.mediaConsent;

  if (!isConsentAgeBand(input.ageBand)) {
    return denial("invalid_age_band");
  }

  if (typeof input.identityOrPhoneReuse !== "boolean") {
    return denial("invalid_identity_reuse_state");
  }

  if (
    !isIdentityOrPhoneReusePermitted({
      identityOrPhoneReuse: input.identityOrPhoneReuse,
      accommodation: input.accessibilityAccommodation,
    })
  ) {
    return denial("identity_reuse_denied");
  }

  switch (input.ageBand) {
    case "10_17":
      return evaluateMinorEligibility({
        programmeConsent: input.programmeConsent,
        assent: input.assent,
        consentingAdultKind: input.consentingAdultKind,
        alternativeAdultException: input.alternativeAdultException,
      });
    case "18_25":
      return evaluateAdultEligibility({
        legalConsent: input.legalConsent,
        acknowledgement: input.acknowledgement,
        consentingAdultKind: input.consentingAdultKind,
        alternativeAdultException: input.alternativeAdultException,
      });
    default: {
      const _exhaustive: never = input.ageBand;
      return _exhaustive;
    }
  }
}

export function isAdultRelationshipPersistenceBlocked(): boolean {
  return (ALWAYS_DENIED_ACTIONS as readonly string[]).includes("link_adult_relationship");
}
