export const THEME_STORAGE_KEY = "mh-appearance";

export const themeIds = ["light", "warm", "dark"] as const;

export type ThemeId = (typeof themeIds)[number];

export const DEFAULT_THEME: ThemeId = "light";

export const themeChoices = [
  { id: "light", label: "Light" },
  { id: "warm", label: "Warm" },
  { id: "dark", label: "Dark" },
] as const;

export const themeSelectorLabel = "Appearance. You can change how the site looks.";

export function nextThemeId(theme: ThemeId): ThemeId {
  const index = themeIds.indexOf(theme);
  return themeIds[(index + 1) % themeIds.length] ?? DEFAULT_THEME;
}

export function themeChoiceLabel(theme: ThemeId): string {
  return themeChoices.find((choice) => choice.id === theme)?.label ?? "Light";
}

export function themeCycleLabel(theme: ThemeId): string {
  return `Current theme: ${themeChoiceLabel(theme)}. Activate to use ${themeChoiceLabel(nextThemeId(theme))} theme`;
}

export function isThemeId(value: unknown): value is ThemeId {
  return value === "light" || value === "warm" || value === "dark";
}

export function parseStoredTheme(value: string | null | undefined): ThemeId {
  return isThemeId(value) ? value : DEFAULT_THEME;
}

export function colorSchemeForTheme(theme: ThemeId): "light" | "dark" {
  return theme === "dark" ? "dark" : "light";
}

export const THEME_BOOTSTRAP_SCRIPT = `(function(){try{var k=${JSON.stringify(
  THEME_STORAGE_KEY,
)};var t=localStorage.getItem(k);if(t!=="light"&&t!=="warm"&&t!=="dark")t=${JSON.stringify(
  DEFAULT_THEME,
)};document.documentElement.setAttribute("data-theme",t);document.documentElement.style.colorScheme=t==="dark"?"dark":"light";}catch(e){document.documentElement.setAttribute("data-theme",${JSON.stringify(
  DEFAULT_THEME,
)});document.documentElement.style.colorScheme="light";}})();`;
