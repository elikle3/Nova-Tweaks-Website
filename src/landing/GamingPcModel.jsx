import React, { useEffect, useRef } from 'react';

function GamingPcModel() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext('2d');
    if (!context) return undefined;

    let width = 1;
    let height = 1;
    let frame = 0;
    let visible = true;
    const pointer = { x: 0, y: 0 };
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const onPointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
      pointer.y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));
    };
    const clearPointer = () => {
      pointer.x = 0;
      pointer.y = 0;
    };

    const polygon = (points, fill, stroke = '') => {
      context.beginPath();
      points.forEach(([x, y], index) => (index ? context.lineTo(x, y) : context.moveTo(x, y)));
      context.closePath();
      context.fillStyle = fill;
      context.fill();
      if (stroke) {
        context.strokeStyle = stroke;
        context.lineWidth = 1;
        context.stroke();
      }
    };

    const drawFan = (x, y, radius, rotation) => {
      const glow = context.createRadialGradient(x, y, radius * 0.15, x, y, radius);
      glow.addColorStop(0, 'rgba(222,238,255,.95)');
      glow.addColorStop(0.35, 'rgba(104,226,255,.35)');
      glow.addColorStop(0.72, 'rgba(154,83,255,.28)');
      glow.addColorStop(1, 'rgba(72,33,150,.02)');
      context.fillStyle = glow;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();

      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      for (let blade = 0; blade < 7; blade += 1) {
        context.rotate((Math.PI * 2) / 7);
        context.beginPath();
        context.moveTo(radius * 0.12, 0);
        context.quadraticCurveTo(radius * 0.62, -radius * 0.5, radius * 0.78, -radius * 0.05);
        context.quadraticCurveTo(radius * 0.5, radius * 0.2, radius * 0.12, 0);
        context.fillStyle = 'rgba(185,224,255,.28)';
        context.fill();
      }
      context.restore();
      context.strokeStyle = 'rgba(197,169,255,.42)';
      context.lineWidth = 1.5;
      context.beginPath();
      context.arc(x, y, radius * 0.83, 0, Math.PI * 2);
      context.stroke();
    };

    const draw = (timestamp = 0) => {
      context.clearRect(0, 0, width, height);
      const scale = Math.min(width / 520, height / 640);
      const centerX = width * 0.5 + pointer.x * 9;
      const centerY = height * 0.52 + pointer.y * 5;
      const caseWidth = 270 * scale;
      const caseHeight = 430 * scale;
      const depth = 82 * scale;
      const left = centerX - caseWidth * 0.5;
      const top = centerY - caseHeight * 0.5;
      const right = left + caseWidth;
      const bottom = top + caseHeight;
      const rotation = reducedMotion ? 0 : timestamp * 0.0016;

      context.shadowBlur = 42 * scale;
      context.shadowColor = 'rgba(115,60,255,.32)';
      polygon(
        [[left, top], [right, top + 18 * scale], [right, bottom], [left, bottom - 16 * scale]],
        'rgba(10,12,26,.96)',
        'rgba(190,163,255,.36)'
      );
      context.shadowBlur = 0;

      polygon(
        [[right, top + 18 * scale], [right + depth, top - 20 * scale], [right + depth, bottom - 46 * scale], [right, bottom]],
        'rgba(7,8,19,.98)',
        'rgba(129,88,220,.28)'
      );
      polygon(
        [[left, top], [left + depth, top - 38 * scale], [right + depth, top - 20 * scale], [right, top + 18 * scale]],
        'rgba(22,19,43,.98)',
        'rgba(190,163,255,.3)'
      );

      const glassInset = 19 * scale;
      const glass = context.createLinearGradient(left, top, right, bottom);
      glass.addColorStop(0, 'rgba(67,87,130,.28)');
      glass.addColorStop(0.55, 'rgba(18,22,49,.5)');
      glass.addColorStop(1, 'rgba(74,28,120,.3)');
      context.fillStyle = glass;
      context.fillRect(left + glassInset, top + 38 * scale, caseWidth - glassInset * 2, caseHeight - 67 * scale);
      context.strokeStyle = 'rgba(146,218,255,.18)';
      context.strokeRect(left + glassInset, top + 38 * scale, caseWidth - glassInset * 2, caseHeight - 67 * scale);

      const fanX = left + 72 * scale;
      [top + 112 * scale, top + 216 * scale, top + 320 * scale].forEach((fanY, index) => {
        drawFan(fanX, fanY, 39 * scale, rotation * (index % 2 ? -1 : 1));
      });
      drawFan(right - 57 * scale, top + 106 * scale, 34 * scale, -rotation);

      context.fillStyle = 'rgba(26,29,55,.9)';
      context.fillRect(left + 118 * scale, top + 175 * scale, 112 * scale, 66 * scale);
      const gpuGlow = context.createLinearGradient(left + 118 * scale, 0, right - 25 * scale, 0);
      gpuGlow.addColorStop(0, '#72e1ff');
      gpuGlow.addColorStop(0.5, '#ae78ff');
      gpuGlow.addColorStop(1, '#ff64be');
      context.fillStyle = gpuGlow;
      context.fillRect(left + 122 * scale, top + 231 * scale, 103 * scale, 3 * scale);

      context.fillStyle = 'rgba(35,38,70,.95)';
      context.fillRect(left + 125 * scale, top + 273 * scale, 90 * scale, 68 * scale);
      context.strokeStyle = 'rgba(122,225,255,.5)';
      context.strokeRect(left + 137 * scale, top + 287 * scale, 66 * scale, 39 * scale);

      context.fillStyle = 'rgba(199,178,255,.6)';
      context.font = `${Math.max(8, 10 * scale)}px Inter, system-ui, sans-serif`;
      context.letterSpacing = `${2 * scale}px`;
      context.fillText('NOVA', left + 140 * scale, bottom - 37 * scale);

      if (visible && !reducedMotion) frame = window.requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(([entry]) => {
      const wasVisible = visible;
      visible = entry.isIntersecting;
      if (visible && !wasVisible && !reducedMotion) frame = window.requestAnimationFrame(draw);
    }, { rootMargin: '120px 0px' });
    observer.observe(canvas);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reducedMotion) draw();
    });
    resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', onPointerMove, { passive: true });
    canvas.addEventListener('pointerleave', clearPointer);
    resize();
    draw();

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', clearPointer);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      className="nova-gaming-pc"
      role="img"
      aria-label="Procedural flagship gaming PC"
    >
      <canvas ref={canvasRef} className="nova-gaming-pc-frame" aria-hidden="true" />
    </div>
  );
}

export default GamingPcModel;
