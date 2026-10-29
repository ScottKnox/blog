# Architecture

## Why this stack
- **Astro:** purpose-built for content sites; ships zero JS by default; first-class Markdown, content collections, RSS, and sitemap support.
- **Static output:** no server to run or pay for; Vercel serves it from its CDN on the free Hobby plan.
- **Markdown in git:** posts are versioned, portable, and not locked into any platform.

## Repository layout
```
/
├─ AGENTS.md                  # Agent guide (entry point)
├─ docs/                      # Project docs
├─ README.md                  # Human guide: setup, writing posts, publishing
├─ public/                    # Static files served as-is (favicon.svg/.ico, apple-touch-icon.png)
├─ src/
│  ├─ assets/                 # Optimized images
│  ├─ components/             # Header, Footer, PostCard, PostList, SEO, Sidebar + sidebar sections
│  │                          #   (ProfileCard, FeaturedPosts, RecentPosts, ProjectsList,
│  │                          #   SidebarSection wrapper, SidebarPostLinks)
│  ├─ content/
│  │  └─ posts/               # One Markdown/MDX file per post
│  ├─ content.config.ts       # Content collection schema
│  ├─ data/
│  │  ├─ site.ts              # Name, bio, social links, photo reference, site metadata
│  │  ├─ categories.ts        # Allowed categories (slug, label, description)
│  │  └─ projects.ts          # Projects shown in the sidebar
│  ├─ layouts/                # BaseLayout, SidebarLayout (main + sidebar), PostLayout
│  ├─ pages/
│  │  ├─ index.astro            # Home: intro + page 1 of latest posts
│  │  ├─ about.astro
│  │  ├─ 404.astro
│  │  ├─ rss.xml.ts
│  │  ├─ robots.txt.ts         # Generated so the sitemap URL follows `site`
│  │  ├─ page/
│  │  │  └─ [page].astro       # Home pages 2+ (/page/2, /page/3, ...)
│  │  ├─ posts/
│  │  │  ├─ index.astro
│  │  │  └─ [...slug].astro
│  │  └─ categories/
│  │     ├─ index.astro
│  │     └─ [category].astro
│  ├─ styles/                 # tokens.css (colors, type scale), global.css (reset, prose)
│  └─ utils/                  # posts.ts (shared post queries), format.ts (dates, reading time),
│                             #   heading-anchors.ts + table-scroll.ts (Markdown plugins),
│                             #   post-dates.ts (frontmatter dates for sitemap <lastmod>)
├─ astro.config.mjs
├─ package.json
└─ tsconfig.json
```

## Content model
Defined with Zod in `src/content.config.ts`.

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | Required |
| `description` | string | Required; used for meta description and lists |
| `pubDate` | date | Required |
| `updatedDate` | date | Optional |
| `category` | enum | Required; one slug from `src/data/categories.ts` (the schema enum is derived from that list, so typos fail the build) |
| `featured` | boolean | Default `false`; drives the "Featured" sidebar section |
| `draft` | boolean | Default `false`; excluded from production |
| `heroImage` | image | Optional; also used for social cards |
| `heroAlt` | string | Required when `heroImage` is set (the schema enforces this); used as the image's `alt` and `og:image:alt` |

Non-post data (categories, projects, site info) lives in typed TypeScript files in `src/data/`, not in the content collection, since it changes rarely.

