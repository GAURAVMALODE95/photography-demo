import { useEffect, useId, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { studio, navLinks, socials } from "../data/site.js";

const primaryLinks = navLinks.filter((l) => l.label !== "Enquire");
const enquireLink =
  navLinks.find((l) => l.label === "Enquire") || {
    to: "/conatct",
    label: "Enquire",
  };

function isActive(link, pathname, hash) {
  if (link.to.startsWith("/#")) {
    return pathname === "/" && hash === link.to.slice(1);
  }
  if (link.to === "/") return pathname === "/";
  return pathname === link.to || pathname.startsWith(`${link.to}/`);
}

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const panelId = useId();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      setScrolled(y > 36);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <header
      className={`site-nav${open ? " is-open" : ""}${scrolled ? " is-scrolled" : ""}`}
    >
      <div className="site-nav__bar">
        <Link
          className="site-nav__brand"
          to="/"
          onClick={() => setOpen(false)}
        >
          <span className="site-nav__brand-name">{studio.name}</span>
          <span className="site-nav__brand-mark" aria-hidden="true" />
        </Link>

        <nav className="site-nav__links" aria-label="Primary">
          {primaryLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={
                isActive(l, location.pathname, location.hash) ? "is-active" : ""
              }
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="site-nav__actions">
          <Link className="site-nav__cta" to={enquireLink.to}>
            {enquireLink.label}
          </Link>

          <button
            type="button"
            className="site-nav__toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="site-nav__toggle-label">
              {open ? "Close" : "Menu"}
            </span>
            <span className="site-nav__toggle-icon" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      <div
        className="site-nav__backdrop"
        aria-hidden={!open}
        onClick={() => setOpen(false)}
      />

      <aside
        id={panelId}
        className="site-nav__drawer"
        aria-hidden={!open}
        aria-label="Menu"
      >
        <div className="site-nav__drawer-inner">
          <p className="site-nav__drawer-kicker">Explore</p>

          <nav className="site-nav__drawer-links" aria-label="Mobile">
            {primaryLinks.map((l, i) => (
              <Link
                key={l.to}
                to={l.to}
                className={
                  isActive(l, location.pathname, location.hash)
                    ? "is-active"
                    : ""
                }
                onClick={() => setOpen(false)}
                style={{ "--i": i }}
              >
                <span className="site-nav__drawer-index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="site-nav__drawer-label">{l.label}</span>
              </Link>
            ))}
          </nav>

          <div className="site-nav__drawer-foot">
            <Link
              className="site-nav__drawer-cta"
              to={enquireLink.to}
              onClick={() => setOpen(false)}
            >
              {enquireLink.label}
            </Link>
            <p className="site-nav__drawer-role">{studio.role}</p>
            <a
              className="site-nav__drawer-mail"
              href={`mailto:${studio.email}`}
            >
              {studio.email}
            </a>
            <div className="site-nav__drawer-socials">
              {socials.slice(0, 3).map((s) => (
                <a
                  key={s.id}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </header>
  );
}
