import Image from "next/image";
import Link from "next/link";
import {
  footerAudienceLinks,
  footerOrganisationLinks,
  footerProgrammeLinks,
  publicRoutes,
} from "@/config/routes";
import { programmeFacts } from "@/config/site";

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="mb-2.5 font-[family-name:var(--font-ibm-plex-mono)] text-sm font-semibold uppercase tracking-[0.1em] text-[var(--mh-dark-text)]">
        {title}
      </h4>
      <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              className="inline-flex min-h-10 items-center text-[14.5px] text-[var(--mh-dark-muted)] no-underline transition-colors hover:text-[var(--mh-cyan)]"
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
    <footer className="mh-footer border-t border-[var(--mh-dark-border)] bg-[var(--mh-dark-surface)] px-[18px] py-[30px] text-[var(--mh-dark-muted)] md:px-7 md:py-[38px] lg:px-14 lg:pb-[30px] lg:pt-12">
      <div className="mx-auto grid max-w-[1180px] gap-[22px] md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-9">
        <div>
          <Link href={publicRoutes.home} className="mb-3 inline-flex min-h-11 items-center no-underline">
            <Image
              src="/brand/mecellino-haven-logo.jpg"
              alt="Mecellino Haven"
              width={1024}
              height={188}
              className="h-9 w-auto"
            />
          </Link>
          <p className="max-w-[34ch] text-[14.5px] leading-relaxed">
            Mobile amusement at selected events, and the Youth Discovery Gateway for young people aged{" "}
            {programmeFacts.ageRange}.
          </p>
          <Link href={publicRoutes.parents} className="mh-link mt-3 min-h-11">
            Safety &amp; safeguarding →
          </Link>
        </div>
        <FooterColumn title="Programme" links={footerProgrammeLinks} />
        <FooterColumn title="For you" links={footerAudienceLinks} />
        <FooterColumn title="Organisation" links={footerOrganisationLinks} />
      </div>
      <div className="mx-auto mt-6 flex max-w-[1180px] flex-wrap gap-x-[18px] gap-y-1.5 border-t border-[var(--mh-dark-border)] pt-4 text-[12.5px]">
        <span>Page last reviewed: September 2026</span>
        <span>Programme baseline: Definition v1.0 · Safeguarding manual v0.9 (draft)</span>
      </div>
    </footer>
  );
}
