export type FailClosedWrite = {
  written: false;
  reason: "fail_closed" | "service_role_refused";
};

export function refuseServiceRoleForOrdinaryRequest(): FailClosedWrite {
  return { written: false, reason: "service_role_refused" };
}

export function writeProtectedAppMetadata(input: {
  subject: unknown;
  roles: unknown;
  userMetadata?: unknown;
}): FailClosedWrite {
  void input.subject;
  void input.roles;
  void input.userMetadata;
  return { written: false, reason: "fail_closed" };
}

export function inviteAccount(input: { email?: unknown; phone?: unknown }): FailClosedWrite {
  void input;
  return { written: false, reason: "fail_closed" };
}

export function deactivateAccount(input: { subject?: unknown }): FailClosedWrite {
  void input;
  return { written: false, reason: "fail_closed" };
}
