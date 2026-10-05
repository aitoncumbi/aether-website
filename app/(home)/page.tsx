import Link from 'next/link';
import { Activity, Globe, History, KeyRound, type LucideIcon } from 'lucide-react';
import { CipherText } from '@/components/cipher-text';
import { Console3D } from '@/components/console-3d';
import { CountUp } from '@/components/count-up';
import { SwapText } from '@/components/motion';
import { Particles } from '@/components/particles/particles';
import { Marquee, ScrubText } from '@/components/scroll-text';
import { projectUrl } from '@/lib/shared';

// [text, kind]: kind styles the line in the terminal.
const quickstart: [string, 'cmd' | 'comment' | 'out'][] = [
  ['cp .env.example .env', 'cmd'],
  ['# set a root key and a long random secret', 'comment'],
  ['docker compose up -d', 'cmd'],
  ['', 'out'],
  ['export AWS_ENDPOINT_URL=http://localhost:9000', 'cmd'],
  ['aws s3 mb s3://reports', 'cmd'],
  ['make_bucket: reports', 'out'],
  ['aws s3 cp ./q3.pdf s3://reports/', 'cmd'],
  ['upload: ./q3.pdf to s3://reports/q3.pdf', 'out'],
];

const features: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: KeyRound,
    title: 'A key per application',
    body: 'Read, write or owner rights per bucket. Disabling a key takes effect immediately.',
  },
  {
    icon: Activity,
    title: 'Built to be watched',
    body: 'Prometheus metrics, health endpoints for load balancers, and JSON access logs with a request id.',
  },
  {
    icon: History,
    title: 'Versions and lifecycle',
    body: 'Keep every version of an object and expire old data with lifecycle rules.',
  },
  {
    icon: Globe,
    title: 'HTTPS without restarts',
    body: 'TLS for the S3 and admin APIs. Renewed certificates are picked up within a minute.',
  },
];

// From docs/BENCHMARKS.md in the Aether repo: commit 2e4d60c, default config,
// server and client on one 4 vCPU VM.
const stats: { value: number; decimals?: number; suffix?: string; unit: string; label: string }[] = [
  { value: 8449, unit: 'ops/s', label: 'GETs of 1 KiB objects, at 3.7 ms median latency' },
  { value: 1343.7, decimals: 1, unit: 'MiB/s', label: 'Reading 64 MiB objects back' },
  { value: 500, suffix: 'k', unit: 'keys/s', label: 'Listed, 1000 keys a page, by 8 clients' },
  { value: 0, unit: 'errors', label: 'Across every phase of the run' },
];

// Group commit (v1.1): 32 clients writing 1 KiB objects, on a laptop with a slow fsync.
const groupCommit = [
  { label: 'Before', ops: 166, p50: 190.6 },
  { label: 'After', ops: 1926, p50: 15.1 },
];

// Shown as shifting ciphertext in the encryption section.
const ciphertext = ['9f3a c1e8 07bd 52aa e41f 9c06', '4ac0 8e9d 1b77 f06c 3d52 a8e4', 'e27d 5b19 c8a0 0f4e 76d3 b9a2'];

const milestones = [
  { version: 'v1', label: 'Single node, keys, console, metrics', done: true },
  { version: 'v2', label: 'Versioning, lifecycle, tags, encryption', done: true },
  { version: 'v2.1', label: 'Backups and versions in the console', done: true },
  { version: 'Next', label: 'Replication', done: false },
];

const primary =
  'inline-flex h-10 items-center rounded-full bg-white px-5 font-mono text-[11px] tracking-[0.18em] text-black uppercase transition-colors hover:bg-[#9ff4ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';
const bracket =
  'whitespace-nowrap font-mono text-[11px] tracking-[0.18em] text-white uppercase underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';
