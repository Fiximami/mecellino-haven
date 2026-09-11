import { PublicPageShell } from "@/components/layout";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PublicPageShell>{children}</PublicPageShell>;
}
