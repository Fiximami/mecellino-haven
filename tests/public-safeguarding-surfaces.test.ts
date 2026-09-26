import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

function walk(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next") {
      continue;
    }
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(path, acc);
    } else if (/\.(tsx|ts)$/.test(entry.name)) {
      acc.push(path);
    }
  }
  return acc;
}

const publicFiles = [
  ...walk("app/(site)"),
  ...walk("components/home"),
  ...walk("components/layout"),
  "components/ydg/EnquiryForm.tsx",
  "components/ydg/index.tsx",
  "config/routes.ts",
  "config/site.ts",
].filter((file) => !file.replaceAll("\\", "/").includes("app/(site)/parents/"));

const publicSource = publicFiles.map((file) => readFileSync(file, "utf8")).join("\n");
const routesSource = readFileSync("config/routes.ts", "utf8");
const headerSource = readFileSync("components/layout/SiteHeader.tsx", "utf8");
const footerSource = readFileSync("components/layout/SiteFooter.tsx", "utf8");
const parents = readFileSync("app/(site)/parents/page.tsx", "utf8");
const proxy = readFileSync("proxy.ts", "utf8");
const gate = readFileSync("lib/public/safeguarding-gate.ts", "utf8");
const enquiry = readFileSync("components/ydg/EnquiryForm.tsx", "utf8");
const contact = readFileSync("app/(site)/contact/page.tsx", "utf8");
const ydg = readFileSync("app/(site)/capacity-building/ydg/page.tsx", "utf8");
const site = readFileSync("config/site.ts", "utf8");

describe("public safeguarding communication", () => {
  it("keeps /parents as an always-404 fail-closed public page", () => {
    assert.match(parents, /export default function ParentsPage/);
    assert.match(parents, /notFound\(\)/);
    assert.match(parents, /robots: \{ index: false, follow: false \}/);
    assert.doesNotMatch(parents, /reservedParentsOnboardingContent/);
    assert.doesNotMatch(parents, /PageHero|PageSection|FaqAccordion/);
    assert.doesNotMatch(parents, /shouldPublishPublicSafeguarding|YDG_PUBLIC_SAFEGUARDING/);
  });

  it("keeps reserved parent onboarding copy out of public application modules", () => {
    const reserved = readFileSync("docs/product/RESERVED_PARENT_ONBOARDING_CONTENT.md", "utf8");
    assert.match(reserved, /reserved for future authenticated YDG onboarding/);
    assert.match(reserved, /not approved for public publication/);
    assert.match(reserved, /not an active route/);
    assert.match(reserved, /not an authorisation to collect participant data/);
    assert.match(
      reserved,
      /Implementation remains blocked pending the required safeguarding, legal, privacy and access-control gates/,
    );
    assert.match(reserved, /ages 14–15/);
    assert.match(reserved, /eligibilityAgeStatement|Eligible ages are 13–25/);
    assert.match(reserved, /Youth aged 10–12 are not currently eligible/);
    const applicationSource = [...walk("app"), ...walk("components")]
      .map((file) => readFileSync(file, "utf8"))
      .join("\n");
    assert.doesNotMatch(publicSource, /RESERVED_PARENT_ONBOARDING_CONTENT/);
    assert.doesNotMatch(parents, /RESERVED_PARENT_ONBOARDING_CONTENT/);
    assert.doesNotMatch(applicationSource, /RESERVED_PARENT_ONBOARDING_CONTENT|reservedParentsOnboardingContent/);
  });

  it("does not allow an environment variable to publish /parents", () => {
    assert.doesNotMatch(gate, /YDG_PUBLIC_SAFEGUARDING|process\.env|shouldPublishPublicSafeguarding/);
    assert.doesNotMatch(proxy, /YDG_PUBLIC_SAFEGUARDING|shouldPublishPublicSafeguarding/);
    assert.match(proxy, /isPublicSafeguardingPath\(pathname\)/);
    assert.doesNotMatch(proxy, /isPublicSafeguardingPath\(pathname\) &&/);
  });

  it("removes public safeguarding labels, CTAs, role titles and route links", () => {
    assert.doesNotMatch(publicSource, /safeguarding/i);
    assert.doesNotMatch(publicSource, /Safety first, always/);
    assert.doesNotMatch(publicSource, /Safety & safeguarding/);
    assert.doesNotMatch(publicSource, /Safeguarding information/);
    assert.doesNotMatch(publicSource, /Read safeguarding information/);
    assert.doesNotMatch(publicSource, /Read as a parent or guardian/);
    assert.doesNotMatch(publicSource, /href=\{publicRoutes\.parents\}/);
    assert.doesNotMatch(routesSource, /href: publicRoutes\.parents/);
    assert.doesNotMatch(publicSource, /Safeguarding Lead|safeguarding focal person|safeguarding readiness/i);
  });

  it("keeps YDG in desktop and mobile navigation without a safeguarding entry", () => {
    assert.match(routesSource, /export const primaryNav/);
    assert.match(routesSource, /export const drawerNav/);
    assert.match(routesSource, /label: "YDG", href: publicRoutes\.ydg/);
    assert.equal(routesSource.match(/label: "YDG", href: publicRoutes\.ydg/g)?.length, 2);
    assert.match(headerSource, /primaryNav\.map/);
    assert.match(headerSource, /drawerNav\.map/);
    assert.doesNotMatch(headerSource, /Safety & safeguarding|Safeguarding information|safeguarding/i);
    assert.doesNotMatch(footerSource, /Safety & safeguarding|Safeguarding information|Parents & guardians|safeguarding/i);
  });

  it("keeps emergency and incident-reporting warnings visible", () => {
    assert.match(enquiry, /If a child is in immediate danger, contact emergency services first/);
    assert.match(enquiry, /This is not an emergency or[\s\S]{0,20}incident-reporting channel/);
    assert.match(contact, /This is not an emergency[\s\S]{0,40}incident-reporting channel/);
    assert.match(site, /This is not an emergency or incident-reporting channel/);
  });

  it("keeps parental approval and supervision requirements intact", () => {
    assert.match(ydg, /13–17 require guardian consent plus participant assent/);
    assert.match(ydg, /parent or guardian approval that never replaces that consent/);
    assert.match(ydg, /Where a parent or legal guardian is responsible/);
    assert.match(ydg, /transportResponsibilityStatement/);
    assert.match(site, /Pilot participant transport is arranged and funded by parents or guardians/);
  });
});
