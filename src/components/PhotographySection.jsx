import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { categories, gallery } from "../data/site.js";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function useIsMobileGallery(breakpoint = 768) {
  const [mobile, setMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= breakpoint;
  });

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const onChange = () => setMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [breakpoint]);

  return mobile;
}

export default function PhotographySection({
  showAllLink = true,
  initialCategory = "wedding",
  limitPerCategory,
}) {
  const [active, setActive] = useState(initialCategory);
  const isMobile = useIsMobileGallery(768);

  const images = useMemo(() => {
    const list = gallery[active] || [];

    return typeof limitPerCategory === "number"
      ? list.slice(0, limitPerCategory)
      : list;
  }, [active, limitPerCategory]);

  const mobileSwiper = {
    modules: [Autoplay, Pagination],
    slidesPerView: 1,
    spaceBetween: 14,
    centeredSlides: true,
    loop: images.length > 1,
    speed: 650,
    grabCursor: true,
    resistanceRatio: 0.65,
    // Let vertical page scroll pass through; only claim clear horizontal swipes
    touchAngle: 28,
    threshold: 12,
    touchStartPreventDefault: false,
    touchMoveStopPropagation: false,
    preventInteractionOnTransition: false,
    autoplay: {
      delay: 3200,
      disableOnInteraction: false,
      pauseOnMouseEnter: false,
      stopOnLastSlide: false,
    },
    pagination: {
      clickable: true,
      dynamicBullets: true,
    },
  };

  const desktopSwiper = {
    modules: [Autoplay, Navigation],
    navigation: true,
    loop: images.length > 4,
    speed: 5000,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
      reverseDirection: false,
    },
    spaceBetween: 20,
    breakpoints: {
      769: { slidesPerView: 2 },
      1024: { slidesPerView: 4 },
    },
  };

  const swiperProps = isMobile ? mobileSwiper : desktopSwiper;

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

      <div
        className={`photo-swiper-wrap${isMobile ? " photo-swiper-wrap--mobile" : " photo-swiper-wrap--desktop"}`}
      >
        <Swiper
          key={`${active}-${isMobile ? "m" : "d"}-${images.length}`}
          className="photo-swiper"
          {...swiperProps}
        >
          {images.map((img, index) => (
            <SwiperSlide key={`${active}-${index}`}>
              <Link to="/photos" className="photo-swiper__link">
                <img
                  src={img}
                  alt={`Photo ${index + 1}`}
                  className="photo-slider-image"
                  loading="lazy"
                  draggable={false}
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

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
