import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { completePasswordSignIn, completeRecoveryRequest } from "../lib/auth/credentials.ts";
import { NEUTRAL_AUTH_ERROR, NEUTRAL_RECOVERY_MESSAGE } from "../lib/auth/errors.ts";
import {
  createMemoryDistributedLockoutStore,
  recordDistributedLockoutFailure,
} from "../lib/auth/lockout-distributed.ts";
import {
  LOCKOUT_HMAC_PURPOSE_EMAIL,
  LOCKOUT_PEPPER_MIN_BYTES,
  type LockoutPepperMaterial,
} from "../lib/auth/lockout-identifier.ts";
import { LOCKOUT_FAILURE_THRESHOLD } from "../lib/auth/lockout-state.ts";
import { recordFailedAttempt, resetLockoutStoreForTests } from "../lib/auth/lockout.ts";

const EMAIL = "synthetic.staff@example.test";
const PEPPERS: LockoutPepperMaterial = {
  current: { version: 2, secret: "c".repeat(LOCKOUT_PEPPER_MIN_BYTES) },
  previous: { version: 1, secret: "p".repeat(LOCKOUT_PEPPER_MIN_BYTES) },
};

async function lockIdentifier(
  store: ReturnType<typeof createMemoryDistributedLockoutStore>,
  peppers: LockoutPepperMaterial = PEPPERS,
) {
  const now = Date.now();
  for (let index = 0; index < LOCKOUT_FAILURE_THRESHOLD; index += 1) {
    await recordDistributedLockoutFailure(EMAIL, peppers, store, now + index, LOCKOUT_HMAC_PURPOSE_EMAIL);
  }
}

