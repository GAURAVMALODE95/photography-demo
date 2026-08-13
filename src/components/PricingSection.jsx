import { useState } from "react";
import { packages } from "../data/site.js";

const defaultSelected = Math.max(
  0,
  packages.findIndex((p) => p.featured)
);

export default function PricingSection() {
  const [selected, setSelected] = useState(
    defaultSelected === -1 ? 1 : defaultSelected
  );

  return (
    <section className="section pricing" id="pricing">
      <div className="section__head">
        <p className="eyebrow">Pricing</p>
        <h2>
          Packages with <em>room to breathe</em>
        </h2>
        <p className="lede">
          Starting points — every celebration is different. We'll shape
          coverage around your day, city, and guest list.
        </p>
      </div>

      <div className="price-grid" role="listbox" aria-label="Packages">
        {packages.map((p, index) => {
          const isSelected = selected === index;
          return (
            <article
              key={p.name}
              role="option"
              aria-selected={isSelected}
              tabIndex={0}
              className={`price-card${isSelected ? " is-selected" : ""}${p.featured ? " is-featured" : ""}`}
              style={{ "--delay": `${index * 0.1}s` }}
              onClick={() => setSelected(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected(index);
                }
              }}
            >
              {/* Hanging inverted bulb + soft light wash */}
              <div
                className={`price-card__lamp${isSelected ? " is-on" : ""}`}
                aria-hidden="true"
              >
                <span className="price-card__wire" />
                <span className="price-card__bulb material-symbols-outlined">
                  lightbulb_2
                </span>
                <span className="price-card__beam" />
              </div>

              {p.featured && (
                <span className="price-card__tag">Most booked</span>
              )}

              <p className="price-card__name">{p.name}</p>
              <p className="price-card__amount">{p.price}</p>
              <p className="price-card__note">{p.note}</p>

              <ul className="price-card__features">
                {p.features.map((f, i) => (
                  <li key={f} style={{ "--fi": i }}>
                    <span className="price-card__check" aria-hidden="true">
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                className="btn price-card__cta"
                href="#contact"
                onClick={(e) => e.stopPropagation()}
              >
                Enquire
                <span className="price-card__cta-arrow" aria-hidden="true">
                  →
                </span>
              </a>

              <div className="price-card__glow" aria-hidden="true" />
            </article>
          );
        })}
      </div>
    </section>
  );
}
