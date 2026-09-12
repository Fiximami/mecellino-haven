import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { revokeSession } from "../lib/auth/revoke-session-core.ts";

describe("server session revocation", () => {
  it("clears local auth cookies when provider sign-out fails", async () => {
    const cleared: string[] = [];

    await revokeSession(
      {
        auth: {
          async signOut() {
            throw new Error("synthetic provider outage");
          },
        },
      },
      {
        getAll() {
          return [{ name: "sb-example-auth-token" }, { name: "theme" }];
        },
        set(name, value, options) {
          assert.equal(value, "");
          assert.equal(options.maxAge, 0);
          cleared.push(name);
        },
      },
    );

    assert.deepEqual(cleared, ["sb-example-auth-token"]);
  });
});
