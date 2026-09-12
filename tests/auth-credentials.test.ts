import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { completePasswordSignIn, completeRecoveryRequest } from "../lib/auth/credentials.ts";
import { NEUTRAL_AUTH_ERROR, NEUTRAL_RECOVERY_MESSAGE } from "../lib/auth/errors.ts";
import { resetLockoutStoreForTests } from "../lib/auth/lockout.ts";

describe("authentication lifecycle foundation", () => {
  it("returns a neutral error for missing details, unknown accounts and failed sign-in", async () => {
    resetLockoutStoreForTests();
    const missing = await completePasswordSignIn(
      { email: "", password: "" },
      async () => ({ ok: false }),
    );
    const unknown = await completePasswordSignIn(
      { email: "synthetic.unknown@example.test", password: "x" },
      async () => ({ ok: false }),
    );
    const knownBad = await completePasswordSignIn(
      { email: "synthetic.staff@example.test", password: "wrong" },
      async () => ({ ok: false }),
    );

    assert.deepEqual(missing, { ok: false, message: NEUTRAL_AUTH_ERROR });
    assert.deepEqual(unknown, { ok: false, message: NEUTRAL_AUTH_ERROR });
    assert.deepEqual(knownBad, { ok: false, message: NEUTRAL_AUTH_ERROR });
    assert.equal(missing.message, unknown.message);
    assert.equal(unknown.message, knownBad.message);
  });

  it("returns the same recovery message whether or not a sender is available", async () => {
    const withoutSender = await completeRecoveryRequest("synthetic.unknown@example.test", null);
    const withSender = await completeRecoveryRequest("synthetic.staff@example.test", async () => {
      throw new Error("provider rejected");
    });
    assert.equal(withoutSender.message, NEUTRAL_RECOVERY_MESSAGE);
    assert.equal(withSender.message, NEUTRAL_RECOVERY_MESSAGE);
  });

  it("sanitizes an unsafe next path after a successful synthetic sign-in", async () => {
    resetLockoutStoreForTests();
    const result = await completePasswordSignIn(
      {
        email: "synthetic.staff@example.test",
        password: "synthetic-only",
        next: "https://evil.example",
      },
      async () => ({ ok: true }),
    );
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.redirectTo, "/");
    }
  });
});
