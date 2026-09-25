import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import {
  footerAudienceLinks,
  footerOrganisationLinks,
  footerProgrammeLinks,
  footerServiceLinks,
  publicRoutes,
} from "@/config/routes";
import { amusementDevelopmentStatement } from "@/config/site";

const copyrightYear = new Date().getFullYear();

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="mb-2.5 font-[family-name:var(--font-ibm-plex-mono)] text-sm font-semibold uppercase tracking-[0.1em] text-[var(--mh-chrome-text)]">
        {title}
      </h2>
      <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              className="inline-flex min-h-10 items-center text-[14.5px] text-[var(--mh-chrome-muted)] no-underline transition-colors hover:text-[var(--mh-navy-cyan)]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mh-footer border-t border-[var(--mh-chrome-border)] bg-[var(--mh-chrome-surface)] px-[18px] py-[30px] text-[var(--mh-chrome-muted)] md:px-7 md:py-[38px] lg:px-14 lg:pb-[30px] lg:pt-12">
      <div className="mx-auto grid max-w-[1180px] gap-[22px] md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-9">
        <div>
          <Link href={publicRoutes.home} className="mb-3 inline-flex min-h-11 items-center no-underline" aria-label="Mecellino Haven home">
            <BrandLogo />
          </Link>
          <p className="max-w-[38ch] text-[14.5px] leading-relaxed">
            Capacity Building, Lifestyle Coaching, Events and Entertainment, and current mobile amusement through
            temporary event stands — including Youth Discovery Gateway for individuals and institutions.
          </p>
          <p className="mt-3 max-w-[38ch] text-[13.5px] leading-relaxed">{amusementDevelopmentStatement}</p>
        </div>
        <FooterColumn title="Services" links={footerServiceLinks} />
        <FooterColumn title="Programmes" links={footerProgrammeLinks} />
        <div className="flex flex-col gap-[22px]">
          <FooterColumn title="For you" links={footerAudienceLinks} />
          <FooterColumn title="Organisation" links={footerOrganisationLinks} />
        </div>
      </div>
      <div className="mx-auto mt-6 flex max-w-[1180px] flex-col gap-1 border-t border-[var(--mh-chrome-border)] pt-4 text-[12.5px]">
        <p className="m-0">© {copyrightYear} Mecellino Haven. All rights reserved.</p>
        <p className="m-0 text-[12px] text-[var(--mh-chrome-muted)] opacity-80">
          Designed and developed by MualenTech Ltd.
        </p>
      </div>
    </footer>
  );
}
