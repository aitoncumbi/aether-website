import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { projectUrl } from '@/lib/shared';
import consoleShot from '@/public/console-buckets.png';

const quickstart = `cp .env.example .env      # root key and a long random secret
docker compose up -d

aws --endpoint-url http://localhost:9000 s3 mb s3://reports
aws --endpoint-url http://localhost:9000 s3 cp ./q3.pdf s3://reports/`;

const features = [
  {
    title: 'A key per application',
    body: 'Give each service its own key with read, write or owner rights per bucket. Disabling a key takes effect immediately.',
  },
  {
    title: 'A web console',
    body: 'Browse, upload and share objects, and manage keys and their bucket permissions, from the admin port.',
  },
  {
    title: 'Checksummed blocks',
    body: 'Every block carries a CRC32C checksum and is re-read every week, so disk corruption is found before you need the data.',
  },
  {
    title: 'Built to be watched',
    body: 'Prometheus metrics, health endpoints for load balancers, and JSON access logs with a request id on every line.',
  },
  {
    title: 'Versions and encryption',
    body: 'Keep every version of an object, expire old data with lifecycle rules, and encrypt at rest with your own master key.',
  },
  {
    title: 'HTTPS without restarts',
    body: 'TLS for the S3 and admin APIs. Renewed certificates are picked up within a minute.',
  },
];

const buttonBase =
  'inline-flex h-11 items-center gap-2 rounded-lg px-5 text-sm font-medium whitespace-nowrap transition-colors active:translate-y-px';

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 md:px-8">
      <section className="pt-16 pb-12 md:pt-24 md:pb-16">
        <h1 className="max-w-4xl text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl">
          S3-compatible object storage for your own servers.
        </h1>
        <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-fd-muted-foreground">
          One Rust binary that works with the AWS SDKs, AWS CLI, boto3 and rclone. No cloud account involved.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/docs/installation"
            className={`${buttonBase} bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/90`}
          >
            Get started
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          <a
            href={projectUrl}
            className={`${buttonBase} border border-fd-border bg-fd-card text-fd-foreground hover:bg-fd-accent`}
          >
            View on GitHub
          </a>
        </div>
      </section>

      <figure className="overflow-hidden rounded-xl border border-fd-border bg-[#09090b] shadow-[0_24px_60px_-30px_rgb(9_9_11/0.5)]">
        <Image
          src={consoleShot}
          alt="The Aether web console listing four buckets with their object counts and sizes, and the selected bucket's access keys"
          priority
          sizes="(min-width: 1152px) 1088px, 100vw"
        />
      </figure>

      <section className="grid gap-8 py-20 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-12 md:py-28">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Running in two commands</h2>
          <p className="mt-4 max-w-[45ch] leading-relaxed text-fd-muted-foreground">
            The Docker image keeps data in a volume and publishes the S3 API on port 9000. Point any S3 client at it.
          </p>
          <Link
            href="/docs/connect-clients"
            className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-fd-primary hover:underline"
          >
            Connect your clients
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <pre className="overflow-x-auto rounded-xl border border-fd-border bg-fd-card p-5 font-mono text-[13px] leading-relaxed text-fd-card-foreground">
          <code>{quickstart}</code>
        </pre>
      </section>

      <section className="border-t border-fd-border py-20 md:py-28">
        <h2 className="max-w-2xl text-2xl font-semibold tracking-tight md:text-3xl">
          The parts you need to run storage yourself
        </h2>
        <dl className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {features.map((f) => (
            <div key={f.title}>
              <dt className="font-semibold">{f.title}</dt>
              <dd className="mt-2 max-w-[55ch] leading-relaxed text-fd-muted-foreground">{f.body}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="border-t border-fd-border py-20 md:py-28">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Where it stands</h2>
          <p className="mt-4 text-lg leading-relaxed text-fd-muted-foreground">
            Versions 1 and 2 are complete for a single node, but not yet proven in production. CI runs the AWS CLI,
            boto3 and rclone against a live server, plus 321 of Ceph&apos;s s3-tests. Versioning, lifecycle rules and
            encryption shipped in v2; replication is next on the roadmap.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
            <Link href="/docs/compatibility" className="text-fd-primary hover:underline">
              What works today
            </Link>
            <a href={`${projectUrl}/blob/main/docs/ROADMAP.md`} className="text-fd-primary hover:underline">
              Roadmap
            </a>
          </div>
        </div>
      </section>

      <footer className="flex flex-wrap justify-between gap-4 border-t border-fd-border py-8 text-sm text-fd-muted-foreground">
        <p>Aether is open source under the MIT license.</p>
        <nav className="flex gap-6" aria-label="Footer">
          <Link href="/docs" className="hover:text-fd-foreground">
            Docs
          </Link>
          <a href={projectUrl} className="hover:text-fd-foreground">
            GitHub
          </a>
        </nav>
      </footer>
    </main>
  );
}
