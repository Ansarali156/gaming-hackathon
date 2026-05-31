import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { LogoScrollSection } from "@/components/sections/LogoScrollSection";
import { WelcomeSection } from "@/components/sections/WelcomeSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { TracksSection } from "@/components/sections/TracksSection";
import { WhyParticipateSection } from "@/components/sections/WhyParticipateSection";
import { PrizeSection } from "@/components/sections/PrizeSection";
import { TimelineSection } from "@/components/sections/TimelineSection";
import { SponsorsSection } from "@/components/sections/SponsorsSection";
import { FAQSection } from "@/components/sections/FAQSection";

export default function Home() {
  return (
    <div className="relative">
      <Header />
      <main>
        <HeroSection />
        <LogoScrollSection />
        <PrizeSection />
        <AboutSection />
        <TracksSection />
        <WhyParticipateSection />
        <TimelineSection />
        <WelcomeSection />
        <SponsorsSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
