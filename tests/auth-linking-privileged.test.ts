import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { lookupPersonByGuessedIdentifier, requestAccountLink } from "../lib/auth/linking.ts";
import {
  deactivateAccount,
  inviteAccount,
  refuseServiceRoleForOrdinaryRequest,
  writeProtectedAppMetadata,
} from "../lib/auth/privileged.ts";

describe("linking and privileged writes", () => {
  it("does not create a guardian or participant link from an identifier", () => {
    const actors = ["participant", "guardian", "responsible_adult", "referrer", "mentor", "staff"] as const;
    for (const actor of actors) {
      const result = requestAccountLink({
        actor,
        email: "uninvited@example.test",
        phone: "0000000000",
        participantId: "guessed-participant",
      });
      assert.equal(result.linked, false);
      assert.equal(result.reason, "self_link_by_identifier_forbidden");
    }
  });

  it("does not return a Person for a guessed identifier", () => {
    assert.equal(lookupPersonByGuessedIdentifier("guessed-participant"), null);
    assert.equal(lookupPersonByGuessedIdentifier("uninvited@example.test"), null);
  });

  it("fails closed for invitation, role writes and service-role ordinary use", () => {
    assert.deepEqual(inviteAccount({ email: "uninvited@example.test" }), {
      written: false,
      reason: "fail_closed",
    });
    assert.deepEqual(
      writeProtectedAppMetadata({
        subject: "synthetic-staff-001",
        roles: ["system_administrator"],
        userMetadata: { role: "system_administrator" },
      }),
      { written: false, reason: "fail_closed" },
    );
    assert.deepEqual(deactivateAccount({ subject: "synthetic-staff-001" }), {
      written: false,
      reason: "fail_closed",
    });
    assert.deepEqual(refuseServiceRoleForOrdinaryRequest(), {
      written: false,
      reason: "service_role_refused",
    });
  });
});
