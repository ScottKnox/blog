# Project Overview

## Purpose
A simple personal blog for sharing software engineering thoughts online, without paying for a blogging service.

## Audience
Other developers and curious readers, arriving via search, social links, or RSS.

## Goals
- Publish a post by adding a Markdown file and pushing to git.
- Cost nothing beyond an optional custom domain.
- Load instantly and read well on any device.
- Be easy to maintain for years with almost no upkeep.

## Non-goals
Do not build these unless explicitly requested: user accounts, comments, a CMS or admin UI, a database, newsletter infrastructure, multi-author support, paywalls, tags, a light theme, or heavy client-side interactivity.

## Features

### Pages
| Page | Route | Contents |
|------|-------|----------|
| Home | `/` | Short intro, then the latest posts (paginated list) |
| All posts | `/posts` | Every post, newest first |
| Post | `/posts/<slug>` | Rendered article, category, date, reading time, previous/next links |
| Category | `/categories/<category>` | Posts in one category; `/categories` lists all categories with counts |
| About | `/about` | Photo and a longer bio, contact/social links |
| 404 | n/a | Friendly not-found page with a link home |

### Layout and sidebar
- Two-column layout on desktop: main content plus one sticky sidebar. On tablet and mobile the sidebar stacks below the main content.
- The sidebar contains, in order:
  1. **Profile card:** photo, name, one- or two-sentence bio, link to About.
  2. **Featured posts:** posts flagged `featured: true` in frontmatter (max 3-5).
  3. **Recent posts:** the latest 5 posts.
  4. **Projects:** links to personal projects (name, one-line description, external link).
- The sidebar is shown on Home, All posts, Category, and Post pages. The About page is single-column.

### Categories
- Each post belongs to exactly one category, set in frontmatter.
- Allowed categories are defined in one place (a single config list); a typo in a post fails the build.
- Categories show on post cards and post pages, and link to their category page.
- No tags in the MVP.

### Content and feeds
- Markdown/MDX posts with syntax-highlighted code, images with captions, and anchored headings.
- Reading time and publish date (optional "updated" date) on each post.
- RSS feed at `/rss.xml`, sitemap, and `robots.txt`.
- Drafts: visible in dev, hidden in production, RSS, and sitemap.

### SEO and sharing
Per-page title, meta description, canonical URL, and Open Graph/Twitter tags (using the post's hero image if present, otherwise a default).

### Not in the MVP (add only if requested)
- Light theme or theme toggle
- Full-text search (Pagefind, static)
- Auto-generated Open Graph images
- Analytics (Vercel Web Analytics free tier would be the first choice)
- Comments (e.g. giscus)
- Tag pages

## Design direction
Sleek, modern, and restrained, with a **dark theme only**. Typography does the heavy lifting; decoration is minimal.

**Color**
- Near-black, slightly cool or neutral background (not pure `#000`), with layered surfaces for cards and the sidebar, and subtle 1px borders.
- Off-white body text (not pure white); muted gray for secondary text. Body text contrast must meet WCAG AA, aiming for AAA.
- **One accent color: warm amber** (links, hover states, focus rings, active states). Explicitly avoid purple/indigo/violet and gradient-heavy "AI" aesthetics, glows, glassmorphism, and emoji decoration.
- Define all colors as CSS custom properties in one place so the palette is easy to tune.

**Typography**
- Optimized for long-form reading on phones, tablets, and desktops.
- Body: a high-quality text serif (e.g. Newsreader or Source Serif 4) at about 18-20px, line-height about 1.7, measure capped around 65-70 characters.
- UI and headings: a clean sans-serif (e.g. Geist or Inter). Code: a good monospace (e.g. JetBrains Mono or Geist Mono).
- Fluid type scale using `clamp()` so sizes adapt smoothly across screen widths; clear heading hierarchy and generous vertical rhythm.
- Fonts are self-hosted (e.g. via Fontsource), subset, and use `font-display: swap`; load only the weights actually used.
- Well-styled prose: blockquotes, lists, inline code, code blocks, tables, images, and footnotes.

**Feel**
Subtle hover and focus transitions only; respect `prefers-reduced-motion`. No popups, banners, carousels, or tracking.

## Assets and content the owner provides
- A square or portrait **photo** (at least 800px) for the profile card and About page.
- Short bio (1-2 sentences) for the sidebar and a longer bio for About.
- Social/contact links.
- The list of projects (name, description, URL).
- The initial list of categories.

Until provided, use clearly marked placeholders.

## Roadmap
1. **Foundation:** scaffold Astro, fonts, design tokens (dark palette, type scale), base layout, Vercel deployment.
2. **Content:** collection schema with categories and featured flag, post list and post pages, a few sample posts.
3. **Layout:** sidebar (profile, featured, recent, projects) and responsive behavior.
4. **Browse:** category index and category pages, About page, 404.
5. **Discovery and SEO:** RSS, sitemap, robots.txt, metadata and Open Graph.
6. **Polish:** accessibility pass, Lighthouse check, real photo and content.
