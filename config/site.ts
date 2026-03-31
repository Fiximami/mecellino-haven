import type { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Mecellino Haven",
  tagline: "Where families play together",
  description:
    "Mecellino Haven is a children's amusement and family recreation brand offering fun, safe experiences for all ages.",
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Attractions", href: "/attractions" },
    { label: "Packages", href: "/visit" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ],
  social: [
    { label: "Facebook", href: "#", ariaLabel: "Follow us on Facebook" },
    { label: "Instagram", href: "#", ariaLabel: "Follow us on Instagram" },
    { label: "Twitter", href: "#", ariaLabel: "Follow us on Twitter" },
  ],
  contact: {
    email: "hello@mecellinohaven.com",
    phone: "+1 (555) 123-4567",
    address: "123 Family Fun Way, Your City, ST 12345",
  },
};
