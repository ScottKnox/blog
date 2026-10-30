// PLACEHOLDER categories: replace with the real list. A post's `category` must match a slug here.
export const categories = [
  {
    slug: 'engineering',
    label: 'Engineering',
    description: 'Building software: design, code, and trade-offs.',
  },
  {
    slug: 'ai',
    label: 'AI',
    description: 'Cutting through AI hype and nonsense.',
  },
  {
    slug: 'tools',
    label: 'Tools',
    description: 'Editors, terminals, workflows, and the stuff in between.',
  },
  {
    slug: 'career',
    label: 'Career',
    description: 'Working as a software engineer.',
  },
] as const;

export type Category = (typeof categories)[number];
export type CategorySlug = Category['slug'];

export const categorySlugs = categories.map((c) => c.slug) as [CategorySlug, ...CategorySlug[]];

export function getCategory(slug: CategorySlug): Category {
  return categories.find((c) => c.slug === slug)!;
}
