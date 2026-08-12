/**
 * Cinematic scroll parallax
 * 1) Sticky hero: scrub a real <video> via currentTime (smooth — not JPEG frames)
 * 2) Multi-layer parallax: video / vignette / copy move at different rates
 * 3) Moment clips: short videos play + parallax when they enter view
 */

/**
 * @param {HTMLElement} section
 * @returns {number} 0–1
 */
export function sectionProgress(section) {
  const rect = section.getBoundingClientRect();
  const range = rect.height - window.innerHeight;
  if (range <= 0) return 0;
  return Math.min(1, Math.max(0, -rect.top / range));
}

/**
 * Smooth exponential approach (frame-rate independent-ish).
 * @param {number} current
 * @param {number} target
 * @param {number} factor 0–1
 */
function lerp(current, target, factor) {
  return current + (target - current) * factor;
}

/**
 * Hero: scroll-linked video scrub + layered parallax transforms.
 *
 * @param {Object} opts
 * @param {string|HTMLElement} opts.section
 * @param {string|HTMLElement} opts.video
 * @param {string|HTMLElement} [opts.videoLayer]
 * @param {string|HTMLElement} [opts.copyLayer]
 * @param {NodeList|HTMLElement[]} [opts.chapters] - elements with data-from / data-to (0–1)
 * @param {string|HTMLElement} [opts.progressFill]
 * @param {number} [opts.smoothing=0.14]
 * @param {number} [opts.videoScale=0.12] - how much video scales up over the scrub (parallax depth)
 * @param {number} [opts.copyShift=80] - px copy moves opposite to scroll
 */
