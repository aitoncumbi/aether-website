import { createGetUrl } from 'fumadocs-core/source';

export const appName = 'Aether';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

/** Where the docs' source lives, for "Edit on GitHub" links. */
export const gitConfig = {
  user: 'aitoncumbi',
  repo: 'aether-website',
  branch: 'main',
};

/** The Aether server itself. */
export const projectUrl = 'https://github.com/aitoncumbi/Aeather';

const getContentUrl = createGetUrl(docsContentRoute);

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'content.md'];

  return { segments, url: getContentUrl(segments, page.locale) };
}

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'image.png'];

  return { segments, url: getImageUrl(segments, page.locale) };
}
