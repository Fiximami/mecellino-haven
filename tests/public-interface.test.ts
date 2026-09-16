import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { designTokens } from "../config/design-tokens.ts";
import {
  onboardingConsentFoundation,
  onboardingConsentStepsFor,
} from "../lib/consent/onboarding-foundation.ts";
import {
  colorSchemeForTheme,
  DEFAULT_THEME,
  parseStoredTheme,
  THEME_BOOTSTRAP_SCRIPT,
  THEME_STORAGE_KEY,
  themeChoices,
  themeIds,
  themeSelectorLabel,
} from "../lib/theme/appearance.ts";

function walk(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next") {
      continue;
    }
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(path, acc);
    } else if (/\.(tsx|ts|css)$/.test(entry.name)) {
      acc.push(path);
    }
  }
  return acc;
}

const publicUiFiles = [
  ...walk("app/(site)"),
  ...walk("components/home"),
  ...walk("components/layout"),
  ...walk("components/brand"),
  ...walk("components/theme"),
  "components/ydg/index.tsx",
  "config/routes.ts",
  "config/site.ts",
];

const routesSource = readFileSync("config/routes.ts", "utf8");
const siteSource = readFileSync("config/site.ts", "utf8");
const publicUiSource = publicUiFiles.map((file) => readFileSync(file, "utf8")).join("\n");
const sitePagesSource = walk("app/(site)").map((file) => readFileSync(file, "utf8")).join("\n");
const marketingPages = [
  "app/(site)/page.tsx",
  "components/home/HomePageContent.tsx",
  "app/(site)/capacity-building/page.tsx",
  "app/(site)/capacity-building/ydg/page.tsx",
  "app/(site)/capacity-building/ydg/how-it-works/page.tsx",
  "app/(site)/capacity-building/ydg/tracks/page.tsx",
  "app/(site)/about/page.tsx",
  "components/layout/SiteFooter.tsx",
];
const marketingSource = marketingPages.map((file) => readFileSync(file, "utf8")).join("\n");
const tracksSource = readFileSync("app/(site)/capacity-building/ydg/tracks/page.tsx", "utf8");
const globalsCss = readFileSync("app/globals.css", "utf8");
const layoutSource = readFileSync("app/layout.tsx", "utf8");
const headerSource = readFileSync("components/layout/SiteHeader.tsx", "utf8");
const journeyCardSource = readFileSync("components/brand/ServiceJourneyCard.tsx", "utf8");
const homeSource = readFileSync("components/home/HomePageContent.tsx", "utf8");
const pathCardSource = readFileSync("components/ydg/index.tsx", "utf8");
const consentComponentSource = readFileSync("components/consent/OnboardingConsentFoundation.tsx", "utf8");

describe("public contact terminology", () => {
  it("keeps the canonical /contact route and uses Contact Us as the destination label", () => {
    assert.match(routesSource, /contact: "\/contact"/);
    assert.match(siteSource, /export const publicContactLabel = "Contact Us"/);
    assert.match(routesSource, /label: "Contact Us", href: publicRoutes\.contact/);
    assert.match(headerSource, /publicContactLabel/);
    assert.doesNotMatch(publicUiSource, /Enquiry preview/);
    assert.doesNotMatch(publicUiSource, /Preview an enquiry/);
    assert.doesNotMatch(publicUiSource, /Preview enquiry form/);
    assert.match(sitePagesSource, /enquiry/);
  });
});

describe("professional email exposure", () => {
  it("publishes only info@mecellinohaven.com and does not expose Gmail", () => {
    assert.match(siteSource, /export const publicEnquiryEmail = "info@mecellinohaven\.com"/);
    assert.match(publicUiSource, /info@mecellinohaven\.com/);
    assert.doesNotMatch(publicUiSource, /gmail\.com/i);
    assert.equal(existsSync("docs/operations/PRE_LAUNCH_CONFIGURATION_REGISTER.md"), true);
    const register = readFileSync("docs/operations/PRE_LAUNCH_CONFIGURATION_REGISTER.md", "utf8");
    assert.match(register, /info@mecellinohaven\.com/);
    assert.match(register, /SPF, DKIM and DMARC/);
    assert.match(register, /NEXT_PUBLIC_SITE_URL/);
    assert.match(register, /NEXT_PUBLIC_SUPABASE_URL/);
    assert.match(register, /operational Gmail/);
    assert.doesNotMatch(register, /[A-Za-z0-9._%+-]+@gmail\.com/);
  });
});

describe("clickable public cards", () => {
  it("uses a single accessible link for journey cards without Explore labels", () => {
    assert.match(journeyCardSource, /<Link/);
    assert.doesNotMatch(journeyCardSource, /action\?:/);
    assert.doesNotMatch(journeyCardSource, /Explore/);
    assert.match(journeyCardSource, /mh-card-link/);
    assert.match(journeyCardSource, /aria-labelledby/);
  });

  it("does not nest links inside PathCard or home community cards", () => {
    assert.match(pathCardSource, /if \(href\)/);
    assert.doesNotMatch(homeSource, /Find out more/);
    assert.match(homeSource, /mh-card mh-card-link/);
    assert.match(globalsCss, /a\.mh-card-link/);
    assert.match(globalsCss, /a\.ydg-pathcard/);
  });
});

