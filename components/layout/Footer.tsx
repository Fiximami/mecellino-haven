import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { contact, nav, social } = siteConfig;

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background)]" role="contentinfo">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="text-lg font-semibold text-[var(--foreground)]"
            >
              {siteConfig.name}
            </Link>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {siteConfig.tagline}
            </p>
          </div>

          {contact && (contact.email || contact.phone || contact.address) && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]">
                Contact
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                {contact.address && (
                  <li className="max-w-xs">{contact.address}</li>
                )}
                {contact.phone && (
                  <li>
                    <a
                      href={`tel:${contact.phone.replace(/\s/g, "")}`}
                      className="transition-colors hover:text-[var(--foreground)]"
                    >
                      {contact.phone}
                    </a>
                  </li>
                )}
                {contact.email && (
                  <li>
                    <a
                      href={`mailto:${contact.email}`}
                      className="transition-colors hover:text-[var(--foreground)]"
                    >
                      {contact.email}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]">
              Quick links
            </h3>
            <ul className="mt-4 space-y-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[var(--border)] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[var(--muted-foreground)]">
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          {social && social.length > 0 && (
            <ul className="flex gap-6">
              {social.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
                    aria-label={item.ariaLabel ?? `Follow us on ${item.label}`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
