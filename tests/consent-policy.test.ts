import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { authorize } from "../lib/auth/authorize.ts";
import { identityFromProtectedClaims } from "../lib/auth/identity.ts";
import { programmeRoles } from "../lib/auth/roles.ts";
import {
  accessibilityAccommodationStatuses,
  adultRelationshipKinds,
  alternativeAdultExceptionStatuses,
  canApproveAlternativeAdultException,
  consentAgeBands,
  consentInstrumentKinds,
  consentRecordStatuses,
  evaluateProgrammeEligibility,
  evaluateSelectedAdultRelationship,
  isAccessibilityAccommodationStatus,
  isAdultRelationshipKind,
  isAdultRelationshipPersistenceBlocked,
  isAlternativeAdultExceptionStatus,
  isConsentAgeBand,
  isConsentInstrumentKind,
  isConsentRecordStatus,
  isIdentityOrPhoneReusePermitted,
  isInstrumentCurrent,
  isParticipantWithdrawalStatus,
  isProgrammeEligibilityReason,
  programmeEligibilityReasons,
  type ProgrammeEligibilityInput,
} from "../lib/consent/index.ts";

const consentDir = "lib/consent";
const consentSources = readdirSync(consentDir)
  .filter((name) => name.endsWith(".ts"))
  .map((name) => ({
    name,
    text: readFileSync(join(consentDir, name), "utf8"),
  }));
const concatenated = consentSources.map((file) => file.text).join("\n");
const vocabularySource = readFileSync("lib/consent/vocabulary.ts", "utf8");

const unknownValues: unknown[] = [null, undefined, 1, {}, [], "", "unknown"];

const nonCurrentStatuses = consentRecordStatuses.filter((status) => !isInstrumentCurrent(status));

function minorInput(overrides: Partial<ProgrammeEligibilityInput> = {}): ProgrammeEligibilityInput {
  return {
    ageBand: "10_17",
    programmeConsent: "granted",
    assent: "granted",
    legalConsent: "requested",
    acknowledgement: "requested",
    mediaConsent: "refused",
    consentingAdultKind: "parent",
    alternativeAdultException: "not_applicable",
    identityOrPhoneReuse: false,
    accessibilityAccommodation: "none",
    ...overrides,
  };
}

function adultInput(overrides: Partial<ProgrammeEligibilityInput> = {}): ProgrammeEligibilityInput {
  return {
    ageBand: "18_25",
    programmeConsent: "requested",
    assent: "requested",
    legalConsent: "granted",
    acknowledgement: "granted",
    mediaConsent: "refused",
    consentingAdultKind: "parent",
    alternativeAdultException: "not_applicable",
    identityOrPhoneReuse: false,
    accessibilityAccommodation: "none",
    ...overrides,
  };
}

