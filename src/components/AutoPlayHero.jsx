import { useEffect, useRef, useState } from "react";
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

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/**
 * Same hero UI — video autoplays at normal speed.
 * Chapter text cycles on its own slower, readable timer (4 lines).
 */
export default function AutoPlayHero({
  videoSrcDesktop = "/media/scrub.mp4",
  videoSrcMobile = "/media/scrub-mobile-cover.mp4",
  poster = "/media/posters/01.jpg",
}) {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const chapterRefs = useRef([]);

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= MOBILE_MAX : false
  );
  const [videoSrc, setVideoSrc] = useState(() =>
    pickSrc(videoSrcDesktop, videoSrcMobile)
  );

  useEffect(() => {
    const sync = () => {
      setIsMobile(window.innerWidth <= MOBILE_MAX);
      setVideoSrc(pickSrc(videoSrcDesktop, videoSrcMobile));
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [videoSrcDesktop, videoSrcMobile]);

  // Video: autoplay + loop (unchanged pace). Progress bar follows video only.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let raf = 0;
    let active = true;

    const tick = () => {
      if (!active) return;
      const duration = video.duration;
      if (Number.isFinite(duration) && duration > 0 && progressRef.current) {
        const p = Math.min(1, Math.max(0, video.currentTime / duration));
        progressRef.current.style.transform = `scaleX(${p})`;
      }
      raf = requestAnimationFrame(tick);
    };

    video.muted = true;
    video.playsInline = true;
    video.loop = true;
    video.preload = "auto";

    const play = () => {
      const p = video.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };

    play();
    raf = requestAnimationFrame(tick);

    const onVisibility = () => {
      if (document.hidden) video.pause();
      else play();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      active = false;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      video.pause();
    };
  }, [videoSrc]);

  // Text: slow readable cycle — independent of video speed
  useEffect(() => {
    const total = chapters.length;
    if (!total) return;

    let raf = 0;
    let active = true;
    const startedAt = performance.now();
    const cycleMs = CHAPTER_HOLD_MS * total;

    const paint = (index, opacity) => {
      chapterRefs.current.forEach((el, i) => {
        if (!el) return;
        const on = i === index ? opacity : 0;
        el.style.opacity = String(on);
        el.style.transform = `translate3d(0, ${(1 - on) * 14}px, 0)`;
      });
    };

    // Show first chapter immediately
    paint(0, 1);

    const tick = (now) => {
      if (!active) return;

      const elapsed = ((now - startedAt) % cycleMs + cycleMs) % cycleMs;
      const index = Math.min(total - 1, Math.floor(elapsed / CHAPTER_HOLD_MS));
      const local = elapsed - index * CHAPTER_HOLD_MS;

      let opacity = 1;
      // Fade in at start of each slide
      if (local < CHAPTER_FADE_MS) {
        opacity = easeInOut(local / CHAPTER_FADE_MS);
      }
      // Fade out near the end (except we crossfade into next via next slide's fade-in)
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
      className={`hero hero--auto${isMobile ? " hero--mobile" : ""}`}
      aria-label="Cinematic opening"
    >
      <div className="hero__sticky">
        <div className="hero__video-layer">
          <video
            key={videoSrc}
            ref={videoRef}
            className="hero__video"
            src={videoSrc}
            muted
            playsInline
            autoPlay
            loop
            preload="auto"
            poster={poster}
            disablePictureInPicture
            disableRemotePlayback
          />
        </div>

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

        <div className="hero__hint" aria-hidden="true">
          <div className="hero__hint-mouse">
            <span className="hero__hint-wheel" />
          </div>
          <div className="hero__hint-touch" />
          <span className="hero__hint-label">Explore</span>
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
