'use client';

import { useEffect, useRef, useState } from 'react';

/** The fixed particle canvas behind the landing page. three.js loads after hydration. */
export function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let dispose: (() => void) | undefined;
    let cancelled = false;
    import('./field')
      .then(({ createField }) => {
        if (!cancelled) dispose = createField(ref.current!);
      })
      .catch((err) => console.error('Aether particles failed to start', err)); // e.g. no WebGL: the page still reads
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0 block h-lvh w-full" />;
}

/** Cards one at a time, with bracketed previous/next buttons. */
export function Carousel({ items }: { items: { value: string; unit: string; label: string }[] }) {
  const [i, setI] = useState(0);
  const step = (d: number) => setI((n) => (n + d + items.length) % items.length);
  const item = items[i];
  const pad = (n: number) => String(n).padStart(2, '0');
  const button =
    'cursor-pointer font-mono text-[11px] tracking-[0.18em] text-white/70 uppercase transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

  return (
    <div className="border border-white/15 bg-black/40 backdrop-blur-sm">
      <div className="flex justify-between border-b border-white/10 px-6 py-3 font-mono text-[10px] tracking-[0.2em] text-white/45 uppercase">
        <span>Result</span>
        <span>
          {pad(i + 1)} / {pad(items.length)}
        </span>
      </div>
      <div aria-live="polite" className="grid min-h-60 content-end px-6 py-8">
        <p key={i} className="fade-in flex items-baseline gap-3">
          <span className="text-6xl font-light tracking-tight tabular-nums md:text-7xl">{item.value}</span>
          <span className="font-mono text-xs tracking-[0.12em] text-[#9ff4ff] uppercase">{item.unit}</span>
        </p>
        <p className="mt-3 text-sm leading-relaxed text-white/60">{item.label}</p>
      </div>
      <div className="flex justify-between border-t border-white/10 px-6 py-3">
        <button type="button" className={button} onClick={() => step(-1)} aria-label="Previous result">
          [ ← Prev ]
        </button>
        <button type="button" className={button} onClick={() => step(1)} aria-label="Next result">
          [ Next → ]
        </button>
      </div>
    </div>
  );
}
