function createGuard<T extends string>(
  values: readonly T[],
): (value: unknown) => value is T {
  const set = new Set<string>(values);
  return (value: unknown): value is T => typeof value === "string" && set.has(value);
}

/* TVET as an education stage remains pending owner approval. */
export const educationStages = [
  "upper_primary",
  "jhs",
  "shs",
  "tertiary",
  "other",
] as const;

export type EducationStage = (typeof educationStages)[number];

export const isEducationStage = createGuard(educationStages);

export const transitionGoals = [
  "not_yet_set",
  "continue_education",
  "tvet",
  "work_exploration",
  "entrepreneurship_exploration",
  "undecided",
] as const;

export type TransitionGoal = (typeof transitionGoals)[number];

export const isTransitionGoal = createGuard(transitionGoals);

export const unfoldStages = [
  "Play",
  "Discover",
  "Explore",
  "Experience",
  "Prepare",
  "Execute",
  "Mentor",
] as const;

export type UnfoldStage = (typeof unfoldStages)[number];

export const isUnfoldStage = createGuard(unfoldStages);

export const participationStatuses = [
  "prospect",
  "referred",
  "consent_pending",
  "deferred",
  "enrolled",
  "active",
  "paused",
  "aged_out_completing",
  "completed",
  "withdrawn",
] as const;

export type ParticipationStatus = (typeof participationStatuses)[number];

export const isParticipationStatus = createGuard(participationStatuses);

export const episodeTerminalStatuses = ["completed", "withdrawn"] as const;

export type EpisodeTerminalStatus = (typeof episodeTerminalStatuses)[number];

export const isEpisodeTerminalStatus = createGuard(episodeTerminalStatuses);

export const evidenceVisibilityClasses = [
  "private_reflection",
  "activity_evidence",
  "family_visible",
  "showcase_candidate",
  "showcase_approved",
] as const;

export type EvidenceVisibilityClass = (typeof evidenceVisibilityClasses)[number];

export const isEvidenceVisibilityClass = createGuard(evidenceVisibilityClasses);

export const enrolmentAndTransitionEvents = [
  "ParticipationStatusChanged",
  "TransitionReviewCompleted",
  "EnrolmentCreated",
  "EnrolmentEnded",
  "EnrolmentTransferred",
  "WithdrawalConfirmed",
  "UnfoldStageChanged",
  "TrackAssigned",
] as const;

export type EnrolmentAndTransitionEvent = (typeof enrolmentAndTransitionEvents)[number];

export const isEnrolmentAndTransitionEvent = createGuard(enrolmentAndTransitionEvents);

export const participationStatusTransitions = {
  prospect: ["referred", "consent_pending"],
  referred: ["consent_pending", "withdrawn"],
  consent_pending: ["enrolled", "deferred", "withdrawn"],
  deferred: ["enrolled", "consent_pending", "withdrawn"],
  enrolled: ["active", "deferred", "consent_pending", "withdrawn"],
  active: ["paused", "withdrawn", "completed", "aged_out_completing"],
  paused: ["active", "withdrawn"],
  aged_out_completing: ["completed", "withdrawn"],
  completed: [],
  withdrawn: [],
} as const satisfies Record<ParticipationStatus, readonly ParticipationStatus[]>;

export function canChangeParticipationStatus(
  from: ParticipationStatus,
  to: ParticipationStatus,
): boolean {
  return (participationStatusTransitions[from] as readonly ParticipationStatus[]).includes(to);
}

export function isEpisodeTerminal(status: ParticipationStatus): boolean {
  return isEpisodeTerminalStatus(status);
}

export function canEnterDeferred(status: ParticipationStatus): boolean {
  return status === "consent_pending" || status === "enrolled";
}
