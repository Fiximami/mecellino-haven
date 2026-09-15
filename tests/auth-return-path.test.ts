import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DEFAULT_RETURN_PATH, isSafeReturnPath, sanitizeReturnPath } from "../lib/auth/return-path.ts";

describe("return path allowlist", () => {
  it("accepts canonical public relative paths", () => {
    assert.equal(isSafeReturnPath("/parents"), true);
    assert.equal(sanitizeReturnPath("/contact"), "/contact");
    assert.equal(sanitizeReturnPath("/capacity-building/ydg"), "/capacity-building/ydg");
    assert.equal(
      sanitizeReturnPath("/capacity-building/ydg/how-it-works"),
      "/capacity-building/ydg/how-it-works",
    );
    assert.equal(sanitizeReturnPath("/lifestyle-coaching"), "/lifestyle-coaching");
    assert.equal(sanitizeReturnPath("/amusement"), "/amusement");
  });

  it("rejects obsolete standalone programme paths", () => {
    assert.equal(sanitizeReturnPath("/ydg"), DEFAULT_RETURN_PATH);
    assert.equal(sanitizeReturnPath("/how-ydg-works"), DEFAULT_RETURN_PATH);
    assert.equal(sanitizeReturnPath("/tracks"), DEFAULT_RETURN_PATH);
    assert.equal(sanitizeReturnPath("/mobile-amusement"), DEFAULT_RETURN_PATH);
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
