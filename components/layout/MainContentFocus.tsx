"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const MOBILE_NAV_FOCUS_KEY = "mh-mobile-nav-focus";

export function focusMainContent() {
  const main = document.getElementById("main-content");
  const heading = main?.querySelector("h1");
  const target = heading instanceof HTMLElement ? heading : main;

  if (!(target instanceof HTMLElement)) return;

  if (!target.hasAttribute("tabindex")) {
    target.setAttribute("tabindex", "-1");
  }

  target.focus({ preventScroll: false });
}

export function setMobileNavFocusPending() {
  try {
    sessionStorage.setItem(MOBILE_NAV_FOCUS_KEY, "1");
  } catch {
    // sessionStorage may be unavailable; focus will fall back to default navigation behaviour.
  }
}

export function MainContentFocus() {
  const pathname = usePathname();

  useEffect(() => {
    let pending = false;

    try {
      pending = sessionStorage.getItem(MOBILE_NAV_FOCUS_KEY) === "1";
      if (pending) {
        sessionStorage.removeItem(MOBILE_NAV_FOCUS_KEY);
      }
    } catch {
      return;
    }

    if (!pending) return;

    focusMainContent();
  }, [pathname]);

  return null;
}
