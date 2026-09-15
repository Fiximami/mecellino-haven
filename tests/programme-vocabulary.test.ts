import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  canChangeParticipationStatus,
  canEnterDeferred,
  educationStages,
  enrolmentAndTransitionEvents,
  evidenceVisibilityClasses,
  isEducationStage,
  isEnrolmentAndTransitionEvent,
  isEpisodeTerminal,
  isEvidenceVisibilityClass,
  isParticipationStatus,
  isTransitionGoal,
  isUnfoldStage,
  participationStatuses,
  transitionGoals,
  unfoldStages,
} from "../lib/programme/index.ts";

const vocabularySource = readFileSync("lib/programme/vocabulary.ts", "utf8");

const unknownValues: unknown[] = [null, undefined, 1, {}, [], "", "unknown"];

describe("education stage", () => {
  it("accepts the approved 4A values", () => {
    for (const value of educationStages) {
      assert.equal(isEducationStage(value), true);
    }
    assert.deepEqual([...educationStages], [
      "upper_primary",
      "jhs",
      "shs",
      "tertiary",
      "other",
    ]);
  });

  it("rejects unknown values and TVET as an education stage", () => {
    for (const value of unknownValues) {
      assert.equal(isEducationStage(value), false);
    }
    assert.equal(isEducationStage("tvet"), false);
    assert.equal(educationStages.includes("tvet" as (typeof educationStages)[number]), false);
  });
});

describe("transition goal", () => {
  it("accepts approved exploratory goals including TVET", () => {
    for (const value of transitionGoals) {
      assert.equal(isTransitionGoal(value), true);
    }
    assert.equal(isTransitionGoal("tvet"), true);
  });

  it("rejects unknown goals", () => {
    for (const value of unknownValues) {
      assert.equal(isTransitionGoal(value), false);
    }
  });
});

describe("UNFOLD stage", () => {
  it("keeps Execute as the canonical progression term", () => {
    assert.deepEqual([...unfoldStages], [
      "Play",
      "Discover",
      "Explore",
      "Experience",
      "Prepare",
      "Execute",
      "Mentor",
    ]);
    assert.equal(isUnfoldStage("Execute"), true);
  });

  it("rejects unknown and superseded progression wording", () => {
    for (const value of unknownValues) {
      assert.equal(isUnfoldStage(value), false);
    }
    for (const superseded of ["Launch", "Delivery", "Understand", "Navigate", "Focus", "Own"]) {
      assert.equal(isUnfoldStage(superseded), false);
      assert.equal(unfoldStages.includes(superseded as (typeof unfoldStages)[number]), false);
    }
  });
});

describe("participation status", () => {
  it("accepts approved episode statuses", () => {
    for (const value of participationStatuses) {
      assert.equal(isParticipationStatus(value), true);
    }
  });

  it("rejects unknown statuses and journey-level flags", () => {
    for (const value of unknownValues) {
      assert.equal(isParticipationStatus(value), false);
    }
    assert.equal(isParticipationStatus("alumni_eligible"), false);
    assert.equal(isParticipationStatus("alumni_contributor"), false);
  });

  it("models deferred, withdrawn, completion and ageing rules per episode", () => {
    assert.equal(canEnterDeferred("consent_pending"), true);
    assert.equal(canEnterDeferred("enrolled"), true);
    assert.equal(canEnterDeferred("active"), false);
    assert.equal(canEnterDeferred("paused"), false);
    assert.equal(canChangeParticipationStatus("active", "deferred"), false);
    assert.equal(canChangeParticipationStatus("paused", "deferred"), false);
    assert.equal(canChangeParticipationStatus("consent_pending", "deferred"), true);
    assert.equal(canChangeParticipationStatus("enrolled", "deferred"), true);
    assert.equal(canChangeParticipationStatus("deferred", "enrolled"), true);
    assert.equal(canChangeParticipationStatus("deferred", "consent_pending"), true);
    assert.equal(isEpisodeTerminal("withdrawn"), true);
    assert.equal(isEpisodeTerminal("completed"), true);
    assert.equal(canChangeParticipationStatus("withdrawn", "enrolled"), false);
    assert.equal(canChangeParticipationStatus("withdrawn", "active"), false);
    assert.equal(canChangeParticipationStatus("completed", "active"), false);
    assert.equal(canChangeParticipationStatus("active", "aged_out_completing"), true);
    assert.equal(canChangeParticipationStatus("aged_out_completing", "completed"), true);
    assert.equal(canChangeParticipationStatus("aged_out_completing", "enrolled"), false);
  });
});

describe("evidence visibility", () => {
  it("accepts approved visibility classes and rejects unknown values", () => {
    assert.deepEqual([...evidenceVisibilityClasses], [
      "private_reflection",
      "activity_evidence",
      "family_visible",
      "showcase_candidate",
      "showcase_approved",
    ]);
    for (const value of evidenceVisibilityClasses) {
      assert.equal(isEvidenceVisibilityClass(value), true);
    }
    for (const value of unknownValues) {
      assert.equal(isEvidenceVisibilityClass(value), false);
    }
  });
});

describe("enrolment and transition events", () => {
  it("matches the R2 event names", () => {
    const required = [
      "ParticipationStatusChanged",
      "TransitionReviewCompleted",
      "EnrolmentCreated",
      "EnrolmentEnded",
      "EnrolmentTransferred",
    ];
    for (const name of required) {
      assert.equal(isEnrolmentAndTransitionEvent(name), true);
    }
    assert.deepEqual([...enrolmentAndTransitionEvents], [
      "ParticipationStatusChanged",
      "TransitionReviewCompleted",
      "EnrolmentCreated",
      "EnrolmentEnded",
      "EnrolmentTransferred",
      "WithdrawalConfirmed",
      "UnfoldStageChanged",
      "TrackAssigned",
    ]);
    for (const value of unknownValues) {
      assert.equal(isEnrolmentAndTransitionEvent(value), false);
    }
  });
});

describe("vocabulary boundaries", () => {
  it("records that TVET remains pending as an education stage", () => {
    assert.match(
      vocabularySource,
      /TVET as an education stage remains pending owner approval/,
    );
    assert.doesNotMatch(vocabularySource, /TVET[\s\S]{0,80}as `other`/i);
  });

  it("does not introduce score, ranking, automated matching or placement vocabulary", () => {
    const forbidden = [
      /\bscore\b/i,
      /\branking\b/i,
      /\bmarketplace\b/i,
      /\bautomated matching\b/i,
      /\bplacement\b/i,
    ];
    for (const pattern of forbidden) {
      assert.doesNotMatch(vocabularySource, pattern);
    }
  });
});
