'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ChevronRight,
  Copy,
  Database,
  Folder,
  KeyRound,
  LayoutGrid,
  LogOut,
  Plus,
  Search,
  type LucideIcon,
} from 'lucide-react';
import { LogoMark } from '@/lib/layout.shared';

// The web console's Buckets page, built in markup rather than shown as a screenshot.
const buckets = [
  { name: 'analytics-exports', objects: 3, size: '9.34 MB', share: 0.02, keys: 1 },
  { name: 'backups-nightly', objects: 6, size: '400 MB', share: 0.84, keys: 1 },
  { name: 'invoices', objects: 9, size: '3.17 MB', share: 0.01, keys: 2 },
  { name: 'media-uploads', objects: 20, size: '66.0 MB', share: 0.14, keys: 1 },
];

const nav: [LucideIcon, string, number?][] = [
  [LayoutGrid, 'Overview'],
  [Database, 'Buckets', 4],
  [Folder, 'Object browser'],
];
const access: [LucideIcon, string, number?][] = [
  [KeyRound, 'Access keys', 4],
  [BookOpen, 'Documentation'],
];

const settings: [string, string][] = [
  ['Versioning', 'Enabled'],
  ['Lifecycle', '1 rule: expire after 90 days'],
  ['Encryption', 'SSE-S3, AES-256-GCM'],
];

const muted = 'text-white/45';
const caption = 'font-mono text-[9px] tracking-[0.2em] text-white/40 uppercase';

/**
 * One part of the console. While the section scrolls it starts scattered in
 * depth (`x`, `y`, `z`, turned by `r`) and settles into place; `at` staggers it.
 * See `.piece` in global.css.
 */
function Piece({
  x = 0,
  y = 0,
  z = 0,
  r = 0,
  at,
  className = '',
  children,
}: {
  x?: number;
  y?: number;
  z?: number;
  r?: number;
  at: number;
  className?: string;
  children: ReactNode;
}) {
  const style = { '--x': `${x}%`, '--y': `${y}%`, '--z': `${z}px`, '--r': `${r}deg`, '--at': `${at}%` } as CSSProperties;
  return (
    <div className={`piece ${className}`} style={style}>
      {children}
    </div>
  );
}

