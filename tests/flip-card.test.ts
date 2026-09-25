import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  moveOwnedFlipFocus,
  resolveOwnedFlipFocusTarget,
} from "../lib/motion/flip-focus.ts";

const flipSource = readFileSync("components/motion/FlipCard.tsx", "utf8");
const journeyCardSource = readFileSync("components/brand/ServiceJourneyCard.tsx", "utf8");
const pathCardSource = readFileSync("components/ydg/index.tsx", "utf8");
const tracksSource = readFileSync("components/ydg/TrackRevealList.tsx", "utf8");
const tracksPage = readFileSync("app/(site)/capacity-building/ydg/tracks/page.tsx", "utf8");
const ydgPage = readFileSync("app/(site)/capacity-building/ydg/page.tsx", "utf8");
const enquiry = readFileSync("components/ydg/EnquiryForm.tsx", "utf8");
const contact = readFileSync("app/(site)/contact/page.tsx", "utf8");
const events = readFileSync("app/(site)/events-entertainment/page.tsx", "utf8");
const parents = readFileSync("app/(site)/parents/page.tsx", "utf8");
const consent = readFileSync("components/consent/OnboardingConsentFoundation.tsx", "utf8");
const globalsCss = readFileSync("app/globals.css", "utf8");
const homeSource = readFileSync("components/home/HomePageContent.tsx", "utf8");

