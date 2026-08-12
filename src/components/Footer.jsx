import { Link } from "react-router-dom";

const quickLinks = [
  { label: "Photography", to: "/#photography" },
  { label: "Films", to: "/films" },
  { label: "Services", to: "/services" },
  { label: "Pricing", to: "/#pricing" },
  { label: "About", to: "/about" },
];

const socials = [
  { label: "Instagram", href: "https://instagram.com", icon: "IG" },
  { label: "Pinterest", href: "https://pinterest.com", icon: "PIN" },
  { label: "YouTube", href: "https://youtube.com", icon: "YT" },
  { label: "WhatsApp", href: "https://wa.me/910000000000", icon: "WA" },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__glow" aria-hidden="true" />

      <div className="site-footer__top">
        {/* Brand */}
        <div className="site-footer__brand">
          <Link to="/" className="site-footer__logo">
            Your Studio
          </Link>

          <p className="site-footer__tagline">
            Wedding &amp; Lifestyle Photography — Nashik, India.
            Traveling for stories worth keeping.
          </p>

          <div className="site-footer__socials">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="site-footer__social"
                aria-label={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Explore */}
        <div className="site-footer__col">
          <p className="site-footer__heading">Explore</p>
          <ul>
            {quickLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.to}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="site-footer__col">
          <p className="site-footer__heading">Contact</p>
          <ul className="site-footer__contact">
            <li>
              <a href="mailto:hello@yourstudio.com">
                hello@yourstudio.com
              </a>
            </li>
            <li>
              <a href="tel:+910000000000">
                +91 00000 00000
              </a>
            </li>
            <li>Nashik, Maharashtra, India</li>
          </ul>
        </div>

        {/* CTA */}
        <div className="site-footer__col">
          <p className="site-footer__heading">Let's Talk</p>

          <p className="site-footer__cta-text">
            Currently booking weddings &amp; shoots across India.
          </p>

          <Link to="/#contact" className="btn site-footer__cta">
            Enquire Now <span>→</span>
          </Link>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>
          © {new Date().getFullYear()} Your Studio. All rights reserved.
        </p>

        <p className="site-footer__credit">
          Crafted with care, one frame at a time.
        </p>
      </div>
    </footer>
  );
}