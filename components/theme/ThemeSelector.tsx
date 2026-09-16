"use client";

import { useId, useSyncExternalStore } from "react";
import {
  colorSchemeForTheme,
  DEFAULT_THEME,
  parseStoredTheme,
  THEME_STORAGE_KEY,
  themeChoices,
  themeSelectorLabel,
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
  const labelId = useId();
  const helpId = useId();
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, getServerThemeSnapshot);

  const selectTheme = (next: ThemeId) => {
    applyTheme(next);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const index = themeChoices.findIndex((choice) => choice.id === theme);
    if (index < 0) {
      return;
    }

    let nextIndex = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % themeChoices.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + themeChoices.length) % themeChoices.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = themeChoices.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const next = themeChoices[nextIndex];
    if (next) {
      selectTheme(next.id);
      const target = event.currentTarget.querySelector<HTMLButtonElement>(`[data-theme-id="${next.id}"]`);
      target?.focus();
    }
  };

  return (
    <div className={cn("mh-theme-selector", compact && "mh-theme-selector-compact")}>
      <p id={labelId} className={cn("mh-theme-selector-label", compact && "sr-only")}>
        Appearance
      </p>
      <p id={helpId} className={compact ? "sr-only" : "mh-theme-selector-help"}>
        You can change how the site looks.
      </p>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        aria-describedby={helpId}
        aria-label={themeSelectorLabel}
        className="mh-theme-options"
        onKeyDown={onKeyDown}
      >
        {themeChoices.map((choice) => {
          const selected = theme === choice.id;
          return (
            <button
              key={choice.id}
              type="button"
              role="radio"
              data-theme-id={choice.id}
              aria-checked={selected}
              aria-label={choice.label}
              tabIndex={selected ? 0 : -1}
              className={cn("mh-theme-option", selected && "is-selected")}
              onClick={() => selectTheme(choice.id)}
            >
              {choice.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
