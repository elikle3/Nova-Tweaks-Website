import React, { useEffect, useRef } from 'react';

const STAR_COUNT = 220;

function createStars() {
  let seed = 0x51f15e;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0xffffffff;
  };
  return Array.from({ length: STAR_COUNT }, () => ({
    x: random(),
    y: random(),
    depth: 0.2 + random() * 0.8,
    radius: 0.35 + random() * 1.35,
    phase: random() * Math.PI * 2
  }));
}

function StarfieldBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return undefined;

    const stars = createStars();
    const pointer = { x: 0, y: 0 };
    let scrollProgress = 0;
    let width = 1;
    let height = 1;
    let animationFrame = 0;
    let visible = true;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, window.innerWidth);
      height = Math.max(1, window.innerHeight);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const onPointerMove = (event) => {
      pointer.x = (event.clientX / Math.max(width, 1) - 0.5) * 2;
      pointer.y = (event.clientY / Math.max(height, 1) - 0.5) * 2;
    };

    const onScroll = () => {
      const maximum = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollProgress = Math.max(0, Math.min(1, window.scrollY / maximum));
    };

    const draw = (timestamp = 0) => {
      const time = reducedMotion ? 0 : timestamp * 0.00035;
      const background = context.createRadialGradient(
        width * (0.5 + pointer.x * 0.025),
        height * 0.34,
        0,
        width * 0.5,
        height * 0.5,
        Math.max(width, height)
      );
      background.addColorStop(0, '#10133d');
      background.addColorStop(0.45, '#090b27');
      background.addColorStop(1, '#03040f');
      context.fillStyle = background;
      context.fillRect(0, 0, width, height);

      for (const star of stars) {
        const drift = (time * star.depth * 0.035 + scrollProgress * star.depth * 0.18) % 1;
        const x = ((star.x + drift + pointer.x * star.depth * 0.012) % 1) * width;
        const y = ((star.y + scrollProgress * star.depth * 0.08 + pointer.y * star.depth * 0.008) % 1) * height;
        const twinkle = reducedMotion ? 0.72 : 0.48 + Math.sin(time * 8 + star.phase) * 0.24;
        context.beginPath();
        context.arc(x, y, star.radius * star.depth, 0, Math.PI * 2);
        context.fillStyle = `rgba(${star.depth > 0.72 ? '190,232,255' : '202,183,255'},${Math.max(0.18, twinkle)})`;
        context.fill();
      }

      if (visible && !reducedMotion) animationFrame = window.requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(([entry]) => {
      const wasVisible = visible;
      visible = entry.isIntersecting;
      if (visible && !wasVisible && !reducedMotion) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    });
    observer.observe(canvas);

    resize();
    onScroll();
    draw();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="starfield-background"
      aria-hidden="true"
    />
  );
}

export default StarfieldBackground;
