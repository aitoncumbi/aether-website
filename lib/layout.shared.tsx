import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, projectUrl } from './shared';

export function LogoMark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(-30 12 12)" />
    </svg>
  );
}

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <LogoMark />
          <span className="font-semibold">{appName}</span>
        </>
      ),
    },
    links: [{ text: 'Docs', url: '/docs', active: 'nested-url' }],
    githubUrl: projectUrl,
  };
}
