'use client';

import { ReactLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';

/** Smooth wheel scrolling on the landing page. Lenis turns itself off when reduced motion is preferred. */
export function SmoothScroll() {
  return <ReactLenis root options={{ lerp: 0.1 }} />;
}
