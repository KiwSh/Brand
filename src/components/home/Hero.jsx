import { useState, useEffect } from "react";
import { useLanguage } from "../../hooks/useLanguage";

export default function Hero({ scrollTo }) {
  const { t } = useLanguage();
  const [par, setPar] = useState(0);

  useEffect(() => {
    const fn = () => setPar(window.scrollY);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Format title with br tags or em tag from key
  const getFormattedTitle = () => {
    const titleText = t("hero_title");
    const lines = titleText.split("\n");
    return (
      <>
        {lines[0]}<br/>
        <em>{lines[1]}</em><br/>
        {lines[2]}
      </>
    );
  };

  return (
    <section id="hero" className="a-hero">
      <div className="a-hero-content" style={{ transform:`translateY(${par * 0.18}px)` }}>
        <p className="a-eyebrow" style={{ animation:"fadeUp .8s .2s both" }}>{t("hero_eyebrow")}</p>
        <h1 className="a-title" style={{ animation:"fadeUp .9s .4s both" }}>
          {getFormattedTitle()}
        </h1>
        <p className="a-sub" style={{ animation:"fadeUp .8s .6s both" }}>
          {t("hero_sub")}
        </p>
        <div className="a-hero-actions" style={{ animation:"fadeUp .8s .8s both" }}>
          <button className="btn-primary" onClick={() => scrollTo("products")}>{t("hero_explore")}</button>
          <button className="btn-ghost" onClick={() => scrollTo("about")}>{t("hero_story")}</button>
        </div>
      </div>
      <div className="a-hero-img" style={{ transform:`translateY(${par * 0.08}px)` }}>
        <img 
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop" 
          alt="RISH Editorial Model" 
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} 
        />
      </div>
      <div className="a-scroll-hint" style={{ animation:"fadeUp .8s 1.2s both" }}>
        <div className="a-scroll-line" /><span>{t("hero_scroll")}</span>
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </section>
  );
}