describe("consent vocabulary", () => {
  it("accepts the approved age bands, instrument kinds and record statuses", () => {
    assert.deepEqual([...consentAgeBands], ["10_17", "18_25"]);
    assert.deepEqual([...consentInstrumentKinds], [
      "programme_consent",
      "participant_assent",
      "participant_legal_consent",
      "adult_acknowledgement",
      "media",
      "first_aid",
      "supervised_trips",
      "transport",
      "code_of_conduct",
    ]);
    assert.deepEqual([...consentRecordStatuses], [
      "requested",
      "granted",
      "withdrawn",
      "expired",
      "exception_pending",
      "exception_approved",
      "refused",
    ]);
    for (const value of consentAgeBands) {
      assert.equal(isConsentAgeBand(value), true);
    }
    for (const value of consentInstrumentKinds) {
      assert.equal(isConsentInstrumentKind(value), true);
    }
    for (const value of consentRecordStatuses) {
      assert.equal(isConsentRecordStatus(value), true);
    }
  });

  it("treats granted as the only current instrument status", () => {
    assert.equal(isInstrumentCurrent("granted"), true);
    for (const status of nonCurrentStatuses) {
      assert.equal(isInstrumentCurrent(status), false);
    }
  });

  it("treats withdrawn and refused as participant withdrawal of a required instrument", () => {
    assert.equal(isParticipantWithdrawalStatus("withdrawn"), true);
    assert.equal(isParticipantWithdrawalStatus("refused"), true);
    for (const status of consentRecordStatuses) {
      if (status !== "withdrawn" && status !== "refused") {
        assert.equal(isParticipantWithdrawalStatus(status), false);
      }
    }
  });

  it("keeps adult-relationship kinds distinct without reconciling persistence", () => {
    assert.deepEqual([...adultRelationshipKinds], [
      "parent",
      "legal_guardian",
      "approved_responsible_adult",
    ]);
    for (const value of adultRelationshipKinds) {
      assert.equal(isAdultRelationshipKind(value), true);
    }
    assert.match(
      vocabularySource,
      /Persistence stays blocked: link_adult_relationship is always denied until parent vs legal_guardian is reconciled/,
    );
  });

  it("accepts exception, accommodation and eligibility reason vocabularies", () => {
    assert.deepEqual([...alternativeAdultExceptionStatuses], [
      "not_applicable",
      "exception_pending",
      "exception_approved",
      "refused",
    ]);
    assert.deepEqual([...accessibilityAccommodationStatuses], [
      "none",
      "unverified",
      "independently_verified",
    ]);
    assert.deepEqual([...programmeEligibilityReasons], [
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
    ]);
    for (const value of alternativeAdultExceptionStatuses) {
      assert.equal(isAlternativeAdultExceptionStatus(value), true);
    }
    for (const value of accessibilityAccommodationStatuses) {
      assert.equal(isAccessibilityAccommodationStatus(value), true);
    }
    for (const value of programmeEligibilityReasons) {
      assert.equal(isProgrammeEligibilityReason(value), true);
    }
  });

  it("rejects unknown vocabulary values", () => {
    const guards = [
      isConsentAgeBand,
      isConsentInstrumentKind,
      isConsentRecordStatus,
      isAdultRelationshipKind,
      isAlternativeAdultExceptionStatus,
      isAccessibilityAccommodationStatus,
      isProgrammeEligibilityReason,
    ];
    for (const guard of guards) {
      for (const value of unknownValues) {
        assert.equal(guard(value), false);
      }
    }
  });
});

describe("ages 10-17 programme eligibility", () => {
  it("requires current programme consent and current participant assent for parent or legal guardian", () => {
    for (const consentingAdultKind of ["parent", "legal_guardian"] as const) {
      assert.deepEqual(
        evaluateProgrammeEligibility(minorInput({ consentingAdultKind })),
        { eligible: true, reason: "eligible" },
      );

      for (const programmeConsent of nonCurrentStatuses) {
        const decision = evaluateProgrammeEligibility(
          minorInput({ consentingAdultKind, programmeConsent }),
        );
        assert.equal(decision.eligible, false);
        assert.equal(decision.reason, "missing_programme_consent");
      }

      for (const assent of ["requested", "expired", "exception_pending", "exception_approved"] as const) {
        const decision = evaluateProgrammeEligibility(minorInput({ consentingAdultKind, assent }));
        assert.equal(decision.eligible, false);
        assert.equal(decision.reason, "missing_assent");
      }

      for (const assent of ["withdrawn", "refused"] as const) {
        const decision = evaluateProgrammeEligibility(minorInput({ consentingAdultKind, assent }));
        assert.equal(decision.eligible, false);
        assert.equal(decision.reason, "participant_withdrawal");
      }
    }
  });

  it("allows an approved alternative adult only after exception approval and current instruments", () => {
    assert.deepEqual(
      evaluateProgrammeEligibility(
        minorInput({
          consentingAdultKind: "approved_responsible_adult",
          alternativeAdultException: "exception_approved",
        }),
      ),
      { eligible: true, reason: "eligible" },
    );

    assert.deepEqual(
      evaluateProgrammeEligibility(
        minorInput({
          consentingAdultKind: "approved_responsible_adult",
          alternativeAdultException: "not_applicable",
        }),
      ),
      { eligible: false, reason: "pending_exception" },
    );
    assert.deepEqual(
      evaluateProgrammeEligibility(
        minorInput({
          consentingAdultKind: "approved_responsible_adult",
          alternativeAdultException: "exception_pending",
        }),
      ),
      { eligible: false, reason: "pending_exception" },
    );
    assert.deepEqual(
      evaluateProgrammeEligibility(
        minorInput({
          consentingAdultKind: "approved_responsible_adult",
          alternativeAdultException: "refused",
        }),
      ),
      { eligible: false, reason: "exception_refused" },
    );
  });

  it("does not treat adult legal consent as a substitute for minor instruments", () => {
    const decision = evaluateProgrammeEligibility(
      minorInput({
        programmeConsent: "requested",
        assent: "requested",
        legalConsent: "granted",
        acknowledgement: "granted",
      }),
    );
    assert.equal(decision.eligible, false);
    assert.equal(decision.reason, "missing_programme_consent");
  });
});

