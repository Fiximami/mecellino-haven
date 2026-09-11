import type { NavLink } from "@/types";

export const publicRoutes = {
  home: "/",
  about: "/about",
  ydg: "/ydg",
  howYdgWorks: "/how-ydg-works",
  tracks: "/tracks",
  parents: "/parents",
  mobileAmusement: "/mobile-amusement",
  schools: "/schools",
  contact: "/contact",
} as const;

export const primaryNav: NavLink[] = [
  { label: "Home", href: publicRoutes.home },
  { label: "YDG", href: publicRoutes.ydg },
  { label: "Mobile Amusement", href: publicRoutes.mobileAmusement },
  { label: "Schools & Partners", href: publicRoutes.schools },
  { label: "About", href: publicRoutes.about },
  { label: "Contact", href: publicRoutes.contact },
];

export const drawerNav: NavLink[] = [
  ...primaryNav.slice(0, 1),
  { label: "Youth Discovery Gateway", href: publicRoutes.ydg },
  ...primaryNav.slice(2),
  { label: "Safety & Safeguarding", href: publicRoutes.parents },
];

export const footerProgrammeLinks: NavLink[] = [
  { label: "About YDG", href: publicRoutes.ydg },
  { label: "How YDG works", href: publicRoutes.howYdgWorks },
  { label: "The four tracks", href: publicRoutes.tracks },
];

export const footerAudienceLinks: NavLink[] = [
  { label: "Parents & guardians", href: publicRoutes.parents },
  { label: "Schools & partners", href: publicRoutes.schools },
  { label: "Mobile amusement", href: publicRoutes.mobileAmusement },
];

export const footerOrganisationLinks: NavLink[] = [
  { label: "About us", href: publicRoutes.about },
  { label: "Enquiry preview", href: publicRoutes.contact },
  { label: "Complaints", href: publicRoutes.parents },
];
