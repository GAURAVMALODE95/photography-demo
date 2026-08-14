import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { chapters } from "../data/content.jsx";

const MOBILE_MAX = 900;
/** How long each line stays on screen (readable pace) */
const CHAPTER_HOLD_MS = 4200;
/** Soft crossfade between lines */
const CHAPTER_FADE_MS = 700;

function pickSrc(desktopSrc, mobileSrc) {
  if (typeof window === "undefined") return desktopSrc;
  return window.innerWidth <= MOBILE_MAX ? mobileSrc : desktopSrc;
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const easeInOut = easeInOutCubic;

/** Gentle page bounce: peek content below, then spring back */
function bounceScreen({ peakPx = 120, onDone } = {}) {
  if (typeof window === "undefined") return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    onDone?.();
    return () => {};
  }

  let cancelled = false;
  let raf = 0;
  const startY = window.scrollY || window.pageYOffset || 0;
  const peak = Math.min(peakPx, Math.round(window.innerHeight * 0.16));

  const animate = (from, to, duration, ease) =>
    new Promise((resolve) => {
      const t0 = performance.now();
      const step = (now) => {
        if (cancelled) {
          resolve();
          return;
        }
        const t = Math.min(1, (now - t0) / duration);
        window.scrollTo({ top: from + (to - from) * ease(t), left: 0 });
        if (t < 1) raf = requestAnimationFrame(step);
        else resolve();
      };
      raf = requestAnimationFrame(step);
    });

  (async () => {
    await animate(startY, startY + peak, 480, easeOutCubic);
    if (cancelled) return;
    await animate(startY + peak, startY, 620, easeInOutCubic);
    if (cancelled) return;
    // Softer second dip so the clue is unmistakable
    await animate(startY, startY + peak * 0.45, 340, easeOutCubic);
    if (cancelled) return;
    await animate(startY + peak * 0.45, startY, 480, easeInOutCubic);
    if (!cancelled) onDone?.();
  })();

  return () => {
    cancelled = true;
    cancelAnimationFrame(raf);
  };
}

/**
 * Reuse the boot <video id="hero-early-video"> so we never download twice.
 */
function adoptEarlyVideo(host) {
  if (typeof document === "undefined" || !host) return null;
  const early =
    window.__HERO_EARLY_VIDEO || document.getElementById("hero-early-video");
  if (!early || !(early instanceof HTMLVideoElement)) return null;

  early.className = "hero__video";
  early.removeAttribute("id");
  host.appendChild(early);
  document.documentElement.classList.add("hero-adopted");
  window.__HERO_EARLY_VIDEO = early;
  const bootCopy = document.getElementById("hero-early-copy");
  if (bootCopy) bootCopy.remove();
  return early;
}

/**
 * Same hero UI — video autoplays at normal speed.
 * Boot video from index.html is adopted (already loading / playing).
 */
