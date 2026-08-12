import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { films } from "../data/site.js";

function FilmCard({ film }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <article className="film-card">
      <button
        type="button"
        className="film-card__media"
        onClick={toggle}
      >
       <video
  ref={videoRef}
  src={film.src}
  poster={film.poster}
  autoPlay
  muted
  loop
  playsInline
  preload="metadata"
  style={{
    width: "100%",
    height: "100%",
    objectFit: "cover",
  }}
  onPlay={() => setPlaying(true)}
  onPause={() => setPlaying(false)}
  onLoadedData={() => console.log("Loaded:", film.src)}
  onCanPlay={() => console.log("Can Play:", film.src)}
  onError={(e) =>
    console.log("Video Error:", film.src, e.target.error)
  }
/>

        {!playing && (
          <span className="film-card__play">
            ▶
          </span>
        )}
      </button>

      <div className="film-card__meta">
        <h3>{film.title}</h3>
        <p>{film.meta}</p>
      </div>
    </article>
  );
}

export default function FilmsSection({
  showAllLink = true,
  limit,
}) {
  const list =
    typeof limit === "number"
      ? films.slice(0, limit)
      : films;

  return (
    <section className="section films" id="films">
      <div className="section__head">
        <p className="eyebrow">Films</p>

        <h2>
          Moving pictures, <em>quietly told</em>
        </h2>

        <p className="lede">
          Highlight films and soft cinematic edits — for the
          moments that need sound, breath, and time.
        </p>
      </div>

      <div className="films-grid">
        {list.map((film, index) => (
          <FilmCard
            key={`${film.title}-${index}`}
            film={film}
          />
        ))}
      </div>

      {showAllLink && (
        <div className="section__cta">
          <Link className="btn" to="/videos">
            All Videos
          </Link>
        </div>
      )}
    </section>
  );
}