import React, { createElement, useEffect, useLayoutEffect, useRef, useState } from 'react';

const DEFAULT_CHARACTER_DELAY = 22.5;
const CURSOR_HOLD = 1100;
const CURSOR_FADE = 480;

function getReducedMotionPreference() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function HeroTypewriterTitle({
  text,
  className = '',
  as = 'h1',
  startOnView = false,
  hideNavigation = false,
  characterDelay = DEFAULT_CHARACTER_DELAY
}) {
  const titleRef = useRef(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(getReducedMotionPreference);
  const [started, setStarted] = useState(prefersReducedMotion || !startOnView);
  const [typedText, setTypedText] = useState(prefersReducedMotion ? text : '');
  const [cursorPhase, setCursorPhase] = useState(prefersReducedMotion ? 'hidden' : 'typing');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handlePreferenceChange = (event) => setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener('change', handlePreferenceChange);
    return () => mediaQuery.removeEventListener('change', handlePreferenceChange);
  }, []);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const pending = hideNavigation && started && !prefersReducedMotion && typedText.length < text.length;
    root.classList.toggle('hero-typewriter-pending', pending);
    return () => {
      if (hideNavigation) root.classList.remove('hero-typewriter-pending');
    };
  }, [hideNavigation, prefersReducedMotion, started, text.length, typedText.length]);

  useLayoutEffect(() => {
    const scope = titleRef.current?.closest('[data-typewriter-scope]');
    scope?.style.setProperty('--active-hero-typewriter-duration', `${text.length * characterDelay}ms`);
    return () => scope?.style.removeProperty('--active-hero-typewriter-duration');
  }, [characterDelay, text.length]);

  useEffect(() => {
    if (!startOnView || started || prefersReducedMotion) return undefined;
    const title = titleRef.current;
    if (!title) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setStarted(true);
      observer.disconnect();
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.22 });

    observer.observe(title);
    return () => observer.disconnect();
  }, [prefersReducedMotion, startOnView, started]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setStarted(true);
      setTypedText(text);
      setCursorPhase('hidden');
      return undefined;
    }
    if (!started) return undefined;

    let characterIndex = 0;
    let typingTimer;
    let cursorHoldTimer;
    let cursorFadeTimer;

    setTypedText('');
    setCursorPhase('typing');

    const typeNextCharacter = () => {
      characterIndex += 1;
      setTypedText(text.slice(0, characterIndex));

      if (characterIndex < text.length) {
        typingTimer = window.setTimeout(typeNextCharacter, characterDelay);
        return;
      }

      setCursorPhase('holding');
      cursorHoldTimer = window.setTimeout(() => {
        setCursorPhase('fading');
        cursorFadeTimer = window.setTimeout(() => setCursorPhase('hidden'), CURSOR_FADE);
      }, CURSOR_HOLD);
    };

    typingTimer = window.setTimeout(typeNextCharacter, characterDelay);

    return () => {
      window.clearTimeout(typingTimer);
      window.clearTimeout(cursorHoldTimer);
      window.clearTimeout(cursorFadeTimer);
    };
  }, [characterDelay, prefersReducedMotion, started, text]);

  return createElement(
    as,
    {
      ref: titleRef,
      className: `hero-typewriter-title ${started ? 'is-started' : ''} ${typedText.length === text.length ? 'is-complete' : ''} ${className}`.trim(),
      'aria-label': text
    },
    <>
      <span className="hero-typewriter-reserve" aria-hidden="true">{text}</span>
      <span className="hero-typewriter-text" aria-hidden="true">
        {typedText}
        <span className={`hero-typewriter-cursor is-${cursorPhase}`}>|</span>
      </span>
    </>
  );
}
