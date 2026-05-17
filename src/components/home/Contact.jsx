import { useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";

export default function Contact() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const getFormattedHeader = () => {
    const titleText = t("contact_title");
    const lines = titleText.split("\n");
    return (
      <>
        {lines[0]}<br/>
        <em>{lines[1]}</em>
      </>
    );
  };

  return (
    <section id="contact" className="a-contact">
      <div className="a-contact-bg">RISH</div>
      <div className="a-contact-inner">
        <span className="a-section-label a-reveal">{t("contact_label")}</span>
        <h2 className="a-reveal d1">{getFormattedHeader()}</h2>
        <p className="a-reveal d2">{t("contact_sub")}</p>
        <div className="a-contact-form a-reveal d3">
          <input 
            type="email" 
            placeholder={t("contact_placeholder")} 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
          />
          <button onClick={() => { if (email) setSent(true); }}>
            {sent ? t("contact_subscribed") : t("contact_subscribe")}
          </button>
        </div>
        <div className="a-contact-links a-reveal d4">
          {["Instagram","WhatsApp","Tokopedia","Shopee"].map(s => (
            <button key={s} className="a-contact-link">{s}</button>
          ))}
        </div>
      </div>
    </section>
  );
}
