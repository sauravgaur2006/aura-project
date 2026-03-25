import { useEffect, useRef } from 'react';

const BackgroundCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    let W: number, H: number;
    let animationFrameId: number;
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      W = c.width = window.innerWidth;
      H = c.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    document.addEventListener('mousemove', handleMouseMove);

    const spacing = 48;
    const PCOUNT = 65;

    interface ParticleData {
      x: number; y: number; vx: number; vy: number; r: number; alpha: number;
    }

    const particles: ParticleData[] = [];
    for (let i = 0; i < PCOUNT; i++) {
      particles.push({
        x: Math.random() * (W || 1000),
        y: Math.random() * (H || 800),
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.4,
        alpha: Math.random() * 0.45 + 0.08,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      const g1 = ctx.createRadialGradient(W * 0.25, H * 0.35, 0, W * 0.25, H * 0.35, W * 0.7);
      g1.addColorStop(0, 'rgba(59, 130, 246, 0.045)');
      g1.addColorStop(0.5, 'rgba(139, 92, 246, 0.025)');
      g1.addColorStop(1, 'transparent');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, W, H);

      const g2 = ctx.createRadialGradient(W * 0.75, H * 0.65, 0, W * 0.75, H * 0.65, W * 0.5);
      g2.addColorStop(0, 'rgba(6, 214, 160, 0.03)');
      g2.addColorStop(1, 'transparent');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, W, H);

      const cols = Math.ceil(W / spacing) + 1;
      const rows = Math.ceil(H / spacing) + 1;
      for (let r = 0; r < rows; r++) {
        for (let col = 0; col < cols; col++) {
          const x = col * spacing;
          const y = r * spacing;
          const dx = x - mouse.x;
          if (Math.abs(dx) > 180) continue;
          const dy = y - mouse.y;
          if (Math.abs(dy) > 180) continue;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const influence = Math.max(0, 1 - dist / 180);
          if (influence <= 0) continue;
          const size = 0.7 + influence * 2.5;
          const alpha = 0.06 + influence * 0.35;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(59, 130, 246, ${alpha})`;
          ctx.fill();
          if (influence > 0.15) {
            ctx.beginPath();
            ctx.arc(x, y, size + 3.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(6, 214, 160, ${influence * 0.12})`;
            ctx.fill();
          }
        }
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 214, 160, ${p.alpha})`;
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const ddx = p.x - q.x;
          if (Math.abs(ddx) > 150) continue;
          const ddy = p.y - q.y;
          if (Math.abs(ddy) > 150) continue;
          const d = Math.sqrt(ddx * ddx + ddy * ddy);
          if (d < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.065 * (1 - d / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-screen h-screen z-0 pointer-events-none"
    />
  );
};

export default BackgroundCanvas;
