import { useState } from "react";
import Footer from "../components/Footer";
import ConfirmModal from "../components/ConfirmModal";
import { useLanguage } from "../hooks/useLanguage";

export default function CartPage({ cart, updateCartQty, removeFromCart, onBack, onViewDetail, appliedVoucher, setAppliedVoucher, onProceedToCheckout }) {
  const { lang, t } = useLanguage();
  const [removeId, setRemoveId] = useState(null);
  const [voucherInput, setVoucherInput] = useState("");
  const [showVouchers, setShowVouchers] = useState(false);

  const AVAILABLE_VOUCHERS = [
    { 
      code: "WELCOME10", 
      desc: lang === "en" ? "10% discount for exclusive customers" : "Diskon 10% untuk pelanggan eksklusif", 
      type: "percent", 
      value: 10 
    },
    { 
      code: "RISH500", 
      desc: lang === "en" ? "Direct discount of Rp 500.000" : "Potongan Langsung Rp 500.000", 
      type: "fixed", 
      value: 500000 
    },
  ];

  const confirmRemove = () => {
    removeFromCart(removeId);
    setRemoveId(null);
  };

  const handleApplyVoucher = (v) => {
    setAppliedVoucher(v);
    setVoucherInput("");
    setShowVouchers(false);
  };

  const handleApplyManual = () => {
    const found = AVAILABLE_VOUCHERS.find(v => v.code === voucherInput.toUpperCase());
    if (found) {
      handleApplyVoucher(found);
    } else {
      alert(lang === "en" ? "Invalid promo code or not found." : "Kode voucher tidak valid atau tidak ditemukan.");
    }
  };

  const subtotal = cart.reduce((acc, item) => {
    const priceStr = item.price.replace(/[^\d]/g, '');
    return acc + (parseInt(priceStr, 10) * item.qty);
  }, 0);

  let discount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.type === "percent") discount = subtotal * (appliedVoucher.value / 100);
    if (appliedVoucher.type === "fixed") discount = appliedVoucher.value;
    if (discount > subtotal) discount = subtotal; // Prevent negative total
  }

  const total = subtotal - discount;

  const formatPrice = (num) => "Rp " + num.toLocaleString("id-ID");

  return (
    <>
      <div className="a-page cart-page">
        <button className="page-back-btn" onClick={onBack}>{lang === "en" ? "← Back" : "← Kembali"}</button>
        <div className="detail-breadcrumb" style={{ marginBottom: 40 }}>
          <button onClick={onBack}>Home</button>
          <span>/</span>
          <span style={{ color:"var(--ink)" }}>{t("cart")}</span>
        </div>

        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ color: 'var(--smoke)', marginBottom: 20 }}>{t("cart_empty")}</p>
            <button className="btn-primary" onClick={onBack}>{lang === "en" ? "Continue Shopping" : "Lanjutkan Belanja"}</button>
          </div>
        ) : (
          <div className="cart-grid">
            <div className="cart-items">
              {cart.map((item, idx) => (
                <div key={item.cartId} className="cart-item" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="cart-item-thumb">
                    {item.thumbs && item.thumbs[0].startsWith("http") ? (
                      <img 
                        src={item.thumbs[0]} 
                        alt={item.name} 
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} 
                      />
                    ) : (
                      item.thumbs ? item.thumbs[0] : "📦"
                    )}
                  </div>
                  <div className="cart-item-info">
                    <h3 onClick={() => onViewDetail(item.productId)} style={{ cursor: 'none' }}>{item.name}</h3>
                    <p className="cart-item-meta">Size: {item.size} — {item.price}</p>
                    <div className="qty-ctrl" style={{ marginTop: 16 }}>
                      <button onClick={() => updateCartQty(item.cartId, Math.max(1, item.qty - 1))}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateCartQty(item.cartId, Math.min(99, item.qty + 1))}>+</button>
                    </div>
                  </div>
                  <div className="cart-item-actions">
                    <p className="cart-item-total">{formatPrice(parseInt(item.price.replace(/[^\d]/g, ''), 10) * item.qty)}</p>
                    <button className="cart-item-remove" onClick={() => setRemoveId(item.cartId)}>{t("cart_remove")}</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>
                {t("cart_summary").split(' ')[0]} <em>{t("cart_summary").split(' ').slice(1).join(' ')}</em>
              </h3>
              <div className="summary-row">
                <span>{t("cart_subtotal")}</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>{t("cart_shipping")}</span>
                <span>{lang === "en" ? "Calculated at checkout" : "Dihitung saat checkout"}</span>
              </div>
              
              {appliedVoucher && (
                <div className="summary-row" style={{ color: 'var(--gold)' }}>
                  <span>
                    {t("cart_discount")} ({appliedVoucher.code}) 
                    <button onClick={() => setAppliedVoucher(null)} style={{ background: 'none', border: 'none', color: 'var(--smoke)', fontSize: 10, cursor: 'none', marginLeft: 8 }}>
                      [{lang === "en" ? "Remove" : "Hapus"}]
                    </button>
                  </span>
                  <span>- {formatPrice(discount)}</span>
                </div>
              )}

              <div className="cart-voucher">
                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                  <input 
                    type="text" 
                    placeholder={t("cart_voucher_placeholder")} 
                    value={voucherInput} 
                    onChange={e => setVoucherInput(e.target.value)} 
                    className="voucher-input"
                  />
                  <button className="btn-primary voucher-btn" onClick={handleApplyManual}>{t("cart_voucher_apply")}</button>
                </div>
                <button className="btn-ghost voucher-list-btn" onClick={() => setShowVouchers(true)}>
                  {lang === "en" ? "View available store promos →" : "Lihat promo toko yang tersedia →"}
                </button>
              </div>

              <div className="summary-row summary-total">
                <span>{t("cart_total")}</span>
                <span>{formatPrice(total)}</span>
              </div>
              <button className="btn-primary" style={{ width: '100%', padding: 20 }} onClick={onProceedToCheckout}>
                {t("cart_checkout")}
              </button>
            </div>
          </div>
        )}
      </div>

      {showVouchers && (
        <div className="a-modal-overlay" onClick={() => setShowVouchers(false)}>
          <div className="a-modal-content voucher-modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'var(--fd)', fontSize: 28, marginBottom: 24, textAlign: 'left' }}>
              {lang === "en" ? "Select " : "Pilih "}<em>{lang === "en" ? "Voucher" : "Voucher"}</em>
            </h3>
            <div className="voucher-list">
              {AVAILABLE_VOUCHERS.map(v => (
                <div key={v.code} className="voucher-card">
                  <div className="voucher-info">
                    <span className="voucher-code">{v.code}</span>
                    <p className="voucher-desc">{v.desc}</p>
                  </div>
                  <button className="btn-primary voucher-use" onClick={() => handleApplyVoucher(v)}>
                    {lang === "en" ? "Use" : "Pakai"}
                  </button>
                </div>
              ))}
            </div>
            <button className="btn-ghost" style={{ marginTop: 24, width: '100%' }} onClick={() => setShowVouchers(false)}>
              {lang === "en" ? "Close" : "Tutup"}
            </button>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={removeId !== null} 
        message={lang === "en" ? "Are you sure you want to remove this item from your cart?" : "Apakah Anda yakin ingin mengeluarkan item ini dari keranjang?"} 
        onConfirm={confirmRemove} 
        onCancel={() => setRemoveId(null)} 
      />

      <Footer />
    </>
  );
}
