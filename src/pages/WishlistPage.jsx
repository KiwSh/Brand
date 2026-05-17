import { useState } from "react";
import { PRODUCTS } from "../data";
import Footer from "../components/Footer";
import ConfirmModal from "../components/ConfirmModal";
import { useReveal } from "../hooks/useReveal";
import { useLanguage } from "../hooks/useLanguage";

export default function WishlistPage({ wishlist, toggleWishlist, onBack, onViewDetail }) {
  const { lang, t } = useLanguage();
  const [removeId, setRemoveId] = useState(null);
  const wishlistedProducts = PRODUCTS.filter(p => wishlist.includes(p.id));

  const confirmRemove = () => {
    toggleWishlist(removeId);
    setRemoveId(null);
  };

  useReveal([wishlist]);

  const getFormattedHeader = () => {
    const titleText = t("wishlist_title");
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
      <div className="a-page wishlist-page">
        <button className="page-back-btn" onClick={onBack}>{lang === "en" ? "← Back" : "← Kembali"}</button>
        <div className="detail-breadcrumb" style={{ marginBottom: 40 }}>
          <button onClick={onBack}>Home</button>
          <span>/</span>
          <span style={{ color:"var(--ink)" }}>{t("wishlist")}</span>
        </div>

        <h1 style={{ fontFamily: "var(--fd)", fontSize: 48, fontWeight: 300, marginBottom: 40 }}>
          {getFormattedHeader()}
        </h1>

        {wishlistedProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", borderTop: ".5px solid var(--stone)", borderBottom: ".5px solid var(--stone)" }}>
            <p style={{ color: "var(--smoke)", fontSize: 15, marginBottom: 20 }}>{t("wishlist_empty")}</p>
            <button className="btn-primary" onClick={onBack}>
              {lang === "en" ? "Explore Collections" : "Jelajahi Koleksi"}
            </button>
          </div>
        ) : (
          <div className="a-prod-grid">
            {wishlistedProducts.map((p, i) => (
              <div key={p.id} className={`a-prod-card a-reveal d${i+1}`}>
                <div className="a-prod-img" onClick={() => onViewDetail(p.id)}>
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
                <div style={{ display: 'flex' }}>
                  <button className="a-prod-cta" style={{ flex: 1, borderRight: '.5px solid rgba(184,154,106,.2)' }} onClick={() => onViewDetail(p.id)}>
                    {lang === "en" ? "View →" : "Lihat →"}
                  </button>
                  <button className="a-prod-cta" style={{ flex: 1, color: 'var(--smoke)' }} onClick={(e) => { e.stopPropagation(); setRemoveId(p.id); }}>
                    {t("cart_remove")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal 
        isOpen={removeId !== null} 
        message={lang === "en" ? "Are you sure you want to remove this product from your wishlist?" : "Apakah Anda yakin ingin menghapus produk ini dari wishlist?"} 
        onConfirm={confirmRemove} 
        onCancel={() => setRemoveId(null)} 
      />

      <Footer />
    </>
  );
}
