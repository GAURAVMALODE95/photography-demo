import { useEffect, useRef, useState } from "react";

/**
 * Clean autofocus brackets — editorial photography cursor.
 * Scales on interactive hover. Disabled on touch devices.
 */
export default function CustomCursor() {
  const tipRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const noReduce = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || !noReduce) return;

    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let raf = 0;
    let active = true;

    const onMove = (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      setHidden(false);
    };

    const onLeave = () => setHidden(true);

    const onOver = (e) => {
      const el = e.target;
      if (!(el instanceof Element)) return;
      const interactive = el.closest(
        "a, button, [role='button'], input, textarea, select, label"
      );
      setHovering(Boolean(interactive));
    };

    const tick = () => {
      if (!active) return;
      if (tipRef.current) {
        tipRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      active = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      className={[
        "photo-cursor",
        hidden ? "is-hidden" : "",
        hovering ? "is-hover" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    >
      <div className="photo-cursor__focus" ref={tipRef}>
        <svg viewBox="0 0 40 40" width="36" height="36">
          {/* Autofocus corner brackets */}
          <path
            d="M4 14V4h10M36 14V4H26M4 26v10h10M36 26v10H26"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="square"
          />
          {/* Center focus point */}
          <circle cx="20" cy="20" r="1.6" fill="currentColor" />
          <circle
            cx="20"
            cy="20"
            r="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.4"
          />
        </svg>
      </div>
    </div>
  );
}
