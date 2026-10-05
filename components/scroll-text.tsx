import { LogoMark } from '@/lib/layout.shared';

/**
 * Text that lights up word by word as it scrolls through the viewport. Pure CSS
 * (scroll-driven animations, see `.scrub` in global.css); browsers without
 * support and reduced-motion visitors see it fully lit.
 */
export function ScrubText({ text, className = '' }: { text: string; className?: string }) {
  return (
    <p className={className}>
      {text.split(' ').map((word, i) => (
        <span key={i} className="scrub">
          {word}{' '}
        </span>
      ))}
    </p>
  );
}

/** A giant line that slides sideways as the page scrolls past it. */
export function Marquee({ text }: { text: string }) {
  return (
    <div aria-hidden className="marquee relative left-1/2 w-screen -translate-x-1/2 overflow-hidden py-6">
      <span>
        {text} · {text} · {text} ·
      </span>
    </div>
  );
}

/** A slowly turning circular badge, with the Aether mark at its centre. */
export function OrbitBadge() {
  return (
    <div aria-hidden className="relative size-24 text-[#ffc46b]">
      <svg viewBox="0 0 100 100" className="badge-spin absolute inset-0 size-full">
        <defs>
          <path id="badge-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text fill="currentColor" fontSize="9" letterSpacing="3" fontFamily="var(--font-mono)">
          <textPath href="#badge-circle">SELF-HOSTED OBJECT STORAGE ·</textPath>
        </text>
      </svg>
      <span className="absolute inset-0 grid place-items-center text-white">
        <LogoMark size={22} />
      </span>
    </div>
  );
}
