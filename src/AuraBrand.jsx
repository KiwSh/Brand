import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "./hooks/useLanguage";
import Cursor from "./components/Cursor";
import ParticleCanvas from "./components/ParticleCanvas";
import Nav from "./components/Nav";
import HomePage from "./pages/HomePage";
import ProductDetail from "./pages/ProductDetail";
import GalleryPage from "./pages/GalleryPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import AuthPage from "./pages/AuthPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import ConfirmModal from "./components/ConfirmModal";

import "./styles/aura.css";

/* ── Google Fonts ── */
const injectFonts = () => {
  if (document.getElementById("aura-fonts")) return;
  const link = document.createElement("link");
  link.id = "aura-fonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap";
  document.head.appendChild(link);
};

export default function AuraBrand() {
  const { t } = useLanguage();
  const [page, setPage] = useState("home");         // "home" | "detail" | "gallery" | "cart" | "wishlist"
  const [productId, setProductId] = useState(0);
  const [history, setHistory] = useState([{ page:"home" }]);
  
  // New States
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [logoutModal, setLogoutModal] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "Rifqi",
      phone: "081234567890",
      street: "Jl. Kemang Raya No. 10",
      city: "Jakarta Selatan",
      postalCode: "12730",
      isPrimary: true
    }
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState(1);
  const [orders, setOrders] = useState([
    {
      id: "RISH-834927",
      date: "15 Mei 2026",
      items: [
        { name: "Rish Classic Blazer", qty: 1, price: "Rp 850.000", size: "L", thumbs: ["🧥"], productId: 1 }
      ],
      subtotal: 850000,
      shippingCost: 25000,
      discount: 0,
      grandTotal: 875000,
      paymentMethod: "bank",
      address: {
        name: "Rifqi",
        phone: "081234567890",
        street: "Jl. Kemang Raya No. 10",
        city: "Jakarta Selatan",
        postalCode: "12730"
      },
      status: "dikirim"
    },
    {
      id: "RISH-492019",
      date: "10 Mei 2026",
      items: [
        { name: "Rish Oversized Cotton Shirt", qty: 2, price: "Rp 450.000", size: "M", thumbs: ["👕"], productId: 2 }
      ],
      subtotal: 900000,
      shippingCost: 25000,
      discount: 90000,
      grandTotal: 835000,
      paymentMethod: "ewallet",
      address: {
        name: "Rifqi",
        phone: "081234567890",
        street: "Jl. Kemang Raya No. 10",
        city: "Jakarta Selatan",
        postalCode: "12730"
      },
      status: "selesai"
    }
  ]);

  useEffect(() => {
    injectFonts();
  }, []);

  const navigate = useCallback((newPage, extra = {}) => {
    setPage(newPage);
    setHistory(h => [...h, { page: newPage, ...extra }]);
    window.scrollTo(0, 0);
    if (extra.productId !== undefined) setProductId(extra.productId);
  }, []);

  const scrollTo = useCallback(id => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior:"smooth" });
  }, []);

  const requireAuth = useCallback((callback) => {
    if (user) {
      callback();
    } else {
      navigate("auth");
    }
  }, [user, navigate]);

  const goToDetail = useCallback(id => navigate("detail", { productId: id }), [navigate]);
  const goToGallery = useCallback(() => navigate("gallery"), [navigate]);
  const goToCart = useCallback(() => requireAuth(() => navigate("cart")), [requireAuth, navigate]);
  const goToCheckout = useCallback(() => requireAuth(() => navigate("checkout")), [requireAuth, navigate]);
  const goToOrders = useCallback(() => requireAuth(() => navigate("orders")), [requireAuth, navigate]);
  const goToWishlist = useCallback(() => requireAuth(() => navigate("wishlist")), [requireAuth, navigate]);
  const goToAuth = useCallback(() => navigate("auth"), [navigate]);

  const goBack = useCallback(() => {
    setHistory(h => {
      const prev = [...h];
      prev.pop();
      const dest = prev[prev.length - 1] || { page:"home" };
      setPage(dest.page);
      if (dest.productId !== undefined) setProductId(dest.productId);
      window.scrollTo(0, 0);
      return prev;
    });
  }, []);

  const requestLogout = useCallback(() => setLogoutModal(true), []);
  const confirmLogout = useCallback(() => {
    setUser(null);
    setLogoutModal(false);
    if (page === "cart" || page === "wishlist") {
      navigate("home");
    }
  }, [page, navigate]);
  const cancelLogout = useCallback(() => setLogoutModal(false), []);

  // Cart Handlers
  const addToCart = useCallback((item) => {
    requireAuth(() => {
      setCart(prev => {
        const existing = prev.find(i => i.productId === item.productId && i.size === item.size);
        if (existing) {
          return prev.map(i => i === existing ? { ...i, qty: i.qty + item.qty } : i);
        }
        return [...prev, { ...item, cartId: Date.now() + Math.random() }];
      });
    });
  }, [requireAuth]);

  const updateCartQty = useCallback((cartId, qty) => {
    setCart(prev => prev.map(i => i.cartId === cartId ? { ...i, qty } : i));
  }, []);

  const removeFromCart = useCallback((cartId) => {
    setCart(prev => prev.filter(i => i.cartId !== cartId));
  }, []);

  // Address Handler
  const addAddress = useCallback((newAddr) => {
    setAddresses(prev => {
      const updated = newAddr.isPrimary 
        ? prev.map(a => ({ ...a, isPrimary: false })) 
        : prev;
      const addrWithId = { ...newAddr, id: Date.now() };
      const nextList = [...updated, addrWithId];
      if (newAddr.isPrimary || prev.length === 0) {
        setSelectedAddressId(addrWithId.id);
      }
      return nextList;
    });
  }, []);

  // Order Handlers
  const addOrder = useCallback((newOrder) => {
    setOrders(prev => [newOrder, ...prev]);
  }, []);

  const updateOrderStatus = useCallback((orderId, status) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  }, []);

  // Wishlist Handlers
  const toggleWishlist = useCallback((id) => {
    requireAuth(() => {
      setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    });
  }, [requireAuth]);

  console.log("AuraBrand rendering page:", page, "user:", user);

  return (
    <div className="aura-root">
      <Cursor />
      <ParticleCanvas />
      <Nav
        page={page}
        user={user}
        setPage={p => { setPage(p); setHistory([{ page:p }]); window.scrollTo(0,0); }}
        scrollTo={scrollTo}
        history={history}
        setHistory={setHistory}
        cartCount={cart.reduce((a, c) => a + c.qty, 0)}
        wishlistCount={wishlist.length}
        onCartClick={goToCart}
        onWishlistClick={goToWishlist}
        onLoginClick={goToAuth}
        onLogoutClick={requestLogout}
        onOrdersClick={goToOrders}
      />

      <ConfirmModal 
        isOpen={logoutModal} 
        message={t("logout_confirm_msg")} 
        onConfirm={confirmLogout} 
        onCancel={cancelLogout} 
      />

      <div style={{ paddingTop: page !== "home" && page !== "auth" ? 72 : 0 }}>
        {page === "home" && (
          <HomePage
            onViewDetail={goToDetail}
            onViewAll={goToGallery}
            scrollTo={scrollTo}
          />
        )}
        {page === "detail" && (
          <ProductDetail
            productId={productId}
            onViewDetail={goToDetail}
            onBack={goBack}
            addToCart={addToCart}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            requireAuth={requireAuth}
            user={user}
          />
        )}
        {page === "gallery" && (
          <GalleryPage onBack={goBack} />
        )}
        {page === "cart" && (
          <CartPage 
            cart={cart}
            updateCartQty={updateCartQty}
            removeFromCart={removeFromCart}
            onBack={goBack}
            onViewDetail={goToDetail}
            appliedVoucher={appliedVoucher}
            setAppliedVoucher={setAppliedVoucher}
            onProceedToCheckout={goToCheckout}
          />
        )}
        {page === "checkout" && (
          <CheckoutPage
            cart={cart}
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            setSelectedAddressId={setSelectedAddressId}
            addAddress={addAddress}
            appliedVoucher={appliedVoucher}
            onBack={goBack}
            onPlaceOrder={addOrder}
            onSuccess={() => {
              setCart([]);
              setAppliedVoucher(null);
              setPage("home");
              setHistory([{ page: "home" }]);
            }}
          />
        )}
        {page === "orders" && (
          <OrdersPage
            orders={orders}
            updateOrderStatus={updateOrderStatus}
            onBack={goBack}
            onViewDetail={goToDetail}
          />
        )}
        {page === "wishlist" && (
          <WishlistPage
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            onBack={goBack}
            onViewDetail={goToDetail}
          />
        )}
        {page === "auth" && (
          <AuthPage
            onSuccess={(u) => { setUser(u); goBack(); }}
            onBack={goBack}
          />
        )}
      </div>
    </div>
  );
}