import { useEffect, useRef } from "react";

export default function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, animId;
    const particles = [];
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    class Particle {
      constructor() { this.init(); }
      init() {
        this.x = Math.random() * W; this.y = H + Math.random() * 200;
        this.size = Math.random() * 2.5 + 0.5;
        this.vy = -(Math.random() * 0.6 + 0.15); this.vx = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.wb = Math.random() * Math.PI * 2; this.wbs = Math.random() * 0.015 + 0.005;
        this.wba = Math.random() * 0.8 + 0.2;
        this.life = 0; this.maxLife = Math.random() * 300 + 200;
        this.shape = Math.floor(Math.random() * 3); this.gold = Math.random() > 0.6;
      }
      update() {
        this.y += this.vy; this.x += this.vx + Math.sin(this.wb) * this.wba;
        this.wb += this.wbs; this.life++;
        if (this.y < -20 || this.life > this.maxLife) this.init();
      }
      draw() {
        const a = this.opacity * (1 - this.life / this.maxLife);
        ctx.save(); ctx.globalAlpha = a;
        ctx.fillStyle = this.gold ? "#b89a6a" : "#8a8076";
        ctx.beginPath();
        if (this.shape === 0) { ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); }
        else if (this.shape === 1) { ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size); }
        else {
          for (let i = 0; i < 4; i++) {
            const a1 = (i * Math.PI / 2) - Math.PI / 4, a2 = a1 + Math.PI / 4;
            i === 0
              ? ctx.moveTo(this.x + Math.cos(a2) * this.size * 1.2, this.y + Math.sin(a2) * this.size * 1.2)
              : ctx.lineTo(this.x + Math.cos(a1) * this.size * 0.5, this.y + Math.sin(a1) * this.size * 0.5);
            ctx.lineTo(this.x + Math.cos(a2) * this.size * 1.2, this.y + Math.sin(a2) * this.size * 1.2);
          }
          ctx.closePath(); ctx.fill();
        }
        ctx.restore();
      }
    }
    for (let i = 0; i < 90; i++) {
      const p = new Particle(); p.y = Math.random() * H; p.life = Math.floor(Math.random() * p.maxLife);
      particles.push(p);
    }
    const loop = () => { ctx.clearRect(0, 0, W, H); particles.forEach(p => { p.update(); p.draw(); }); animId = requestAnimationFrame(loop); };
    loop();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position:"fixed", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:0, opacity:.35 }} />;
}