describe("dormant distributed lockout sign-in", () => {
  it("clears lockout state after a successful authentication", async () => {
    const store = createMemoryDistributedLockoutStore();
    await recordDistributedLockoutFailure(EMAIL, PEPPERS, store, Date.now(), LOCKOUT_HMAC_PURPOSE_EMAIL);
    const result = await completePasswordSignIn(
      { email: EMAIL, password: "synthetic-only" },
      async () => ({ ok: true }),
      { lockout: { peppers: PEPPERS, store } },
    );
    assert.equal(result.ok, true);
    let authenticated = false;
    const lockedAgain = await completePasswordSignIn(
      { email: EMAIL, password: "wrong" },
      async () => {
        authenticated = true;
        return { ok: false };
      },
      { lockout: { peppers: PEPPERS, store } },
    );
    assert.equal(authenticated, true);
    assert.deepEqual(lockedAgain, { ok: false, message: NEUTRAL_AUTH_ERROR });
  });

  it("records a failed authentication and keeps a neutral response", async () => {
    const store = createMemoryDistributedLockoutStore();
    let authenticated = false;
    const result = await completePasswordSignIn(
      { email: EMAIL, password: "wrong" },
      async () => {
        authenticated = true;
        return { ok: false };
      },
      { lockout: { peppers: PEPPERS, store } },
    );
    assert.equal(authenticated, true);
    assert.deepEqual(result, { ok: false, message: NEUTRAL_AUTH_ERROR });
    assert.equal("Retry-After" in result, false);
  });

  it("denies a locked identifier before credential verification", async () => {
    const store = createMemoryDistributedLockoutStore();
    await lockIdentifier(store);
    let authenticated = false;
    const result = await completePasswordSignIn(
      { email: EMAIL, password: "synthetic-only" },
      async () => {
        authenticated = true;
        return { ok: true };
      },
      { lockout: { peppers: PEPPERS, store } },
    );
    assert.equal(authenticated, false);
    assert.deepEqual(result, { ok: false, message: NEUTRAL_AUTH_ERROR });
  });

  it("fails closed when the hosted store or pepper is unavailable", async () => {
    let authenticated = false;
    const unavailable = await completePasswordSignIn(
      { email: EMAIL, password: "synthetic-only" },
      async () => {
        authenticated = true;
        return { ok: true };
      },
      { requireDurableAudit: true, auditSink: null, lockout: { peppers: PEPPERS, store: null } },
    );
    assert.equal(authenticated, false);
    assert.deepEqual(unavailable, { ok: false, message: NEUTRAL_AUTH_ERROR });

    const malformed = await completePasswordSignIn(
      { email: EMAIL, password: "synthetic-only" },
      async () => {
        authenticated = true;
        return { ok: true };
      },
      {
        requireDurableAudit: true,
        lockout: {
          peppers: { current: { version: 1, secret: "short" } },
          store: createMemoryDistributedLockoutStore(),
        },
      },
    );
    assert.equal(authenticated, false);
    assert.deepEqual(malformed, { ok: false, message: NEUTRAL_AUTH_ERROR });
  });

  it("treats a previous-pepper lock as locked during rotation", async () => {
    const store = createMemoryDistributedLockoutStore();
    await lockIdentifier(store, { current: PEPPERS.previous! });
    let authenticated = false;
    const result = await completePasswordSignIn(
      { email: EMAIL, password: "synthetic-only" },
      async () => {
        authenticated = true;
        return { ok: true };
      },
      { lockout: { peppers: PEPPERS, store } },
    );
    assert.equal(authenticated, false);
    assert.deepEqual(result, { ok: false, message: NEUTRAL_AUTH_ERROR });
  });

  it("does not fall back to the local map for hosted authentication", async () => {
    resetLockoutStoreForTests();
    for (let index = 0; index < LOCKOUT_FAILURE_THRESHOLD; index += 1) {
      recordFailedAttempt(EMAIL);
    }
    const store = createMemoryDistributedLockoutStore();
    let authenticated = false;
    const result = await completePasswordSignIn(
      { email: EMAIL, password: "synthetic-only" },
      async () => {
        authenticated = true;
        return { ok: true };
      },
      {
        requireDurableAudit: true,
        auditSink: {
          async emit() {},
        },
        lockout: { peppers: PEPPERS, store },
      },
    );
    assert.equal(authenticated, true);
    assert.equal(result.ok, true);

    let hostedAuth = false;
    const noStore = await completePasswordSignIn(
      { email: "synthetic.other@example.test", password: "synthetic-only" },
      async () => {
        hostedAuth = true;
        return { ok: true };
      },
      { requireDurableAudit: true, auditSink: null },
    );
    assert.equal(hostedAuth, false);
    assert.deepEqual(noStore, { ok: false, message: NEUTRAL_AUTH_ERROR });
  });
});

describe("dormant distributed lockout recovery", () => {
  it("uses the email HMAC purpose and stays enumeration-neutral", async () => {
    const store = createMemoryDistributedLockoutStore();
    await lockIdentifier(store);
    let sent = false;
    const locked = await completeRecoveryRequest(
      EMAIL,
      async () => {
        sent = true;
      },
      null,
      { requireDistributedLockout: true, lockout: { peppers: PEPPERS, store } },
    );
    assert.equal(sent, false);
    assert.equal(locked.message, NEUTRAL_RECOVERY_MESSAGE);

    const unknown = await completeRecoveryRequest(
      "synthetic.unknown@example.test",
      async () => {
        sent = true;
      },
      null,
      { requireDistributedLockout: true, lockout: { peppers: PEPPERS, store } },
    );
    assert.equal(sent, true);
    assert.equal(unknown.message, NEUTRAL_RECOVERY_MESSAGE);

    let recovered = false;
    const unavailable = await completeRecoveryRequest(
      EMAIL,
      async () => {
        recovered = true;
      },
      null,
      { requireDistributedLockout: true, lockout: { peppers: PEPPERS, store: null } },
    );
    assert.equal(recovered, false);
    assert.equal(unavailable.message, NEUTRAL_RECOVERY_MESSAGE);
  });
});
