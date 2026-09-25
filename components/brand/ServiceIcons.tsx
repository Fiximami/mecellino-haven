import type { ReactNode } from "react";

const iconClass = "h-6 w-6";

export function CapacityIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true" fill="none">
      <path
        d="M4 19V7.5L12 4l8 3.5V19"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M8 19v-7h8v7" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 12v7" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function LifestyleIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true" fill="none">
      <path
        d="M12 20s-6.5-4.2-6.5-9.1A3.9 3.9 0 0 1 12 8.2a3.9 3.9 0 0 1 6.5 2.7C18.5 15.8 12 20 12 20Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function EventsIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true" fill="none">
      <rect x="3.5" y="5.5" width="17" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 3.5V8M16 3.5V8M3.5 10.5h17" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function AmusementIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true" fill="none">
      <path d="M5 19h14M7 19 12 5l5 14" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9.2 13h5.6" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function YdgIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true" fill="none">
      <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 7.5v5l3.2 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function ThemeCycleIcon({ theme }: { theme: "light" | "warm" | "dark" }) {
  if (theme === "dark") {
    return (
      <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true" fill="none">
        <path
          d="M15.2 4.6A7.8 7.8 0 1 0 19.4 14 6.2 6.2 0 0 1 15.2 4.6Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (theme === "warm") {
    return (
      <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true" fill="none">
        <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6.1 6.1l1.6 1.6M16.3 16.3l1.6 1.6M17.9 6.1l-1.6 1.6M7.7 16.3l-1.6 1.6"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true" fill="none">
      <circle cx="12" cy="12" r="4.4" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 4.2v1.4M12 18.4v1.4M4.2 12h1.4M18.4 12h1.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconBadge({ children }: { children: ReactNode }) {
  return (
    <span className="mh-icon-badge text-[var(--mh-terracotta)]" aria-hidden="true">
      {children}
    </span>
  );
}
