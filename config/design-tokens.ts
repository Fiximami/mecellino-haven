export const designTokens = {
  colors: {
    terracotta: "#C45836",
    terracottaDark: "#9E4227",
    cream: "#FBF6F0",
    cream2: "#F4EBE1",
    paper: "#FFFFFF",
    ink: "#171310",
    ink2: "#413931",
    navy: "#1B2A4A",
    navy2: "#132038",
    navy3: "#26385C",
    gold: "#B8860B",
    goldLight: "#D9A72B",
    slate: "#5A6472",
    line: "#E3D9CD",
    line2: "#CFC2B2",
    ok: "#1F6B4A",
    warn: "#8A5A00",
    err: "#A3271B",
    shellBg: "#EFE9E2",
  },
  fonts: {
    display: 'var(--font-source-serif)',
    body: 'var(--font-libre-franklin)',
    mono: 'var(--font-ibm-plex-mono)',
  },
  spacing: {
    sectionMobile: "34px 18px",
    sectionTablet: "44px 28px",
    sectionDesktop: "64px 56px",
    contentMax: "1180px",
  },
  motion: {
    durationFast: "200ms",
    durationNormal: "300ms",
    easeOutExpo: "cubic-bezier(0.16, 1, 0.3, 1)",
  },
} as const;

export type DesignTokens = typeof designTokens;