function NavGroup({ label, items, active }: { label: string; items: typeof nav; active?: string }) {
  return (
    <div className="mt-6">
      <p className={`${caption} px-3`}>{label}</p>
      <ul className="mt-2 space-y-0.5">
        {items.map(([Icon, name, count]) => (
          <li
            key={name}
            className={`flex items-center gap-2.5 px-3 py-2 ${name === active ? 'bg-white/[0.07] text-white' : 'text-white/60'}`}
          >
            <Icon className="size-3.5" strokeWidth={1.5} aria-hidden />
            {name}
            {count && <span className="ml-auto font-mono text-[10px] text-white/40">{count}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The console assembling itself in 3D as the section scrolls past. */
export function Console3D({ children }: { children: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null);

  // The console is laid out at a fixed size, then zoomed to fit the space under the heading.
  useEffect(() => {
    const el = stage.current!;
    const frame = el.firstElementChild as HTMLElement;
    const fit = () => {
      frame.style.zoom = '1';
      frame.style.zoom = String(Math.min(1, el.clientWidth / frame.offsetWidth, el.clientHeight / frame.offsetHeight));
    };
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <section className="console-scroll relative mx-[calc(50%-50vw)] h-[260svh] bg-black">
      <div className="dot-floor sticky top-0 flex h-svh flex-col overflow-hidden px-4 pt-24 pb-10 md:px-12">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-end justify-between gap-6">
          <div>{children}</div>
          <Link
            href="/docs/web-console"
            className="console-tour inline-flex shrink-0 h-10 items-center rounded-full bg-white px-5 font-mono text-[11px] tracking-[0.18em] text-black uppercase transition-colors hover:bg-[#9ff4ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Take the tour
          </Link>
        </div>

        <div ref={stage} className="console-stage mt-6 flex min-h-0 w-full flex-1 items-center justify-center">
          <div
            role="img"
            aria-label="The Aether web console: four buckets with their object counts and sizes, and the selected bucket's details and access keys"
            className="console-frame grid h-[400px] w-[560px] shrink-0 grid-cols-1 border border-white/15 bg-[#060606] text-[11px] md:h-[650px] md:w-[1040px] md:grid-cols-[11rem_minmax(0,1fr)_16rem]"
          >
            {/* Sidebar */}
            <Piece x={-60} z={320} r={28} at={0} className="flex flex-col border-r border-white/10 bg-[#0b0b0b] p-3 max-md:hidden">
              <div className="flex items-center gap-2 px-1">
                <span className="grid size-7 place-items-center bg-white text-black">
                  <LogoMark size={14} />
                </span>
                <span>
                  <span className="block text-[12px] font-medium">Aether</span>
                  <span className="block text-[9px] text-white/45">Object storage console</span>
                </span>
              </div>
              <NavGroup label="Storage" items={nav} active="Buckets" />
              <NavGroup label="Access" items={access} />
              <Piece y={140} z={520} at={34} className="mt-auto border border-white/10 bg-white/[0.03] p-2.5">
                <p className="flex items-center gap-1.5">
                  <span className="size-1.5 bg-[#9ff4ff]" /> Ready
                  <span className={`ml-auto font-mono text-[9px] ${muted}`}>up 2m</span>
                </p>
                <p className={`mt-2 flex justify-between font-mono text-[9px] ${muted}`}>
                  Disk <span>690 MB / 8.24 GB</span>
                </p>
                <span className="mt-1.5 block h-0.5 bg-white/10">
                  <span className="block h-full w-[8%] bg-[#9ff4ff]" />
                </span>
              </Piece>
              <div className="mt-3 flex items-center gap-2 px-1">
                <KeyRound className="size-3.5 text-white/50" strokeWidth={1.5} aria-hidden />
                <span>
                  <span className="block font-mono">admin</span>
                  <span className={`block text-[9px] ${muted}`}>Root key</span>
                </span>
                <LogOut className="ml-auto size-3.5 text-white/40" strokeWidth={1.5} aria-hidden />
              </div>
            </Piece>

            {/* Buckets */}
            <div className="flex min-w-0 flex-col">
              <Piece y={-160} z={260} r={-6} at={8} className="flex items-end justify-between gap-4 border-b border-white/10 p-4">
                <div>
                  <p className="text-[18px] font-medium tracking-tight">Buckets</p>
                  <p className={muted}>4 buckets · 478 MB · 38 objects</p>
                </div>
                <div className="flex gap-2 max-sm:hidden">
                  <span className={`flex h-7 w-36 items-center gap-1.5 bg-white/[0.05] px-2 ${muted}`}>
                    <Search className="size-3" aria-hidden /> Filter by name
                  </span>
                  <span className="flex h-7 items-center gap-1 bg-white px-2.5 text-black">
                    <Plus className="size-3" aria-hidden /> Create bucket
                  </span>
                </div>
              </Piece>
              <Piece y={-80} z={180} at={14} className={`grid grid-cols-[minmax(0,1fr)_3rem_9rem_2.5rem] gap-3 px-4 py-2.5 ${caption}`}>
                <span>Name</span>
                <span className="text-right">Objects</span>
                <span>Size</span>
                <span className="text-right">Keys</span>
              </Piece>
              {buckets.map((b, i) => (
                <Piece
                  key={b.name}
                  x={i % 2 ? 70 : -70}
                  z={380 + i * 90}
                  r={i % 2 ? -18 : 18}
                  at={18 + i * 5}
                  className={`grid grid-cols-[minmax(0,1fr)_3rem_9rem_2.5rem] items-center gap-3 border-t border-white/[0.06] px-4 py-2.5 ${b.name === 'media-uploads' ? 'bg-white/[0.05]' : ''}`}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="grid size-6 shrink-0 place-items-center bg-white/[0.06]">
                      <Database className="size-3 text-white/60" strokeWidth={1.5} aria-hidden />
                    </span>
                    <span className="truncate font-mono">{b.name}</span>
                  </span>
                  <span className={`text-right font-mono ${muted}`}>{b.objects}</span>
                  <span className="flex items-center gap-2">
                    <span className="w-12 text-right font-mono">{b.size}</span>
                    <span className="h-0.5 flex-1 bg-white/10">
                      <span className="block h-full bg-[#9ff4ff]" style={{ width: `${Math.max(b.share, 0.03) * 100}%` }} />
                    </span>
                  </span>
                  <span className={`text-right font-mono ${muted}`}>{b.keys}</span>
                </Piece>
              ))}
            </div>

            {/* Selected bucket */}
            <Piece x={80} z={300} r={-30} at={30} className="space-y-4 border-l border-white/10 p-4 max-md:hidden">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-[14px]">media-uploads</p>
                  <p className={muted}>Created Oct 2, 2026</p>
                </div>
                <span className="flex items-center gap-0.5 bg-white/[0.06] px-2 py-1">
                  Browse <ChevronRight className="size-3" aria-hidden />
                </span>
              </div>
              <dl className="grid grid-cols-3 divide-x divide-white/10 border-y border-white/10 py-2.5 text-center">
                {[
                  ['Objects', '20'],
                  ['Size', '66.0 MB'],
                  ['Of all data', '13.8%'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className={`text-[9px] ${muted}`}>{k}</dt>
                    <dd className="font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
              <div>
                <p className={caption}>Connect</p>
                <p className="mt-1.5 flex items-center gap-2 bg-white/[0.05] px-2 py-1.5 font-mono text-[9px] text-white/70">
                  <span className="truncate">aws --endpoint-url http://127.0.0.1:9000 s3 ls s3://media-uploads</span>
                  <Copy className="size-3 shrink-0" aria-hidden />
                </p>
              </div>
              <div>
                <p className={caption}>Keys with access</p>
                <div className="mt-1.5 flex items-center justify-between border-t border-white/10 pt-2">
                  <span>
                    <span className="block">media api</span>
                    <span className={`block font-mono text-[9px] ${muted}`}>AKRDIGKINQT57E7Q0X49</span>
                  </span>
                  <span className="flex gap-1 text-[9px]">
                    <span className="bg-white/[0.07] px-1.5 py-0.5">Read</span>
                    <span className="bg-white/[0.07] px-1.5 py-0.5">Write</span>
                  </span>
                </div>
              </div>
              <div>
                <p className={caption}>Settings</p>
                {settings.map(([k, v]) => (
                  <p key={k} className="mt-1.5 flex justify-between gap-3 border-t border-white/10 pt-1.5">
                    {k}
                    <span className={`text-right ${muted}`}>{v}</span>
                  </p>
                ))}
              </div>
            </Piece>
          </div>
        </div>

      </div>
    </section>
  );
}