describe("ages 18-25 programme eligibility", () => {
  it("requires the participant legal consent and organisational acknowledgement", () => {
    for (const consentingAdultKind of ["parent", "legal_guardian"] as const) {
      assert.deepEqual(
        evaluateProgrammeEligibility(adultInput({ consentingAdultKind })),
        { eligible: true, reason: "eligible" },
      );

      for (const legalConsent of ["requested", "expired", "exception_pending", "exception_approved"] as const) {
        const decision = evaluateProgrammeEligibility(
          adultInput({ consentingAdultKind, legalConsent }),
        );
        assert.equal(decision.eligible, false);
        assert.equal(decision.reason, "missing_legal_consent");
      }

      for (const acknowledgement of nonCurrentStatuses) {
        const decision = evaluateProgrammeEligibility(
          adultInput({ consentingAdultKind, acknowledgement }),
        );
        assert.equal(decision.eligible, false);
        assert.equal(decision.reason, "missing_acknowledgement");
      }
    }
  });

  it("lets adult self-consent control participation even when acknowledgement is granted", () => {
    for (const legalConsent of ["withdrawn", "refused"] as const) {
      const decision = evaluateProgrammeEligibility(
        adultInput({
          legalConsent,
          acknowledgement: "granted",
          consentingAdultKind: "parent",
        }),
      );
      assert.equal(decision.eligible, false);
      assert.equal(decision.reason, "participant_withdrawal");
    }

    const araWithdrawn = evaluateProgrammeEligibility(
      adultInput({
        legalConsent: "withdrawn",
        acknowledgement: "granted",
        consentingAdultKind: "approved_responsible_adult",
        alternativeAdultException: "exception_approved",
      }),
    );
    assert.equal(araWithdrawn.eligible, false);
    assert.equal(araWithdrawn.reason, "participant_withdrawal");
  });

  it("does not let acknowledgement replace missing or non-current adult legal consent", () => {
    const missing = evaluateProgrammeEligibility(
      adultInput({ legalConsent: "requested", acknowledgement: "granted" }),
    );
    assert.equal(missing.eligible, false);
    assert.equal(missing.reason, "missing_legal_consent");
  });

  it("allows an approved alternative adult only as eligibility acknowledgement, not as legal consent", () => {
    assert.deepEqual(
      evaluateProgrammeEligibility(
        adultInput({
          consentingAdultKind: "approved_responsible_adult",
          alternativeAdultException: "exception_approved",
        }),
      ),
      { eligible: true, reason: "eligible" },
    );
    assert.deepEqual(
      evaluateProgrammeEligibility(
        adultInput({
          consentingAdultKind: "approved_responsible_adult",
          alternativeAdultException: "exception_pending",
        }),
      ),
      { eligible: false, reason: "pending_exception" },
    );
    assert.deepEqual(
      evaluateProgrammeEligibility(
        adultInput({
          consentingAdultKind: "approved_responsible_adult",
          alternativeAdultException: "refused",
        }),
      ),
      { eligible: false, reason: "exception_refused" },
    );
  });

  it("ignores leftover 10-17 instruments when adult instruments are current", () => {
    assert.deepEqual(
      evaluateProgrammeEligibility(
        adultInput({
          programmeConsent: "refused",
          assent: "refused",
        }),
      ),
      { eligible: true, reason: "eligible" },
    );
  });
});

