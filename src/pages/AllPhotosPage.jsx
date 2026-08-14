import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { categories, gallery } from "../data/site.js";
import Reveal from "../components/Reveal.jsx";

const IMAGES_PER_PAGE = 20;

export default function AllPhotosPage() {
  const [active, setActive] = useState("wedding");
  const [currentPage, setCurrentPage] = useState(1);

  const images = useMemo(() => {
    return gallery[active] || [];
  }, [active]);

  const totalPages = Math.ceil(images.length / IMAGES_PER_PAGE);

  const currentImages = images.slice(
    (currentPage - 1) * IMAGES_PER_PAGE,
    currentPage * IMAGES_PER_PAGE
  );

  const changeCategory = (id) => {
    setActive(id);
    setCurrentPage(1);
  };

  return (
    <main className="page">
  <section className="photos-banner">
  <img src="/images/banner.jpg" alt="Banner" />

  <div className="photos-banner-content">
    <p className="photos-banner-subtitle">Photography </p>

    <h1 className="photos-banner-title">
      Our <span>Gallery</span>
    </h1>

    <p className="photos-banner-desc">
      Browse our collection of weddings, pre-weddings, maternity,
      birthdays and family moments captured with timeless elegance.
    </p>
  </div>
</section>

<Reveal as="div" delay={40}>
<div className="photos-home-link">
  <Link to="/">← Home</Link>
</div>

      <div className="photo-filters">
        {categories.map((c) => (
          <button
            key={c.id}
            className={active === c.id ? "is-active" : ""}
            onClick={() => changeCategory(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <p className="photo-filters__blurb">
        {categories.find((c) => c.id === active)?.blurb}
      </p>

      <div className="all-photo-grid">
        {currentImages.map((img, index) => (
          <div key={index} className="all-photo-card">
            <img src={img} alt={`Photo ${index + 1}`} />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </button>

          <span>
            {currentPage} / {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
          
        </div>
        
      )}
      <div className="gallery-end">
  <h2>
    Many <span>More...</span>
  </h2>

  <p>
    Every frame tells a story, and this is only the beginning.
    Stay connected to explore many more beautiful moments.
  </p>
</div>
</Reveal>
    </main>
  );
}