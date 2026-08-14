import { useEffect, useRef, useState } from "react";
import { ReactLenis } from "lenis/react";

/** Desktop wheel feel — kept stable; never remounted for mobile tweaks */
const LENIS_OPTIONS = {
  autoRaf: true,
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  syncTouch: false,
  syncTouchLerp: 0.1,
  touchInertiaExponent: 1.35,
  touchMultiplier: 1.6,
  wheelMultiplier: 0.95,
  anchors: {
    offset: -16,
    duration: 1.15,
  },
};

function useIsMobileScroll() {
  const [mobile, setMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 979px)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 979px)");
    const onChange = () => setMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return mobile;
}

/**
 * Site-wide smooth scrolling via Lenis.
 * Desktop: existing wheel feel (untouched).
 * Mobile: enables syncTouch for smoother finger scrolling.
 */
export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);
  const isMobile = useIsMobileScroll();

  useEffect(() => {
    const nativeScrollTo = window.scrollTo.bind(window);
    let applying = false;

    const bridgeScrollTo = (...args) => {
      if (applying) {
        nativeScrollTo(...args);
        return;
      }

      const lenis = lenisRef.current?.lenis;
      const first = args[0];

      const fromLenisApply =
        first &&
        typeof first === "object" &&
        (first.behavior === "instant" || first.behavior === "auto");

      if (!lenis || fromLenisApply) {
        nativeScrollTo(...args);
        return;
      }

      let top = 0;
      let immediate = true;

      if (typeof first === "number") {
        top = typeof args[1] === "number" ? args[1] : first;
      } else if (first && typeof first === "object") {
        top = Number(first.top ?? 0);
        immediate = first.behavior !== "smooth";
      }

      applying = true;
      try {
        lenis.scrollTo(top, {
          immediate,
          force: true,
          lock: false,
        });
      } finally {
        applying = false;
      }
    };

    window.scrollTo = bridgeScrollTo;
    window.__lenis = () => lenisRef.current?.lenis ?? null;

    return () => {
      window.scrollTo = nativeScrollTo;
      delete window.__lenis;
    };
  }, []);

  // Mobile-only: turn on touch smoothing. Desktop stays syncTouch: false.
  useEffect(() => {
    const apply = () => {
      const lenis = lenisRef.current?.lenis;
      if (!lenis) return false;
      if (isMobile) {
        lenis.options.syncTouch = true;
        lenis.options.syncTouchLerp = 0.1;
        lenis.options.touchInertiaExponent = 1.35;
        lenis.options.touchMultiplier = 1.2;
      } else {
        lenis.options.syncTouch = false;
        lenis.options.touchMultiplier = 1.6;
      }
      return true;
    };

    if (apply()) return undefined;
    const id = window.setInterval(() => {
      if (apply()) window.clearInterval(id);
    }, 50);
    return () => window.clearInterval(id);
  }, [isMobile]);

  return (
    <ReactLenis root ref={lenisRef} options={LENIS_OPTIONS}>
      {children}
    </ReactLenis>
  );
}
