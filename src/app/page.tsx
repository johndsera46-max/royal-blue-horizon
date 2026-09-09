import Hero from "@/components/Hero";
import OperationsTicker from "@/components/OperationsTicker";
import ServicesSection from "@/components/ServicesSection";
import NetworkSection from "@/components/NetworkSection";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <OperationsTicker />
      <ServicesSection />
      <NetworkSection />
      <Testimonials />
      <CTASection />
    </>
  );
}
