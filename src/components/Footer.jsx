import { useLanguage } from "../hooks/useLanguage";

export default function Footer() {
  const { t } = useLanguage();

  const cols = [
    { 
      title: t("footer_col1"), 
      links: [
        t("Signature Series"), 
        t("Limited Edition"), 
        t("New Arrivals"), 
        t("Gift Sets"), 
        t("Archive")
      ] 
    },
    { 
      title: t("footer_col2"), 
      links: [
        t("Our Story"), 
        t("Atelier"), 
        t("Sustainability"), 
        t("Press"), 
        t("Careers")
      ] 
    },
    { 
      title: t("footer_col3"), 
      links: [
        t("Shipping Info"), 
        t("Returns"), 
        t("Size Guide"), 
        t("FAQ"), 
        t("Contact Us")
      ] 
    },
  ];

  return (
    <>
      <footer className="a-footer">
        <div className="a-footer-brand">
          <div className="a-footer-logo">RISH</div>
          <p>{t("footer_desc")}</p>
        </div>
        {cols.map(c => (
          <div key={c.title} className="a-footer-col">
            <h4>{c.title}</h4>
            <ul>
              {c.links.map(l => (
                <li key={l}><button>{l}</button></li>
              ))}
            </ul>
          </div>
        ))}
      </footer>
      <div className="a-footer-bottom">
        <p>{t("footer_copyright")}</p>
        <p>{t("footer_privacy")}</p>
      </div>
    </>
  );
}
