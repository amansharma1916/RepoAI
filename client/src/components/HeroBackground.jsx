import React, { useEffect, useRef } from 'react';

const HeroBackground = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef([]);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles - floating code-like symbols and geometric shapes
    const particleCount = Math.min(60, Math.floor(window.innerWidth / 25));
    const symbols = ['{ }', '< >', '( )', 'code', '//', '&&', '||', '=>', 'fn', 'AI', '1', '0', 'git', 'repo', 'ml'];

    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.4 + 0.1,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.01,
      type: Math.random() > 0.6 ? 'symbol' : Math.random() > 0.5 ? 'circle' : 'line',
      length: Math.random() * 40 + 20,
    }));

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        // Mouse interaction - particles gently move away from cursor
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 200;

        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          p.x += (dx / dist) * force * 0.8;
          p.y += (dy / dist) * force * 0.8;
        }

        // Update position
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        // Wrap around edges
        if (p.x < -50) p.x = canvas.width + 50;
        if (p.x > canvas.width + 50) p.x = -50;
        if (p.y < -50) p.y = canvas.height + 50;
        if (p.y > canvas.height + 50) p.y = -50;

        // Draw based on type
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.type === 'symbol') {
          ctx.font = `${p.size * 6 + 8}px 'Inter', monospace`;
          ctx.fillStyle = `rgba(0, 212, 255, ${p.opacity})`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.symbol, 0, 0);
        } else if (p.type === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 3, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0, 212, 255, ${p.opacity * 0.6})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.moveTo(-p.length / 2, 0);
          ctx.lineTo(p.length / 2, 0);
          ctx.strokeStyle = `rgba(0, 212, 255, ${p.opacity * 0.4})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.restore();
      });

      // Draw connecting lines between nearby particles
      particlesRef.current.forEach((p1, i) => {
        particlesRef.current.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 212, 255, ${0.08 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 1 }}
    />
  );
};

export default HeroBackground;
