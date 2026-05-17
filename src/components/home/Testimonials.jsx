import { useLanguage } from "../../hooks/useLanguage";

export default function Testimonials() {
  const { t } = useLanguage();

  const testimonials = [
    { 
      init: "SR", 
      name: "Sarah R.", 
      role: t("testi_t1_role"), 
      text: t("testi_t1_text") 
    },
    { 
      init: "MP", 
      name: "Marco P.", 
      role: t("testi_t2_role"), 
      text: t("testi_t2_text") 
    },
    { 
      init: "LW", 
      name: "Layla W.", 
      role: t("testi_t3_role"), 
      text: t("testi_t3_text") 
    },
  ];

  const getFormattedHeader = () => {
    const titleText = t("testi_title");
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
    <section id="testimonials" className="a-testi">
      <div className="a-testi-header a-reveal">
        <span className="a-section-label">{t("testi_label")}</span>
        <h2>{getFormattedHeader()}</h2>
      </div>
      <div className="a-testi-grid">
        {testimonials.map((t, i) => (
          <div key={t.name} className={`a-testi-card a-reveal d${i+1}`}>
            <div className="a-stars">★★★★★</div>
            <div className="a-testi-quote">"</div>
            <div className="a-testi-text">{t.text}</div>
            <div className="a-testi-author">
              <div className="a-testi-avatar">{t.init}</div>
              <div>
                <div className="a-testi-name">{t.name}</div>
                <div className="a-testi-role">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
