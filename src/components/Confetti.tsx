import { useEffect, useRef } from "react";

type P = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  size: number;
  color: string;
  shape: "rect" | "circle" | "star";
  life: number;
};

const COLORS = [
  "#FFD84D",
  "#FF8B3D",
  "#5CC8FF",
  "#9B4FD6",
  "#4CAF3E",
  "#FF6B6B",
  "#FFF3C4",
];

/**
 * Bursting confetti painted on a canvas overlay.
 * `burstKey` increments to trigger a new explosion of paper.
 */
export default function Confetti({
  burstKey,
  count = 90,
  originY = 0.42,
}: {
  burstKey: number;
  count?: number;
  originY?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const partsRef = useRef<P[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const loop = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      const parts = partsRef.current;
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.vy += 0.28;
        p.vx *= 0.992;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life -= 1;
        if (p.life <= 0 || p.y > h + 60) {
          parts.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.min(1, p.life / 32);
        ctx.fillStyle = p.color;
        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2.2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          for (let k = 0; k < 10; k++) {
            const r = k % 2 === 0 ? p.size / 1.5 : p.size / 3.4;
            const a = (Math.PI / 5) * k - Math.PI / 2;
            ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
          }
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }
      if (parts.length > 0) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        rafRef.current = null;
      }
    };

    if (burstKey > 0 && !reduced) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const cx = w / 2;
      const cy = h * originY;
      for (let i = 0; i < count; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 2.15;
        const speed = 7 + Math.random() * 13;
        partsRef.current.push({
          x: cx + (Math.random() - 0.5) * w * 0.22,
          y: cy + (Math.random() - 0.5) * 40,
          vx: Math.cos(angle) * speed * (0.6 + Math.random() * 0.9),
          vy: Math.sin(angle) * speed,
          rot: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.34,
          size: 12 + Math.random() * 18,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          shape: Math.random() < 0.62 ? "rect" : Math.random() < 0.6 ? "circle" : "star",
          life: 110 + Math.random() * 90,
        });
      }
      if (rafRef.current === null) rafRef.current = requestAnimationFrame(loop);
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [burstKey, count, originY]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-40"
    />
  );
}
