import HeroSection from "@/components/sections/HeroSection";
import DomesticAbuseDefinition from "@/components/sections/DomesticAbuseDefinition";
import AnimatedStats from "@/components/AnimatedStats";
import HopeSection from "@/components/sections/HopeSection";
import ServicesOverview from "@/components/sections/ServicesOverview";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import SupportResources from "@/components/sections/SupportResources";
import MapSection from "@/components/MapSection";
import CTASection from "@/components/sections/CTASection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <DomesticAbuseDefinition />
      <AnimatedStats />
      <HopeSection />
      <ServicesOverview />
      <TestimonialCarousel />
      <SupportResources />
      <MapSection />
      <CTASection />
    </>
  );
}
