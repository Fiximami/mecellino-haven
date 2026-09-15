import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isProgrammeRole } from "../lib/auth/roles.ts";

describe("server-owned role boundary", () => {
  it("keeps the canonical legal guardian role distinct from client metadata", () => {
    assert.equal(isProgrammeRole("legal_guardian"), true);
    assert.equal(isProgrammeRole("parent"), true);
    assert.equal(isProgrammeRole("guardian"), false);
    assert.notEqual("parent", "legal_guardian");
  });

  it("does not treat unknown database role labels as protected roles", () => {
    assert.equal(isProgrammeRole("system_administrator"), true);
    assert.equal(isProgrammeRole("participant_admin"), false);
  });
});
