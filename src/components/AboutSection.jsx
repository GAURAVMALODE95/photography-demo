import { studio } from "../data/site.js";

export default function AboutSection() {
  return (
    <section className="section about" id="about">
      <div className="about__grid">
        <div className="about__portrait">
          <img
            src={studio.portrait}
            alt={studio.photographer}
            loading="lazy"
          />
        </div>
        <div className="about__copy">
          <p className="eyebrow">About</p>
          <h2>
            {studio.photographer}
            <em> — behind the lens</em>
          </h2>
          <p className="about__role">{studio.role}</p>
          <p className="about__city">{studio.city}</p>
          {studio.about.map((para) => (
  <p key={para} className="lede">
    {para}
  </p>
))}

<a href="/about" className="about-btn">
  Know More
</a>
        </div>
      </div>
    </section>
  );
}
