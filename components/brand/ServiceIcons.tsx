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

export function IconBadge({ children }: { children: ReactNode }) {
  return (
    <span className="mh-icon-badge text-[var(--mh-terracotta)]" aria-hidden="true">
      {children}
    </span>
  );
}
