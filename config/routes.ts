import type { NavLink } from "@/types";

export const publicRoutes = {
  home: "/",
  about: "/about",
  capacityBuilding: "/capacity-building",
  ydg: "/capacity-building/ydg",
  howYdgWorks: "/capacity-building/ydg/how-it-works",
  tracks: "/capacity-building/ydg/tracks",
  retirementLife: "/capacity-building/retirement-life-preparedness",
  lifestyleCoaching: "/lifestyle-coaching",
  eventsEntertainment: "/events-entertainment",
  amusement: "/amusement",
  parents: "/parents",
  schools: "/schools",
  contact: "/contact",
} as const;

export const primaryNav: NavLink[] = [
  { label: "Home", href: publicRoutes.home },
  { label: "Capacity Building", href: publicRoutes.capacityBuilding },
  { label: "Lifestyle Coaching", href: publicRoutes.lifestyleCoaching },
  { label: "Events", href: publicRoutes.eventsEntertainment },
  { label: "Amusement", href: publicRoutes.amusement },
  { label: "About", href: publicRoutes.about },
];

export const drawerNav: NavLink[] = [
  { label: "Home", href: publicRoutes.home },
  { label: "Capacity Building", href: publicRoutes.capacityBuilding },
  { label: "Youth Discovery Gateway", href: publicRoutes.ydg },
  { label: "Lifestyle Coaching", href: publicRoutes.lifestyleCoaching },
  { label: "Events and Entertainment", href: publicRoutes.eventsEntertainment },
  { label: "Amusement", href: publicRoutes.amusement },
  { label: "Schools & partners", href: publicRoutes.schools },
  { label: "About", href: publicRoutes.about },
  { label: "Safety & safeguarding", href: publicRoutes.parents },
];

export const footerServiceLinks: NavLink[] = [
  { label: "Capacity Building", href: publicRoutes.capacityBuilding },
  { label: "Lifestyle Coaching", href: publicRoutes.lifestyleCoaching },
  { label: "Events and Entertainment", href: publicRoutes.eventsEntertainment },
  { label: "Amusement", href: publicRoutes.amusement },
];

export const footerProgrammeLinks: NavLink[] = [
  { label: "Youth Discovery Gateway", href: publicRoutes.ydg },
  { label: "How YDG works", href: publicRoutes.howYdgWorks },
  { label: "The four YDG tracks", href: publicRoutes.tracks },
  { label: "Retirement Life Preparedness", href: publicRoutes.retirementLife },
];

export const footerAudienceLinks: NavLink[] = [
  { label: "Parents & guardians", href: publicRoutes.parents },
  { label: "Schools & partners", href: publicRoutes.schools },
  { label: "Contact Us", href: publicRoutes.contact },
];

export const footerOrganisationLinks: NavLink[] = [
  { label: "About us", href: publicRoutes.about },
  { label: "Safeguarding information", href: publicRoutes.parents },
];
