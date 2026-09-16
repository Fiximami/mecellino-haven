type ServiceVisual = "capacity" | "lifestyle" | "events" | "amusement" | "ydg" | "haven";

export function ServiceArtwork({ visual }: { visual: ServiceVisual }) {
  const titleId = `mh-art-${visual}`;

  return (
    <svg
      className="mh-service-art"
      viewBox="0 0 160 120"
      aria-hidden="true"
      focusable="false"
    >
      <title id={titleId}>{artTitle(visual)}</title>
      {visual === "capacity" ? <CapacityArt /> : null}
      {visual === "ydg" ? <YdgArt /> : null}
      {visual === "lifestyle" ? <LifestyleArt /> : null}
      {visual === "events" ? <EventsArt /> : null}
      {visual === "amusement" ? <AmusementArt /> : null}
      {visual === "haven" ? <HavenArt /> : null}
    </svg>
  );
}

function artTitle(visual: ServiceVisual) {
  switch (visual) {
    case "capacity":
      return "Guided learning and progression";
    case "ydg":
      return "Discovery, direction and evidence";
    case "lifestyle":
      return "Wellbeing and personal growth";
    case "events":
      return "Community gathering";
    case "amusement":
      return "Future mobile recreation";
    case "haven":
      return "A sheltered place for growth";
  }
}

function CapacityArt() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M18 96h124" opacity="0.35" />
      <rect x="22" y="72" width="28" height="24" rx="4" />
      <rect x="58" y="52" width="28" height="44" rx="4" />
      <rect x="94" y="28" width="28" height="68" rx="4" />
      <path d="M30 64l18-10 18 4 22-16 22-6" strokeLinecap="round" />
      <circle cx="110" cy="22" r="5" fill="currentColor" stroke="none" />
    </g>
  );
}

function YdgArt() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="80" cy="58" r="34" opacity="0.35" />
      <path d="M80 24v34l22 14" />
      <path d="M46 96c10-18 22-28 34-28s24 10 34 28" />
      <circle cx="80" cy="58" r="4" fill="currentColor" stroke="none" />
    </g>
  );
}

function LifestyleArt() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M80 96c-22-16-34-30-34-46a18 18 0 0 1 34-8 18 18 0 0 1 34 8c0 16-12 30-34 46Z" />
      <path d="M80 38v22" strokeLinecap="round" />
      <path d="M68 48h24" strokeLinecap="round" opacity="0.6" />
    </g>
  );
}

function EventsArt() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="58" cy="62" r="22" />
      <circle cx="96" cy="50" r="18" opacity="0.7" />
      <circle cx="90" cy="78" r="14" opacity="0.45" />
      <path d="M40 96h84" strokeLinecap="round" opacity="0.35" />
    </g>
  );
}

function AmusementArt() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="28" y="48" width="72" height="40" rx="10" />
      <circle cx="48" cy="96" r="8" />
      <circle cx="80" cy="96" r="8" />
      <path d="M100 62h28l-8 26H92" />
      <path d="M118 48l10-12" opacity="0.5" />
    </g>
  );
}

function HavenArt() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M22 88V52l58-28 58 28v36" />
      <path d="M54 88V64h52v24" />
      <path d="M80 64v24" />
      <path d="M36 40c18-16 38-16 56 0" opacity="0.45" />
    </g>
  );
}
