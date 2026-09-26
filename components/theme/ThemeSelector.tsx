"use client";

import { useSyncExternalStore } from "react";
import { ThemeCycleIcon } from "@/components/brand/ServiceIcons";
import {
  colorSchemeForTheme,
  DEFAULT_THEME,
  nextThemeId,
  parseStoredTheme,
  THEME_STORAGE_KEY,
  themeChoiceLabel,
  themeCycleLabel,
  type ThemeId,
} from "@/lib/theme/appearance";
import { cn } from "@/lib/utils";

const THEME_CHANGE_EVENT = "mh-appearance-change";

function applyTheme(theme: ThemeId) {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.colorScheme = colorSchemeForTheme(theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Persistence is best-effort; the in-memory selection still applies.
  }
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getThemeSnapshot(): ThemeId {
  return parseStoredTheme(document.documentElement.getAttribute("data-theme"));
}

function getServerThemeSnapshot(): ThemeId {
  return DEFAULT_THEME;
}

export function ThemeSelector({ compact = false }: { compact?: boolean }) {
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, getServerThemeSnapshot);
  const next = nextThemeId(theme);
  const label = themeCycleLabel(theme);

  return (
    <button
      type="button"
      className={cn("mh-theme-button", compact && "mh-theme-button-compact")}
      aria-label={label}
      title={label}
      onClick={() => applyTheme(next)}
    >
      <ThemeCycleIcon theme={theme} />
      <span className="mh-theme-button-label">{themeChoiceLabel(theme)}</span>
    </button>
  );
}
