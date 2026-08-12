import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { categories, gallery } from "../data/site.js";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

export default function PhotographySection({
  showAllLink = true,
  initialCategory = "wedding",
  limitPerCategory,
}) {
  const [active, setActive] = useState(initialCategory);

  const images = useMemo(() => {
    const list = gallery[active] || [];

    return typeof limitPerCategory === "number"
      ? list.slice(0, limitPerCategory)
      : list;
  }, [active, limitPerCategory]);

  return (
    <section className="section photography pb-0" id="photography">
      <div className="section__head">
        <p className="eyebrow">Photography</p>

        <h2>
          Stories across <em>every season</em>
        </h2>

        <p className="lede">
          Weddings, maternity, birthdays, family — each frame made for Indian
          celebrations, soft light, and real emotion.
        </p>
      </div>

      <div
        className="photo-filters"
        role="tablist"
        aria-label="Gallery categories"
      >
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={active === c.id}
            className={active === c.id ? "is-active" : ""}
            onClick={() => setActive(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <p className="photo-filters__blurb">
        {categories.find((c) => c.id === active)?.blurb}
      </p>

      {/* First Row */}
      <Swiper
        modules={[Autoplay, Navigation]}
        navigation
        loop={true}
        speed={5000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          reverseDirection: false,
        }}
        spaceBetween={20}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <Link to="/photos">
              <img
                src={img}
                alt={`Photo ${index + 1}`}
                className="photo-slider-image"
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

            {/* Second Row */}
      {/* <Swiper
        modules={[Autoplay, Navigation]}
        navigation
        loop={true}
        speed={5000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          reverseDirection: true,
        }}
        spaceBetween={20}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
      >
        {images.map((img, index) => (
          <SwiperSlide key={`second-${index}`}>
            <Link to="/photos">
              <img
                src={img}
                alt={`Photo ${index + 1}`}
                className="photo-slider-image"
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper> */}

      {showAllLink && (
        <div className="section__cta">
          <Link className="btn" to="/photos">
            All Photos
          </Link>
        </div>
      )}
    </section>
  );
}