export default function AutoPlayHero({
  videoSrcDesktop = "/media/scrub.mp4",
  videoSrcMobile = "/media/scrub-mobile-auto.mp4",
  poster = "/media/posters/01.jpg",
}) {
  const hostRef = useRef(null);
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const chapterRefs = useRef([]);
  const adoptedRef = useRef(false);

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= MOBILE_MAX : false
  );
  const [ready, setReady] = useState(() => {
    if (typeof window === "undefined") return false;
    const v =
      window.__HERO_EARLY_VIDEO || document.getElementById("hero-early-video");
    return !!(v && v.readyState >= 2);
  });
  const [nudgeScroll, setNudgeScroll] = useState(false);
  const nudgeFiredRef = useRef(false);
  const bouncingRef = useRef(false);
  const cancelBounceRef = useRef(null);

  // Adopt early video before paint so React never covers it with a blank hero
  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host || adoptedRef.current) return;

    const expected = pickSrc(videoSrcDesktop, videoSrcMobile);
    let video = adoptEarlyVideo(host);

    if (!video) {
      video = document.createElement("video");
      video.className = "hero__video";
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
      video.autoplay = true;
      video.loop = true;
      video.preload = "auto";
      video.poster = poster;
      video.setAttribute("disablePictureInPicture", "");
      video.src = expected;
      host.appendChild(video);
      try {
        video.load();
      } catch {
        /* ignore */
      }
    }

    videoRef.current = video;
    adoptedRef.current = true;
    setIsMobile(window.innerWidth <= MOBILE_MAX);
  }, [videoSrcDesktop, videoSrcMobile, poster]);

  // Breakpoint resize — swap source only if needed
  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth <= MOBILE_MAX);
      const video = videoRef.current;
      if (!video) return;
      const next = pickSrc(videoSrcDesktop, videoSrcMobile);
      const current = video.getAttribute("src") || video.currentSrc || "";
      if (current.includes(next) || current.endsWith(next)) return;
      video.src = next;
      window.__HERO_VIDEO_HREF = next;
      try {
        video.load();
      } catch {
        /* ignore */
      }
      video.play()?.catch(() => {});
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [videoSrcDesktop, videoSrcMobile]);

  // Playback + progress
  useEffect(() => {
    let raf = 0;
    let active = true;
    let started = false;
    let tries = 0;

    const attach = () => {
      const video = videoRef.current;
      if (!video) {
        if (tries++ < 40) raf = requestAnimationFrame(attach);
        return;
      }

      setReady(false);

      const tick = () => {
        if (!active) return;
        const duration = video.duration;
        if (Number.isFinite(duration) && duration > 0 && progressRef.current) {
          const p = Math.min(1, Math.max(0, video.currentTime / duration));
          progressRef.current.style.transform = `scaleX(${p})`;

          // First loop nearly done + still on hero → bounce the page as a scroll clue
          if (!nudgeFiredRef.current && p >= 0.92 && window.scrollY < 48) {
            nudgeFiredRef.current = true;
            setNudgeScroll(true);
            bouncingRef.current = true;
            cancelBounceRef.current?.();
            cancelBounceRef.current = bounceScreen({
              peakPx: isMobile ? 100 : 130,
              onDone: () => {
                bouncingRef.current = false;
              },
            });
          }
        }
        raf = requestAnimationFrame(tick);
      };

      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.loop = true;
      video.preload = "auto";

      const play = () => {
        const p = video.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      };

      const hasEnoughBuffer = () => {
        const duration = video.duration;
        if (!Number.isFinite(duration) || duration <= 0) return false;
        if (video.readyState >= 3) return true;
        try {
          for (let i = 0; i < video.buffered.length; i++) {
            if (
              video.buffered.start(i) <= 0.15 &&
              video.buffered.end(i) >= duration * 0.6
            ) {
              return true;
            }
          }
        } catch {
          /* ignore */
        }
        return false;
      };

      const tryStart = () => {
        if (!active || started) return;
        if (!hasEnoughBuffer() && video.readyState < 2) return;
        started = true;
        setReady(true);
        play();
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(tick);
      };

      const onProgress = () => tryStart();
      const onCanPlay = () => tryStart();
      const onLoadedData = () => tryStart();

      video.addEventListener("progress", onProgress);
      video.addEventListener("canplay", onCanPlay);
      video.addEventListener("loadeddata", onLoadedData);

      // Already playing from boot?
      if (!video.paused && video.readyState >= 2) {
        started = true;
        setReady(true);
        raf = requestAnimationFrame(tick);
      } else {
        tryStart();
      }

      const fallback = window.setTimeout(() => {
        if (!active || started) return;
        started = true;
        setReady(true);
        play();
        raf = requestAnimationFrame(tick);
      }, 2500);

      const onVisibility = () => {
        if (document.hidden) video.pause();
        else if (started) play();
      };
      document.addEventListener("visibilitychange", onVisibility);

      return () => {
        window.clearTimeout(fallback);
        video.removeEventListener("progress", onProgress);
        video.removeEventListener("canplay", onCanPlay);
        video.removeEventListener("loadeddata", onLoadedData);
        document.removeEventListener("visibilitychange", onVisibility);
      };
    };

    const cleanupAttach = attach();

    return () => {
      active = false;
      cancelAnimationFrame(raf);
      cancelBounceRef.current?.();
      bouncingRef.current = false;
      if (typeof cleanupAttach === "function") cleanupAttach();
    };
  }, [isMobile]);

  // User scroll/touch cancels auto-bounce; real scroll clears the cue label
  useEffect(() => {
    const stopBounce = () => {
      if (!bouncingRef.current) return;
      cancelBounceRef.current?.();
      bouncingRef.current = false;
    };

    const onScroll = () => {
      if (bouncingRef.current) return; // ignore programmatic bounce scroll
      if (window.scrollY < 48) return;
      setNudgeScroll(false);
      nudgeFiredRef.current = true;
      stopBounce();
    };

    const onUserIntent = () => {
      stopBounce();
      if (window.scrollY >= 48) {
        setNudgeScroll(false);
        nudgeFiredRef.current = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onUserIntent, { passive: true });
    window.addEventListener("touchstart", onUserIntent, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onUserIntent);
      window.removeEventListener("touchstart", onUserIntent);
    };
  }, []);

  // Text cycle — starts fully visible with the video (no delayed fade-in)
  useEffect(() => {
    const total = chapters.length;
    if (!total) return;

    let raf = 0;
    let active = true;
    // Skip opening fade so first line is on screen with the video immediately
    const startedAt = performance.now() - CHAPTER_FADE_MS;
    const cycleMs = CHAPTER_HOLD_MS * total;

    const paint = (index, opacity) => {
      chapterRefs.current.forEach((el, i) => {
        if (!el) return;
        const on = i === index ? opacity : 0;
        el.style.opacity = String(on);
        el.style.transform = `translate3d(0, ${(1 - on) * 14}px, 0)`;
      });
    };

    paint(0, 1);

    const tick = (now) => {
      if (!active) return;

      const elapsed = ((now - startedAt) % cycleMs + cycleMs) % cycleMs;
      const index = Math.min(total - 1, Math.floor(elapsed / CHAPTER_HOLD_MS));
      const local = elapsed - index * CHAPTER_HOLD_MS;

      let opacity = 1;
      if (local < CHAPTER_FADE_MS) {
        opacity = easeInOut(local / CHAPTER_FADE_MS);
      }
      const fadeOutStart = CHAPTER_HOLD_MS - CHAPTER_FADE_MS;
      if (local > fadeOutStart) {
        opacity = easeInOut(1 - (local - fadeOutStart) / CHAPTER_FADE_MS);
      }

      paint(index, opacity);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      active = false;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      className={`hero hero--auto${isMobile ? " hero--mobile" : ""}${ready ? " is-ready" : ""}${nudgeScroll ? " is-nudge" : ""}`}
      aria-label="Cinematic opening"
    >
      <div className="hero__sticky">
        <div className="hero__video-layer" ref={hostRef} />

        <div className="hero__veil" aria-hidden="true" />

        <div className="hero__copy">
          {chapters.map((ch, i) => {
            const Tag = ch.as || "h2";
            return (
              <div
                key={i}
                className="chapter"
                ref={(el) => {
                  chapterRefs.current[i] = el;
                }}
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                <div>
                  <Tag>{ch.title}</Tag>
                  <p>{ch.body}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="hero__progress" aria-hidden="true">
          <span className="hero__progress-fill" ref={progressRef} />
        </div>

        <div
          className={`hero__hint${nudgeScroll ? " is-nudge" : ""}`}
          aria-hidden="true"
        >
          <div className="hero__hint-mouse">
            <span className="hero__hint-wheel" />
          </div>
          <div className="hero__hint-touch" />
          <span className="hero__hint-label">
            {nudgeScroll
              ? isMobile
                ? "Swipe up"
                : "Scroll to explore"
              : "Explore"}
          </span>
          <svg
            className="hero__hint-chevrons"
            width="20"
            height="28"
            viewBox="0 0 20 28"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 8l7 6 7-6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 15l7 6 7-6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.55"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
