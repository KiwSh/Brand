import { useState, useEffect } from "react";
import { useReveal } from "../hooks/useReveal";
import { GALLERY_ITEMS } from "../data";
import Footer from "../components/Footer";
import { useLanguage } from "../hooks/useLanguage";

export default function GalleryPage({ onBack }) {
  const { lang, t } = useLanguage();
  const [filter, setFilter] = useState("all");
  const [lightbox, setLightbox] = useState(null); // index in filtered list
  const [filteredList, setFilteredList] = useState(GALLERY_ITEMS);

  useReveal([filter]);

  useEffect(() => {
    setFilteredList(filter === "all" ? GALLERY_ITEMS : GALLERY_ITEMS.filter(g => g.cat === filter));
  }, [filter]);

  // Keyboard nav for lightbox
  useEffect(() => {
    const handler = e => {
      if (lightbox === null) return;
      if (e.key === "ArrowLeft") setLightbox(i => (i - 1 + filteredList.length) % filteredList.length);
      if (e.key === "ArrowRight") setLightbox(i => (i + 1) % filteredList.length);
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, filteredList.length]);

  const FILTERS = [
    { key:"all", label: lang === "en" ? "All" : "Semua" },
    { key:"process", label: lang === "en" ? "Process" : "Proses" },
    { key:"material", label: lang === "en" ? "Material" : "Material" },
    { key:"campaign", label: lang === "en" ? "Campaign" : "Kampanye" },
    { key:"atelier", label: "Atelier" },
  ];

  const lbItem = lightbox !== null ? filteredList[lightbox] : null;

  const getFormattedHeader = () => {
    const titleText = t("gallery_title");
    const words = titleText.split(" ");
    const lastWord = words.pop();
    const remaining = words.join(" ");
    return (
      <>
        {remaining} <em>{lastWord}</em>
      </>
    );
  };

  return (
    <>
      {/* Lightbox */}
      <div className={`a-lightbox${lightbox !== null ? " open" : ""}`}>
        <button className="lb-close" onClick={() => setLightbox(null)}>✕</button>
        {lbItem && (
          <div className="lb-content">
            <div className="lb-img">
              {lbItem.symbol.startsWith("http") ? (
                <img 
                  src={lbItem.symbol} 
                  alt={lang === "en" ? lbItem.titleEn : lbItem.title} 
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} 
                />
              ) : (
                lbItem.symbol
              )}
            </div>
            <div className="lb-cat">{lbItem.cat}</div>
            <div className="lb-title">{lang === "en" ? lbItem.titleEn : lbItem.title}</div>
            <div className="lb-desc">{lang === "en" ? lbItem.descEn : lbItem.desc}</div>
            <div className="lb-nav">
              <button onClick={() => setLightbox(i => (i - 1 + filteredList.length) % filteredList.length)}>
                {lang === "en" ? "← Previous" : "← Sebelumnya"}
              </button>
              <button onClick={() => setLightbox(i => (i + 1) % filteredList.length)}>
                {lang === "en" ? "Next →" : "Berikutnya →"}
              </button>
            </div>
            <div className="lb-counter">{lightbox + 1} / {filteredList.length}</div>
          </div>
        )}
      </div>

      <div className="gallery-pg a-page">
        {onBack && (
          <div className="gallery-back-wrap">
            <button className="page-back-btn" onClick={onBack}>{lang === "en" ? "← Back" : "← Kembali"}</button>
            <div className="detail-breadcrumb" style={{ marginBottom: 40 }}>
              <button onClick={onBack}>Home</button>
              <span>/</span>
              <span style={{ color:"var(--ink)" }}>{t("gallery")}</span>
            </div>
          </div>
        )}
        {/* Hero */}
        <div className="gallery-pg-hero">
          <div>
            <span className="a-section-label">{t("gallery_label")}</span>
            <h1>{getFormattedHeader()}</h1>
          </div>
          <div>
            <p style={{ fontSize:15, lineHeight:1.85, color:"var(--smoke)", marginBottom:32 }}>
              {lang === "en" 
                ? "Each image tells the story of the process, materials, and dedication hidden behind each of RISH's works." 
                : "Setiap gambar menceritakan kisah proses, bahan, dan dedikasi yang tersembunyi di balik setiap karya RISH."}
            </p>
            <div className="gallery-pg-stats">
              {[
                ["9+", lang === "en" ? "Gallery Series" : "Koleksi Galeri"],
                ["48h", lang === "en" ? "Per Product" : "Per Produk"],
                ["200+", lang === "en" ? "Exclusive Photos" : "Foto Eksklusif"]
              ].map(([n,l]) => (
                <div key={l}>
                  <div className="gallery-pg-stat-num">{n}</div>
                  <div className="gallery-pg-stat-lbl">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="gallery-filters">
          {FILTERS.map(f => (
            <button key={f.key} className={`filter-btn${filter === f.key ? " active" : ""}`} onClick={() => setFilter(f.key)}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Masonry grid */}
        <div className="masonry">
          {filteredList.map((item, i) => (
            <div key={item.id} className={`masonry-item${item.large ? " large" : ""}`} onClick={() => setLightbox(i)}>
              <div className="masonry-inner">
                {item.symbol.startsWith("http") ? (
                  <img 
                    src={item.symbol} 
                    alt={lang === "en" ? item.titleEn : item.title} 
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} 
                  />
                ) : (
                  item.symbol
                )}
              </div>
              <div className="masonry-overlay" />
              <div className="masonry-info">
                <div className="masonry-cat">{item.cat}</div>
                <div className="masonry-title">{lang === "en" ? item.titleEn : item.title}</div>
                <div className="masonry-sub">{lang === "en" ? item.subEn : item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
