import React, { useCallback, useEffect, useRef } from 'react';
import starfieldDocument from '../starfield.html?raw';

function StarfieldBackground() {
  const frameRef = useRef(null);
  const scrollFrameRef = useRef(0);

  const syncScroll = useCallback(() => {
    const frameWindow = frameRef.current?.contentWindow;
    if (!frameWindow) return;

    const pageScrollMax = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    );
    const scrollProgress = pageScrollMax > 0 ? window.scrollY / pageScrollMax : 0;
    frameWindow.postMessage({
      type: 'nova-scroll-progress',
      progress: scrollProgress
    }, '*');
  }, []);

  useEffect(() => {
    const requestScrollSync = () => {
      if (scrollFrameRef.current) return;
      scrollFrameRef.current = window.requestAnimationFrame(() => {
        scrollFrameRef.current = 0;
        syncScroll();
      });
    };

    const forwardPointer = (event) => {
      const frameWindow = frameRef.current?.contentWindow;
      if (!frameWindow) return;

      frameWindow.dispatchEvent(new frameWindow.MouseEvent('mousemove', {
        clientX: event.clientX,
        clientY: event.clientY
      }));
    };

    const clearPointer = () => {
      const frameWindow = frameRef.current?.contentWindow;
      if (!frameWindow) return;
      frameWindow.dispatchEvent(new frameWindow.MouseEvent('mouseout'));
    };

    window.addEventListener('scroll', requestScrollSync, { passive: true });
    window.addEventListener('resize', requestScrollSync, { passive: true });
    window.addEventListener('mousemove', forwardPointer, { passive: true });
    document.documentElement.addEventListener('mouseleave', clearPointer);

    requestScrollSync();

    return () => {
      window.removeEventListener('scroll', requestScrollSync);
      window.removeEventListener('resize', requestScrollSync);
      window.removeEventListener('mousemove', forwardPointer);
      document.documentElement.removeEventListener('mouseleave', clearPointer);
      if (scrollFrameRef.current) {
        window.cancelAnimationFrame(scrollFrameRef.current);
      }
    };
  }, [syncScroll]);

  return (
    <iframe
      ref={frameRef}
      className="starfield-background"
      srcDoc={starfieldDocument}
      title="Animated starfield background"
      aria-hidden="true"
      tabIndex={-1}
      scrolling="no"
      onLoad={syncScroll}
    />
  );
}

export default StarfieldBackground;
