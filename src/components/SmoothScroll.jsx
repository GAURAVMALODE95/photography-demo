import { useEffect, useRef } from "react";
import { ReactLenis } from "lenis/react";

/**
 * Site-wide smooth scrolling via Lenis.
 * Bridges programmatic window.scrollTo (hero bounce) into Lenis,
 * but never intercepts Lenis's own apply calls — that deadlocks scroll.
 */
export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const nativeScrollTo = window.scrollTo.bind(window);
    let applying = false;

    const bridgeScrollTo = (...args) => {
      // Re-entrancy: Lenis setScroll → window.scrollTo → must stay native
      if (applying) {
        nativeScrollTo(...args);
        return;
      }

      const lenis = lenisRef.current?.lenis;
      const first = args[0];

      // Lenis RAF applies via scrollTo({ top, behavior: "instant" })
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

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: true,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        syncTouch: false,
        touchMultiplier: 1.6,
        wheelMultiplier: 0.95,
        anchors: {
          offset: -16,
          duration: 1.15,
        },
      }}
    >
      {children}
    </ReactLenis>
  );
}
