import { useEffect, useRef, useState } from "react";
import { createVideoScrubHero } from "../lib/cinematic-parallax.js";
import { chapters } from "../data/content.jsx";

const MOBILE_MAX = 767;

function pickScrubSrc(desktopSrc, mobileSrc) {
  if (typeof window === "undefined") return desktopSrc;
  return window.innerWidth <= MOBILE_MAX ? mobileSrc : desktopSrc;
}

/**
 * Sticky scroll-scrubbed video hero with layered parallax copy.
 * Desktop: 1440p scrub · Mobile: 1080p scrub
 */
export default function VideoScrubHero({
  videoSrcDesktop = "/media/scrub.mp4",
  videoSrcMobile = "/media/scrub-mobile.mp4",
  poster = "/media/posters/01.jpg",
  smoothing = 0.16,
  videoScale = 0.14,
  copyShift = 70,
}) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const videoLayerRef = useRef(null);
  const copyRef = useRef(null);
  const progressRef = useRef(null);

  const [videoSrc, setVideoSrc] = useState(() =>
    pickScrubSrc(videoSrcDesktop, videoSrcMobile)
  );

  useEffect(() => {
    const sync = () => setVideoSrc(pickScrubSrc(videoSrcDesktop, videoSrcMobile));
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [videoSrcDesktop, videoSrcMobile]);

  useEffect(() => {
    if (!sectionRef.current || !videoRef.current) return;

    const instance = createVideoScrubHero({
      section: sectionRef.current,
      video: videoRef.current,
      videoLayer: videoLayerRef.current,
      copyLayer: copyRef.current,
      progressFill: progressRef.current,
      chapters: sectionRef.current.querySelectorAll("[data-chapter]"),
      smoothing,
      videoScale,
      copyShift,
    });

    return () => instance.destroy();
  }, [smoothing, videoScale, copyShift, videoSrc]);

  return (
    <section className="hero" ref={sectionRef} aria-label="Cinematic opening">
      <div className="hero__sticky">
        <div className="hero__video-layer" ref={videoLayerRef}>
          <video
            key={videoSrc}
            ref={videoRef}
            src={videoSrc}
            muted
            playsInline
            preload="auto"
            poster={poster}
          />
        </div>

        <div className="hero__veil" aria-hidden="true" />

        <div className="hero__copy" ref={copyRef}>
          {chapters.map((ch, i) => {
            const Tag = ch.as || "h2";
            return (
              <div
                key={i}
                className="chapter"
                data-chapter
                data-from={ch.from}
                data-to={ch.to}
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
          <span className="hero__hint-label">Explore</span>
          <svg
            className="hero__hint-chevrons"
            width="20"
            height="28"
            viewBox="0 0 20 28"
            fill="none"
            aria-hidden="true"
          >
            <path d="M3 8l7 6 7-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 15l7 6 7-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
          </svg>
        </div>
      </div>
    </section>
  );
}
