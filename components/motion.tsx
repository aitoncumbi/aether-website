'use client';

import { Fragment, useEffect, useState } from 'react';

/**
 * A line that cycles through phrases, swapping letter by letter: each letter
 * of the new phrase rises out of a blur a moment after the one before it.
 * Screen readers and reduced-motion visitors get the first phrase only.
 */
export function SwapText({ phrases, interval = 3200 }: { phrases: string[]; interval?: number }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setI((n) => (n + 1) % phrases.length), interval);
    return () => clearInterval(id);
  }, [phrases.length, interval]);

  let k = 0; // running letter index, for the stagger
  return (
    <>
      <span aria-hidden key={i} className="swap">
        {phrases[i].split(' ').map((word, w) => (
          // Words never break apart; the space after each sits outside it, so lines wrap there.
          <Fragment key={w}>
            <span className="whitespace-nowrap">
              {[...word].map((ch) => (
                <span key={k} style={{ animationDelay: `${k++ * 28}ms` }}>
                  {ch}
                </span>
              ))}
            </span>{' '}
          </Fragment>
        ))}
      </span>
      <span className="sr-only">{phrases[0]}</span>
    </>
  );
}
