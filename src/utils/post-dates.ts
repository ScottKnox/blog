import { readdirSync, readFileSync } from 'node:fs';
import { join, parse } from 'node:path';

// Reads post dates directly from frontmatter, because astro.config.mjs (where the sitemap is
// configured) runs before content collections are available. The content schema still
// validates these fields at build time.
export function getPostLastModified(dir = 'src/content/posts'): Map<string, Date> {
  const dates = new Map<string, Date>();
  for (const file of readdirSync(dir)) {
    if (!/\.mdx?$/.test(file)) continue;
    const frontmatter = readFileSync(join(dir, file), 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
    const field = (key: string) =>
      frontmatter.match(new RegExp(`^${key}:\\s*['"]?([^'"\\r\\n]+)`, 'm'))?.[1]?.trim();
    const value = field('updatedDate') ?? field('pubDate');
    const date = value ? new Date(value) : undefined;
    if (date && !Number.isNaN(date.valueOf())) dates.set(parse(file).name, date);
  }
  return dates;
}
