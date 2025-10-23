'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type SearchProgressCarouselProps = {
  phrases: string[];
  isActive: boolean;
  cycleMs?: number;
};

const TRANSITION_MS = 280;

export function SearchProgressCarousel({
  phrases,
  isActive,
  cycleMs = 3500,
}: SearchProgressCarouselProps) {
  const normalizedPhrases = useMemo(
    () =>
      phrases
        .map((phrase) => phrase?.trim())
        .filter((phrase): phrase is string => Boolean(phrase?.length)),
    [phrases],
  );

  const phrasesToCycle = normalizedPhrases.length
    ? normalizedPhrases
    : ['Finding the best agents for you...'];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const transitionRef = useRef<number | null>(null);
  const wasActiveRef = useRef(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [phrasesToCycle]);

  useEffect(() => {
    const clearTimers = () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (transitionRef.current !== null) {
        window.clearTimeout(transitionRef.current);
        transitionRef.current = null;
      }
    };

    if (isActive && !wasActiveRef.current) {
      setCurrentIndex(0);
    }

    wasActiveRef.current = isActive;

    clearTimers();

    if (!isActive || phrasesToCycle.length <= 1) {
      setIsTransitioning(false);
      return () => {
        clearTimers();
      };
    }

    const safeCycleMs = Math.max(cycleMs, TRANSITION_MS * 2);

    intervalRef.current = window.setInterval(() => {
      setIsTransitioning(true);

      transitionRef.current = window.setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % phrasesToCycle.length);
        setIsTransitioning(false);
      }, TRANSITION_MS);
    }, safeCycleMs);

    return () => {
      clearTimers();
    };
  }, [cycleMs, isActive, phrasesToCycle]);

  const currentPhrase = phrasesToCycle[currentIndex % phrasesToCycle.length];

  const rootVisibilityClass = isActive ? 'opacity-100' : 'opacity-0';
  const transitionClass = isTransitioning
    ? prefersReducedMotion
      ? 'opacity-0'
      : '-translate-y-3 opacity-0'
    : prefersReducedMotion
      ? 'opacity-100'
      : 'translate-y-0 opacity-100';

  return (
    <div
      className={`pointer-events-none flex flex-col items-center gap-6 text-center transition-opacity duration-300 ease-out ${rootVisibilityClass}`}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 via-indigo-500 to-purple-500 text-2xl font-semibold text-white shadow-lg">
        M
      </div>
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
          Search In Progress
        </p>
        <div
          aria-live="polite"
          role="status"
          className="relative h-6 overflow-hidden text-base font-medium text-slate-700"
        >
          <span
            className={`block transition-all duration-300 ease-out ${transitionClass}`}
            style={prefersReducedMotion ? { transform: 'translateY(0)' } : undefined}
          >
            {currentPhrase}
          </span>
        </div>
      </div>
    </div>
  );
}

