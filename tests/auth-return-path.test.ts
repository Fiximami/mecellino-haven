import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { DEFAULT_RETURN_PATH, isSafeReturnPath, sanitizeReturnPath } from "../lib/auth/return-path.ts";

describe("return path allowlist", () => {
  it("accepts canonical public relative paths", () => {
    assert.equal(isSafeReturnPath("/contact"), true);
    assert.equal(sanitizeReturnPath("/"), DEFAULT_RETURN_PATH);
    assert.equal(sanitizeReturnPath("/about"), "/about");
    assert.equal(sanitizeReturnPath("/contact"), "/contact");
    assert.equal(sanitizeReturnPath("/capacity-building"), "/capacity-building");
    assert.equal(sanitizeReturnPath("/capacity-building/ydg"), "/capacity-building/ydg");
    assert.equal(
      sanitizeReturnPath("/capacity-building/ydg/how-it-works"),
      "/capacity-building/ydg/how-it-works",
    );
    assert.equal(sanitizeReturnPath("/capacity-building/ydg/tracks"), "/capacity-building/ydg/tracks");
    assert.equal(sanitizeReturnPath("/lifestyle-coaching"), "/lifestyle-coaching");
    assert.equal(sanitizeReturnPath("/events-entertainment"), "/events-entertainment");
    assert.equal(sanitizeReturnPath("/amusement"), "/amusement");
    assert.equal(sanitizeReturnPath("/schools"), "/schools");
    assert.equal(sanitizeReturnPath("/auth/sign-in"), "/auth/sign-in");
  });

  it("does not accept /parents as an authentication return destination", () => {
    assert.equal(isSafeReturnPath("/parents"), false);
    assert.equal(isSafeReturnPath("/parents/manual"), false);
    assert.equal(sanitizeReturnPath("/parents"), DEFAULT_RETURN_PATH);
    assert.equal(sanitizeReturnPath("/parents/manual"), DEFAULT_RETURN_PATH);
    assert.equal(DEFAULT_RETURN_PATH, "/");
    assert.doesNotMatch(readFileSync("lib/auth/return-path.ts", "utf8"), /"\/parents"/);
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