describe("public age wording", () => {
  it("does not publish an explicit 10–25 marketing range on Capacity Building and YDG surfaces", () => {
    assert.doesNotMatch(marketingSource, /10–25|10-25/);
    assert.match(marketingSource, /individuals and institutions/);
    const consentPolicy = readFileSync("lib/consent/policy.ts", "utf8");
    assert.match(consentPolicy, /10_17/);
    assert.match(consentPolicy, /18_25/);
  });

  it("describes YDG tracks by developmental stage rather than public age ranges", () => {
    assert.match(tracksSource, /Early discovery/);
    assert.match(tracksSource, /Foundation development/);
    assert.match(tracksSource, /Direction building/);
    assert.match(tracksSource, /Execution and progression/);
    assert.doesNotMatch(tracksSource, /10–13|10-13|14–15|14-15|16–17|16-17|18–25|18-25|10–25|10-25/);
    assert.doesNotMatch(tracksSource, /aged \d+|ages \d+|turns 26/);
    assert.match(pathCardSource, /\{stage\}/);
    const parents = readFileSync("app/(site)/parents/page.tsx", "utf8");
    assert.match(parents, /ages 14–15/);
  });
});

describe("safety first destination", () => {
  it("sends the Safety first interactive elements to /parents", () => {
    assert.match(homeSource, /Safety first, always/);
    assert.match(homeSource, /className="mh-safety-heading"/);
    assert.match(homeSource, /<Link key=\{item\.title\} href=\{publicRoutes\.parents\} className="mh-safety-item"/);
    assert.doesNotMatch(homeSource, /className="mh-safety-item"[\s\S]{0,220}<Link/);
  });
});

describe("three-theme appearance", () => {
  it("defaults to light, persists locally, and exposes Light, Warm and Dark", () => {
    assert.deepEqual(themeIds, ["light", "warm", "dark"]);
    assert.equal(DEFAULT_THEME, "light");
    assert.equal(themeChoices.length, 3);
    assert.equal(parseStoredTheme(null), "light");
    assert.equal(parseStoredTheme("warm"), "warm");
    assert.equal(parseStoredTheme("midnight"), "light");
    assert.equal(colorSchemeForTheme("dark"), "dark");
    assert.equal(THEME_STORAGE_KEY, "mh-appearance");
    assert.match(THEME_BOOTSTRAP_SCRIPT, /localStorage\.getItem/);
    assert.match(THEME_BOOTSTRAP_SCRIPT, /data-theme/);
    assert.match(layoutSource, /data-theme="light"/);
    assert.match(layoutSource, /THEME_BOOTSTRAP_SCRIPT/);
    assert.match(headerSource, /ThemeSelector/);
    assert.match(themeSelectorLabel, /Appearance/);
    assert.equal(designTokens.themes.light.page, "#FAFAFA");
    assert.equal(designTokens.themes.warm.page, "#F4EBE1");
    assert.equal(designTokens.themes.dark.page, "#132038");
    assert.match(globalsCss, /html\[data-theme="light"\]/);
    assert.match(globalsCss, /html\[data-theme="warm"\]/);
    assert.match(globalsCss, /html\[data-theme="dark"\]/);
    assert.match(globalsCss, /#fafafa/i);
    assert.match(globalsCss, /--mh-focus/);
    assert.match(globalsCss, /--mh-motion: 220ms/);
    assert.match(globalsCss, /prefers-reduced-motion/);
    assert.match(globalsCss, /\.mh-contact-cta/);
    assert.doesNotMatch(globalsCss, /\.mh-journey::before/);
  });
});

describe("YDG partners", () => {
  it("presents partner audiences without YDG-Community or invented organisations", () => {
    assert.match(
      siteSource,
      /export const ydgPartnerAudiences = \[\s*"schools",\s*"institutions",\s*"parents",\s*"entrepreneurs",\s*"governments",\s*"NGOs",\s*\] as const;/,
    );
    assert.doesNotMatch(publicUiSource, /YDG-Community/);
    const schools = readFileSync("app/(site)/schools/page.tsx", "utf8");
    assert.match(schools, /schools, institutions, parents, entrepreneurs, governments and NGOs/);
    assert.match(schools, /not a list of signed organisations/);
  });
});

describe("dormant onboarding consent foundation", () => {
  it("stays unmounted on public routes and collects no data", () => {
    assert.equal(onboardingConsentFoundation.status, "dormant");
    assert.equal(onboardingConsentFoundation.collection, "none");
    assert.equal(onboardingConsentFoundation.storage, "none");
    assert.equal(onboardingConsentFoundation.submission, "none");
    assert.equal(onboardingConsentFoundation.globalPopup, false);
    assert.equal(onboardingConsentFoundation.mediaConsent.optional, true);
    assert.equal(onboardingConsentFoundation.alternativeResponsibleAdult.owner, "safeguarding_lead");
    const minor = onboardingConsentStepsFor("under_18");
    assert.equal(minor.programmeConsent, "parent_or_legal_guardian_required");
    assert.equal(minor.participantAssent, "required_separate");
    const adult = onboardingConsentStepsFor("adult");
    assert.equal(adult.participantLegalConsent, "mandatory");
    assert.equal(adult.guardianLegalConsent, "skipped");
    assert.equal(adult.organisationalAcknowledgement, "required");
    assert.doesNotMatch(sitePagesSource, /OnboardingConsentFoundation/);
    assert.doesNotMatch(layoutSource, /OnboardingConsentFoundation/);
    assert.doesNotMatch(consentComponentSource, /fetch\(/);
    assert.doesNotMatch(consentComponentSource, /localStorage/);
    assert.equal(existsSync("app/(site)/register"), false);
    assert.equal(existsSync("app/register"), false);
  });
});
