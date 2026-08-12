import { useEffect, useRef, useState } from "react";

const stats = [
  { label: "Weddings shot", value: 180, suffix: "+" },
  { label: "Cities travelled", value: 24, suffix: "" },
  { label: "Years behind the lens", value: 9, suffix: "" },
  { label: "Happy families", value: 500, suffix: "+" },
];

const values = [
  {
    title: "Unscripted moments",
    body: "I don't direct — I wait. The best frames happen when no one's posing for the camera.",
  },
  {
    title: "Light first",
    body: "Every shoot is planned around when and where the light is softest, warmest, most honest.",
  },
  {
    title: "Quiet presence",
    body: "You should remember your day, not the photographer chasing you through it.",
  },
];

/* Reusable scroll-reveal hook — re-triggers every time the element
   enters/leaves the viewport (does NOT disconnect after first hit) */
function useReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

/* Small wrapper so we don't repeat the ref/class boilerplate everywhere */
function Reveal({ as: Tag = "div", className = "", style, children, ...rest }) {
  const [ref, visible] = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal${visible ? " is-visible" : ""} ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </Tag>
  );
}

function useCountUp(target, start) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) {
      setValue(0); // reset so it counts up again next time it scrolls into view
      return;
    }
    let frame;
    const duration = 1400;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, target]);

  return value;
}

function StatItem({ stat }) {
  const [ref, visible] = useReveal(0.4);
  const count = useCountUp(stat.value, visible);

  return (
    <div className={`about-stat reveal${visible ? " is-visible" : ""}`} ref={ref}>
      <p className="about-stat__num">
        {count}
        {stat.suffix}
      </p>
      <p className="about-stat__label">{stat.label}</p>
    </div>
  );
}

export default function AboutPage() {
  return (
    <main className="about-page">
      {/* Banner */}
      <section className="about-banner">
        <img
          src="/images/about-banner.webp"
          alt=""
          className="about-banner__img"
        />
        <div className="about-banner__overlay" />
        <div className="about-banner__content">
          <p className="eyebrow eyebrow--light">About</p>
          <h1>
            Stories told in <em>light and time</em>
          </h1>
        </div>
      </section>

      {/* Portrait + bio */}
      <section className="about-intro">
        <Reveal className="about-intro__media">
          <div className="about-intro__frame">
            <img src="/images/gaurav.jpg" alt="Gaurav Taneja" />
            <span className="about-intro__corner about-intro__corner--tl" />
            <span className="about-intro__corner about-intro__corner--br" />
          </div>
        </Reveal>

        <Reveal className="about-intro__body" style={{ "--delay": "0.15s" }}>
          <p className="eyebrow">About</p>
          <h2>
            Gaurav Taneja
            <br />
            <em>— behind the lens</em>
          </h2>
          <p className="about-intro__role">
            Wedding &amp; Lifestyle Photographer
          </p>
          <p className="about-intro__loc">Nashik · India</p>

          <p>
            I photograph the in-between — the quiet before the varmala, the
            laugh after the cake, the way light finds a mother's hands.
          </p>
          <p>
            Based in Nashik, I travel across India for weddings, maternity,
            birthdays, and the everyday love that lives between celebrations.
          </p>
        </Reveal>
      </section>

      {/* Stats */}
      <section className="about-stats">
        {stats.map((s) => (
          <StatItem key={s.label} stat={s} />
        ))}
      </section>

      {/* Mission & Vision */}
      <section className="about-mv">
        <Reveal className="about-mv__card">
          <span className="about-mv__index">Mission</span>
          <h3>Why I pick up the camera</h3>
          <p>
            To make families feel so at ease that they forget I'm there —
            and to hand back a set of photographs that feel like memory,
            not performance. Every wedding, every birthday, every quiet
            afternoon deserves to be kept exactly as it felt.
          </p>
        </Reveal>

        <div className="about-mv__divider" aria-hidden="true" />

        <Reveal className="about-mv__card" style={{ "--delay": "0.15s" }}>
          <span className="about-mv__index">Vision</span>
          <h3>Where this is headed</h3>
          <p>
            To become the photographer Indian families call first — known
            not just for beautiful frames, but for showing up with warmth,
            discretion, and an eye that finds joy in the smallest gestures,
            city after city, generation after generation.
          </p>
        </Reveal>
      </section>

      {/* Values */}
      <section className="about-values">
        <Reveal className="section__head">
          <p className="eyebrow">Philosophy</p>
          <h2>
            How I <em>work</em>
          </h2>
        </Reveal>

        <div className="about-values__grid">
          {values.map((v, index) => (
            <Reveal
              key={v.title}
              as="article"
              className="about-value"
              style={{ "--delay": `${index * 0.12}s` }}
            >
              <span className="about-value__num">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{v.title}</h3>
              <p>{v.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <Reveal as="section" className="about-cta">
        <h2>
          Let's tell <em>your story</em>
        </h2>
        <p>Currently booking weddings and shoots across India.</p>
        <a className="btn" href="#contact">
          Enquire now
        </a>
      </Reveal>
    </main>
  );
}