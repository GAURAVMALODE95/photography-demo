import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { films } from "../data/site.js";
import Reveal from "../components/Reveal.jsx";

function VideoCard({ film, index }) {
  const videoRef = useRef(null);
  const wrapRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      className={`video-card${visible ? " is-visible" : ""}`}
      ref={wrapRef}
      style={{ "--delay": `${(index % 4) * 0.08}s` }}
    >
      <div className="video-card__frame">
        <video
          ref={videoRef}
          src={film.src}
          poster={film.poster}
          muted={muted}
          loop
          playsInline
          preload="metadata"
        />

        <button
          type="button"
          className="video-card__mute"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Unmute video" : "Mute video"}
        >
          {muted ? "🔇" : "🔊"}
        </button>

        <span className="video-card__corner video-card__corner--tl" />
        <span className="video-card__corner video-card__corner--br" />
      </div>

      <div className="video-card__meta">
        <h3>{film.title}</h3>
        {film.tag && <p>{film.tag}</p>}
      </div>
    </article>
  );
}

export default function AllVideosPage() {
  return (
    <main className="page" id="top">
      {/* Banner — video background */}
      <section className="gallery-banner">
        <video
          className="gallery-banner__video"
          src="/reel.mp4"
          poster="/images/videos-banner.jpg"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="gallery-banner__overlay" />
        <div className="gallery-banner__content">
          <p className="eyebrow eyebrow--light">Films</p>
          <h1>
            Our <em>Reels</em>
          </h1>
          <p className="gallery-banner__lede">
            Moving stories from weddings, pre-weddings, and celebrations —
            captured with the same quiet, timeless eye.
          </p>
        </div>
      </section>

      <Reveal as="div" delay={40}>
        {/* Back home */}
        <div className="page__bar">
          <Link to="/" className="page__back">
            ← Home
          </Link>
        </div>

        {/* Reel grid — 4 per row */}
        <section className="video-grid">
          {films.map((film, index) => (
            <VideoCard key={film.title} film={film} index={index} />
          ))}
        </section>
      </Reveal>
    </main>
  );
}