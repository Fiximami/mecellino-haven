import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturedAttractionsSection } from "@/components/sections/FeaturedAttractionsSection";
import { AboutPreviewSection } from "@/components/sections/AboutPreviewSection";
import { PackagesPreviewSection } from "@/components/sections/PackagesPreviewSection";
import { SafetySection } from "@/components/sections/SafetySection";
import { GalleryPreviewSection } from "@/components/sections/GalleryPreviewSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ContactCtaSection } from "@/components/sections/ContactCtaSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedAttractionsSection />
      <AboutPreviewSection />
      <PackagesPreviewSection />
      <SafetySection />
      <GalleryPreviewSection />
      <TestimonialsSection />
      <ContactCtaSection />
    </>
  );
}
