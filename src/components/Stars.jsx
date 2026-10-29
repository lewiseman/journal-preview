import { useEffect, useRef } from "react";
import { reducedMotion } from "../scroll";

/* A twinkling night sky with the occasional shooting star.
   Stars drift against the pointer by their depth. Pauses off-screen. */
export default function Stars({ className = "", density = 2600 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let stars = [];
    let shooting = null;
    let nextShot = performance.now() + 2500;
    let raf = 0;
    let visible = true;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(520, Math.round((w * h) / density));
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h * 0.85,
        r: Math.random() ** 2.4 * 1.7 + 0.25,
        p: Math.random() * Math.PI * 2,
        s: 0.6 + Math.random() * 1.8,
        z: 0.2 + Math.random() * 0.8,
        gold: Math.random() < 0.08,
      }));
    };

    const draw = (t) => {
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        const a = reducedMotion ? 0.8 : 0.45 + 0.55 * Math.sin(s.p + (t / 1000) * s.s) ** 2;
        const x = s.x - pointer.x * 18 * s.z;
        const y = s.y - pointer.y * 12 * s.z;
        ctx.globalAlpha = a * (0.4 + s.z * 0.6);
        ctx.fillStyle = s.gold ? "#ffd84a" : "#f4ead4";
        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
        if (s.r > 1.4) {
          // little cross-glint on the brightest stars
          ctx.globalAlpha = a * 0.35;
          ctx.fillRect(x - s.r * 3, y - 0.3, s.r * 6, 0.6);
          ctx.fillRect(x - 0.3, y - s.r * 3, 0.6, s.r * 6);
        }
      }

      if (!reducedMotion) {
        if (!shooting && t > nextShot) {
          shooting = {
            x: w * (0.2 + Math.random() * 0.7),
            y: h * Math.random() * 0.35,
            vx: -(6 + Math.random() * 4),
            vy: 2.5 + Math.random() * 2,
            life: 1,
          };
          nextShot = t + 4000 + Math.random() * 5000;
        }
        if (shooting) {
          const s = shooting;
          const g = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 14, s.y - s.vy * 14);
          g.addColorStop(0, "rgba(255,240,200,0.95)");
          g.addColorStop(1, "rgba(255,240,200,0)");
          ctx.globalAlpha = s.life;
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x - s.vx * 14, s.y - s.vy * 14);
          ctx.stroke();
          s.x += s.vx;
          s.y += s.vy;
          s.life -= 0.012;
          if (s.life <= 0) shooting = null;
        }
      }
      ctx.globalAlpha = 1;
      if (visible && !reducedMotion) raf = requestAnimationFrame(draw);
    };

    const onPointer = (e) => {
      pointer.tx = e.clientX / window.innerWidth - 0.5;
      pointer.ty = e.clientY / window.innerHeight - 0.5;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(draw);
    });

    resize();
    io.observe(canvas);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [density]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
