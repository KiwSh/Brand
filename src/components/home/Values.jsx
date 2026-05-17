import { useLanguage } from "../../hooks/useLanguage";

export default function Values() {
  const { t } = useLanguage();

  const values = [
    { 
      num: "01", 
      title: t("values_v1_title"), 
      desc: t("values_v1_desc"),
      icon: <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{opacity:.5}}><circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="1"/><path d="M18 10v8l5 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg> 
    },
    { 
      num: "02", 
      title: t("values_v2_title"), 
      desc: t("values_v2_desc"),
      icon: <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{opacity:.5}}><path d="M18 4l3.5 8.5H30l-7 5 2.5 8.5L18 21l-7.5 5 2.5-8.5-7-5h8.5Z" stroke="currentColor" strokeWidth="1"/></svg> 
    },
    { 
      num: "03", 
      title: t("values_v3_title"), 
      desc: t("values_v3_desc"),
      icon: <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{opacity:.5}}><path d="M18 28s-12-7-12-16a12 12 0 0 1 24 0c0 9-12 16-12 16Z" stroke="currentColor" strokeWidth="1"/><circle cx="18" cy="13" r="3" stroke="currentColor" strokeWidth="1"/></svg> 
    },
    { 
      num: "04", 
      title: t("values_v4_title"), 
      desc: t("values_v4_desc"),
      icon: <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{opacity:.5}}><rect x="4" y="10" width="28" height="20" rx="2" stroke="currentColor" strokeWidth="1"/><path d="M4 16h28M12 6v4M24 6v4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg> 
    },
  ];

  const getFormattedHeader = () => {
    const titleText = t("values_title");
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
    <section id="values" className="a-values">
      <div className="a-values-header">
        <span className="a-section-label a-reveal">{t("values_label")}</span>
        <h2 className="a-reveal d1">{getFormattedHeader()}</h2>
      </div>
      <div className="a-val-grid">
        {values.map((v, i) => (
          <div key={v.num} className={`a-val-item a-reveal d${i+1}`}>
            {v.icon}
            <div className="a-val-num">{v.num}</div>
            <div className="a-val-title">{v.title}</div>
            <div className="a-val-desc">{v.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
