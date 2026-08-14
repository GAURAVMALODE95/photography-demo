import { useEffect, useRef } from "react";

function isMobileUx() {
  if (typeof window === "undefined") return true;
  return window.matchMedia(
    "(max-width: 979px), ((pointer: coarse) and (hover: none))"
  ).matches;
}

/**
 * Scroll reveal for sections below the hero.
 * Mobile: show instantly (no blur/lag). Desktop: soft fade-in.
 */
export default function Reveal({
  children,
  className = "",
  as: Tag = "div",
  delay = 0,
  once = true,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Instant paint on phones — delayed/blurred reveals feel like lag
    if (reduce || isMobileUx()) {
      el.classList.add("is-inview");
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add("is-inview");
        if (once) io.unobserve(el);
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -6% 0px",
      }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref}
      className={`reveal${className ? ` ${className}` : ""}`}
      style={{ "--reveal-delay": `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
