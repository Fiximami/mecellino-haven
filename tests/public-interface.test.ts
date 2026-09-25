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
  nextThemeId,
  parseStoredTheme,
  THEME_BOOTSTRAP_SCRIPT,
  THEME_STORAGE_KEY,
  themeChoiceLabel,
  themeChoices,
  themeCycleLabel,
  themeIds,
  themeSelectorLabel,
} from "../lib/theme/appearance.ts";
import { editorialImages } from "../config/editorial-images.ts";
import { isPrimaryNavCurrent, publicRoutes } from "../config/routes.ts";

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
const footerSource = readFileSync("components/layout/SiteFooter.tsx", "utf8");
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

describe("homepage pathways", () => {
  it("routes visitors toward YDG and mobile amusement without opening applications", () => {
    assert.match(homeSource, /Two clear pathways/);
    assert.match(homeSource, /mh-pathway-ydg/);
    assert.match(homeSource, /mh-pathway-amusement/);
    assert.match(homeSource, /publicRoutes\.ydg/);
    assert.match(homeSource, /publicRoutes\.amusement/);
    assert.doesNotMatch(homeSource, /apply now|application submitted/i);
  });
});

describe("clickable public cards", () => {
  it("uses flip cards for eligible journey cards without Explore labels", () => {
    assert.match(journeyCardSource, /FlipCard/);
    assert.match(readFileSync("components/motion/FlipCard.tsx", "utf8"), /View details/);
    assert.doesNotMatch(journeyCardSource, /action\?:/);
    assert.doesNotMatch(journeyCardSource, /Explore/);
    assert.match(journeyCardSource, /mh-card mh-journey/);
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
  it("publishes the approved 13–25 eligibility and forbids superseded 10–25 bands", () => {
    assert.match(siteSource, /ageRange: "13–25"/);
    assert.match(siteSource, /consentMinor: "13–17"/);
    assert.match(siteSource, /consentAdult: "18–25"/);
    assert.match(siteSource, /official cohort start date/);
    assert.match(siteSource, /Youth aged 10–12 are not currently eligible/);
    assert.match(marketingSource, /13–25/);
    assert.doesNotMatch(marketingSource, /10–25|10-25/);
    assert.doesNotMatch(marketingSource, /10–13|10-13/);
    assert.match(marketingSource, /individuals and institutions/);
    const consentPolicy = readFileSync("lib/consent/policy.ts", "utf8");
    assert.match(consentPolicy, /13_17/);
    assert.match(consentPolicy, /18_25/);
    assert.doesNotMatch(consentPolicy, /10_17/);
  });

  it("describes YDG tracks by developmental stage and states 13–25 eligibility without per-track ages", () => {
    assert.match(tracksSource, /Early discovery/);
    assert.match(tracksSource, /Foundation development/);
    assert.match(tracksSource, /Direction building/);
    assert.match(tracksSource, /Execution and progression/);
    assert.match(tracksSource, /TrackRevealList/);
    assert.match(tracksSource, /View details/);
    assert.match(tracksSource, /eligibilityAgeStatement/);
    assert.doesNotMatch(tracksSource, /10–13|10-13|10–25|10-25/);
    assert.doesNotMatch(tracksSource, /turns 26/);
    assert.match(pathCardSource, /\{stage\}/);
    const reservedParents = readFileSync("docs/product/RESERVED_PARENT_ONBOARDING_CONTENT.md", "utf8");
    assert.match(reservedParents, /ages 14–15/);
    assert.match(reservedParents, /Eligible ages are 13–25/);
    assert.match(reservedParents, /Youth aged 10–12 are not currently eligible/);
    const parents = readFileSync("app/(site)/parents/page.tsx", "utf8");
    assert.match(parents, /notFound\(\)/);
    assert.doesNotMatch(parents, /ages 14–15|eligibilityAgeStatement|ineligibleUnder13Statement/);
  });
});

describe("UNFOLD signature interaction", () => {
  it("keeps the seven canonical stages selectable without automatic progression", () => {
    const explorer = readFileSync("components/ydg/UnfoldExplorer.tsx", "utf8");
    const howItWorks = readFileSync("app/(site)/capacity-building/ydg/how-it-works/page.tsx", "utf8");
    const ydg = readFileSync("app/(site)/capacity-building/ydg/page.tsx", "utf8");
    assert.match(pathCardSource, /Play[\s\S]*Discover[\s\S]*Explore[\s\S]*Experience[\s\S]*Prepare[\s\S]*Execute[\s\S]*Mentor/);
    assert.match(howItWorks, /UnfoldSequence/);
    assert.match(ydg, /UnfoldSequence/);
    assert.match(explorer, /role="tablist"/);
    assert.match(explorer, /aria-selected/);
    assert.match(explorer, /role="tabpanel"/);
    assert.match(explorer, /ArrowRight/);
    assert.doesNotMatch(explorer, /setInterval|setTimeout/);
    assert.match(globalsCss, /prefers-reduced-motion/);
    assert.match(globalsCss, /grid-template-columns: repeat\(7, minmax\(0, 1fr\)\)/);
    assert.match(globalsCss, /\.ydg-unfold-tab:focus-visible/);
    assert.match(globalsCss, /\.ydg-on-navy \.ydg-unfold-tab:focus-visible/);
    assert.match(globalsCss, /\.ydg-track-reveal-control:focus-visible/);
    assert.match(globalsCss, /--mh-gold-on-navy: #d9a72b/);
    assert.match(globalsCss, /--mh-terracotta-text: #9e4227/);
    assert.match(globalsCss, /--mh-focus-on-navy: #22d3ee/);
  });
});

describe("mobile amusement operations", () => {
  it("describes temporary event stands and forbids a permanent park claim", () => {
    assert.match(siteSource, /temporary event stands/);
    assert.match(siteSource, /does not operate a permanent amusement park/);
    assert.match(siteSource, /Capacity, coaching, events and mobile amusement/);
    assert.doesNotMatch(siteSource, /future amusement/);
    assert.match(homeSource, /Two clear pathways/);
    assert.match(homeSource, /Temporary stands/);
    assert.doesNotMatch(publicUiSource, /\bIGNITE\b/);
    assert.doesNotMatch(homeSource, /amusement that is still in development|Amusement is in development|coming soon|future amusement/i);
    assert.doesNotMatch(footerSource, /amusement in development|coming soon|future amusement/i);
    assert.doesNotMatch(marketingSource, /Amusement is in development|future amusement|coming soon/i);
    assert.match(headerSource, /lg:flex/);
    assert.match(headerSource, /min-width: 1024px/);
  });
});

describe("public safeguarding surfaces", () => {
  it("removes safeguarding labels and /parents links from public navigation and homepage", () => {
    assert.doesNotMatch(homeSource, /Safety first, always/);
    assert.doesNotMatch(homeSource, /Read safeguarding information/);
    assert.doesNotMatch(homeSource, /Read as a parent or guardian/);
    assert.doesNotMatch(homeSource, /publicRoutes\.parents/);
    assert.doesNotMatch(routesSource, /Safety & safeguarding/);
    assert.doesNotMatch(routesSource, /Safeguarding information/);
    assert.doesNotMatch(routesSource, /Parents & guardians/);
    assert.match(routesSource, /label: "YDG", href: publicRoutes\.ydg/);
    assert.equal(routesSource.match(/label: "YDG", href: publicRoutes\.ydg/g)?.length, 2);
    assert.match(headerSource, /primaryNav\.map/);
    assert.match(headerSource, /drawerNav\.map/);
  });
});

describe("primary navigation", () => {
  it("includes YDG as a top-level item without removing Capacity Building", () => {
    assert.match(routesSource, /label: "Capacity Building", href: publicRoutes\.capacityBuilding/);
    assert.match(routesSource, /label: "YDG", href: publicRoutes\.ydg/);
    assert.equal(routesSource.match(/label: "YDG", href: publicRoutes\.ydg/g)?.length, 2);
    assert.match(headerSource, /primaryNav\.map/);
    assert.match(headerSource, /drawerNav\.map/);
    assert.equal(isPrimaryNavCurrent("/", publicRoutes.home), true);
    assert.equal(isPrimaryNavCurrent("/capacity-building", publicRoutes.capacityBuilding), true);
    assert.equal(isPrimaryNavCurrent("/capacity-building/ydg", publicRoutes.ydg), true);
    assert.equal(isPrimaryNavCurrent("/capacity-building/ydg", publicRoutes.capacityBuilding), false);
    assert.equal(isPrimaryNavCurrent("/capacity-building/ydg/tracks", publicRoutes.ydg), true);
    assert.equal(isPrimaryNavCurrent("/capacity-building/retirement-life-preparedness", publicRoutes.capacityBuilding), true);
  });
});

describe("living gateway motion", () => {
  it("keeps a decorative SVG gateway on home and YDG only, with reduced-motion and pause gates", () => {
    const gateway = readFileSync("components/motion/LivingGateway.tsx", "utf8");
    const playback = readFileSync("lib/motion/usePlaybackGate.ts", "utf8");
    const reveal = readFileSync("components/motion/RevealGroup.tsx", "utf8");
    const lifestyle = readFileSync("app/(site)/lifestyle-coaching/page.tsx", "utf8");
    const retirement = readFileSync("app/(site)/capacity-building/retirement-life-preparedness/page.tsx", "utf8");
    const events = readFileSync("app/(site)/events-entertainment/page.tsx", "utf8");
    const amusement = readFileSync("app/(site)/amusement/page.tsx", "utf8");
    const capacity = readFileSync("app/(site)/capacity-building/page.tsx", "utf8");
    const ydg = readFileSync("app/(site)/capacity-building/ydg/page.tsx", "utf8");
    assert.match(homeSource, /LivingGateway variant="haven"/);
    assert.match(homeSource, /LivingGateway variant="cta"/);
    assert.match(ydg, /LivingGateway variant="ydg"/);
    assert.doesNotMatch(lifestyle, /LivingGateway/);
    assert.doesNotMatch(retirement, /LivingGateway/);
    assert.doesNotMatch(events, /LivingGateway/);
    assert.doesNotMatch(amusement, /LivingGateway/);
    assert.doesNotMatch(capacity, /LivingGateway/);
    assert.match(gateway, /aria-hidden="true"/);
    assert.match(gateway, /<svg/);
    assert.match(gateway, /mh-gateway-ribbon/);
    assert.match(globalsCss, /mh-ribbon-flow/);
    assert.match(globalsCss, /\.mh-gateway\.is-paused/);
    assert.match(globalsCss, /prefers-reduced-motion: reduce/);
    assert.doesNotMatch(gateway, /<text|Launch/);
    assert.doesNotMatch(gateway, /WebGL|three\.|HTMLCanvas|mp4|webm/i);
    assert.match(playback, /prefers-reduced-motion/);
    assert.match(playback, /visibilitychange/);
    assert.match(playback, /IntersectionObserver/);
    assert.match(globalsCss, /prefers-reduced-motion: no-preference/);
    assert.match(globalsCss, /@supports not \(offset-path: path\("M0 0"\)\)/);
    assert.match(globalsCss, /\.mh-gateway-pulse \{\s*display: none;/);
    assert.match(globalsCss, /\.mh-gateway\.is-paused/);
    assert.match(reveal, /IntersectionObserver/);
    assert.match(readFileSync("components/motion/FlipCard.tsx", "utf8"), /mh-reveal-item/);
    assert.match(journeyCardSource, /FlipCard/);
    assert.doesNotMatch(homeSource, /mh-safety-item mh-reveal-item/);
  });
});

describe("public footer", () => {
  it("removes public safeguarding CTAs and draft metadata, and shows a dynamic copyright", () => {
    assert.doesNotMatch(footerSource, /Safety &amp; safeguarding|Safety & safeguarding/);
    assert.doesNotMatch(footerSource, /Safeguarding information/);
    assert.doesNotMatch(footerSource, /Page last reviewed|Programme baseline|Definition v1\.0|Safeguarding manual/);
    assert.match(footerSource, /new Date\(\)\.getFullYear\(\)/);
    assert.match(footerSource, /© \{copyrightYear\} Mecellino Haven\. All rights reserved\./);
    assert.match(footerSource, /Designed and developed by MualenTech Ltd\./);
    assert.doesNotMatch(footerSource, /href=.*mualentech/i);
    assert.doesNotMatch(routesSource, /label: "Safeguarding information"/);
    assert.doesNotMatch(routesSource, /href: publicRoutes\.parents/);
    assert.equal(existsSync("app/(site)/parents/page.tsx"), true);
    assert.equal(existsSync("components/consent/OnboardingConsentFoundation.tsx"), true);
  });
});

describe("three-theme appearance", () => {
  it("defaults to light, persists locally, and cycles Light, Warm and Dark from one button", () => {
    assert.deepEqual(themeIds, ["light", "warm", "dark"]);
    assert.equal(DEFAULT_THEME, "light");
    assert.equal(themeChoices.length, 3);
    assert.equal(nextThemeId("light"), "warm");
    assert.equal(nextThemeId("warm"), "dark");
    assert.equal(nextThemeId("dark"), "light");
    assert.equal(themeChoiceLabel("light"), "Light");
    assert.equal(
      themeCycleLabel("light"),
      "Current theme: Light. Activate to use Warm theme",
    );
    assert.equal(
      themeCycleLabel("warm"),
      "Current theme: Warm. Activate to use Dark theme",
    );
    assert.equal(
      themeCycleLabel("dark"),
      "Current theme: Dark. Activate to use Light theme",
    );
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
    const themeSource = readFileSync("components/theme/ThemeSelector.tsx", "utf8");
    assert.match(themeSource, /themeCycleLabel/);
    assert.match(themeSource, /<button/);
    assert.match(themeSource, /ThemeCycleIcon/);
    assert.doesNotMatch(themeSource, /role="radiogroup"|role="radio"/);
    assert.doesNotMatch(publicUiSource, /Light \| Warm \| Dark/);
    assert.match(themeSelectorLabel, /Appearance/);
    assert.equal(designTokens.themes.light.page, "#FAFAFA");
    assert.equal(designTokens.themes.warm.page, "#F4EBE1");
    assert.equal(designTokens.themes.dark.page, "#132038");
    assert.match(globalsCss, /html\[data-theme="light"\]/);
    assert.match(globalsCss, /html\[data-theme="warm"\]/);
    assert.match(globalsCss, /html\[data-theme="dark"\]/);
    assert.match(globalsCss, /#fafafa/i);
    assert.match(globalsCss, /--mh-focus/);
    assert.match(globalsCss, /\.mh-theme-button:focus-visible/);
    assert.match(globalsCss, /--mh-motion: 220ms/);
    assert.match(globalsCss, /prefers-reduced-motion/);
    assert.match(globalsCss, /\.mh-contact-cta/);
    assert.doesNotMatch(globalsCss, /\.mh-journey::before/);
  });
});

describe("public page introductions", () => {
  it("removes breadcrumbs and duplicate page-category eyebrows while keeping the H1", () => {
    assert.equal(existsSync("components/brand/PageBreadcrumb.tsx"), false);
    assert.doesNotMatch(sitePagesSource, /PageBreadcrumb|mh-breadcrumb|Home \/ /);
    assert.doesNotMatch(homeSource, /mh-eyebrow">Mecellino Haven/);
    assert.doesNotMatch(
      sitePagesSource,
      /eyebrow="(?:CAPACITY BUILDING|Capacity Building|About|Lifestyle Coaching|Contact Us|Events and Entertainment|Amusement|Youth Discovery Gateway)"/,
    );
    assert.match(homeSource, /<h1 className="mh-h1">/);
    for (const page of [
      "app/(site)/capacity-building/page.tsx",
      "app/(site)/capacity-building/ydg/page.tsx",
      "app/(site)/capacity-building/ydg/how-it-works/page.tsx",
      "app/(site)/capacity-building/ydg/tracks/page.tsx",
      "app/(site)/lifestyle-coaching/page.tsx",
      "app/(site)/events-entertainment/page.tsx",
      "app/(site)/amusement/page.tsx",
      "app/(site)/about/page.tsx",
      "app/(site)/contact/page.tsx",
      "app/(site)/schools/page.tsx",
    ]) {
      assert.match(readFileSync(page, "utf8"), /<PageHero/);
    }
  });
});

describe("editorial photography", () => {
  it("uses local licensed photographs instead of decorative scene artwork", () => {
    assert.equal(existsSync("components/brand/ServiceArtwork.tsx"), false);
    assert.doesNotMatch(publicUiSource, /ServiceArtwork/);
    assert.match(journeyCardSource, /EditorialPhoto/);
    assert.match(homeSource, /EditorialPhoto/);
    const provenancePath = "docs/product/IMAGE_PROVENANCE.json";
    assert.equal(existsSync(provenancePath), true);
    const provenance = JSON.parse(readFileSync(provenancePath, "utf8")) as {
      images: Array<{
        localFilename: string;
        sourceUrl: string;
        isPhotograph: boolean;
        photographer: string;
        licenceUrl: string;
        ageSuitability: string;
        whyAppropriate: string;
        generatedArtwork: boolean;
      }>;
    };
    const usedFiles = new Set(Object.values(editorialImages).map((image) => image.src.replace("/images/editorial/", "")));
    for (const image of provenance.images) {
      assert.equal(image.isPhotograph, true);
      assert.equal(image.generatedArtwork, false);
      assert.ok(image.photographer.length > 0);
      assert.ok(image.licenceUrl.startsWith("https://"));
      assert.ok(image.ageSuitability.length > 0);
      assert.ok(image.whyAppropriate.length > 0);
      assert.match(image.sourceUrl, /pexels\.com\/photo\/|commons\.wikimedia\.org\/wiki\/File:/);
      assert.doesNotMatch(image.sourceUrl, /\/search\//);
      assert.equal(existsSync(join("public/images/editorial", image.localFilename)), true);
    }
    for (const filename of usedFiles) {
      assert.ok(
        provenance.images.some((image) => image.localFilename === filename),
        `missing provenance for ${filename}`,
      );
    }
    const diskFiles = readdirSync("public/images/editorial").filter((name) => /\.(jpe?g|png|webp)$/i.test(name));
    for (const filename of diskFiles) {
      assert.ok(
        provenance.images.some((image) => image.localFilename === filename),
        `unused public editorial file ${filename}`,
      );
    }
    assert.equal(existsSync("public/images/editorial/candidates"), false);
    assert.doesNotMatch(publicUiSource, /AI boy in suit|AI group picture/);
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
