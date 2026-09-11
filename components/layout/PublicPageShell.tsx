import type { ReactNode } from "react";
import { MainContentFocus } from "./MainContentFocus";
import { SiteFooter } from "./SiteFooter";
import { SiteHeaderShell } from "./SiteHeaderShell";

export function PublicPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="ydg-page flex min-h-screen flex-col">
      <a href="#main-content" className="ydg-skip">
        Skip to main content
      </a>
      <SiteHeaderShell />
      <main id="main-content" className="mh-page flex-1">
        <MainContentFocus />
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
