import { useLanguage } from "../../hooks/useLanguage";
import { GALLERY_ITEMS } from "../../data";

export default function GalleryPreview({ onViewAll }) {
  const { lang, t } = useLanguage();
  const previewItems = GALLERY_ITEMS.slice(0, 5);

  return (
    <section id="gallery" className="a-gallery">
      <div className="a-gallery-header">
        <div>
          <span className="a-section-label a-reveal">{t("gallery_label")}</span>
          <h2 className="a-reveal d1">{t("gallery_title")}</h2>
        </div>
        <button className="btn-ghost a-reveal d2" onClick={onViewAll}>{t("gallery_explore")}</button>
      </div>
      <div className="a-gallery-grid">
        {previewItems.map((g, i) => (
          <div key={g.symbol} className={`a-gal-item${g.large ? " tall" : ""} a-reveal d${i % 3 + 1}`} onClick={onViewAll} style={{ cursor:"none" }}>
            <div className="a-gal-inner">
              {g.symbol.startsWith("http") ? (
                <img 
                  src={g.symbol} 
                  alt={lang === "en" ? g.titleEn : g.title} 
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} 
                />
              ) : (
                g.symbol
              )}
            </div>
            <div className="a-gal-caption">
              <div className="a-gal-cap-title">{lang === "en" ? g.titleEn : g.title}</div>
              <div className="a-gal-cap-sub">{lang === "en" ? g.subEn : g.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
