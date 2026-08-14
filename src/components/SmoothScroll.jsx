import { useEffect, useRef, useState } from "react";
import { ReactLenis } from "lenis/react";

/** Desktop only — mobile uses native OS scroll (much better on phones) */
const DESKTOP_LENIS_OPTIONS = {
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
};

function usePreferNativeScroll() {
  const [native, setNative] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia(
      "(max-width: 979px), ((pointer: coarse) and (hover: none))"
    ).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(
      "(max-width: 979px), ((pointer: coarse) and (hover: none))"
    );
    const onChange = () => setNative(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return native;
}

/**
 * Desktop: Lenis smooth wheel scroll.
 * Mobile / touch: native scroll only — Lenis touch smoothing feels laggy.
 */
export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);
  const preferNative = usePreferNativeScroll();

  // Clean Lenis leftovers when switching to native (mobile)
  useEffect(() => {
    if (!preferNative) return undefined;
    const root = document.documentElement;
    root.classList.remove(
      "lenis",
      "lenis-smooth",
      "lenis-scrolling",
      "lenis-stopped",
      "lenis-smooth-touch"
    );
    delete window.__lenis;
    return undefined;
  }, [preferNative]);

  // Bridge window.scrollTo → Lenis only while desktop Lenis is active
  useEffect(() => {
    if (preferNative) return undefined;

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
  }, [preferNative]);

  if (preferNative) {
    return children;
  }

  return (
    <ReactLenis root ref={lenisRef} options={DESKTOP_LENIS_OPTIONS}>
      {children}
    </ReactLenis>
  );
}