describe("media consent", () => {
  it("has no effect on programme eligibility for either age band", () => {
    for (const mediaConsent of [...consentRecordStatuses, ...unknownValues]) {
      assert.deepEqual(evaluateProgrammeEligibility(minorInput({ mediaConsent })), {
        eligible: true,
        reason: "eligible",
      });
      assert.deepEqual(evaluateProgrammeEligibility(adultInput({ mediaConsent })), {
        eligible: true,
        reason: "eligible",
      });
    }

    const withdrawnMediaStillIneligible = evaluateProgrammeEligibility(
      minorInput({ assent: "withdrawn", mediaConsent: "granted" }),
    );
    assert.equal(withdrawnMediaStillIneligible.eligible, false);
    assert.equal(withdrawnMediaStillIneligible.reason, "participant_withdrawal");
  });
});

describe("selected adult-relationship and exception state", () => {
  it("allows parent and legal guardian only with not_applicable exception status", () => {
    for (const consentingAdultKind of ["parent", "legal_guardian"] as const) {
      assert.deepEqual(
        evaluateSelectedAdultRelationship(consentingAdultKind, "not_applicable"),
        { ok: true, kind: consentingAdultKind },
      );
      assert.deepEqual(
        evaluateProgrammeEligibility(minorInput({ consentingAdultKind })),
        { eligible: true, reason: "eligible" },
      );
      assert.deepEqual(
        evaluateProgrammeEligibility(adultInput({ consentingAdultKind })),
        { eligible: true, reason: "eligible" },
      );
    }
  });

  it("rejects parent or legal guardian paired with an alternative-adult exception as invalid", () => {
    for (const consentingAdultKind of ["parent", "legal_guardian"] as const) {
      for (const alternativeAdultException of [
        "exception_pending",
        "exception_approved",
        "refused",
        ...unknownValues,
      ]) {
        assert.deepEqual(
          evaluateSelectedAdultRelationship(consentingAdultKind, alternativeAdultException),
          { ok: false, code: "invalid_relationship_state" },
        );
        assert.deepEqual(
          evaluateProgrammeEligibility(minorInput({ consentingAdultKind, alternativeAdultException })),
          { eligible: false, reason: "invalid_relationship_state" },
        );
        assert.deepEqual(
          evaluateProgrammeEligibility(adultInput({ consentingAdultKind, alternativeAdultException })),
          { eligible: false, reason: "invalid_relationship_state" },
        );
      }
    }
  });

  it("requires exception_approved for an approved responsible adult", () => {
    assert.deepEqual(
      evaluateSelectedAdultRelationship("approved_responsible_adult", "exception_approved"),
      { ok: true, kind: "approved_responsible_adult" },
    );
    for (const factory of [minorInput, adultInput]) {
      assert.deepEqual(
        evaluateProgrammeEligibility(
          factory({
            consentingAdultKind: "approved_responsible_adult",
            alternativeAdultException: "exception_approved",
          }),
        ),
        { eligible: true, reason: "eligible" },
      );
    }
  });

  it("keeps pending, not-applicable and unknown ARA exceptions ineligible", () => {
    for (const alternativeAdultException of ["exception_pending", "not_applicable", ...unknownValues]) {
      assert.deepEqual(
        evaluateSelectedAdultRelationship("approved_responsible_adult", alternativeAdultException),
        { ok: false, code: "pending_exception" },
      );
      assert.deepEqual(
        evaluateProgrammeEligibility(
          minorInput({
            consentingAdultKind: "approved_responsible_adult",
            alternativeAdultException,
          }),
        ),
        { eligible: false, reason: "pending_exception" },
      );
      assert.deepEqual(
        evaluateProgrammeEligibility(
          adultInput({
            consentingAdultKind: "approved_responsible_adult",
            alternativeAdultException,
          }),
        ),
        { eligible: false, reason: "pending_exception" },
      );
    }
  });

  it("returns the explicit refusal reason for a refused ARA exception", () => {
    assert.deepEqual(
      evaluateSelectedAdultRelationship("approved_responsible_adult", "refused"),
      { ok: false, code: "exception_refused" },
    );
    assert.deepEqual(
      evaluateProgrammeEligibility(
        minorInput({
          consentingAdultKind: "approved_responsible_adult",
          alternativeAdultException: "refused",
        }),
      ),
      { eligible: false, reason: "exception_refused" },
    );
    assert.deepEqual(
      evaluateProgrammeEligibility(
        adultInput({
          consentingAdultKind: "approved_responsible_adult",
          alternativeAdultException: "refused",
        }),
      ),
      { eligible: false, reason: "exception_refused" },
    );
  });

  it("keeps unknown adult kinds ineligible without treating them as an exception path", () => {
    assert.deepEqual(evaluateSelectedAdultRelationship("unknown", "not_applicable"), {
      ok: false,
      code: "unknown_kind",
    });
    assert.deepEqual(
      evaluateProgrammeEligibility(minorInput({ consentingAdultKind: "unknown" })),
      { eligible: false, reason: "missing_programme_consent" },
    );
    assert.deepEqual(
      evaluateProgrammeEligibility(adultInput({ consentingAdultKind: "unknown" })),
      { eligible: false, reason: "missing_acknowledgement" },
    );
  });
});

