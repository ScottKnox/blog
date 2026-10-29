import type { APIContext } from 'astro';

// Generated so the sitemap URL always follows `site` in astro.config.mjs.
export function GET(context: APIContext) {
  const sitemap = new URL('sitemap-index.xml', context.site);
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap.href}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
