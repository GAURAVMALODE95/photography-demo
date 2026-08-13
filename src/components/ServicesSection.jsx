import { services } from "../data/site.js";

export default function ServicesSection() {
  return (
    <section className="section services" id="services">
      <div className="section__head">
        <p className="eyebrow">Services</p>
        <h2>
          What I <em>offer</em>
        </h2>
        <p className="lede">
          Clear offerings for the celebrations families book most — shaped
          gently around your day.
        </p>
      </div>

      <div className="services-grid services-grid--3">
        {services.map((s, index) => (
          <article
            key={s.title}
            className="service-card"
            style={{ "--delay": `${(index % 3) * 0.12}s` }}
          >
            <div className="service-card__border" aria-hidden="true" />

            <div className="service-card__inner">
              <span className="service-card__index">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="service-card__body">
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>

              <div className="service-card__glow" aria-hidden="true" />
            </div>
          </article>
        ))}
      </div>
      <div className="services-btn">
  <a href="/services" className="btn">
    Learn More
  </a>
</div>
    </section>
  );
}