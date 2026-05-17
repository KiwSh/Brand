import { useState } from "react";
import { useReveal } from "../hooks/useReveal";
import { PRODUCTS } from "../data";
import Footer from "../components/Footer";
import ReviewModal from "../components/ReviewModal";
import { useLanguage } from "../hooks/useLanguage";

export default function ProductDetail({ productId, onViewDetail, onBack, addToCart, wishlist, toggleWishlist, requireAuth, user }) {
  const { lang, t } = useLanguage();
  const product = PRODUCTS[productId];
  const [activeThumb, setActiveThumb] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const isWished = wishlist && wishlist.includes(productId);
  const [reviewPage, setReviewPage] = useState(1);
  const [addedReviews, setAddedReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const reviewsPerPage = 5;
  const allReviews = [...addedReviews, ...(product.reviews || [])];
  const totalReviews = allReviews.length;
  const totalPages = Math.ceil(totalReviews / reviewsPerPage);
  const displayedReviews = allReviews.slice((reviewPage - 1) * reviewsPerPage, reviewPage * reviewsPerPage);

  useReveal([productId]);

  const showToastMsg = (msg) => {
    setToastMsg(msg);
    setToast(true);
    setTimeout(() => setToast(false), 2800);
  };

  const handleAddToCart = () => {
    addToCart({ ...product, size: selectedSize, qty });
    showToastMsg(lang === "en" ? `✓ Added to cart — ${product.name}` : `✓ Ditambahkan ke keranjang — ${product.name}`);
  };

  const handleWriteReview = () => {
    requireAuth(() => setShowReviewModal(true));
  };

  const handleSubmitReview = (reviewData) => {
    const newReview = {
      id: Date.now(),
      name: user?.name || "User",
      rating: reviewData.rating,
      date: new Date().toLocaleDateString(lang === "en" ? "en-GB" : "id-ID", { day: '2-digit', month: 'short', year: 'numeric' }),
      text: reviewData.text
    };
    setAddedReviews(prev => [newReview, ...prev]);
    setShowReviewModal(false);
    showToastMsg(lang === "en" ? "✓ Review submitted successfully!" : "✓ Ulasan berhasil dikirim!");
  };

  const others = PRODUCTS.filter(p => p.id !== productId);

  // Take features and descriptions in active language
  const desc = lang === "en" ? (product.descEn || product.desc) : product.desc;
  const features = lang === "en" ? (product.featuresEn || product.features) : product.features;

  return (
    <>
      <div className="a-toast" style={{ transform: toast ? "translateY(0)" : "translateY(80px)", opacity: toast ? 1 : 0 }}>
        {toastMsg}
      </div>
      <div className="detail-hero a-page">
        {/* Breadcrumb */}
        <button className="page-back-btn" onClick={onBack}>{lang === "en" ? "← Back" : "← Kembali"}</button>
        <div className="detail-breadcrumb">
          <button onClick={onBack}>Home</button>
          <span>/</span>
          <span style={{ color:"var(--ink)" }}>{product.name}</span>
        </div>

        <div className="detail-grid">
          {/* Left: Images */}
          <div className="detail-img-col">
            <div className="detail-img-main">
              {product.thumbs[activeThumb].startsWith("http") ? (
                <img 
                  src={product.thumbs[activeThumb]} 
                  alt={product.name} 
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} 
                />
              ) : (
                product.thumbs[activeThumb]
              )}
            </div>
            <div className="detail-thumbs">
              {product.thumbs.map((t, i) => (
                <div 
                  key={i} 
                  className={`detail-thumb${activeThumb === i ? " active" : ""}`} 
                  onClick={() => setActiveThumb(i)}
                  style={{ overflow: "hidden" }}
                >
                  {t.startsWith("http") ? (
                    <img 
                      src={t} 
                      alt={`${product.name} thumbnail`} 
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} 
                    />
                  ) : (
                    t
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="detail-info">
            <div className="detail-tag-badge">{product.tag}</div>
            <h1 className="detail-name">{product.name}</h1>
            <div className="detail-rating">
              <span className="detail-stars">★★★★★</span>
              <span className="detail-rating-count" style={{ color:"var(--smoke)", fontSize:12 }}>
                4.9 ({totalReviews} {lang === "en" ? "reviews" : "ulasan"})
              </span>
            </div>
            <div className="detail-price">{product.price}</div>
            <div className="detail-price-note">
              {lang === "en" ? "Tax included · Free shipping > Rp 500,000" : "Termasuk pajak · Gratis ongkir > Rp 500.000"}
            </div>
            <div className="detail-divider" />
            <p className="detail-desc">{desc}</p>
            <ul className="detail-features">
              {features.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
            <div className="detail-divider" />

            {/* Size */}
            <div className="detail-option-label">{lang === "en" ? "Select Size" : "Pilih Ukuran"}</div>
            <div className="size-options">
              {["XS","S","M","L","XL","XXL"].map(s => (
                <button key={s} className={`size-btn${selectedSize === s ? " active" : ""}`} onClick={() => setSelectedSize(s)}>{s}</button>
              ))}
            </div>

            {/* Qty */}
            <div className="qty-row">
              <span className="detail-option-label" style={{ margin:0 }}>{lang === "en" ? "Quantity" : "Jumlah"}</span>
              <div className="qty-ctrl">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => Math.min(99, q + 1))}>+</button>
              </div>
            </div>

            <button className="add-to-cart" onClick={handleAddToCart}>
              {lang === "en" ? "Add to Cart" : "Tambah ke Keranjang"}
            </button>
            <button className="wishlist-btn" onClick={() => toggleWishlist(productId)}>
              {isWished 
                ? (lang === "en" ? "♥ Saved to Wishlist" : "♥ Tersimpan di Wishlist") 
                : (lang === "en" ? "♡ Save to Wishlist" : "♡ Simpan ke Wishlist")}
            </button>

            <div className="detail-tags-row">
              {product.tags.map(t => <span key={t} className="detail-tag-pill">{t}</span>)}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="detail-reviews">
        <div className="detail-reviews-inner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
            <h3 style={{ margin: 0 }}>
              {lang === "en" ? "Customer " : "Ulasan "}<em>{lang === "en" ? "Reviews" : "Pembeli"}</em>
            </h3>
            <button className="btn-ghost" style={{ padding: '8px 0' }} onClick={handleWriteReview}>
              {lang === "en" ? "Write Review" : "Tulis Ulasan"}
            </button>
          </div>
          <div className="reviews-list">
            {displayedReviews.length > 0 ? (
              displayedReviews.map(review => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <div>
                      <div className="review-name">{review.name}</div>
                      <div className="review-stars">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                    </div>
                    <div className="review-date">{review.date}</div>
                  </div>
                  <div className="review-comment">{review.text}</div>
                </div>
              ))
            ) : (
              <p style={{ color: "var(--smoke)", fontSize: 14 }}>
                {lang === "en" ? "No reviews for this product yet." : "Belum ada ulasan untuk produk ini."}
              </p>
            )}
          </div>
          
          {totalPages > 1 && (
            <div className="reviews-pagination">
              <button 
                className="review-page-btn" 
                disabled={reviewPage === 1} 
                onClick={() => setReviewPage(p => Math.max(1, p - 1))}
              >
                ← Prev
              </button>
              <span className="review-page-info">
                {lang === "en" ? `Page ${reviewPage} of ${totalPages}` : `Halaman ${reviewPage} dari ${totalPages}`}
              </span>
              <button 
                className="review-page-btn" 
                disabled={reviewPage === totalPages} 
                onClick={() => setReviewPage(p => Math.min(totalPages, p + 1))}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <div className="detail-related">
        <h3>
          {lang === "en" ? "Other " : "Produk "}<em>{lang === "en" ? "Products" : "lainnya"}</em>
        </h3>
        <div className="related-grid">
          {others.map(p => (
            <div key={p.id} className="related-card" onClick={() => onViewDetail(p.id)}>
              <div className="related-img">
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
              <div className="related-info">
                <div className="related-tag">{p.tag}</div>
                <div className="related-name">{p.name}</div>
                <div className="related-price">{p.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <ReviewModal 
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleSubmitReview}
      />
      
      <Footer />
    </>
  );
}
