"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "./SiteHeader";

export function SiteHeaderShell() {
  const pathname = usePathname();
  return <SiteHeader key={pathname} />;
}
