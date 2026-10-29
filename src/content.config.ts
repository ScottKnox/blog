import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { categorySlugs } from './data/categories';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        category: z.enum(categorySlugs),
        featured: z.boolean().default(false),
        draft: z.boolean().default(false),
        heroImage: image().optional(),
        heroAlt: z.string().optional(),
      })
      .refine((data) => !data.heroImage || data.heroAlt, {
        message: '`heroAlt` is required when `heroImage` is set.',
        path: ['heroAlt'],
      }),
});

export const collections = { posts };
