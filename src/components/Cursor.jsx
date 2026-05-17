import { useEffect, useRef, useCallback } from "react";

export default function Cursor() {
  const dotRef = useRef(null), follRef = useRef(null);
  const pos = useRef({ mx:0, my:0, fx:0, fy:0 });
  useEffect(() => {
    const move = e => { pos.current.mx = e.clientX; pos.current.my = e.clientY; };
    window.addEventListener("mousemove", move);
    let id;
    const tick = () => {
      const p = pos.current;
      if (dotRef.current) { dotRef.current.style.left = p.mx+"px"; dotRef.current.style.top = p.my+"px"; }
      p.fx += (p.mx - p.fx) * 0.12; p.fy += (p.my - p.fy) * 0.12;
      if (follRef.current) { follRef.current.style.left = p.fx+"px"; follRef.current.style.top = p.fy+"px"; }
      id = requestAnimationFrame(tick);
    };
    tick();
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(id); };
  }, []);
  const big = useCallback(v => { if (follRef.current) follRef.current.classList.toggle("big", v); }, []);
  useEffect(() => {
    const on = e => { if (e.target.closest("a,button")) big(true); };
    const off = e => { if (e.target.closest("a,button")) big(false); };
    document.addEventListener("mouseover", on);
    document.addEventListener("mouseout", off);
    return () => {
      document.removeEventListener("mouseover", on);
      document.removeEventListener("mouseout", off);
    };
  }, [big]);
  return (<><div ref={dotRef} className="a-cursor" /><div ref={follRef} className="a-cursor-f" /></>);
}
