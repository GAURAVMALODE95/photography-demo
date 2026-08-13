import { useEffect, useId, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { studio, navLinks } from "../data/site.js";

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const panelId = useId();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.documentElement.classList.add("nav-open");

    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("nav-open");
    };
  }, [open]);

  return (
    <header className={`site-nav${open ? " is-open" : ""}`}>
      <Link className="site-nav__brand" to="/" onClick={() => setOpen(false)}>
        {studio.name}
      </Link>

      <nav className="site-nav__links" aria-label="Primary">
        {navLinks.map((l) => (
          <Link key={l.to} to={l.to}>
            {l.label}
          </Link>
        ))}
      </nav>

      <button
        type="button"
        className="site-nav__toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="site-nav__toggle-line" />
        <span className="site-nav__toggle-line" />
        <span className="site-nav__toggle-line" />
      </button>

      <div
        className="site-nav__backdrop"
        aria-hidden={!open}
        onClick={() => setOpen(false)}
      />

      <aside
        id={panelId}
        className="site-nav__drawer"
        aria-hidden={!open}
        aria-label="Mobile menu"
      >
        <div className="site-nav__drawer-top">
          <p className="site-nav__drawer-brand">Menu</p>
          <button
            type="button"
            className="site-nav__drawer-close"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
        </div>

        <nav className="site-nav__drawer-links" aria-label="Mobile">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="site-nav__drawer-foot">
          <p>{studio.role}</p>
          <a href={`mailto:${studio.email}`}>{studio.email}</a>
        </div>
      </aside>
    </header>
  );
}
