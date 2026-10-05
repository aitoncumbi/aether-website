'use client';

import { useEffect, useRef } from 'react';

const format = (n: number, decimals: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/**
 * A number that counts up from zero the first time it scrolls into view.
 * The server renders the final value, so it reads correctly without JavaScript
 * and for visitors who prefer reduced motion. Screen readers get the final value only.
 * Frames write straight to the DOM; React never re-renders while it counts.
 */
export function CountUp({
  value,
  decimals = 0,
  duration = 1600,
  suffix = '',
}: {
  value: number;
  decimals?: number;
  duration?: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const show = (n: number) => (el.textContent = format(n, decimals) + suffix);
    show(0);
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          show(value * (1 - Math.pow(1 - t, 4))); // ease-out quart
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      show(value);
    };
  }, [value, decimals, duration, suffix]);

  return (
    <>
      <span ref={ref} aria-hidden className="tabular-nums">
        {format(value, decimals)}
        {suffix}
      </span>
      <span className="sr-only">
        {format(value, decimals)}
        {suffix}
      </span>
    </>
  );
}
