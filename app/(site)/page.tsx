import type { Metadata } from "next";
import { HomePageContent } from "@/components/home/HomePageContent";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Home",
  description: siteConfig.description,
};

export default function HomePage() {
  return <HomePageContent />;
}
