// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { headingAnchors } from './src/utils/heading-anchors';
import { tableScroll } from './src/utils/table-scroll';
import { getPostLastModified } from './src/utils/post-dates';

const postDates = getPostLastModified();

// https://astro.build/config
export default defineConfig({
  // Canonical site URL: update to the real Vercel/custom domain URL.
  site: 'https://your-blog.vercel.app',
  // Canonical URLs, links, and the sitemap all use no trailing slash.
  trailingSlash: 'never',
  output: 'static',
  integrations: [
    mdx(),
    sitemap({
      // Add <lastmod> to post URLs from `updatedDate` (or `pubDate`).
      serialize(item) {
        const slug = item.url.match(/\/posts\/([^/]+)\/?$/)?.[1];
        const date = slug ? postDates.get(slug) : undefined;
        if (date) item.lastmod = date.toISOString();
        return item;
      },
    }),
  ],
  markdown: {
    shikiConfig: { theme: 'vitesse-dark' },
    processor: satteri({ hastPlugins: [headingAnchors, tableScroll] }),
  },
});