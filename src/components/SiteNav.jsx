import { Link } from "react-router-dom";
import { studio, navLinks } from "../data/site.js";

export default function SiteNav() {
  return (
    <header className="site-nav">
      <Link className="site-nav__brand" to="/">
        {studio.name}
      </Link>

      <nav className="site-nav__links" aria-label="Primary">
        {navLinks.map((l) => (
          <a key={l.to} href={l.to}>
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
