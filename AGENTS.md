# Personal Blog – Agent Guide

A minimal, fast, free-to-host personal blog for a software engineer. Built with Astro, deployed to Vercel as a static site.

Read these before making non-trivial changes:
- [docs/PROJECT.md](docs/PROJECT.md) – goals, scope, requirements, roadmap
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) – stack, structure, content model, deployment

## Guiding principles
1. **Simplicity over features.** If something isn't in [docs/PROJECT.md](docs/PROJECT.md), don't add it. Prefer deleting code to adding it.
2. **Writing is the product.** Posts are Markdown files in git. No CMS, database, or admin UI.
3. **Zero-cost and low-maintenance.** No paid services. Few dependencies. No server runtime.
4. **Fast and accessible by default.** Static HTML, minimal/no client JS, semantic markup, good contrast, works without JavaScript.

## Stack (do not swap without asking)
- Astro (static output) + TypeScript (strict)
- Markdown/MDX via Astro content collections (validated with Zod schemas)
- Plain CSS with custom properties (no Tailwind or UI framework unless requested)
- Dark theme only, with a single warm amber accent. Never use purple/indigo/violet, gradients-as-decoration, glows, or glassmorphism.
- Self-hosted fonts via Fontsource (serif body, sans UI, mono code); typography and readability are the top design priority
- Shiki (built into Astro) for code highlighting
- npm as the package manager
- Vercel (Hobby plan) for hosting; deploys automatically from git

## Commands
- `npm install` – install dependencies
- `npm run dev` – local dev server
- `npm run build` – type/content check (`astro check`) then production build (must pass before finishing a task)
- `npm run preview` – serve the production build locally
- `npx astro check` – type and content-schema check

## Conventions
- Posts live in `src/content/posts/<slug>.md`; the filename is the URL slug (kebab-case).
- Every post needs the frontmatter defined in the content schema (`src/content.config.ts`). Add new fields there first.
- Each post has exactly one `category`, chosen from `src/data/categories.ts`. Posts may set `featured: true` to appear in the sidebar. There are no tags.
- Query posts only through helpers in `src/utils/posts.ts`; never call `getCollection('posts')` elsewhere.
- Sidebar content (profile, projects) comes from `src/data/site.ts` and `src/data/projects.ts`; edit data, not components, to change it.
- Draft posts use `draft: true` and must never appear in production builds, RSS, or the sitemap.
- Components are `.astro` files by default; add a client-side framework island only with a clear need.
- Keep client-side JavaScript to a minimum; justify any addition.
- Use relative or root-relative links; set the canonical site URL in one place (`astro.config.mjs`).
- Images go in `src/assets/` and use Astro's `<Image>` for optimization, with meaningful `alt` text. A post's `heroImage` requires `heroAlt`.
- Don't commit secrets. The site needs none; if a feature requires one, ask first.

## Definition of done
- `npm run build` passes with no errors (it includes `astro check`).
- Pages are responsive, keyboard navigable, and have proper `<title>` and meta description.
- Docs in `docs/` and this file are updated if structure, stack, or conventions changed.
