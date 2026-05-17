import { useState } from "react";
import { useLanguage } from "../hooks/useLanguage";

export default function ReviewModal({ isOpen, onClose, onSubmit }) {
  const { lang } = useLanguage();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert(lang === "en" ? "Please select a star rating first." : "Pilih rating bintang terlebih dahulu.");
      return;
    }
    onSubmit({ rating, text: comment });
    setRating(0);
    setComment("");
  };

  return (
    <div className="a-modal-overlay" onClick={onClose}>
      <div className="a-modal-content review-modal" onClick={e => e.stopPropagation()}>
        <h3 style={{ fontFamily: 'var(--fd)', fontSize: 28, marginBottom: 24, textAlign: 'left' }}>
          {lang === "en" ? "Write " : "Tulis "}<em>{lang === "en" ? "Review" : "Ulasan"}</em>
        </h3>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: 12, letterSpacing: '.1em', color: 'var(--smoke)', textTransform: 'uppercase', marginBottom: 8, fontFamily: 'var(--fb)' }}>
              Rating
            </label>
            <div className="star-selector" onMouseLeave={() => setHoverRating(0)}>
              {[1, 2, 3, 4, 5].map(star => (
                <span 
                  key={star} 
                  className={`star-icon ${(hoverRating || rating) >= star ? 'active' : ''}`}
                  onMouseEnter={() => setHoverRating(star)}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: 12, letterSpacing: '.1em', color: 'var(--smoke)', textTransform: 'uppercase', marginBottom: 8, fontFamily: 'var(--fb)' }}>
              {lang === "en" ? "Comment" : "Komentar"}
            </label>
            <textarea 
              required
              rows="4" 
              placeholder={lang === "en" ? "Share your experience using this product..." : "Bagikan pengalaman Anda menggunakan produk ini..."}
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="review-textarea"
            />
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="button" className="btn-ghost" style={{ flex: 1 }} onClick={onClose}>
              {lang === "en" ? "Cancel" : "Batal"}
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>
              {lang === "en" ? "Submit" : "Kirim"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
