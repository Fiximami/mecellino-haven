import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { authorize } from "../lib/auth/authorize.ts";
import { anonymousIdentity } from "../lib/auth/identity.ts";
import {
  SYNTHETIC_ADMINISTRATOR,
  SYNTHETIC_OPERATIONS,
  SYNTHETIC_STAFF_WITHOUT_GRANT,
} from "./helpers/synthetic.ts";

describe("authorization foundation", () => {
  it("denies anonymous privileged actions", () => {
    const result = authorize({
      identity: anonymousIdentity(),
      action: "provision_users",
      fresh: true,
    });
    assert.equal(result.allowed, false);
    if (!result.allowed) {
      assert.equal(result.reason, "unauthenticated");
    }
  });

  it("denies an authenticated identity without a protected grant", () => {
    const result = authorize({
      identity: SYNTHETIC_STAFF_WITHOUT_GRANT,
      action: "provision_users",
      fresh: true,
      userMetadata: { role: "system_administrator" },
    });
    assert.equal(result.allowed, false);
    if (!result.allowed) {
      assert.equal(result.reason, "missing_protected_grant");
    }
  });

  it("ignores user_metadata.role and client-supplied roles or scopes", () => {
    const elevated = authorize({
      identity: SYNTHETIC_OPERATIONS,
      action: "provision_users",
      fresh: true,
      clientRole: "system_administrator",
      clientScope: { type: "case", id: "guessed" },
      userMetadata: { role: "system_administrator" },
    });
    assert.equal(elevated.allowed, false);

    const fromUserMetadata = authorize({
      identity: SYNTHETIC_STAFF_WITHOUT_GRANT,
      action: "manage_integration_secrets",
      fresh: true,
      userMetadata: { role: "system_administrator" },
    });
    assert.equal(fromUserMetadata.allowed, false);
  });

  it("does not let a system administrator inherit safeguarding case access", () => {
    const read = authorize({
      identity: SYNTHETIC_ADMINISTRATOR,
      action: "read_safeguarding_case",
      fresh: true,
    });
    const write = authorize({
      identity: SYNTHETIC_ADMINISTRATOR,
      action: "write_safeguarding_case",
      fresh: true,
    });
    const glass = authorize({
      identity: SYNTHETIC_ADMINISTRATOR,
      action: "break_glass_case_access",
      fresh: true,
    });
    assert.equal(read.allowed, false);
    assert.equal(write.allowed, false);
    assert.equal(glass.allowed, false);
  });

  it("requires a fresh server validation for privileged actions", () => {
    const stale = authorize({
      identity: SYNTHETIC_ADMINISTRATOR,
      action: "provision_users",
      fresh: false,
    });
    assert.equal(stale.allowed, false);
    if (!stale.allowed) {
      assert.equal(stale.reason, "stale_identity");
    }

    const fresh = authorize({
      identity: SYNTHETIC_ADMINISTRATOR,
      action: "provision_users",
      fresh: true,
    });
    assert.equal(fresh.allowed, true);
  });
});
