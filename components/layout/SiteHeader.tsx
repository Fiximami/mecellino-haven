"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { focusMainContent, setMobileNavFocusPending } from "@/components/layout/MainContentFocus";
import { ThemeSelector } from "@/components/theme/ThemeSelector";
import { drawerNav, primaryNav, publicRoutes } from "@/config/routes";
import { publicContactLabel } from "@/config/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);

  const setDrawer = useCallback((open: boolean, returnFocus = false) => {
    setDrawerOpen(open);
    if (!open && returnFocus) {
      burgerRef.current?.focus();
    }
  }, []);

  const isCurrent = (href: string) =>
    href === publicRoutes.home ? pathname === href : pathname.startsWith(href);

  const handleDrawerLinkClick = useCallback(
    (href: string, event: React.MouseEvent<HTMLAnchorElement>) => {
      const onCurrentRoute =
        href === publicRoutes.home ? pathname === href : pathname.startsWith(href);

      if (onCurrentRoute) {
        event.preventDefault();
        setDrawerOpen(false);
        requestAnimationFrame(() => focusMainContent());
        return;
      }

      setMobileNavFocusPending();
      setDrawerOpen(false);
    },
    [pathname]
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && drawerOpen) {
        setDrawer(false, true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen, setDrawer]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (media.matches) setDrawer(false);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [setDrawer]);

  return (
    <header className="mh-header sticky top-0 z-50 border-b border-[var(--mh-chrome-border)] bg-[var(--mh-chrome-bg)]">
      <div className="mx-auto flex max-w-[1180px] items-center gap-3 px-[18px] py-3 md:px-7 lg:px-10">
        <Link
          href={publicRoutes.home}
          className="mr-auto flex min-h-11 items-center no-underline"
          aria-label="Mecellino Haven home"
        >
          <BrandLogo />
        </Link>

        <ul className="hidden list-none items-center gap-0.5 md:flex lg:gap-1">
          {primaryNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isCurrent(item.href) ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center rounded-full px-2.5 text-[13px] font-medium text-[var(--mh-chrome-muted)] no-underline transition-colors lg:px-3.5 lg:text-[15px]",
                  isCurrent(item.href)
                    ? "bg-white/8 font-semibold text-[var(--mh-chrome-text)]"
                    : "hover:text-[var(--mh-chrome-text)]"
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <ThemeSelector compact />
        </div>

        <Link
          href={publicRoutes.contact}
          className="mh-btn mh-btn-primary mh-contact-cta hidden text-sm md:inline-flex"
        >
          {publicContactLabel}
        </Link>

        <button
          ref={burgerRef}
          type="button"
          className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[var(--mh-chrome-border)] bg-[var(--mh-chrome-surface)] md:hidden"
          aria-expanded={drawerOpen}
          aria-controls="mobile-drawer"
          aria-label={drawerOpen ? "Close menu" : "Open menu"}
          onClick={() => setDrawer(!drawerOpen, false)}
        >
          <span className="relative block h-0.5 w-[18px] bg-white before:absolute before:-top-1.5 before:left-0 before:block before:h-0.5 before:w-[18px] before:bg-white after:absolute after:top-1.5 after:left-0 after:block after:h-0.5 after:w-[18px] after:bg-white" />
        </button>
      </div>

      <div
        id="mobile-drawer"
        className={cn(
          "border-b border-[var(--mh-chrome-border)] bg-[var(--mh-chrome-surface)] px-[18px] pb-[18px] pt-1.5 md:hidden",
          !drawerOpen && "hidden"
        )}
      >
        <ul className="m-0 list-none p-0">
          {drawerNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex min-h-12 items-center border-b border-[var(--mh-chrome-border)] text-base font-medium text-[var(--mh-chrome-text)] no-underline"
                onClick={(event) => handleDrawerLinkClick(item.href, event)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-3.5">
          <ThemeSelector />
        </div>
        <Link
          href={publicRoutes.contact}
          className="mh-btn mh-btn-primary mt-3.5 w-full"
          onClick={(event) => handleDrawerLinkClick(publicRoutes.contact, event)}
        >
          {publicContactLabel}
        </Link>
      </div>
    </header>
  );
}
