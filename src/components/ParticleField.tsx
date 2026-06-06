import React, { useEffect, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  char: string;
  size: number;
  color: string;
  alpha: number;
  targetAlpha: number;
}

export const ParticleField: React.FC = () => {
  const { theme, isDarkMode } = usePortfolio();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    const glyphs = ['.', '·', '+', '×', '*', '°'];

    // Auto-throttle count based on screen width
    const getParticleCount = () => {
      const baseCount = theme.particles.count || 500;
      if (window.innerWidth < 640) {
        return Math.min(baseCount, 150); // Aggressive throttle on mobile
      } else if (window.innerWidth < 1024) {
        return Math.min(baseCount, 300);
      }
      return baseCount;
    };

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      
      // Re-initialize particles to fit new space
      initParticles();
    };

    const initParticles = () => {
      const rect = canvas.getBoundingClientRect();
      const count = getParticleCount();
      particles = [];

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vx: (Math.random() - 0.5) * (theme.particles.speed || 1.2),
          vy: (Math.random() - 0.5) * (theme.particles.speed || 1.2),
          char: glyphs[Math.floor(Math.random() * glyphs.length)],
          size: Math.random() * 5 + 6, // 6px to 11px font sizes
          color: isDarkMode ? '#fdfcfc' : '#201d1d', // Dynamic theme particle colors
          alpha: Math.random() * (theme.particles.opacity || 0.6) + 0.1,
          targetAlpha: Math.random() * (theme.particles.opacity || 0.6) + 0.1
        });
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse globally since canvas is pointer-events: none
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Frame loops
    const drawFrame = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      // Handle trail effect or clear
      if (theme.animations.enableTrails) {
        // Clear screen dynamically based on dark/light canvas colors
        ctx.fillStyle = isDarkMode ? 'rgba(32, 29, 29, 0.18)' : 'rgba(253, 252, 252, 0.18)'; 
        ctx.fillRect(0, 0, w, h);
      } else {
        ctx.clearRect(0, 0, w, h);
      }

      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      // Update & Draw
      particles.forEach((p) => {
        // Base drift velocity
        let dx = p.vx;
        let dy = p.vy;

        // Mouse gravity physics
        if (mouseRef.current.active && theme.animations.particlePhysics) {
          const mx = mouseRef.current.x;
          const my = mouseRef.current.y;
          const distToMouse = Math.hypot(mx - p.x, my - p.y);

          if (distToMouse < 180) {
            // Strong pull / swirl around cursor
            const force = (180 - distToMouse) / 180;
            const angle = Math.atan2(my - p.y, mx - p.x);
            
            // Swirling motion component (perpendicular to pull)
            const swirlX = -Math.sin(angle) * (theme.particles.speed * 1.5);
            const swirlY = Math.cos(angle) * (theme.particles.speed * 1.5);

            // Pull towards mouse
            const pullX = Math.cos(angle) * (theme.particles.speed * 1.0);
            const pullY = Math.sin(angle) * (theme.particles.speed * 1.0);

            // Interpolate drift with forces
            dx = dx * (1 - force) + (swirlX + pullX) * force;
            dy = dy * (1 - force) + (swirlY + pullY) * force;

            // Pulse opacity when close to cursor (interaction glow)
            p.targetAlpha = Math.min((theme.particles.opacity || 0.6) + 0.3, 0.9);
          } else {
            p.targetAlpha = p.alpha;
          }
        } else {
          p.targetAlpha = p.alpha;
        }

        // Smooth alpha interpolation
        p.alpha += (p.targetAlpha - p.alpha) * 0.1;

        // Apply new coords
        p.x += dx;
        p.y += dy;

        // Wrap boundaries
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // Draw particle character
        ctx.font = `bold ${p.size}px "JetBrains Mono", monospace`;
        ctx.fillStyle = isDarkMode ? `rgba(253, 252, 252, ${p.alpha})` : `rgba(32, 29, 29, ${p.alpha})`;
        ctx.fillText(p.char, p.x, p.y);
      });

      animationId = requestAnimationFrame(drawFrame);
    };

    animationId = requestAnimationFrame(drawFrame);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, [theme.particles, theme.animations, isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        display: 'block',
        zIndex: 0
      }}
    />
  );
};
