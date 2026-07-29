import { Header } from "@/ui/components/landing/Header";
import { Hero } from "@/ui/components/landing/Hero";
import { HowItWorks } from "@/ui/components/landing/HowItWorks";
import { Benefits } from "@/ui/components/landing/Benefits";
import { PricingSection } from "@/ui/components/landing/PricingSection";
import { LiveDemo } from "@/ui/components/landing/LiveDemo";
import { TargetAudience } from "@/ui/components/landing/TargetAudience";
import { FinalCTA } from "@/ui/components/landing/FinalCTA";
import { Footer } from "@/ui/components/landing/Footer";
import { ChatWidget } from "@/ui/components/chat/ChatWidget";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Benefits />
        <LiveDemo />
        <TargetAudience />
        <PricingSection />
        <FinalCTA />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
