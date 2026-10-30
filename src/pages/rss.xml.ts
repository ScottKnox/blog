import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
import { render } from 'astro:content';
import { getContainerRenderer as getMDXRenderer } from '@astrojs/mdx/container-renderer';
import { site } from '../data/site';
import { getCategory } from '../data/categories';
import { getAllPosts } from '../utils/posts';

// Feed readers (and dev.to imports) need absolute URLs and no on-site heading "#" anchors.
function prepareFeedHtml(html: string, base: URL, postUrl: URL): string {
  return html
    .replace(/<a [^>]*class="heading-anchor"[^>]*>.*?<\/a>/g, '')
    .replace(/\s(href|src)="([^"]*)"/g, (match, attr: string, value: string) => {
      if (value.startsWith('#')) return ` ${attr}="${postUrl.href}${value}"`;
      if (value.startsWith('/') && !value.startsWith('//')) return ` ${attr}="${new URL(value, base).href}"`;
      return match;
    });
}

export async function GET(context: APIContext) {
  const posts = await getAllPosts();
  const container = await AstroContainer.create({
    renderers: await loadRenderers([getMDXRenderer()]),
  });

  const items = await Promise.all(
    posts.map(async (post) => {
      const link = `/posts/${post.id}`;
      const { Content } = await render(post);
      const html = await container.renderToString(Content);
      return {
        title: post.data.title,
        description: post.data.description || undefined,
        pubDate: post.data.pubDate,
        link,
        categories: [getCategory(post.data.category).label],
        content: prepareFeedHtml(html, context.site!, new URL(link, context.site!)),
      };
    }),
  );

  return rss({
    title: site.title,
    description: site.description,
    site: context.site!,
    trailingSlash: false,
    items,
    customData: '<language>en-us</language>',
  });
}