export function createVideoScrubHero(opts) {
  const section = typeof opts.section === "string" ? document.querySelector(opts.section) : opts.section;
  const video = /** @type {HTMLVideoElement} */ (
    typeof opts.video === "string" ? document.querySelector(opts.video) : opts.video
  );
  const videoLayer =
    typeof opts.videoLayer === "string" ? document.querySelector(opts.videoLayer) : opts.videoLayer;
  const copyLayer =
    typeof opts.copyLayer === "string" ? document.querySelector(opts.copyLayer) : opts.copyLayer;
  const progressFill =
    typeof opts.progressFill === "string" ? document.querySelector(opts.progressFill) : opts.progressFill;
  const chapters = opts.chapters
    ? Array.from(opts.chapters)
    : Array.from(section?.querySelectorAll("[data-chapter]") ?? []);

  const smoothing = opts.smoothing ?? 0.14;
  const videoScale = opts.videoScale ?? 0.12;
  const copyShift = opts.copyShift ?? 80;

  if (!section || !video) throw new Error("[cinematic] section + video required");

  let target = 0;
  let smooth = 0;
  let active = false;
  let ticking = false;
  let raf = 0;
  let ready = false;
  let destroyed = false;
  let lastApplied = -1;
  let seeking = false;
  /** @type {number|null} */
  let pendingSeek = null;

  function flushSeek(t) {
    pendingSeek = t;
    if (seeking) return;
    const cur = video.currentTime;
    if (Math.abs(cur - t) < 0.008) {
      pendingSeek = null;
      return;
    }
    seeking = true;
    try {
      video.currentTime = t;
    } catch {
      seeking = false;
    }
  }

  function onSeeked() {
    seeking = false;
    if (pendingSeek == null) return;
    const next = pendingSeek;
    pendingSeek = null;
    flushSeek(next);
  }

  video.addEventListener("seeked", onSeeked);

  function setChapterVisibility(p) {
    chapters.forEach((el) => {
      const from = Number(el.dataset.from ?? 0);
      const to = Number(el.dataset.to ?? 1);
      let opacity = 0;

      if (p >= from && p <= to) {
        const span = Math.max(0.0001, to - from);
        // Soft crossfade at edges — but NOT at scroll start (from=0) or end (to≈1),
        // so the first frame already shows the opening line.
        const fade = Math.min(0.07, span / 2);
        const fadeIn = from <= 0 ? 0 : fade;
        const fadeOut = to >= 0.99 ? 0 : fade;

        opacity = 1;
        if (fadeIn > 0 && p < from + fadeIn) {
          opacity = (p - from) / fadeIn;
        }
        if (fadeOut > 0 && p > to - fadeOut) {
          opacity = Math.min(opacity, (to - p) / fadeOut);
        }
      }

      el.style.opacity = String(Math.max(0, Math.min(1, opacity)));
      el.style.transform = `translate3d(0, ${(1 - opacity) * 18}px, 0)`;
    });
  }

  function apply(p) {
    if (!ready) return;
    const duration = video.duration;
    if (!Number.isFinite(duration) || duration <= 0) return;

    // Scrub real video — butter-smooth vs JPEG frame sequence
    const t = p * Math.max(0, duration - 0.04);
    if (Math.abs(t - lastApplied) > 0.004) {
      lastApplied = t;
      flushSeek(t);
    }

    // Parallax depth: video slowly zooms + drifts; copy counters
    if (videoLayer) {
      const scale = 1 + p * videoScale;
      const y = p * -40;
      videoLayer.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;
    }
    if (copyLayer) {
      const y = p * copyShift;
      copyLayer.style.transform = `translate3d(0, ${y}px, 0)`;
    }
    if (progressFill) {
      progressFill.style.transform = `scaleX(${p})`;
    }
    setChapterVisibility(p);
  }

  function tick() {
    raf = 0;
    if (destroyed) {
      ticking = false;
      return;
    }

    target = sectionProgress(section);
    smooth = lerp(smooth, target, smoothing);
    if (Math.abs(target - smooth) < 0.0002) smooth = target;

    apply(smooth);

    if (active && Math.abs(target - smooth) > 0.0002) {
      raf = requestAnimationFrame(tick);
    } else {
      ticking = false;
    }
  }

  function ensureTick() {
    if (ticking || destroyed || !ready) return;
    ticking = true;
    raf = requestAnimationFrame(tick);
  }

  function onScroll() {
    if (!active || !ready) return;
    ensureTick();
  }

  const io = new IntersectionObserver(
    ([e]) => {
      active = e.isIntersecting;
      if (active) ensureTick();
    },
    { rootMargin: "15% 0px", threshold: 0 }
  );
  io.observe(section);

  function onReady() {
    ready = true;
    video.pause();
    video.loop = false;
    try {
      video.currentTime = 0;
    } catch {
      /* */
    }
    smooth = sectionProgress(section);
    apply(smooth);
    ensureTick();
  }

  if (video.readyState >= 1) onReady();
  else video.addEventListener("loadedmetadata", onReady, { once: true });

  // Unlock precise seeking on mobile Safari / Chrome: muted play then pause once
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  const kick = video.play();
  if (kick && typeof kick.then === "function") {
    kick
      .then(() => {
        video.pause();
        if (ready) apply(smooth);
      })
      .catch(() => {
        video.pause();
      });
  } else {
    video.pause();
  }

  // Never let it free-play — scrub owns the timeline
  video.addEventListener("play", () => {
    if (ready) video.pause();
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  return {
    destroy() {
      destroyed = true;
      io.disconnect();
      video.removeEventListener("seeked", onSeeked);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    },
  };
}

/**
 * Moment strip: each panel plays its clip once when mostly in view,
 * with a light parallax on the caption / media.
 *
 * @param {Object} opts
 * @param {string} [opts.root=".moment"]
 * @param {number} [opts.parallax=40]
 */
export function createMomentParallax(opts = {}) {
  const strength = opts.parallax ?? 40;
  const container =
    typeof opts.container === "string"
      ? document.querySelector(opts.container)
      : opts.container ?? document;

  const moments = opts.moments
    ? Array.from(opts.moments)
    : Array.from((container || document).querySelectorAll(opts.root ?? ".moment"));

  if (!moments.length) return { destroy() {} };

  const useMobile = window.innerWidth < 768;

  /** @type {Map<HTMLElement, { video: HTMLVideoElement|null, media: HTMLElement|null, caption: HTMLElement|null, played: boolean }>} */
  const state = new Map();

  moments.forEach((el) => {
    const video = /** @type {HTMLVideoElement|null} */ (el.querySelector("video"));
    if (video) {
      // Prefer data-src-desktop / data-src-mobile; fall back to existing <source>
      const desk = video.dataset.srcDesktop;
      const mob = video.dataset.srcMobile;
      if (desk || mob) {
        video.src = useMobile && mob ? mob : desk || mob;
      }
    }
    state.set(el, {
      video,
      media: el.querySelector(".moment__media"),
      caption: el.querySelector(".moment__caption"),
      played: false,
    });
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = /** @type {HTMLElement} */ (entry.target);
        const s = state.get(el);
        if (!s?.video) return;

        if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
          if (!s.played) {
            s.played = true;
            s.video.currentTime = 0;
            const p = s.video.play();
            if (p && typeof p.catch === "function") p.catch(() => {});
          }
        } else if (!entry.isIntersecting) {
          // Allow replay next time they scroll back
          s.played = false;
          s.video.pause();
        }
      });
    },
    { threshold: [0, 0.45, 0.7] }
  );

  moments.forEach((el) => io.observe(el));

  let raf = 0;
  let destroyed = false;

  function onScroll() {
    if (raf || destroyed) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const vh = window.innerHeight;
      moments.forEach((el) => {
        const s = state.get(el);
        if (!s) return;
        const rect = el.getBoundingClientRect();
        // -1 when below, 0 centered, +1 when above
        const mid = (rect.top + rect.height / 2 - vh / 2) / vh;
        const y = mid * strength;
        if (s.media) s.media.style.transform = `translate3d(0, ${y * 0.55}px, 0) scale(1.06)`;
        if (s.caption) s.caption.style.transform = `translate3d(0, ${-y * 1.1}px, 0)`;
      });
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  return {
    destroy() {
      destroyed = true;
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    },
  };
}
