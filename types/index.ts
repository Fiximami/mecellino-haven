export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  ariaLabel?: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  nav: NavLink[];
  social?: SocialLink[];
  contact?: ContactInfo;
}
