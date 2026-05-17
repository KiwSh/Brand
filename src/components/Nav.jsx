import { useState, useEffect } from "react";
import { useLanguage } from "../hooks/useLanguage";

export default function Nav({ page, user, setPage, scrollTo, history, setHistory, cartCount, wishlistCount, onCartClick, onWishlistClick, onLoginClick, onLogoutClick, onOrdersClick }) {
  const { lang, setLang, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const top = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      setScrolled(top > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goBack = () => {
    const prev = [...history];
    prev.pop();
    const dest = prev[prev.length - 1] || { page: "home" };
    setHistory(prev);
    setPage(dest.page);
    window.scrollTo(0, 0);
  };

  const handleOrdersClick = () => {
    if (onOrdersClick) {
      onOrdersClick();
    } else {
      setPage("orders");
      setHistory(h => [...h, { page: "orders" }]);
      window.scrollTo(0, 0);
    }
  };

  const isHome = page === "home";
  const links = [["about","About"],["products","Products"],["values","Values"],["gallery","Gallery"],["contact","Contact"]];

  return (
    <>
      <nav 
        className={`a-nav${scrolled ? " scrolled" : ""}`}
        style={{
          background: scrolled ? "rgba(255, 255, 255, 0.98)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "0.5px solid var(--stone)" : "none"
        }}
      >
        <button className="a-nav-logo" onClick={() => { setPage("home"); setHistory([{ page:"home" }]); window.scrollTo(0,0); }}>RISH</button>
        {isHome ? (
          <ul className="a-nav-links">
            {links.map(([id, label]) => <li key={id}><button onClick={() => scrollTo(id)}>{t(id)}</button></li>)}
          </ul>
        ) : (
          <div style={{ width: 100 }} />
        )}
        
        {/* Desktop Actions (Hidden on Mobile) */}
        <div className="a-nav-desktop-actions">
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <button 
              onClick={() => setLang("en")}
              className="a-nav-back"
              style={{ 
                padding: 0, 
                color: lang === "en" ? "var(--gold)" : "var(--smoke)", 
                fontWeight: lang === "en" ? "600" : "400" 
              }}
            >
              EN
            </button>
            <span style={{ fontSize: "10px", color: "var(--stone)" }}>/</span>
            <button 
              onClick={() => setLang("id")}
              className="a-nav-back"
              style={{ 
                padding: 0, 
                color: lang === "id" ? "var(--gold)" : "var(--smoke)", 
                fontWeight: lang === "id" ? "600" : "400" 
              }}
            >
              ID
            </button>
          </div>
          <div style={{ width: '.5px', height: '14px', background: 'var(--stone)' }} />
          {user ? (
            <button className="a-nav-back" onClick={onLogoutClick} title="Logout">{user.name.split(' ')[0]} ({t("logout")})</button>
          ) : (
            <button className="a-nav-back" onClick={onLoginClick}>{t("login")}</button>
          )}
          <div style={{ width: '.5px', height: '14px', background: 'var(--stone)' }} />
          <button className="a-nav-back" onClick={onWishlistClick}>{t("wishlist")} {wishlistCount > 0 && `(${wishlistCount})`}</button>
          {user && (
            <>
              <div style={{ width: '.5px', height: '14px', background: 'var(--stone)' }} />
              <button className="a-nav-back" onClick={handleOrdersClick}>{t("orders")}</button>
            </>
          )}
          <button className="a-nav-cta" onClick={onCartClick}>{t("cart")} {cartCount > 0 && `(${cartCount})`}</button>
        </div>

        {/* Mobile Actions (Visible only on Mobile) */}
        <div className="a-nav-mobile-actions">
          <button className="a-nav-mobile-cart" onClick={onCartClick}>
            {t("cart")} {cartCount > 0 && `(${cartCount})`}
          </button>
          <button 
            className={`a-nav-hamburger${menuOpen ? " open" : ""}`} 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div className={`a-drawer-overlay${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(false)} />

      {/* Mobile Sidebar Drawer */}
      <div className={`a-mobile-drawer${menuOpen ? " open" : ""}`}>
        {isHome && (
          <ul className="a-drawer-links">
            {links.map(([id, label]) => (
              <li key={id}>
                <button 
                  onClick={() => {
                    setMenuOpen(false);
                    scrollTo(id);
                  }}
                >
                  {t(id)}
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="a-drawer-divider" />
        <div className="a-drawer-meta">
          {/* Language Selection */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button 
              onClick={() => setLang("en")}
              className="a-nav-back"
              style={{ 
                padding: 0, 
                color: lang === "en" ? "var(--gold)" : "var(--smoke)", 
                fontWeight: lang === "en" ? "600" : "400",
                fontSize: "14px"
              }}
            >
              ENGLISH
            </button>
            <span style={{ fontSize: "12px", color: "var(--stone)" }}>/</span>
            <button 
              onClick={() => setLang("id")}
              className="a-nav-back"
              style={{ 
                padding: 0, 
                color: lang === "id" ? "var(--gold)" : "var(--smoke)", 
                fontWeight: lang === "id" ? "600" : "400",
                fontSize: "14px"
              }}
            >
              INDONESIA
            </button>
          </div>
          
          <div className="a-drawer-divider" style={{ margin: "8px 0" }} />
          
          {/* User Account Details */}
          {user ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <span style={{ fontSize: "14px", color: "var(--ink)", fontWeight: 500, letterSpacing: ".05em" }}>
                {user.name.toUpperCase()}
              </span>
              <button className="a-nav-back" style={{ fontSize: "14px" }} onClick={() => { setMenuOpen(false); handleOrdersClick(); }}>
                {t("orders")}
              </button>
              <button className="a-nav-back" style={{ fontSize: "14px" }} onClick={() => { setMenuOpen(false); onWishlistClick(); }}>
                {t("wishlist")} {wishlistCount > 0 && `(${wishlistCount})`}
              </button>
              <button className="a-nav-back" style={{ fontSize: "14px", color: "var(--gold)" }} onClick={() => { setMenuOpen(false); onLogoutClick(); }}>
                {t("logout")}
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <button className="a-nav-back" style={{ fontSize: "14px" }} onClick={() => { setMenuOpen(false); onLoginClick(); }}>
                {t("login")}
              </button>
              <button className="a-nav-back" style={{ fontSize: "14px" }} onClick={() => { setMenuOpen(false); onWishlistClick(); }}>
                {t("wishlist")} {wishlistCount > 0 && `(${wishlistCount})`}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
