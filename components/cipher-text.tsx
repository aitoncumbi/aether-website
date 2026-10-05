'use client';

import { useEffect, useRef } from 'react';

const glyphs = 'ABCDEF0123456789';
const random = (text: string) => text.replace(/\S/g, () => glyphs[Math.floor(Math.random() * glyphs.length)]);

/**
 * Text that decrypts itself: it starts as random hex and resolves left to right
 * when it scrolls into view, then re-encrypts and decrypts again every `loop` ms.
 * With `noise`, it never resolves and keeps shifting, like ciphertext.
 * Renders the real text on the server and for reduced motion; screen readers
 * only ever get the real text. Frames write straight to the DOM, not React state.
 */
export function CipherText({
  text,
  loop,
  noise = false,
  duration = 900,
}: {
  text: string;
  loop?: number;
  noise?: boolean;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const show = (s: string) => (el.textContent = s);
    let frame = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let interval: ReturnType<typeof setInterval> | undefined;

    const decrypt = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const solved = Math.floor(((now - start) / duration) * text.length);
        show(text.slice(0, solved) + random(text.slice(solved)));
        if (solved < text.length) frame = requestAnimationFrame(tick);
        else if (loop) timer = setTimeout(decrypt, loop);
      };
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      clearInterval(interval);
    };

    const observer = new IntersectionObserver(([entry]) => {
      stop();
      if (!entry.isIntersecting) return;
      if (noise) interval = setInterval(() => show(random(text)), 90);
      else decrypt();
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      stop();
      show(text);
    };
  }, [text, loop, noise, duration]);

  return (
    <>
      <span ref={ref} aria-hidden className="whitespace-pre">
        {text}
      </span>
      <span className="sr-only">{text}</span>
    </>
  );
}
