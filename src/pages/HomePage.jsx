import VideoScrubHero from "../components/VideoScrubHero.jsx";
import PhotographySection from "../components/PhotographySection.jsx";
import FilmsSection from "../components/FilmsSection.jsx";
import ServicesSection from "../components/ServicesSection.jsx";
import PricingSection from "../components/PricingSection.jsx";
import AboutSection from "../components/AboutSection.jsx";
import ContactSection from "../components/ContactSection.jsx";

export default function HomePage() {
  return (
    <main id="top">
      <VideoScrubHero />
      <PhotographySection limitPerCategory={6} />
      <FilmsSection />
      <ServicesSection />
      <PricingSection />
      <AboutSection />
      <ContactSection />
    </main>
  );
}
