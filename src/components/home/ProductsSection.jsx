import { PRODUCTS } from "../../data";
import { useLanguage } from "../../hooks/useLanguage";

export default function ProductsSection({ onViewDetail, onViewAll }) {
  const { lang } = useLanguage();

  return (
    <section id="products" className="a-products">
      <div className="a-products-header a-reveal">
        <div>
          <span className="a-section-label" style={{ color:"var(--gold)" }}>
            {lang === "en" ? "Our Collection" : "Koleksi Kami"}
          </span>
          <h2>
            {lang === "en" ? "Discover our " : "Temukan yang "}<em>{lang === "en" ? "finest" : "terbaik"}</em>
          </h2>
        </div>
        <button className="btn-ghost" style={{ color:"var(--stone)", borderColor:"rgba(200,191,178,.3)" }} onClick={onViewAll}>
          {lang === "en" ? "View All →" : "Lihat Semua →"}
        </button>
      </div>
      <div className="a-prod-grid">
        {PRODUCTS.map((p, i) => (
          <div key={p.id} className={`a-prod-card a-reveal d${i+1}`}>
            <div className="a-prod-img">
              {p.roman.startsWith("http") ? (
                <img 
                  src={p.roman} 
                  alt={p.name} 
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} 
                />
              ) : (
                p.roman
              )}
            </div>
            <div className="a-prod-overlay" />
            <div className="a-prod-info">
              <div className="a-prod-tag">{p.tag}</div>
              <div className="a-prod-name">{p.name}</div>
              <div className="a-prod-price">{p.price}</div>
            </div>
            <button className="a-prod-cta" onClick={() => onViewDetail(p.id)}>
              {lang === "en" ? "View →" : "Lihat →"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
