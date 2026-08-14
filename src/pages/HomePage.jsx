import AutoPlayHero from "../components/AutoPlayHero.jsx";
import Reveal from "../components/Reveal.jsx";
import PhotographySection from "../components/PhotographySection.jsx";
import FilmsSection from "../components/FilmsSection.jsx";
import ServicesSection from "../components/ServicesSection.jsx";
import PricingSection from "../components/PricingSection.jsx";
import AboutSection from "../components/AboutSection.jsx";
import ContactSection from "../components/ContactSection.jsx";

export default function HomePage() {
  return (
    <main id="top">
      {/* Hero stays untouched — no Lenis reveal wrappers here */}
      <AutoPlayHero />

      <Reveal as="div" delay={0}>
        <PhotographySection limitPerCategory={6} />
      </Reveal>
      <Reveal as="div" delay={60}>
        <FilmsSection />
      </Reveal>
      <Reveal as="div" delay={60}>
        <ServicesSection />
      </Reveal>
      <Reveal as="div" delay={60}>
        <PricingSection />
      </Reveal>
      <Reveal as="div" delay={60}>
        <AboutSection />
      </Reveal>
      <Reveal as="div" delay={60}>
        <ContactSection />
      </Reveal>
    </main>
  );
}
