import { useState } from "react";
import Footer from "../components/Footer";
import ConfirmModal from "../components/ConfirmModal";
import { useLanguage } from "../hooks/useLanguage";

export default function OrdersPage({ orders, updateOrderStatus, onBack, onViewDetail }) {
  const { lang, t } = useLanguage();
  console.log("OrdersPage rendering with orders:", orders);
  
  const [activeTab, setActiveTab] = useState("semua");
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [returnOrderId, setReturnOrderId] = useState(null);

  const TABS = [
    { id: "semua", label: lang === "en" ? "All" : "Semua" },
    { id: "dikemas", label: lang === "en" ? "Packed" : "Dikemas" },
    { id: "dikirim", label: lang === "en" ? "Shipped" : "Dikirim" },
    { id: "selesai", label: lang === "en" ? "Completed" : "Selesai" },
    { id: "dibatalkan", label: lang === "en" ? "Cancelled" : "Dibatalkan" },
    { id: "pengembalian", label: lang === "en" ? "Returned" : "Pengembalian" }
  ];

  const formatPrice = (num) => "Rp " + num.toLocaleString("id-ID");

  const filteredOrders = activeTab === "semua"
    ? orders
    : orders.filter(o => o.status === activeTab);

  const handleCancelOrder = () => {
    updateOrderStatus(cancelOrderId, "dibatalkan");
    setCancelOrderId(null);
  };

  const handleReturnOrder = () => {
    updateOrderStatus(returnOrderId, "pengembalian");
    setReturnOrderId(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "dikemas":
        return <span className="status-badge dikemas">{lang === "en" ? "Packed" : "Dikemas"}</span>;
      case "dikirim":
        return <span className="status-badge dikirim">{lang === "en" ? "Shipped" : "Dikirim"}</span>;
      case "selesai":
        return <span className="status-badge selesai">{lang === "en" ? "Completed" : "Selesai"}</span>;
      case "dibatalkan":
        return <span className="status-badge dibatalkan">{lang === "en" ? "Cancelled" : "Dibatalkan"}</span>;
      case "pengembalian":
        return <span className="status-badge pengembalian">{lang === "en" ? "Returned" : "Pengembalian"}</span>;
      default:
        return null;
    }
  };

  // Generate tracking nodes dynamically based on order status and active language
  const getTrackingTimeline = (order) => {
    const defaultNodes = [
      { 
        title: lang === "en" ? "Order Created" : "Pesanan Dibuat", 
        desc: lang === "en" ? "Order successfully placed and payment confirmed." : "Pesanan berhasil dibuat dan pembayaran dikonfirmasi.", 
        date: "15 May 2026, 09:00" 
      },
      { 
        title: lang === "en" ? "Packaging" : "Sedang Dikemas", 
        desc: lang === "en" ? "Order is being packed by the RishBrand warehouse team." : "Pesanan sedang dikemas oleh tim gudang RishBrand.", 
        date: "15 May 2026, 11:30" 
      }
    ];

    if (order.status === "dikirim") {
      return [
        { 
          title: lang === "en" ? "In Transit (Shipped)" : "Dalam Perjalanan (Sedang Dikirim)", 
          desc: lang === "en" ? "Package is being delivered by J&T Express courier (Budi) to destination address." : "Paket sedang dibawa oleh kurir J&T Express (Budi) menuju alamat tujuan.", 
          date: "17 May 2026, 10:30", 
          active: true 
        },
        { 
          title: lang === "en" ? "Arrived at Transit Hub" : "Sampai di Hub Transit", 
          desc: lang === "en" ? "Package has arrived at Jakarta Selatan Transit Hub." : "Paket telah sampai di Hub Transit Jakarta Selatan.", 
          date: "16 May 2026, 14:15" 
        },
        { 
          title: lang === "en" ? "Package Handed Over to Courier" : "Paket Diserahkan ke Kurir", 
          desc: lang === "en" ? "Package has been handed over to logistic courier from RishBrand main warehouse." : "Paket telah diserahkan ke kurir logistik dari gudang pusat RishBrand.", 
          date: "16 May 2026, 09:00" 
        },
        ...defaultNodes
      ];
    }

    if (order.status === "selesai") {
      return [
        { 
          title: lang === "en" ? "Package Delivered" : "Paket Diterima", 
          desc: lang === "en" ? "Package successfully delivered and received by customer." : "Paket telah berhasil dikirimkan dan diterima oleh pembeli.", 
          date: "17 May 2026, 15:45", 
          active: true 
        },
        { 
          title: lang === "en" ? "In Transit" : "Dalam Perjalanan", 
          desc: lang === "en" ? "Package is being delivered by J&T Express courier (Budi) to destination address." : "Paket sedang dibawa oleh kurir J&T Express (Budi) menuju alamat tujuan.", 
          date: "17 May 2026, 10:30" 
        },
        { 
          title: lang === "en" ? "Arrived at Transit Hub" : "Sampai di Hub Transit", 
          desc: lang === "en" ? "Package has arrived at Jakarta Selatan Transit Hub." : "Paket telah sampai di Hub Transit Jakarta Selatan.", 
          date: "16 May 2026, 14:15" 
        },
        { 
          title: lang === "en" ? "Package Handed Over to Courier" : "Paket Diserahkan ke Kurir", 
          desc: lang === "en" ? "Package has been handed over to logistic courier from RishBrand main warehouse." : "Paket telah diserahkan ke kurir logistik dari gudang pusat RishBrand.", 
          date: "16 May 2026, 09:00" 
        },
        ...defaultNodes
      ];
    }

    return defaultNodes;
  };

  const getFormattedHeader = () => {
    const titleText = t("orders_title");
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
      <div className="a-page orders-page">
        <button className="page-back-btn" onClick={onBack}>{lang === "en" ? "← Back" : "← Kembali"}</button>
        <div className="detail-breadcrumb" style={{ marginBottom: 40 }}>
          <button onClick={onBack}>Home</button>
          <span>/</span>
          <span style={{ color: "var(--ink)" }}>{t("orders_title")}</span>
        </div>

        <h1 style={{ fontFamily: "var(--fd)", fontSize: 48, fontWeight: 300, marginBottom: 40 }}>
          {getFormattedHeader()}
        </h1>

        {/* Tab Status */}
        <div className="status-tabs-container">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`status-tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {orders.filter(o => tab.id === "semua" ? true : o.status === tab.id).length > 0 && (
                <span className="tab-count-badge">
                  {orders.filter(o => tab.id === "semua" ? true : o.status === tab.id).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Daftar Pesanan */}
        {filteredOrders.length === 0 ? (
          <div className="no-orders-box">
            <p style={{ color: "var(--smoke)", marginBottom: 20 }}>
              {lang === "en" ? "No order history in this section." : "Tidak ada riwayat pesanan dalam seksi ini."}
            </p>
            <button className="btn-primary" onClick={onBack}>
              {lang === "en" ? "Explore Products" : "Jelajahi Produk"}
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order, idx) => (
              <div
                key={order.id}
                className="order-history-card"
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                {/* Header Kartu */}
                <div className="order-card-header">
                  <div className="order-meta-info">
                    <span 
                      className="order-id" 
                      onClick={() => setSelectedOrderDetail(order)} 
                      style={{ cursor: 'pointer', textDecoration: 'underline', transition: 'color .3s' }}
                      title={lang === "en" ? "Click to view order details" : "Klik untuk melihat detail pesanan"}
                    >
                      #{order.id}
                    </span>
                    <span className="order-date">{order.date}</span>
                    <span style={{ color: 'var(--stone)' }}>—</span>
                    <span className="order-payment" style={{ textTransform: 'uppercase', fontSize: 11, letterSpacing: '.05em', color: 'var(--smoke)' }}>
                      {order.paymentMethod === "bank" 
                        ? t("checkout_payment_bank") 
                        : order.paymentMethod === "card" 
                          ? (lang === "en" ? "Credit Card" : "Kartu Kredit") 
                          : order.paymentMethod === "ewallet" 
                            ? t("checkout_payment_ewallet") 
                            : "COD"}
                    </span>
                  </div>
                  <div className="order-status-indicator">
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Daftar Item */}
                <div className="order-card-items">
                  {order.items.map((item, i) => (
                    <div key={i} className="order-item-row">
                      <div className="order-item-thumb">
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
                      <div className="order-item-detail">
                        <h4 onClick={() => item.productId && onViewDetail(item.productId)} style={{ cursor: item.productId ? 'none' : 'default' }}>
                          {item.name}
                        </h4>
                        <p>{lang === "en" ? "Size" : "Ukuran"}: {item.size} — {lang === "en" ? "Qty" : "Kuantitas"}: {item.qty}</p>
                      </div>
                      <div className="order-item-price-col">
                        <span>{item.price}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Kartu & Total Tagihan */}
                <div className="order-card-footer">
                  <div className="order-address-preview">
                    <span>{lang === "en" ? "Shipped to" : "Dikirim ke"}: <strong>{order.address.name}</strong> ({order.address.city})</span>
                  </div>
                  <div className="order-total-actions">
                    <div className="order-total-summary">
                      <span style={{ fontSize: 12, color: 'var(--smoke)' }}>{lang === "en" ? "Order Total" : "Total Pesanan"}:</span>
                      <strong style={{ fontSize: 18, color: 'var(--ink)' }}>{formatPrice(order.grandTotal)}</strong>
                    </div>
                    
                    <div className="order-action-buttons" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button
                        className="btn-ghost"
                        onClick={() => setSelectedOrderDetail(order)}
                        style={{ padding: '8px 16px', fontSize: 11, border: '.5px solid var(--stone)' }}
                      >
                        {lang === "en" ? "Details" : "Detail"}
                      </button>

                      {order.status === "dikemas" && (
                        <button
                          className="btn-ghost cancel-btn"
                          onClick={() => setCancelOrderId(order.id)}
                          style={{ padding: '8px 16px', fontSize: 11, border: '.5px solid #d14949', color: '#d14949' }}
                        >
                          {lang === "en" ? "Cancel Order" : "Batalkan Pesanan"}
                        </button>
                      )}
                      
                      {(order.status === "dikirim" || order.status === "selesai") && (
                        <button
                          className="btn-primary"
                          onClick={() => setTrackingOrder(order)}
                          style={{ padding: '8px 20px', fontSize: 11 }}
                        >
                          {lang === "en" ? "Track Package" : "Lacak Paket"}
                        </button>
                      )}
                      
                      {order.status === "selesai" && (
                        <button
                          className="btn-ghost"
                          onClick={() => setReturnOrderId(order.id)}
                          style={{ padding: '8px 16px', fontSize: 11, border: '.5px solid var(--stone)' }}
                        >
                          {lang === "en" ? "Request Return" : "Ajukan Pengembalian"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Pelacakan Paket */}
      {trackingOrder && (
        <div className="a-modal-overlay" onClick={() => setTrackingOrder(null)}>
          <div className="a-modal-content tracking-modal" onClick={e => e.stopPropagation()}>
            <div className="tracking-modal-header" style={{ textAlign: 'left', borderBottom: '.5px solid var(--stone)', paddingBottom: 16, marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'var(--fd)', fontSize: 32, fontWeight: 300, marginBottom: 8 }}>
                {lang === "en" ? "Track " : "Lacak "}<em>{lang === "en" ? "Shipment" : "Pengiriman"}</em>
              </h3>
              <p style={{ fontSize: 12, color: 'var(--smoke)', margin: 0 }}>
                {lang === "en" ? "Order ID" : "No. Pesanan"}: <strong>#{trackingOrder.id}</strong> — {lang === "en" ? "Courier" : "Kurir"}: <strong>J&T Express (RISH-Courier)</strong>
              </p>
              <p style={{ fontSize: 11, color: 'var(--gold)', margin: '4px 0 0 0', letterSpacing: '.05em' }}>
                NO. RESI: <strong>RISHTRACK{trackingOrder.id.replace(/[^\d]/g, "") || "987213"}</strong>
              </p>
            </div>

            <div className="tracking-timeline">
              {getTrackingTimeline(trackingOrder).map((node, i) => (
                <div key={i} className={`timeline-node ${node.active ? "active" : ""}`}>
                  <div className="timeline-dot-col">
                    <div className="timeline-dot">
                      {node.active && <div className="timeline-pulse"></div>}
                    </div>
                    {i < getTrackingTimeline(trackingOrder).length - 1 && <div className="timeline-line"></div>}
                  </div>
                  <div className="timeline-content-col" style={{ textAlign: 'left' }}>
                    <h4 style={{ fontSize: 14, fontWeight: node.active ? 500 : 300, color: node.active ? 'var(--gold)' : 'var(--ink)' }}>
                      {node.title}
                    </h4>
                    <p style={{ fontSize: 12, color: 'var(--smoke)', marginTop: 4, lineHeight: 1.5 }}>
                      {node.desc}
                    </p>
                    <span style={{ fontSize: 10, color: 'var(--stone)', marginTop: 4, display: 'block' }}>
                      {node.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button className="btn-primary" style={{ marginTop: 32, width: '100%', padding: 12 }} onClick={() => setTrackingOrder(null)}>
              {lang === "en" ? "Close Tracking" : "Tutup Pelacakan"}
            </button>
          </div>
        </div>
      )}

      {/* Modal Detail Pesanan */}
      {selectedOrderDetail && (
        <div className="a-modal-overlay" onClick={() => setSelectedOrderDetail(null)}>
          <div className="a-modal-content order-detail-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
            <div className="order-detail-header" style={{ textAlign: 'left', borderBottom: '.5px solid var(--stone)', paddingBottom: 16, marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'var(--fd)', fontSize: 32, fontWeight: 300, marginBottom: 8 }}>
                {lang === "en" ? "Order " : "Detail "}<em>{lang === "en" ? "Details" : "Pesanan"}</em>
              </h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <p style={{ fontSize: 13, color: 'var(--smoke)', margin: 0 }}>
                  {lang === "en" ? "Order ID" : "No. Pesanan"}: <strong>#{selectedOrderDetail.id}</strong><br/>
                  {lang === "en" ? "Date" : "Tanggal"}: <strong>{selectedOrderDetail.date}</strong>
                </p>
                {getStatusBadge(selectedOrderDetail.status)}
              </div>
            </div>

            {/* Section 1: Daftar Produk */}
            <div className="order-detail-section" style={{ textAlign: 'left', marginBottom: 24 }}>
              <h4 style={{ fontFamily: 'var(--fb)', fontSize: 13, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink)', marginBottom: 12, borderBottom: '.5px solid var(--mist)', paddingBottom: 6 }}>
                {lang === "en" ? "Product List" : "Daftar Produk"}
              </h4>
              <div className="order-detail-items" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {selectedOrderDetail.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="order-item-thumb" style={{ width: 48, height: 48, fontSize: 18, overflow: 'hidden' }}>
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
                      <div>
                        <h5 onClick={() => { setSelectedOrderDetail(null); item.productId && onViewDetail(item.productId); }} style={{ margin: 0, fontSize: 14, fontWeight: 400, color: 'var(--ink)', cursor: item.productId ? 'pointer' : 'default', textDecoration: item.productId ? 'underline' : 'none' }}>
                          {item.name}
                        </h5>
                        <p style={{ margin: '4px 0 0 0', fontSize: 11, color: 'var(--smoke)' }}>{lang === "en" ? "Size" : "Ukuran"}: {item.size} — Qty: {item.qty}</p>
                      </div>
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 400 }}>{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Alamat Pengiriman */}
            <div className="order-detail-section" style={{ textAlign: 'left', marginBottom: 24 }}>
              <h4 style={{ fontFamily: 'var(--fb)', fontSize: 13, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink)', marginBottom: 12, borderBottom: '.5px solid var(--mist)', paddingBottom: 6 }}>
                {t("checkout_shipping_address")}
              </h4>
              <div style={{ fontSize: 13, color: 'var(--smoke)', lineHeight: 1.6 }}>
                <strong style={{ color: 'var(--ink)' }}>{selectedOrderDetail.address.name}</strong> ({selectedOrderDetail.address.phone})<br/>
                {selectedOrderDetail.address.street}<br/>
                {selectedOrderDetail.address.city}, {selectedOrderDetail.address.postalCode}
              </div>
            </div>

            {/* Section 3: Rincian Pembayaran */}
            <div className="order-detail-section" style={{ textAlign: 'left', marginBottom: 24 }}>
              <h4 style={{ fontFamily: 'var(--fb)', fontSize: 13, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink)', marginBottom: 12, borderBottom: '.5px solid var(--mist)', paddingBottom: 6 }}>
                {lang === "en" ? "Payment Details" : "Rincian Pembayaran"}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--smoke)' }}>
                  <span>{t("checkout_payment_method")}:</span>
                  <span style={{ textTransform: 'uppercase', fontWeight: 500, color: 'var(--ink)' }}>
                    {selectedOrderDetail.paymentMethod === "bank" 
                      ? t("checkout_payment_bank") 
                      : selectedOrderDetail.paymentMethod === "card" 
                        ? (lang === "en" ? "Credit Card" : "Kartu Kredit") 
                        : selectedOrderDetail.paymentMethod === "ewallet" 
                          ? t("checkout_payment_ewallet") 
                          : "COD"}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--smoke)' }}>
                  <span>{lang === "en" ? "Product Subtotal" : "Subtotal Produk"}:</span>
                  <span style={{ color: 'var(--ink)' }}>{formatPrice(selectedOrderDetail.subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--smoke)' }}>
                  <span>{lang === "en" ? "Shipping Fee" : "Biaya Pengiriman"}:</span>
                  <span style={{ color: 'var(--ink)' }}>{formatPrice(selectedOrderDetail.shippingCost)}</span>
                </div>
                {selectedOrderDetail.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d14949' }}>
                    <span>{lang === "en" ? "Voucher Discount" : "Diskon Voucher"}:</span>
                    <span>-{formatPrice(selectedOrderDetail.discount)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '.5px solid var(--stone)', paddingTop: 8, marginTop: 4 }}>
                  <strong style={{ fontSize: 14, color: 'var(--ink)' }}>{lang === "en" ? "Total Payment" : "Total Pembayaran"}:</strong>
                  <strong style={{ fontSize: 16, color: 'var(--gold)' }}>{formatPrice(selectedOrderDetail.grandTotal)}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
              {(selectedOrderDetail.status === "dikirim" || selectedOrderDetail.status === "selesai") && (
                <button 
                  className="btn-primary" 
                  style={{ flex: 1, padding: 12 }} 
                  onClick={() => {
                    setTrackingOrder(selectedOrderDetail);
                    setSelectedOrderDetail(null);
                  }}
                >
                  {lang === "en" ? "Track Package" : "Lacak Paket"}
                </button>
              )}
              <button 
                className="btn-ghost" 
                style={{ flex: 1, padding: 12, border: '.5px solid var(--stone)' }} 
                onClick={() => setSelectedOrderDetail(null)}
              >
                {lang === "en" ? "Close" : "Tutup"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Konfirmasi Pembatalan */}
      <ConfirmModal
        isOpen={cancelOrderId !== null}
        message={lang === "en" ? "Are you sure you want to cancel this order? This action cannot be undone." : "Apakah Anda yakin ingin membatalkan pesanan ini? Aksi ini tidak dapat dibatalkan."}
        onConfirm={handleCancelOrder}
        onCancel={() => setCancelOrderId(null)}
      />

      {/* Konfirmasi Retur */}
      <ConfirmModal
        isOpen={returnOrderId !== null}
        message={lang === "en" ? "Are you sure you want to request a return for this order? Our team will review your request shortly." : "Apakah Anda yakin ingin mengajukan pengembalian untuk pesanan ini? Tim kami akan segera meninjau permohonan Anda."}
        onConfirm={handleReturnOrder}
        onCancel={() => setReturnOrderId(null)}
      />

      <Footer />
    </>
  );
}
