import { RootProvider } from 'fumadocs-ui/provider/next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import './global.css';

export const metadata: Metadata = {
  title: { default: 'Aether: S3-compatible object storage', template: '%s | Aether' },
  description:
    'S3-compatible object storage written in Rust, for teams that run their own servers. Works with the AWS SDKs, AWS CLI, boto3 and rclone.',
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
