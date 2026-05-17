import { useLanguage } from "../../hooks/useLanguage";

export default function About() {
  const { t } = useLanguage();

  const getFormattedTitle = () => {
    const titleText = t("about_title");
    const lines = titleText.split("\n");
    return (
      <>
        {lines[0]}<br/>
        <em>{lines[1]}</em><br/>
        {lines[2]}
      </>
    );
  };

  const stats = [
    ["48K", t("about_stat1")],
    ["320", t("about_stat2")],
    ["36", t("about_stat3")]
  ];

  return (
    <section id="about" className="a-about">
      <div className="a-about-visual a-reveal">
        <img 
          src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop" 
          alt="Rish Atelier Craftsmanship" 
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} 
        />
        <div className="a-badge">
          <span className="a-badge-num">12+</span>
          <span className="a-badge-lbl">{t("about_excellence")}</span>
        </div>
      </div>
      <div className="a-about-text">
        <span className="a-section-label a-reveal">{t("about_story_label")}</span>
        <h2 className="a-reveal d1">{getFormattedTitle()}</h2>
        <p className="a-reveal d2">{t("about_p1")}</p>
        <p className="a-reveal d2">{t("about_p2")}</p>
        <div className="a-stat-row a-reveal d3">
          {stats.map(([n, l]) => (
            <div key={l}>
              <div className="a-stat-num">{n}</div>
              <div className="a-stat-lbl">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
