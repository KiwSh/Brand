import { useState } from "react";
import Footer from "../components/Footer";
import { useLanguage } from "../hooks/useLanguage";

export default function CheckoutPage({
  cart,
  addresses,
  selectedAddressId,
  setSelectedAddressId,
  addAddress,
  appliedVoucher,
  onBack,
  onPlaceOrder,
  onSuccess
}) {
  const { lang, t } = useLanguage();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  // New Address Form State
  const [newAddr, setNewAddr] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    postalCode: "",
    isPrimary: false
  });

  const [formError, setFormError] = useState("");

  const formatPrice = (num) => "Rp " + num.toLocaleString("id-ID");

  const subtotal = cart.reduce((acc, item) => {
    const priceStr = item.price.replace(/[^\d]/g, '');
    return acc + (parseInt(priceStr, 10) * item.qty);
  }, 0);

  let discount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.type === "percent") discount = subtotal * (appliedVoucher.value / 100);
    if (appliedVoucher.type === "fixed") discount = appliedVoucher.value;
    if (discount > subtotal) discount = subtotal;
  }

  // Cost calculations
  const shippingCost = subtotal > 1500000 ? 0 : 25000;
  const grandTotal = subtotal - discount + shippingCost;

  const activeAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddr.name || !newAddr.phone || !newAddr.street || !newAddr.city || !newAddr.postalCode) {
      setFormError(lang === "en" ? "All fields are required." : "Semua bidang harus diisi.");
      return;
    }
    setFormError("");
    addAddress(newAddr);
    // Reset form
    setNewAddr({
      name: "",
      phone: "",
      street: "",
      city: "",
      postalCode: "",
      isPrimary: false
    });
    setShowAddModal(false);
    setShowAddressModal(false);
  };

  const handlePlaceOrder = () => {
    if (!activeAddress) {
      alert(lang === "en" ? "Please add a shipping address first." : "Silakan tambahkan alamat pengiriman terlebih dahulu.");
      return;
    }
    setIsOrdering(true);
    // Simulate payment and order placing animation
    setTimeout(() => {
      setIsOrdering(false);
      const generatedOrderNum = "RISH-" + Math.floor(100000 + Math.random() * 900000);
      
      const newOrder = {
        id: generatedOrderNum,
        date: new Date().toLocaleDateString(lang === "en" ? "en-US" : "id-ID", { day: 'numeric', month: 'long', year: 'numeric' }),
        items: cart.map(i => ({ ...i })),
        subtotal,
        shippingCost,
        discount,
        grandTotal,
        paymentMethod,
        address: { ...activeAddress },
        status: "dikemas"
      };

      onPlaceOrder(newOrder);
      setOrderNumber(generatedOrderNum);
      setOrderSuccess(true);
    }, 1800);
  };

  const PAYMENT_OPTIONS = [
    { 
      id: "bank", 
      label: t("checkout_payment_bank"), 
      desc: lang === "en" ? "BCA, Mandiri, BNI Virtual Account" : "BCA, Mandiri, BNI Virtual Account", 
      icon: "🏦" 
    },
    { 
      id: "card", 
      label: lang === "en" ? "Credit Card" : "Kartu Kredit", 
      desc: lang === "en" ? "Visa, MasterCard with 3D Secure" : "Visa, MasterCard dengan 3D Secure", 
      icon: "💳" 
    },
    { 
      id: "ewallet", 
      label: t("checkout_payment_ewallet"), 
      desc: lang === "en" ? "GoPay, OVO, ShopeePay" : "GoPay, OVO, ShopeePay", 
      icon: "📱" 
    },
    { 
      id: "cod", 
      label: t("checkout_payment_cod"), 
      desc: lang === "en" ? "Pay on delivery when package arrives" : "Bayar di tempat saat barang tiba", 
      icon: "📦" 
    }
  ];

  const getFormattedHeader = () => {
    const titleText = t("checkout_title");
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
      <div className="a-page checkout-page">
        <button className="page-back-btn" onClick={onBack}>{lang === "en" ? "← Back" : "← Kembali"}</button>
        <div className="detail-breadcrumb" style={{ marginBottom: 40 }}>
          <button onClick={onBack}>{t("cart")}</button>
          <span>/</span>
          <span style={{ color: "var(--ink)" }}>{t("checkout_title")}</span>
        </div>

        <h1 style={{ fontFamily: "var(--fd)", fontSize: 48, fontWeight: 300, marginBottom: 40 }}>
          {getFormattedHeader()}
        </h1>

        <div className="checkout-grid">
          {/* Kolom Kiri: Alamat & Pembayaran */}
          <div className="checkout-main">
            {/* Alamat Pengiriman */}
            <div className="checkout-section">
              <div className="checkout-section-header">
                <h2>1. {t("checkout_shipping_address").split(' ')[0]} <em>{t("checkout_shipping_address").split(' ').slice(1).join(' ')}</em></h2>
                {addresses.length > 0 && (
                  <button className="btn-ghost" style={{ padding: '0 0 4px', fontSize: 12 }} onClick={() => setShowAddressModal(true)}>
                    {lang === "en" ? "Change Address" : "Ubah Alamat"}
                  </button>
                )}
              </div>

              {activeAddress ? (
                <div className="selected-address-card">
                  <div className="address-card-header">
                    <span className="receiver-name">{activeAddress.name}</span>
                    <span className="receiver-phone">{activeAddress.phone}</span>
                    {activeAddress.isPrimary && <span className="primary-badge">{lang === "en" ? "Primary Address" : "Alamat Utama"}</span>}
                  </div>
                  <p className="address-street">{activeAddress.street}</p>
                  <p className="address-city">{activeAddress.city}, {activeAddress.postalCode}</p>
                </div>
              ) : (
                <div className="no-address-card">
                  <p style={{ color: "var(--smoke)", marginBottom: 16 }}>{lang === "en" ? "No shipping address registered yet." : "Belum ada alamat pengiriman yang terdaftar."}</p>
                  <button className="btn-primary" onClick={() => setShowAddModal(true)}>{t("checkout_add_address")}</button>
                </div>
              )}
            </div>

            {/* Metode Pembayaran */}
            <div className="checkout-section" style={{ marginTop: 48 }}>
              <div className="checkout-section-header">
                <h2>2. {t("checkout_payment_method").split(' ')[0]} <em>{t("checkout_payment_method").split(' ').slice(1).join(' ')}</em></h2>
              </div>
              <div className="payment-grid">
                {PAYMENT_OPTIONS.map((opt) => (
                  <div
                    key={opt.id}
                    className={`payment-card ${paymentMethod === opt.id ? "active" : ""}`}
                    onClick={() => setPaymentMethod(opt.id)}
                  >
                    <div className="payment-icon">{opt.icon}</div>
                    <div className="payment-info">
                      <h3>{opt.label}</h3>
                      <p>{opt.desc}</p>
                    </div>
                    <div className="payment-radio">
                      <div className="radio-dot"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Ringkasan Pesanan & Tombol Aksi */}
          <div className="checkout-summary">
            <h3>{t("checkout_order_summary").split(' ')[0]} <em>{t("checkout_order_summary").split(' ').slice(1).join(' ')}</em></h3>
            
            {/* Daftar Barang */}
            <div className="checkout-items-list">
              {cart.map((item) => (
                <div key={item.cartId} className="checkout-item-mini">
                  <span className="item-name-mini">
                    {item.name} <em style={{ fontStyle: "normal", color: "var(--smoke)", fontSize: 12 }}>x{item.qty}</em>
                  </span>
                  <span className="item-price-mini">
                    {formatPrice(parseInt(item.price.replace(/[^\d]/g, ''), 10) * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-divider" />

            <div className="summary-row">
              <span>{t("cart_subtotal")}</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            
            {appliedVoucher && (
              <div className="summary-row" style={{ color: 'var(--gold)' }}>
                <span>{t("cart_discount")} ({appliedVoucher.code})</span>
                <span>- {formatPrice(discount)}</span>
              </div>
            )}

            <div className="summary-row">
              <span>{t("cart_shipping")}</span>
              <span>{shippingCost === 0 ? (lang === "en" ? "Free" : "Gratis") : formatPrice(shippingCost)}</span>
            </div>

            <div className="summary-divider" />

            <div className="summary-row summary-total" style={{ marginTop: 0, paddingTop: 16 }}>
              <span>{lang === "en" ? "Grand Total" : "Total Pembayaran"}</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>

            <button
              className="btn-primary place-order-btn"
              disabled={isOrdering || cart.length === 0}
              onClick={handlePlaceOrder}
              style={{ width: "100%", padding: 20, marginTop: 24 }}
            >
              {isOrdering ? (
                <span className="loading-spinner-text">
                  <span className="spinner"></span> {lang === "en" ? "Processing..." : "Memproses..."}
                </span>
              ) : (
                t("checkout_place_order")
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal Daftar Alamat */}
      {showAddressModal && (
        <div className="a-modal-overlay" onClick={() => setShowAddressModal(false)}>
          <div className="a-modal-content address-list-modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'var(--fd)', fontSize: 28, marginBottom: 20, textAlign: 'left' }}>
              {lang === "en" ? "Select " : "Pilih "}<em>{lang === "en" ? "Address" : "Alamat"}</em>
            </h3>
            <div className="address-modal-list">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`address-option-card ${selectedAddressId === addr.id ? "active" : ""}`}
                  onClick={() => {
                    setSelectedAddressId(addr.id);
                    setShowAddressModal(false);
                  }}
                >
                  <div className="address-option-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <strong style={{ fontSize: 14 }}>{addr.name}</strong>
                      {addr.isPrimary && <span className="primary-badge-mini">{lang === "en" ? "Primary" : "Utama"}</span>}
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--smoke)', marginTop: 4 }}>{addr.phone}</p>
                    <p style={{ fontSize: 13, color: 'var(--ink)', marginTop: 8 }}>{addr.street}</p>
                    <p style={{ fontSize: 12, color: 'var(--smoke)' }}>{addr.city}, {addr.postalCode}</p>
                  </div>
                  <div className="address-select-indicator">
                    {selectedAddressId === addr.id && <span className="select-check">✔</span>}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button className="btn-primary" style={{ flex: 1, padding: 12 }} onClick={() => setShowAddModal(true)}>
                {lang === "en" ? "Add Address" : "Tambah Alamat"}
              </button>
              <button className="btn-ghost" style={{ flex: 1, padding: 12 }} onClick={() => setShowAddressModal(false)}>
                {t("checkout_form_cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Alamat Baru */}
      {showAddModal && (
        <div className="a-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="a-modal-content address-form-modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'var(--fd)', fontSize: 28, marginBottom: 16, textAlign: 'left' }}>
              {lang === "en" ? "Add " : "Tambah "}<em>{lang === "en" ? "New Address" : "Alamat Baru"}</em>
            </h3>
            {formError && <p style={{ color: "#d14949", fontSize: 12, textAlign: "left", marginBottom: 12 }}>{formError}</p>}
            
            <form onSubmit={handleAddAddress} className="address-form-body">
              <div className="checkout-form-group">
                <label>{t("checkout_form_name")}</label>
                <input
                  type="text"
                  placeholder={lang === "en" ? "e.g. Jane Doe" : "Contoh: Budi Santoso"}
                  value={newAddr.name}
                  onChange={e => setNewAddr({ ...newAddr, name: e.target.value })}
                />
              </div>

              <div className="checkout-form-group">
                <label>{t("checkout_form_phone")}</label>
                <input
                  type="tel"
                  placeholder={lang === "en" ? "e.g. +6281234567890" : "Contoh: 081234567890"}
                  value={newAddr.phone}
                  onChange={e => setNewAddr({ ...newAddr, phone: e.target.value })}
                />
              </div>

              <div className="checkout-form-group">
                <label>{t("checkout_form_street")}</label>
                <textarea
                  rows="3"
                  placeholder={lang === "en" ? "Street, Building, House No., District" : "Nama jalan, Gedung, No. Rumah, RT/RW, Kecamatan"}
                  value={newAddr.street}
                  onChange={e => setNewAddr({ ...newAddr, street: e.target.value })}
                  style={{ width: '100%', padding: '10px', background: 'none', border: '.5px solid var(--stone)', outline: 'none', fontFamily: 'var(--fb)', fontSize: '14px', resize: 'none' }}
                />
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <div className="checkout-form-group" style={{ flex: 1 }}>
                  <label>{t("checkout_form_city")}</label>
                  <input
                    type="text"
                    placeholder="Jakarta Selatan"
                    value={newAddr.city}
                    onChange={e => setNewAddr({ ...newAddr, city: e.target.value })}
                  />
                </div>
                <div className="checkout-form-group" style={{ flex: 1 }}>
                  <label>{t("checkout_form_postal")}</label>
                  <input
                    type="text"
                    placeholder="12730"
                    value={newAddr.postalCode}
                    onChange={e => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                  />
                </div>
              </div>

              <div className="checkout-form-checkbox" style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0', cursor: 'none' }}>
                <input
                  type="checkbox"
                  id="isPrimaryCheckbox"
                  checked={newAddr.isPrimary}
                  onChange={e => setNewAddr({ ...newAddr, isPrimary: e.target.checked })}
                  style={{ width: 'auto', margin: 0 }}
                />
                <label htmlFor="isPrimaryCheckbox" style={{ fontSize: 13, color: 'var(--ink)', cursor: 'none' }}>
                  {t("checkout_form_primary")}
                </label>
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: 12 }}>
                  {t("checkout_form_save")}
                </button>
                <button type="button" className="btn-ghost" style={{ flex: 1, padding: 12 }} onClick={() => setShowAddModal(false)}>
                  {t("checkout_form_cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Layar Sukses (Order Success Screen Overlay) */}
      {orderSuccess && (
        <div className="success-screen-overlay">
          <div className="success-content">
            <div className="success-check-icon">✓</div>
            <h2>
              {t("checkout_success_title").split(' ').slice(0, -1).join(' ')} <em>{t("checkout_success_title").split(' ').pop()}</em>
            </h2>
            <p className="success-order-id">{lang === "en" ? "Order Number" : "Nomor Pesanan"}: <strong>{orderNumber}</strong></p>
            <p className="success-message">
              {t("checkout_success_desc")}
            </p>
            <div className="summary-card-success">
              <div className="row-success">
                <span>{t("checkout_payment_method")}</span>
                <strong>{PAYMENT_OPTIONS.find(p => p.id === paymentMethod)?.label}</strong>
              </div>
              <div className="row-success">
                <span>{t("checkout_shipping_address")}</span>
                <strong>{activeAddress.name} — {activeAddress.city}</strong>
              </div>
              <div className="row-success">
                <span>{lang === "en" ? "Total Payment" : "Total Pembayaran"}</span>
                <strong style={{ color: 'var(--gold)' }}>{formatPrice(grandTotal)}</strong>
              </div>
            </div>
            <button className="btn-primary" onClick={onSuccess} style={{ padding: '16px 48px', fontSize: 12 }}>
              {lang === "en" ? "Continue Shopping" : "Lanjutkan Belanja"}
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
