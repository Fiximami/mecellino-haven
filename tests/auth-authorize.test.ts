import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { authorize } from "../lib/auth/authorize.ts";
import { anonymousIdentity, identityFromProtectedClaims } from "../lib/auth/identity.ts";
import { ALWAYS_DENIED_ACTIONS } from "../lib/auth/roles.ts";
import { SESSION_LIFETIME } from "../lib/auth/session-lifetime.ts";
import {
  SYNTHETIC_ADMINISTRATOR,
  SYNTHETIC_OPERATIONS,
  SYNTHETIC_STAFF_WITHOUT_GRANT,
  syntheticSessionTimestamps,
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
      session: {
        ...syntheticSessionTimestamps(),
        clientRole: "system_administrator",
        roles: ["system_administrator"],
        userMetadata: { role: "system_administrator" },
      },
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
      session: syntheticSessionTimestamps(),
    });
    assert.equal(fresh.allowed, true);
  });

  it("keeps link_adult_relationship denied even for a safeguarding lead", () => {
    assert.equal(
      (ALWAYS_DENIED_ACTIONS as readonly string[]).includes("link_adult_relationship"),
      true,
    );

    const safeguardingLead = identityFromProtectedClaims({
      appMetadata: { roles: ["safeguarding_lead"] },
    });
    const result = authorize({
      identity: safeguardingLead,
      action: "link_adult_relationship",
      fresh: true,
    });
    assert.equal(result.allowed, false);
    if (!result.allowed) {
      assert.equal(result.reason, "safeguarding_isolated");
    }
  });

  it("denies protected access when session timestamps are missing or expired", () => {
    const missing = authorize({
      identity: SYNTHETIC_ADMINISTRATOR,
      action: "provision_users",
      fresh: true,
    });
    assert.equal(missing.allowed, false);
    if (!missing.allowed) {
      assert.equal(missing.reason, "invalid_session_lifetime");
    }

    const now = 1_700_000_000_000;
    const idleExpired = authorize({
      identity: SYNTHETIC_ADMINISTRATOR,
      action: "provision_users",
      fresh: true,
      session: syntheticSessionTimestamps({
        now,
        startedAt: now - SESSION_LIFETIME.privileged.idleMs,
        lastActiveAt: now - SESSION_LIFETIME.privileged.idleMs,
      }),
    });
    assert.equal(idleExpired.allowed, false);
    if (!idleExpired.allowed) {
      assert.equal(idleExpired.reason, "expired_idle");
    }

    const absoluteExpired = authorize({
      identity: SYNTHETIC_ADMINISTRATOR,
      action: "provision_users",
      fresh: true,
      session: syntheticSessionTimestamps({
        now,
        startedAt: now - SESSION_LIFETIME.privileged.absoluteMs,
        lastActiveAt: now,
      }),
    });
    assert.equal(absoluteExpired.allowed, false);
    if (!absoluteExpired.allowed) {
      assert.equal(absoluteExpired.reason, "expired_absolute");
    }
  });

  it("does not let client session roles relax a privileged timeout", () => {
    const now = 1_700_000_000_000;
    const result = authorize({
      identity: SYNTHETIC_ADMINISTRATOR,
      action: "provision_users",
      fresh: true,
      clientRole: "parent",
      session: {
        ...syntheticSessionTimestamps({
          now,
          startedAt: now - SESSION_LIFETIME.privileged.idleMs,
          lastActiveAt: now - SESSION_LIFETIME.privileged.idleMs,
        }),
        roles: ["parent"],
        clientRole: "parent",
      },
    });
    assert.equal(result.allowed, false);
    if (!result.allowed) {
      assert.equal(result.reason, "expired_idle");
    }
  });
});