const h2 = 'text-3xl leading-[1.05] font-normal tracking-tight uppercase md:text-[2.6rem]';
const body = 'mt-6 space-y-4 text-sm leading-relaxed text-white/60';
const card = 'max-md:rounded-xl max-md:bg-black/60 max-md:p-6 max-md:backdrop-blur-sm';
const box = 'border border-white/15 bg-black/50 font-mono text-[12px] leading-relaxed backdrop-blur-sm';
const fact = 'border-t border-white/20 pt-4';
// Full-width blocks cross the form, so they sit on dark glass.
const glass = 'md:border md:border-white/10 md:bg-black/60 md:p-8 md:backdrop-blur-md';

// A section is one camera stop. Text sits on one side; the form is framed on the other.
const stop = 'relative flex min-h-svh items-center py-28';
const left = `reveal w-full max-w-md ${card}`;
const right = `${left} md:ml-auto`;

/** Small mono marker above a heading: a name, a rule and a number. */
function Label({ n, children }: { n: number; children: string }) {
  return (
    <p className="mb-6 flex items-center gap-4 font-mono text-[11px] tracking-[0.2em] text-white/50 uppercase">
      {children}
      <span className="h-px w-8 bg-white/30" />
      {String(n).padStart(2, '0')}
    </p>
  );
}

/** Faint figures pinned around the 3D form, like callouts on a drawing. Wide screens only. */
function Notes({ items }: { items: [string, string, string][] }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
      {items.map(([text, top, left]) => (
        <span
          key={text}
          className="absolute flex items-center gap-2 font-mono text-[10px] tracking-[0.15em] text-white/40 uppercase"
          style={{ top, left }}
        >
          <span className="h-px w-5 bg-white/30" />
          {text}
        </span>
      ))}
    </div>
  );
}

function InlineCode({ text }: { text: string }) {
  return text.split('`').map((part, i) =>
    i % 2 ? (
      <code key={i} className="font-mono text-white/85">
        {part}
      </code>
    ) : (
      part
    ),
  );
}