describe("alternative-adult exception authorization", () => {
  it("allows only the Safeguarding Lead to approve an alternative adult exception", () => {
    for (const role of programmeRoles) {
      assert.equal(
        canApproveAlternativeAdultException(role),
        role === "safeguarding_lead",
      );
    }
  });
});

describe("identity or phone reuse", () => {
  it("permits the normal path only when identityOrPhoneReuse is exactly false", () => {
    assert.equal(
      isIdentityOrPhoneReusePermitted({
        identityOrPhoneReuse: false,
        accommodation: "none",
      }),
      true,
    );
    assert.deepEqual(evaluateProgrammeEligibility(minorInput({ identityOrPhoneReuse: false })), {
      eligible: true,
      reason: "eligible",
    });
    assert.deepEqual(evaluateProgrammeEligibility(adultInput({ identityOrPhoneReuse: false })), {
      eligible: true,
      reason: "eligible",
    });
  });

  it("permits a confirmed reuse attempt only with independently verified accommodation", () => {
    assert.equal(
      isIdentityOrPhoneReusePermitted({
        identityOrPhoneReuse: true,
        accommodation: "independently_verified",
      }),
      true,
    );
    assert.equal(
      isIdentityOrPhoneReusePermitted({
        identityOrPhoneReuse: true,
        accommodation: "none",
      }),
      false,
    );
    assert.equal(
      isIdentityOrPhoneReusePermitted({
        identityOrPhoneReuse: true,
        accommodation: "unverified",
      }),
      false,
    );

    for (const accommodation of unknownValues) {
      assert.equal(
        isIdentityOrPhoneReusePermitted({
          identityOrPhoneReuse: true,
          accommodation,
        }),
        false,
      );
    }

    assert.deepEqual(
      evaluateProgrammeEligibility(
        minorInput({
          identityOrPhoneReuse: true,
          accessibilityAccommodation: "independently_verified",
        }),
      ),
      { eligible: true, reason: "eligible" },
    );
    assert.deepEqual(
      evaluateProgrammeEligibility(
        adultInput({
          identityOrPhoneReuse: true,
          accessibilityAccommodation: "none",
        }),
      ),
      { eligible: false, reason: "identity_reuse_denied" },
    );
    assert.deepEqual(
      evaluateProgrammeEligibility(
        minorInput({
          identityOrPhoneReuse: true,
          accessibilityAccommodation: "unverified",
        }),
      ),
      { eligible: false, reason: "identity_reuse_denied" },
    );
  });

  it("fails closed for every non-boolean identityOrPhoneReuse value", () => {
    const nonBooleanReuse: unknown[] = [null, undefined, 0, 1, "", "false", "true", {}, []];
    for (const identityOrPhoneReuse of nonBooleanReuse) {
      assert.equal(
        isIdentityOrPhoneReusePermitted({
          identityOrPhoneReuse,
          accommodation: "independently_verified",
        }),
        false,
      );
      assert.deepEqual(evaluateProgrammeEligibility(minorInput({ identityOrPhoneReuse })), {
        eligible: false,
        reason: "invalid_identity_reuse_state",
      });
      assert.deepEqual(evaluateProgrammeEligibility(adultInput({ identityOrPhoneReuse })), {
        eligible: false,
        reason: "invalid_identity_reuse_state",
      });
    }
  });
});