describe("sideways flip cards", () => {
  it("uses a Y-axis flip triggered only by a semantic button", () => {
    assert.match(flipSource, /aria-expanded=\{flipped\}/);
    assert.match(flipSource, /aria-controls=\{panelId\}/);
    assert.match(flipSource, /type="button"/);
    assert.match(flipSource, /inert=\{flipped\}/);
    assert.match(flipSource, /inert=\{!flipped\}/);
    assert.match(flipSource, /frontTriggerRef/);
    assert.match(flipSource, /backTriggerRef/);
    assert.match(flipSource, /focusIntentRef/);
    assert.match(flipSource, /onOwnedToggle\("back"\)/);
    assert.match(flipSource, /onOwnedToggle\("front"\)/);
    assert.match(flipSource, /useLayoutEffect/);
    assert.match(flipSource, /View details/);
    assert.match(flipSource, /Back/);
    assert.doesNotMatch(flipSource, /aria-live/);
    assert.doesNotMatch(flipSource, /setTimeout|setInterval/);
    assert.doesNotMatch(flipSource, /onKeyDown|onKeyUp|onPointerMove|onMouseMove|tilt/);
    assert.doesNotMatch(flipSource, /onMouseEnter|onHover|auto.?flip/i);
    assert.match(globalsCss, /rotateY\(180deg\)/);
    assert.match(globalsCss, /preserve-3d/);
    assert.match(globalsCss, /backface-visibility: hidden/);
    assert.match(globalsCss, /perspective: 1400px/);
    assert.match(globalsCss, /520ms/);
    assert.match(globalsCss, /prefers-reduced-motion: reduce/);
    assert.match(globalsCss, /\.mh-flip-inner \{\s*transition: opacity 180ms ease;/);
    assert.doesNotMatch(globalsCss, /rotateY\(180deg\).*prefers-reduced-motion: reduce|prefers-reduced-motion: reduce[\s\S]{0,180}rotateY\(180deg\)/);
  });

  it("keeps one open card per group and a stable height", () => {
    assert.match(flipSource, /current === id \? null : id/);
    assert.match(globalsCss, /\.mh-flip-inner/);
    assert.match(globalsCss, /min-height: 100%/);
    assert.match(globalsCss, /\.mh-flip-back \{\s*position: absolute;/);
  });

  it("applies flip only to eligible editorial cards", () => {
    assert.match(journeyCardSource, /FlipCard/);
    assert.match(pathCardSource, /if \(details\)/);
    assert.match(tracksSource, /FlipCard/);
    assert.match(homeSource, /FlipCardGroup/);
    assert.match(ydgPage, /title="Digital safety"/);
    assert.match(ydgPage, /details=/);
    assert.match(tracksPage, /eligibilityAgeStatement/);
    assert.match(tracksPage, /never hidden inside a card/);
  });

  it("does not convert prohibited requirement surfaces into flip cards", () => {
    assert.doesNotMatch(enquiry, /FlipCard/);
    assert.doesNotMatch(contact, /FlipCard/);
    assert.doesNotMatch(consent, /FlipCard/);
    assert.doesNotMatch(parents, /FlipCard/);
    assert.doesNotMatch(events, /details=/);
    assert.match(ydgPage, /Where a parent or legal guardian is responsible/);
    assert.doesNotMatch(
      ydgPage,
      /title="Where a parent or legal guardian is responsible"[\s\S]{0,180}details=/,
    );
    assert.doesNotMatch(ydgPage, /title="Where you give your own legal consent"[\s\S]{0,180}details=/);
  });
});

function createFocusTarget(id: string, options: { connected?: boolean; inert?: boolean } = {}) {
  const focused: string[] = [];
  const target = {
    id,
    focused,
    isConnected: options.connected ?? true,
    closest(selector: string) {
      return selector === "[inert]" && options.inert ? { id: `${id}-inert` } : null;
    },
    focus() {
      focused.push(id);
    },
  };
  return target as typeof target & HTMLElement;
}

describe("flip card focus management", () => {
  it("moves focus from View details to the reverse-face Back control after opening", () => {
    const front = createFocusTarget("front");
    const back = createFocusTarget("back");
    const target = resolveOwnedFlipFocusTarget({
      intent: "back",
      flipped: true,
      front,
      back,
    });
    moveOwnedFlipFocus(target);
    assert.equal(target, back);
    assert.deepEqual(back.focused, ["back"]);
    assert.deepEqual(front.focused, []);
  });

  it("returns focus to the original View details trigger when Back closes the card", () => {
    const front = createFocusTarget("front");
    const back = createFocusTarget("back");
    const target = resolveOwnedFlipFocusTarget({
      intent: "front",
      flipped: false,
      front,
      back,
    });
    moveOwnedFlipFocus(target);
    assert.equal(target, front);
    assert.deepEqual(front.focused, ["front"]);
    assert.deepEqual(back.focused, []);
  });

  it("uses the same owned-control path for click, tap, Enter and Space", () => {
    assert.match(flipSource, /onClick=\{\(\) => onOwnedToggle\("back"\)\}/);
    assert.match(flipSource, /onClick=\{\(\) => onOwnedToggle\("front"\)\}/);
    assert.match(flipSource, /type="button"/);
    assert.doesNotMatch(flipSource, /onKeyDown|onPointerUp|onTouchEnd/);
    assert.match(globalsCss, /touch-action: manipulation/);
  });

  it("does not let a group-closed card steal focus when another card opens", () => {
    const closingFront = createFocusTarget("a-front");
    const closingBack = createFocusTarget("a-back");
    const openingBack = createFocusTarget("b-back");
    const stolen = resolveOwnedFlipFocusTarget({
      intent: null,
      flipped: false,
      front: closingFront,
      back: closingBack,
    });
    const next = resolveOwnedFlipFocusTarget({
      intent: "back",
      flipped: true,
      front: createFocusTarget("b-front"),
      back: openingBack,
    });
    moveOwnedFlipFocus(stolen);
    moveOwnedFlipFocus(next);
    assert.equal(stolen, null);
    assert.equal(next, openingBack);
    assert.deepEqual(closingFront.focused, []);
    assert.deepEqual(closingBack.focused, []);
    assert.deepEqual(openingBack.focused, ["b-back"]);
  });

  it("keeps hidden-face controls unfocusable while inert", () => {
    const hiddenBack = createFocusTarget("back", { inert: true });
    const hiddenFront = createFocusTarget("front", { inert: true });
    assert.equal(
      resolveOwnedFlipFocusTarget({
        intent: "back",
        flipped: true,
        front: createFocusTarget("front"),
        back: hiddenBack,
      }),
      null,
    );
    assert.equal(
      resolveOwnedFlipFocusTarget({
        intent: "front",
        flipped: false,
        front: hiddenFront,
        back: createFocusTarget("back"),
      }),
      null,
    );
    assert.equal(
      resolveOwnedFlipFocusTarget({
        intent: "back",
        flipped: true,
        front: createFocusTarget("front"),
        back: createFocusTarget("gone", { connected: false }),
      }),
      null,
    );
    moveOwnedFlipFocus(hiddenBack);
    moveOwnedFlipFocus(null);
    assert.deepEqual(hiddenBack.focused, []);
    assert.match(flipSource, /inert=\{flipped\}/);
    assert.match(flipSource, /inert=\{!flipped\}/);
    assert.match(globalsCss, /\.mh-flip-face\[inert\] a,\s*\.mh-flip-face\[inert\] button/);
  });

  it("preserves focus behaviour in reduced-motion mode", () => {
    const back = createFocusTarget("back");
    const target = resolveOwnedFlipFocusTarget({
      intent: "back",
      flipped: true,
      front: createFocusTarget("front"),
      back,
    });
    moveOwnedFlipFocus(target);
    assert.equal(target, back);
    assert.doesNotMatch(flipSource, /matchMedia|prefers-reduced-motion|animationend|transitionend/);
    assert.match(globalsCss, /\.mh-flip-inner \{\s*transition: opacity 180ms ease;/);
    assert.doesNotMatch(flipSource, /setTimeout|setInterval/);
  });

  it("keeps mobile click and tap activation on the same button controls", () => {
    assert.match(flipSource, /onClick=\{\(\) => onOwnedToggle\("back"\)\}/);
    assert.match(flipSource, /onClick=\{\(\) => onOwnedToggle\("front"\)\}/);
    assert.doesNotMatch(flipSource, /onPointerEnter|onMouseEnter|onHover|onTouchStart/);
    assert.match(globalsCss, /touch-action: manipulation/);
    assert.match(globalsCss, /min-height: 44px/);
  });
});
