# Blog

A personal blog built with [Astro](https://astro.build): static HTML, no database, deployed to Vercel. Posts are Markdown files in git.

## Setup

Requires Node.js 22.23.4 or newer.

```sh
npm install
npm run dev       # http://localhost:4321 (drafts are visible here)
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server with hot reload |
| `npm run build` | Type/content check (`astro check`), then production build to `dist/` |
| `npm run preview` | Serve the production build locally |

## Writing a post

Create `src/content/posts/<slug>.md` (or `.mdx`). The filename becomes the URL: `/posts/<slug>`. Use lowercase kebab-case.

In VS Code, type `post` in the new file and press Ctrl+Space to insert the frontmatter below with today's date. New posts start as drafts. In `.mdx` files, `figure` inserts an image with a caption. The snippets are in `.vscode/blog.code-snippets`.

```md
---
title: 'My post title'
description: 'One or two sentences. Used in lists, search results, and social cards.'
pubDate: 2026-11-01
category: engineering
draft: true
---

Write the post here.
```

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | |
| `description` | yes | Meta description and post-list summary |
| `pubDate` | yes | `YYYY-MM-DD` |
| `updatedDate` | no | Shown as "Updated …" and used in the sitemap |
| `category` | yes | One slug from `src/data/categories.ts`; a typo fails the build |
| `featured` | no | `true` to show in the sidebar's Featured list |
| `draft` | no | `true` to show only in `npm run dev`, never in production, RSS, or the sitemap |
| `heroImage` | no | Path to an image in `src/assets/`, e.g. `../../assets/my-image.jpg`; also used as the social card |
| `heroAlt` | with `heroImage` | Describes the hero image; required when `heroImage` is set |

Code blocks are syntax-highlighted. Headings get `#` anchor links, and GFM tables and footnotes work.

### Images with captions (MDX)

Put images in `src/assets/` and use a `.mdx` post:

```mdx
import { Image } from 'astro:assets';
import diagram from '../../assets/diagram.png';

<figure>
  <Image src={diagram} alt="Describe what the image shows." />
  <figcaption>Caption text.</figcaption>
</figure>
```

## Editing site content

Edit data files, not components:

- `src/data/site.ts`: name, intro, short and long bio, photo, social links
- `src/data/categories.ts`: allowed categories (see [Managing categories](#managing-categories))
- `src/data/projects.ts`: projects in the sidebar
- `src/assets/`: profile photo and default social image (`og-default.png`, 1200×630)
- `astro.config.mjs`: `site` (the production URL used for canonical links, RSS, and the sitemap)

## Publishing a post

1. **Draft it.** Create the file (see [Writing a post](#writing-a-post)) with `draft: true`, and run `npm run dev`. Drafts appear locally with a "Draft" badge.
2. **Mark it ready.** Set `draft: false` (or delete the line) and set `pubDate` to the publish date. Posts sort by `pubDate`, newest first.
3. **Check the build.** Run `npm run build`. It catches frontmatter mistakes (missing fields, unknown category, `heroImage` without `heroAlt`) and type errors. Optionally run `npm run preview` to see exactly what will ship.
4. **Commit and push to main.**

   ```sh
   git add .
   git commit -m "Post: My post title"
   git push
   ```

5. **Confirm it's live.** Vercel builds and deploys in about a minute. The post shows up on the home page, `/posts`, its category page, the sidebar's Recent list, `/rss.xml`, and the sitemap. If the build fails, nothing deploys, and the previous version stays live. Check the deployment log in the Vercel dashboard.

To preview before publishing, push to a branch other than main. Vercel gives every branch its own preview URL. Drafts are hidden there too, so set `draft: false` on the branch.

Good to know:

- **No scheduling.** A post with a future `pubDate` goes live as soon as it's pushed. Keep it as a draft until the day.
- **Editing a published post:** change it, add `updatedDate: YYYY-MM-DD`, and push. The post shows "Updated …" and the sitemap tells search engines it changed.
- **Unpublishing:** set `draft: true`, or delete the file, and push. The URL will then return the 404 page.
- **Don't rename published files.** The filename is the URL, so renaming breaks existing links, bookmarks, and RSS entries.

## Managing categories

Categories live in one list in `src/data/categories.ts`. Each post's `category` must match a `slug` from it:

```ts
export const categories = [
  {
    slug: 'engineering', // used in frontmatter and the URL: /categories/engineering
    label: 'Engineering', // display name
    description: 'Building software: design, code, and trade-offs.', // shown on the category pages
  },
  // ...
] as const;
```

- **Add:** append an entry. Its page appears once at least one published post uses it, and categories with no published posts are hidden everywhere.
- **Reorder:** list order is the order on the Categories page.
- **Change the label or description:** edit it freely; nothing else needs updating.
- **Rename a slug:** this changes the category's URL. Update `category:` in every post that uses it. Until you do, the build fails and names a post that still uses the old slug. Searching the posts folder for `category: old-slug` finds them all.
- **Remove:** move its posts to another category first. A post that still references a removed slug fails the build.

Use lowercase kebab-case slugs, for example `web-dev`. Each post has exactly one category, and there are no tags.

## More

- [docs/PROJECT.md](docs/PROJECT.md): goals, scope, and roadmap
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): how it's built
- [AGENTS.md](AGENTS.md): guide for AI coding agents
