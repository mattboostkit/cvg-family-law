import HeroSection from "@/components/sections/HeroSection";
import TrustIndicators from "@/components/sections/TrustIndicators";
import HopeSection from "@/components/sections/HopeSection";
import ServicesOverview from "@/components/sections/ServicesOverview";
import Testimonials from "@/components/sections/Testimonials";
import CTASection from "@/components/sections/CTASection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustIndicators />
      <HopeSection />
      <ServicesOverview />
      <Testimonials />
      <CTASection />
    </>
  );
}