## Rendering and data flow
1. `src/utils/posts.ts` is the only place that calls `getCollection('posts')`. It excludes drafts in production and sorts by `pubDate` descending, and exposes helpers: `getAllPosts()`, `getFeaturedPosts()`, `getRecentPosts(n)`, `getPostsByCategory(slug)`, `getCategoriesWithPosts()`, and `getHomePages()` (home pagination, `HOME_PAGE_SIZE` posts per page; page 1 is `/`, later pages are `/page/<n>`, and there is no `/page/1`).
2. Pages, sidebar sections, and the RSS endpoint use only those helpers so drafts can't leak.
3. Category pages are generated with `getStaticPaths()` from `getCategoriesWithPosts()` (config order from `categories.ts`); categories with no published posts are omitted from both the index and the generated pages, so there are no empty or dead category links.
4. `SidebarLayout` wraps the main content and renders `Sidebar` (profile, featured, recent, projects) into `BaseLayout`'s optional `sidebar` slot, which sits outside `<main>` as an `<aside>`. Everything is resolved at build time.
5. Layouts inject SEO tags through a single `SEO` component (rendered by `BaseLayout`, which accepts the same props): title, description, canonical URL, Open Graph/Twitter tags, RSS autodiscovery, `noindex` (used by the 404 page), and `BlogPosting` JSON-LD on post pages. The social image is the post's `heroImage` (resized to a 1200px JPEG) or `src/assets/og-default.png` (1200×630).
6. Discovery: `@astrojs/rss` serves `/rss.xml` from `getAllPosts()`; `@astrojs/sitemap` writes `sitemap-index.xml` (drafts are never built in production, so they never appear), with `<lastmod>` on post URLs from `updatedDate`/`pubDate` (read via `src/utils/post-dates.ts`, since the config can't use content collections). URLs everywhere use no trailing slash (`trailingSlash: 'never'`).

## Markdown pipeline
- Astro's default Markdown processor here is **Sätteri** (`@astrojs/markdown-satteri`), not remark/rehype. `markdown.remarkPlugins`/`rehypePlugins` do not work without installing the legacy unified processor; don't add them.
- Custom transforms are Sätteri hast plugins passed via `markdown.processor: satteri({ hastPlugins: [...] })` in `astro.config.mjs`. They apply to both `.md` and `.mdx`.
- `src/utils/heading-anchors.ts` adds ids and `#` links to h2-h4. `src/utils/table-scroll.ts` wraps tables in a focusable, labelled scroll region so wide tables never widen the page on mobile. Shiki highlights code (theme set in `markdown.shikiConfig`); GFM tables and footnotes are built in.
- After changing `markdown.processor` plugins, fully restart `npm run dev`; the dev server's soft restart keeps the old processor (production builds are unaffected).

## Styling
- Dark theme only. Set `color-scheme: dark` and define the palette as CSS custom properties in `src/styles/tokens.css` (background, surface, border, text, muted text, one amber accent). No purple/indigo.
- `global.css` holds the reset and a `.prose` style for article content.
- Fluid type scale and spacing via `clamp()`; reading measure of about 65-70ch.
- Fonts (serif body, sans UI, mono code) are self-hosted via Fontsource; load only needed weights. `BaseLayout` preloads the Latin Newsreader and Inter files to prevent a layout shift on swap.
- Responsive: at 64rem and wider the sidebar sits beside content (CSS grid; sticky only when the viewport is at least 56rem tall so it never gets cut off). Narrower, it stacks below the content (two columns on tablet, one on mobile). Component styles go in scoped `<style>` blocks.
- The profile photo lives in `src/assets/` and is rendered with Astro's `<Image>` (sized, optimized).

## Deployment (Vercel)
- Connect the git repository to Vercel; framework preset is auto-detected as Astro.
- Build command `npm run build` (runs `astro check` then `astro build`, so type or frontmatter errors block the deploy), output directory `dist` (defaults).
- Every push to the main branch deploys to production; other branches and PRs get preview URLs.
- Set `site` in `astro.config.mjs` to the production URL (initially `https://<project>.vercel.app`, later the custom domain) so RSS, sitemap, and canonical URLs are correct.
- No environment variables or serverless functions are required. Keep it that way.
- Custom domain is optional and the only potential cost.

## Quality bar
- Lighthouse 95+ in all categories on key pages.
- No layout shift; images have dimensions.
- Valid HTML, one `<h1>` per page, visible focus styles, sufficient contrast.
