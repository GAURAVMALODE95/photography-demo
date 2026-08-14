import { Routes, Route } from "react-router-dom";
import CustomCursor from "./components/CustomCursor.jsx";
import SiteNav from "./components/SiteNav.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import SmoothScroll from "./components/SmoothScroll.jsx";
import Reveal from "./components/Reveal.jsx";
import HomePage from "./pages/HomePage.jsx";
import AllPhotosPage from "./pages/AllPhotosPage.jsx";
import AllVideosPage from "./pages/AllVideosPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import AllServicesPage from "./pages/AllServicesPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <SmoothScroll>
      <ScrollToTop />
      <CustomCursor />
      <SiteNav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/photos" element={<AllPhotosPage />} />
        <Route path="/videos" element={<AllVideosPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<AllServicesPage />} />
        <Route path="/conatct" element={<ContactPage />} />
      </Routes>
      <Reveal as="div" delay={40}>
        <Footer />
      </Reveal>
    </SmoothScroll>
  );
}
