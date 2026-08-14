import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Always start at the top when changing pages.
 * Hash links (e.g. /#pricing) scroll to that section instead.
 * Uses Lenis when available for smooth route/hash jumps.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const lenis = typeof window !== "undefined" ? window.__lenis?.() : null;

    const scrollTop = (immediate = true) => {
      if (lenis) lenis.scrollTo(0, { immediate, force: true });
      else window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    const scrollToEl = (el) => {
      if (lenis) lenis.scrollTo(el, { offset: -16, duration: 1.15 });
      else el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    if (hash) {
      const id = hash.replace("#", "");
      const timer = window.setTimeout(() => {
        const el = document.getElementById(id);
        if (el) scrollToEl(el);
        else scrollTop(true);
      }, 40);
      return () => window.clearTimeout(timer);
    }

    scrollTop(true);
  }, [pathname, hash]);

  return null;
}
