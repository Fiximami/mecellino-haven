export type LinkActor =
  | "participant"
  | "guardian"
  | "responsible_adult"
  | "referrer"
  | "mentor"
  | "staff";

export type LinkAttempt = {
  actor: LinkActor;
  email?: unknown;
  phone?: unknown;
  participantId?: unknown;
};

export type LinkDecision = {
  linked: false;
  reason: "self_link_by_identifier_forbidden" | "not_implemented";
};

export function requestAccountLink(attempt: LinkAttempt): LinkDecision {
  void attempt;
  return { linked: false, reason: "self_link_by_identifier_forbidden" };
}

export function lookupPersonByGuessedIdentifier(identifier: unknown): null {
  void identifier;
  return null;
}
