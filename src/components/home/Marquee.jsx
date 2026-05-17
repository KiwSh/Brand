import { MARQUEE_ITEMS } from "../../data";

export default function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="a-marquee">
      <div className="a-marquee-track">
        {items.map((t, i) => <span key={i} className="a-marquee-item">{t} <span className="a-marquee-dot">◆</span></span>)}
      </div>
    </div>
  );
}
