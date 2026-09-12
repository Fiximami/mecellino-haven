import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { emitRequiredAuthAudit } from "../lib/auth/audit.ts";
import {
  createDatabaseAuthAuditSink,
  type AuthAuditInsert,
} from "../lib/auth/audit-database.ts";

describe("durable authentication audit contract", () => {
  it("maps a redacted event to the narrow database insert", async () => {
    const writes: AuthAuditInsert[] = [];
    const sink = createDatabaseAuthAuditSink({
      async insert(event) {
        writes.push(event);
      },
    });

    const result = await emitRequiredAuthAudit(
      { class: "role_write", result: "success" },
      sink,
    );

    assert.equal(result.persisted, true);
    assert.deepEqual(writes, [
      {
        event_class: "role_write",
        result: "success",
        action: "role_write",
      },
    ]);
    assert.equal("email" in writes[0], false);
    assert.equal("token" in writes[0], false);
  });

  it("fails closed without exposing the storage error", async () => {
    const sink = createDatabaseAuthAuditSink({
      async insert() {
        throw new Error("synthetic database detail must not escape");
      },
    });

    const result = await emitRequiredAuthAudit(
      { class: "invite", result: "failure" },
      sink,
    );

    assert.deepEqual(result, {
      persisted: false,
      reason: "audit_unavailable",
    });
  });
});