function Terminal() {
  return (
    <div className={box}>
      <p className="border-b border-white/10 px-4 py-2.5 text-[10px] tracking-[0.2em] text-white/45 uppercase">
        ~/aether
      </p>
      <pre className="overflow-x-auto p-4">
        <code>
          {quickstart.map(([text, kind], i) => (
            <div key={i} className={kind === 'cmd' ? 'text-white/85' : kind === 'out' ? 'text-white/55' : 'text-white/35'}>
              {kind === 'cmd' && <span className="text-white/40 select-none">$ </span>}
              {text || ' '}
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

function Stat({ s }: { s: (typeof stats)[number] }) {
  return (
    <div className={`flex flex-col ${fact}`}>
      <dd className="order-1 flex items-baseline gap-2">
        <span className="text-4xl font-light tracking-tight tabular-nums md:text-5xl">
          <CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} />
        </span>
        <span className="font-mono text-[11px] tracking-[0.12em] text-[#9ff4ff] uppercase">{s.unit}</span>
      </dd>
      <dt className="order-2 mt-2 text-sm leading-relaxed text-white/55">{s.label}</dt>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Particles />
      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-12">
        {/* Hero: a glass case with a beam through it, and a line that keeps rewriting itself */}
        <section data-shape="0" data-x="0.4" data-s="0.75" className={`${stop} max-md:items-end md:pt-16`}>
          <Notes
            items={[
              ['Your data stays on your servers', '24%', '58%'],
              ['PUT · GET · LIST', '72%', '64%'],
              ['One Rust binary', '40%', '86%'],
            ]}
          />
          <div className={`reveal max-w-xl ${card}`}>
            <Label n={1}>Aether //</Label>
            <h1 className="text-5xl leading-[0.95] font-normal tracking-[-0.04em] uppercase md:text-[4.5rem]">
              <span className="block">Object storage</span>
              <span className="block min-h-[2em] text-white/55">
                <SwapText
                  phrases={[
                    'on your own servers.',
                    'in one Rust binary.',
                    'for every S3 client.',
                    'with no cloud account.',
                  ]}
                />
              </span>
            </h1>
            <p className="mt-8 max-w-sm text-sm leading-relaxed text-white/60">
              It speaks S3, so the AWS SDKs, AWS CLI, boto3 and rclone work unchanged.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link href="/docs/installation" className={primary}>
                Get started
              </Link>
              <a href={projectUrl} className={bracket}>
                [ View on GitHub ]
              </a>
            </div>
          </div>
        </section>

        {/* Manifesto: one core, with spokes out to every client, and a statement that lights up as you read */}
        <section data-shape="1" data-x="-0.5" data-s="0.9" className={stop}>
          <Notes
            items={[
              ['S3 API :9000', '22%', '10%'],
              ['SigV4', '70%', '26%'],
            ]}
          />
          <div className={right}>
            <Label n={2}>Manifesto //</Label>
            <ScrubText
              className="font-mono text-base leading-[1.5] tracking-[0.06em] text-white/90 uppercase md:text-lg"
              text="One binary that stores, verifies and recovers every object. No cluster to stand up and no cloud account to open: your servers, your disks, and the S3 API every client already speaks."
            />
            <div className="mt-10">
              <Terminal />
            </div>
            <Link href="/docs/connect-clients" className={`${bracket} mt-6 inline-block`}>
              [ Connect your clients ]
            </Link>
          </div>
        </section>

        {/* Integrity: a stack of blocks, a scan ring passing through */}
        <section data-shape="2" data-x="0.45" data-s="0.95" className="relative flex min-h-svh flex-col justify-between py-28">
          <Notes
            items={[
              ['Immutable blocks, ≤ 64 MiB', '16%', '78%'],
              ['CRC32C re-read every 7 days', '40%', '84%'],
            ]}
          />
          <div className={`reveal max-w-xl ${card}`}>
            <Label n={3}>Integrity //</Label>
            <h2 className={h2}>
              Built from immutable blocks
              <br />
              that check themselves.
            </h2>
          </div>
          <div className={`reveal mt-[50svh] md:mt-0 ${card} ${glass}`}>
            <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ['64 MiB', 'At most per block, never modified after it is written.'],
                ['fsync', 'Then an atomic rename, so a block on disk is always complete.'],
                ['CRC32C', 'A checksum per block, kept with the object record.'],
                ['7 days', 'Between background re-reads that catch silent corruption.'],
              ].map(([k, v]) => (
                <div key={k} className={fact}>
                  <dt className="font-mono text-sm tracking-[0.12em] uppercase">{k}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-white/55">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 text-sm text-white/60">
              <InlineCode text="For a copy elsewhere, `aether backup` copies a running server without stopping it." />
            </p>
          </div>
        </section>

        {/* Encryption: a padlock full of noise */}
        <section data-shape="3" data-x="-0.45" className={stop}>
          <Notes items={[['AES-256-GCM at rest', '24%', '10%']]} />
          <div className={right}>
            <Label n={4}>Encryption //</Label>
            <h2 className={h2}>
              Unreadable on disk.
              <br />
              <span className="text-white/55">AES-256-GCM for every object.</span>
            </h2>
            <div className={body}>
              <p>
                SSE-S3 needs one master key and clients change nothing. With SSE-C the server stores nothing that could
                decrypt the data. Access key secrets are encrypted too.
              </p>
            </div>
            <div className={`mt-8 ${box}`}>
              <div className="space-y-1 px-4 py-3 break-all text-white/40">
                {ciphertext.map((line) => (
                  <div key={line}>
                    <CipherText text={line} noise />
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 px-4 py-3">
                <div className="text-white/35"># GET s3://reports/q3.pdf, with the key</div>
                <div className="text-[#9ff4ff]">
                  <CipherText text="%PDF-1.7  Q3 report, 14 pages" loop={3500} duration={1400} />
                </div>
              </div>
            </div>
            <Link href="/docs/encryption" className={`${bracket} mt-6 inline-block`}>
              [ How encryption works ]
            </Link>
          </div>
        </section>

        <div className="font-normal tracking-tight text-white/15 uppercase">
          <Marquee text="Your data stays on your servers" />
        </div>

        {/* Console: its parts fly in from depth and build the page as you scroll */}
        <Console3D>
          <Label n={5}>Console //</Label>
          <h2 className={`max-w-2xl ${h2}`}>Buckets, objects and keys, without the CLI.</h2>
        </Console3D>

        {/* Works with: clients on orbits around one core */}
        <section data-shape="4" data-s="1.3" className="relative flex min-h-svh flex-col items-center justify-center py-32 text-center">
          <div className={`reveal ${card}`}>
            <Label n={6}>Works with //</Label>
            <p className="mx-auto max-w-4xl text-3xl leading-[1.15] font-normal tracking-tight text-balance uppercase [text-shadow:0_0_24px_#000] md:text-5xl">
              AWS CLI, AWS SDKs, boto3 and rclone, plus <span className="text-[#9ff4ff]">334</span> of Ceph&apos;s
              s3-tests, run against a live server in CI.
            </p>
            <div className="mt-10">
              <Link href="/docs/compatibility" className={bracket}>
                [ What works today ]
              </Link>
            </div>
          </div>
        </section>

        {/* Benchmarks: a bar chart of dust, and two columns that drift apart */}
        <section id="measured" data-shape="5" data-x="0.4" data-s="0.9" className={stop}>
          <Notes
            items={[
              ['1 node · 4 vCPU · 15 GB RAM', '80%', '62%'],
              ['ops/s', '20%', '84%'],
            ]}
          />
          <div className={left}>
            <Label n={7}>Benchmarks //</Label>
            <h2 className={h2}>
              Measured on a small VM,
              <br />
              not a lab.
            </h2>
            <div className={body}>
              <p>
                One node with the default configuration, the load generator on the same 4 vCPU machine. A reference
                point for changes to Aether, not a hardware rating.
              </p>
            </div>
            <dl className="mt-10 grid grid-cols-2 gap-x-8">
              <div className="space-y-10">
                <Stat s={stats[0]} />
                <Stat s={stats[2]} />
              </div>
              <div className="drift mt-16 space-y-10">
                <Stat s={stats[1]} />
                <Stat s={stats[3]} />
              </div>
            </dl>
            <figure className={`mt-16 ${fact}`}>
              <figcaption className="text-sm text-white/60">
                <span className="text-white">Group commit (v1.1):</span> small PUTs from 32 clients, with{' '}
                <span className="font-mono text-white">
                  <CountUp value={12} />×
                </span>{' '}
                the throughput
              </figcaption>
              <div className="mt-4 space-y-3">
                {groupCommit.map((g) => (
                  <div key={g.label} className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-3">
                    <span className="font-mono text-[10px] tracking-[0.15em] text-white/50 uppercase">{g.label}</span>
                    <div className="flex flex-col items-start gap-1">
                      <div
                        className="grow-bar h-4 bg-white"
                        style={{
                          width: `${(g.ops / groupCommit[1].ops) * 100}%`,
                          opacity: g.label === 'Before' ? 0.35 : 0.9,
                        }}
                      />
                      <span className="font-mono text-xs whitespace-nowrap">
                        {g.ops.toLocaleString('en-US')} ops/s
                        <span className="text-white/50">, p50 {g.p50} ms</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-white/50">1 KiB objects, on a laptop with a slow fsync.</p>
            </figure>
            <a href={`${projectUrl}/blob/main/docs/BENCHMARKS.md`} className={`${bracket} mt-6 inline-block`}>
              [ Full results ]
            </a>
          </div>
        </section>

        {/* Features: a grid of buckets */}
        <section data-shape="6" data-x="-0.42" data-s="0.95" className={stop}>
          <Notes items={[['One key per application', '24%', '8%']]} />
          <div className={right}>
            <Label n={8}>Operations //</Label>
            <h2 className={h2}>
              And the parts you need
              <br />
              to run it in production.
            </h2>
            <ol className="mt-10">
              {features.map(({ icon: Icon, title, body }) => (
                <li key={title} className="grid grid-cols-[3rem_minmax(0,1fr)] gap-4 border-t border-white/15 py-6">
                  <span className="grid size-11 place-items-center border border-white/20">
                    <Icon className="size-5 text-white/75" strokeWidth={1.25} aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-mono text-[11px] tracking-[0.18em] uppercase">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-2 text-sm text-white/55">
              Plus object tags, multipart uploads, server-side copies and a Docker image.
            </p>
          </div>
        </section>

        {/* Status: a timeline of milestones, the last still dashed */}
        <section data-shape="7" data-x="0.25" data-s="0.8" className="relative flex min-h-svh flex-col justify-between py-28">
          <div className={`reveal max-w-xl ${card}`}>
            <Label n={9}>Status //</Label>
            <h2 className={h2}>Honest about maturity.</h2>
            <div className={body}>
              <p>Complete for a single node, but not yet proven in production. No replication yet, so back it up.</p>
            </div>
          </div>
          <div className={`reveal mt-[45svh] md:mt-0 ${card} ${glass}`}>
            <ol className="grid gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
              {milestones.map((m) => (
                <li key={m.version} className="relative border-t border-white/20 pt-5 pr-6">
                  <span
                    aria-hidden
                    className={`absolute -top-[4px] left-0 size-[7px] rounded-full ${m.done ? 'bg-white' : 'border border-dashed border-white/60 bg-black'}`}
                  />
                  <p className="font-mono text-[11px] tracking-[0.18em] uppercase">
                    {m.version}
                    <span className="sr-only">{m.done ? ', shipped' : ', planned'}</span>
                  </p>
                  <p className={`mt-2 text-sm ${m.done ? 'text-white/80' : 'text-white/45'}`}>{m.label}</p>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-wrap items-baseline gap-x-10 gap-y-3 text-sm text-white/55">
              <span>
                <span className="font-mono text-white">334</span> Ceph s3-tests passing
              </span>
              <span>
                <span className="font-mono text-white">MIT</span> license
              </span>
              <a href={`${projectUrl}/blob/main/docs/ROADMAP.md`} className={bracket}>
                [ Roadmap ]
              </a>
            </div>
          </div>
        </section>

        {/* Close: a cross of light */}
        <section data-shape="8" className="flex min-h-svh flex-col items-center justify-center text-center">
          <div className="reveal">
            <h2 className="text-4xl leading-[1.02] tracking-tight text-balance uppercase [text-shadow:0_0_24px_#000] md:text-6xl">
              Running in
              <br />
              <span className="text-white/55">two commands.</span>
            </h2>
            <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-white/60 [text-shadow:0_0_16px_#000]">
              The Docker image keeps data in a volume and publishes the S3 API on port 9000. Point any S3 client at it.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
              <Link href="/docs/installation" className={primary}>
                Get started
              </Link>
              <a href={projectUrl} className={bracket}>
                [ View on GitHub ]
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/15 bg-black">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-6 font-mono text-[10px] tracking-[0.18em] text-white/50 uppercase md:px-12">
          <p>Aether · MIT license</p>
          <nav className="flex gap-6" aria-label="Footer">
            <Link href="/docs" className="hover:text-white">
              Docs
            </Link>
            <Link href="/docs/compatibility" className="hover:text-white">
              Compatibility
            </Link>
            <a href={`${projectUrl}/blob/main/docs/ROADMAP.md`} className="hover:text-white">
              Roadmap
            </a>
            <a href={projectUrl} className="hover:text-white">
              GitHub
            </a>
          </nav>
        </div>
      </footer>
    </>
  );
}
