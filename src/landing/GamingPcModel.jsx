import React, { useEffect, useRef } from 'react';
import gamingPcDocument from '../assets/gaming-pc-model.html?raw';

function GamingPcModel() {
  const frameRef = useRef(null);
  const modelVisibleRef = useRef(true);

  const syncModelVisibility = () => {
    const frameWindow = frameRef.current?.contentWindow;
    if (!frameWindow) return;

    frameWindow.postMessage({
      type: 'nova-model-visibility',
      visible: modelVisibleRef.current
    }, '*');
  };

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      modelVisibleRef.current = entry.isIntersecting;
      syncModelVisibility();
    }, { rootMargin: '120px 0px' });

    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="nova-gaming-pc"
      role="img"
      aria-label="Interactive procedural flagship gaming PC"
    >
      <iframe
        ref={frameRef}
        className="nova-gaming-pc-frame"
        srcDoc={gamingPcDocument}
        title="Interactive flagship gaming PC"
        aria-hidden="true"
        allowtransparency="true"
        tabIndex={-1}
        scrolling="no"
        onLoad={syncModelVisibility}
      />
    </div>
  );
}

export default GamingPcModel;