describe("unknown inputs", () => {
  it("rejects unknown age bands and missing adult-relationship kinds", () => {
    for (const ageBand of unknownValues) {
      assert.deepEqual(evaluateProgrammeEligibility(minorInput({ ageBand })), {
        eligible: false,
        reason: "invalid_age_band",
      });
    }

    assert.deepEqual(
      evaluateProgrammeEligibility(minorInput({ consentingAdultKind: "unknown" })),
      { eligible: false, reason: "missing_programme_consent" },
    );
    assert.deepEqual(
      evaluateProgrammeEligibility(adultInput({ consentingAdultKind: "unknown" })),
      { eligible: false, reason: "missing_acknowledgement" },
    );
    assert.deepEqual(
      evaluateProgrammeEligibility(minorInput({ programmeConsent: "unknown", assent: "granted" })),
      { eligible: false, reason: "missing_programme_consent" },
    );
    assert.deepEqual(
      evaluateProgrammeEligibility(minorInput({ assent: "unknown" })),
      { eligible: false, reason: "missing_assent" },
    );
    assert.deepEqual(
      evaluateProgrammeEligibility(adultInput({ legalConsent: "unknown" })),
      { eligible: false, reason: "missing_legal_consent" },
    );
    assert.deepEqual(
      evaluateProgrammeEligibility(adultInput({ acknowledgement: "unknown" })),
      { eligible: false, reason: "missing_acknowledgement" },
    );
  });
});

describe("persistence and module boundaries", () => {
  it("keeps AdultRelationship persistence authorization blocked pending parent versus legal_guardian reconciliation", () => {
    assert.equal(isAdultRelationshipPersistenceBlocked(), true);

    const safeguardingLead = identityFromProtectedClaims({
      appMetadata: { roles: ["safeguarding_lead"] },
    });
    const decision = authorize({
      identity: safeguardingLead,
      action: "link_adult_relationship",
      fresh: true,
    });
    assert.equal(decision.allowed, false);
    if (!decision.allowed) {
      assert.equal(decision.reason, "safeguarding_isolated");
    }
  });

  it("does not model PII, persistence, scores, rankings, placement guarantees or live storage", () => {
    const forbidden = [
      /\bdateOfBirth\b/,
      /\bdate_of_birth\b/,
      /\bphoneNumber\b/,
      /\bphone_number\b/,
      /\bemail\b/i,
      /\bschool\b/i,
      /\baddress\b/i,
      /\bnationalId\b/,
      /\bidentityNumber\b/,
      /\bfullName\b/,
      /\bfirstName\b/,
      /\blastName\b/,
      /\bscore\b/i,
      /\branking\b/i,
      /\bplacement\b/i,
      /from ["']next/,
      /from ["']react/,
      /from ["']@supabase/,
      /from ["']postgres/,
      /\.from\(/,
      /\binsert\b/,
      /\bupsert\b/,
      /\bcreateClient\b/,
      /\bretention\b/i,
    ];
    for (const pattern of forbidden) {
      assert.doesNotMatch(concatenated, pattern);
    }
  });
});
