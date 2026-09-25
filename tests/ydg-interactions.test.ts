import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { designTokens } from "../config/design-tokens.ts";

const ydgIndex = readFileSync("components/ydg/index.tsx", "utf8");

describe("UNFOLD stage order", () => {
  it("exposes all seven stages in the canonical order", () => {
    const play = ydgIndex.indexOf('label: "Play"');
    const discover = ydgIndex.indexOf('label: "Discover"');
    const explore = ydgIndex.indexOf('label: "Explore"');
    const experience = ydgIndex.indexOf('label: "Experience"');
    const prepare = ydgIndex.indexOf('label: "Prepare"');
    const execute = ydgIndex.indexOf('label: "Execute"');
    const mentor = ydgIndex.indexOf('label: "Mentor"');
    assert.ok(play >= 0 && play < discover && discover < explore && explore < experience);
    assert.ok(experience < prepare && prepare < execute && execute < mentor);
  });
});

describe("shared visual tokens", () => {
  it("keeps terracotta, navy and gold available for the shared identity", () => {
    assert.equal(designTokens.colors.terracotta, "#C45836");
    assert.equal(designTokens.colors.navy, "#1B2A4A");
    assert.equal(designTokens.colors.gold, "#B8860B");
    assert.equal(designTokens.colors.terracottaText, "#9E4227");
    assert.equal(designTokens.colors.goldOnNavy, "#D9A72B");
    assert.equal(designTokens.roles.textBrandOnLight, "#9E4227");
    assert.equal(designTokens.roles.textOnNavyAccent, "#D9A72B");
    assert.equal(designTokens.radius.card, "20px");
  });
});

describe("YDG public safety copy", () => {
  it("keeps transport responsibilities visible and does not invent an escalation contact", () => {
    const ydg = readFileSync("app/(site)/capacity-building/ydg/page.tsx", "utf8");
    const site = readFileSync("config/site.ts", "utf8");
    assert.match(ydg, /transportResponsibilityStatement/);
    assert.match(site, /Pilot participant transport is arranged and funded by parents or guardians/);
    assert.match(site, /arranged and funded by the Company/);
    assert.doesNotMatch(ydg, /escalat(e|ion) (hotline|phone|email)/i);
  });

  it("states approved 13–25 eligibility without activating consent collection", () => {
    const ydg = readFileSync("app/(site)/capacity-building/ydg/page.tsx", "utf8");
    const site = readFileSync("config/site.ts", "utf8");
    const explorer = readFileSync("components/ydg/UnfoldExplorer.tsx", "utf8");
    assert.match(site, /ageRange: "13–25"/);
    assert.match(ydg, /eligibilityAgeStatement/);
    assert.match(ydg, /ineligibleUnder13Statement/);
    assert.doesNotMatch(explorer, /fetch\(|localStorage|sessionStorage/);
  });
});
