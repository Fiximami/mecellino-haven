import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DEFAULT_RETURN_PATH, isSafeReturnPath, sanitizeReturnPath } from "../lib/auth/return-path.ts";

describe("return path allowlist", () => {
  it("accepts public relative paths", () => {
    assert.equal(isSafeReturnPath("/parents"), true);
    assert.equal(sanitizeReturnPath("/contact"), "/contact");
  });

  it("rejects absolute external URLs and protocol-relative targets", () => {
    assert.equal(isSafeReturnPath("https://evil.example"), false);
    assert.equal(sanitizeReturnPath("https://evil.example"), DEFAULT_RETURN_PATH);
    assert.equal(sanitizeReturnPath("//evil.example"), DEFAULT_RETURN_PATH);
    assert.equal(sanitizeReturnPath("/\\evil.example"), DEFAULT_RETURN_PATH);
    assert.equal(sanitizeReturnPath("/auth/callback"), DEFAULT_RETURN_PATH);
    assert.equal(sanitizeReturnPath("/admin"), DEFAULT_RETURN_PATH);
  });
});
