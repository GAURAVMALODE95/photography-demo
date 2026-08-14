import { useEffect, useMemo, useRef, useState } from "react";
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

function useHorizontalSwipeLock(enabled) {
  const touchRef = useRef({
    x: 0,
    y: 0,
    axis: null,
    locked: false,
  });

  useEffect(() => {
    if (!enabled) return undefined;
    return () => {
      document.documentElement.classList.remove("photo-swipe-lock");
    };
  }, [enabled]);

  if (!enabled) return {};

  return {
    onTouchStart: (swiper, e) => {
      const touch = e.touches?.[0];
      if (!touch) return;
      touchRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        axis: null,
        locked: false,
      };
      swiper.allowTouchMove = true;
    },
    onTouchMove: (swiper, e) => {
      const touch = e.touches?.[0];
      if (!touch) return;
      const t = touchRef.current;
      const dx = touch.clientX - t.x;
      const dy = touch.clientY - t.y;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if (!t.axis && (absX > 6 || absY > 6)) {
        t.axis = absX > absY * 1.15 ? "x" : "y";
      }

      if (t.axis === "y") {
        swiper.allowTouchMove = false;
        if (t.locked) {
          document.documentElement.classList.remove("photo-swipe-lock");
          t.locked = false;
        }
        return;
      }

      if (t.axis === "x") {
        swiper.allowTouchMove = true;
        if (!t.locked) {
          document.documentElement.classList.add("photo-swipe-lock");
          t.locked = true;
        }
      }
    },
    onTouchEnd: (swiper) => {
      swiper.allowTouchMove = true;
      const t = touchRef.current;
      if (t.locked) {
        document.documentElement.classList.remove("photo-swipe-lock");
        t.locked = false;
      }
      t.axis = null;
    },
  };
}

export default function PhotographySection({
  showAllLink = true,
  initialCategory = "wedding",
  limitPerCategory,
}) {
  const [active, setActive] = useState(initialCategory);
  const isMobile = useIsMobileGallery(768);
  const swipeLock = useHorizontalSwipeLock(isMobile);

  const images = useMemo(() => {
    const list = gallery[active] || [];

    return typeof limitPerCategory === "number"
      ? list.slice(0, limitPerCategory)
      : list;
  }, [active, limitPerCategory]);

  const mobileSwiper = {
    modules: [Autoplay, Pagination, Navigation],
    slidesPerView: 1,
    spaceBetween: 12,
    centeredSlides: false,
    loop: images.length > 1,
    speed: 450,
    resistanceRatio: 0.55,
    threshold: 8,
    touchAngle: 35,
    touchStartPreventDefault: false,
    preventClicks: true,
    preventClicksPropagation: true,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
    },
    pagination: {
      clickable: true,
      dynamicBullets: true,
    },
    navigation: {
      prevEl: ".photo-swiper-nav--prev",
      nextEl: ".photo-swiper-nav--next",
    },
    ...swipeLock,
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
        {isMobile && (
          <>
            <button
              type="button"
              className="photo-swiper-nav photo-swiper-nav--prev"
              aria-label="Previous photo"
            >
              ‹
            </button>
            <button
              type="button"
              className="photo-swiper-nav photo-swiper-nav--next"
              aria-label="Next photo"
            >
              ›
            </button>
          </>
        )}

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
                  decoding="async"
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
