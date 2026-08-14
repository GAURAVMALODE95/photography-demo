import { useEffect, useRef, useState } from "react";

function canUseCustomCursor() {
  if (typeof window === "undefined") return false;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return false;

  // Touch / phone / tablet: never use the desktop focus cursor
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const noHover = window.matchMedia("(hover: none)").matches;
  if (coarse || noHover) return false;

  // Desktop-class pointer only
  return window.matchMedia("(pointer: fine)").matches;
}

/**
 * Editorial autofocus cursor — desktop only.
 * Disabled on touch / coarse pointers so menu taps never leave a stuck icon.
 */
export default function CustomCursor() {
  const tipRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (!canUseCustomCursor()) {
      document.documentElement.classList.remove("has-custom-cursor");
      return undefined;
    }

    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let raf = 0;
    let active = true;

    const teardown = () => {
      if (!active) return;
      active = false;
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-custom-cursor");
      setEnabled(false);
      setHidden(true);
    };

    const onMove = (e) => {
      // Ignore synthetic mouse events after touch
      if (e.sourceCapabilities?.firesTouchEvents) return;
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

    // If the user touches the screen, kill the custom cursor immediately
    const onTouch = () => teardown();

    const tick = () => {
      if (!active) return;
      if (tipRef.current) {
        tipRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);

    const mqCoarse = window.matchMedia("(pointer: coarse)");
    const mqHover = window.matchMedia("(hover: none)");
    const onMq = () => {
      if (!canUseCustomCursor()) teardown();
    };
    mqCoarse.addEventListener("change", onMq);
    mqHover.addEventListener("change", onMq);

    return () => {
      active = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("touchstart", onTouch);
      document.removeEventListener("mouseleave", onLeave);
      mqCoarse.removeEventListener("change", onMq);
      mqHover.removeEventListener("change", onMq);
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
          <path
            d="M4 14V4h10M36 14V4H26M4 26v10h10M36 26v10H26"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="square"
          />
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
