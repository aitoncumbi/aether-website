import Link from 'next/link';
import { SmoothScroll } from '@/components/smooth-scroll';
import { projectUrl } from '@/lib/shared';

const navLink = 'text-xs text-white/70 transition-colors hover:text-white';
const mono = 'font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase';

// The landing page is a dark particle scene, so it stays dark whatever the theme setting.
export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <div className="dark overflow-x-clip bg-black text-white">
      <SmoothScroll />
      <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-black/85 to-transparent">
        <div className="mx-auto grid h-20 max-w-7xl grid-cols-[1fr_auto] items-center gap-6 border-b border-white/10 px-4 md:grid-cols-[1fr_auto_1fr] md:px-12">
          <Link href="/" className="w-fit text-sm leading-tight font-medium tracking-[0.12em] uppercase">
            Aether
            <span className="flex justify-between gap-8 text-white/50">
              <span>/</span>S3
            </span>
          </Link>
          <nav className="flex gap-6 max-md:hidden" aria-label="Main">
            <Link href="/docs" className={navLink}>
              Docs,
            </Link>
            <a href="#measured" className={navLink}>
              Benchmarks,
            </a>
            <a href={projectUrl} className={navLink}>
              GitHub,
            </a>
          </nav>
          <Link
            href="/docs/installation"
            className="justify-self-end font-mono text-[11px] tracking-[0.18em] uppercase underline-offset-4 hover:underline"
          >
            [ Get started ]
          </Link>
        </div>
      </header>

      {/* Section counter, fixed at the edge like a viewfinder. */}
      <p
        id="section-counter"
        aria-hidden
        className={`${mono} fixed top-1/2 left-3 z-40 -translate-y-1/2 rotate-180 [writing-mode:vertical-rl] max-md:hidden`}
      >
        001 / 009
      </p>
      {children}
    </div>
  );
}
