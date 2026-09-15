import type { Metadata } from "next";
import { HomePageContent } from "@/components/home/HomePageContent";
import { publicRoutes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { publicPageMetadata } from "@/lib/public-metadata";

export const metadata: Metadata = publicPageMetadata({
  title: "Home",
  description: `${siteConfig.description} Enquiry is a demonstration only; recruitment is not open. Amusement is in development.`,
  path: publicRoutes.home,
});

export default function HomePage() {
  return <HomePageContent />;
}
