import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { servicesDetailed } from "../data/site.js";
import Reveal from "../components/Reveal.jsx";

function ServiceRow({ service, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const isReverse = index % 2 === 1;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={ref}
      className={`service-row${isReverse ? " service-row--reverse" : ""}${
        visible ? " is-visible" : ""
      }`}
    >
      <div className="service-row__media">
        <img src={service.image} alt={service.title} loading="lazy" />
        <span className="service-row__num">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="service-row__body">
        <p className="eyebrow">{service.tag}</p>
        <h2>{service.title}</h2>
        <p className="service-row__desc">{service.description}</p>

        {service.includes && (
          <ul className="service-row__list">
            {service.includes.map((item) => (
              <li key={item}>
                <span className="service-row__check">✓</span>
                {item}
              </li>
            ))}
          </ul>
        )}

        <a className="btn service-row__cta" href="#contact">
          Enquire about this
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}

export default function AllServicesPage() {
  return (
    <main className="page" id="top">
      {/* Banner */}
      <section className="services-banner">
        <img
          src="/images/services-banner.jpg"
          alt=""
          className="services-banner__img"
        />
        <div className="services-banner__overlay" />
        <div className="services-banner__content">
          <p className="eyebrow eyebrow--light">Services</p>
          <h1>
            Everything I <em>offer</em>
          </h1>
          <p className="services-banner__lede">
            From the first getting-ready frame to the album in your hands —
            a closer look at how each service is shaped around your day.
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

        {/* Vertical service cards */}
        <section className="service-list">
          {servicesDetailed.map((s, index) => (
            <ServiceRow key={s.title} service={s} index={index} />
          ))}
        </section>

        {/* Closing CTA */}
        <section className="services-cta">
          <h2>
            Not sure which fits <em>your day?</em>
          </h2>
          <p>Tell me the date and vibe — I'll suggest the right coverage.</p>
          <a className="btn" href="#contact">
            Let's talk
          </a>
        </section>
      </Reveal>
    </main>
  );
}