import { getCollection, type CollectionEntry } from 'astro:content';
import { categories, type Category, type CategorySlug } from '../data/categories';

export type Post = CollectionEntry<'posts'>;

// The only place that reads the posts collection, so drafts can never leak into production.
export async function getAllPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => !import.meta.env.PROD || !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getFeaturedPosts(limit = 5): Promise<Post[]> {
  return (await getAllPosts()).filter((p) => p.data.featured).slice(0, limit);
}

export async function getRecentPosts(n = 5): Promise<Post[]> {
  return (await getAllPosts()).slice(0, n);
}

export async function getPostsByCategory(slug: CategorySlug): Promise<Post[]> {
  return (await getAllPosts()).filter((p) => p.data.category === slug);
}

// Categories that have at least one post, in config order, with their post lists.
export async function getCategoriesWithPosts(): Promise<{ category: Category; posts: Post[] }[]> {
  const all = await getAllPosts();
  return categories
    .map((category) => ({ category, posts: all.filter((p) => p.data.category === category.slug) }))
    .filter(({ posts }) => posts.length > 0);
}

export const HOME_PAGE_SIZE = 10;

export type HomePage = { posts: Post[]; currentPage: number; totalPages: number };

// Home is page 1 at `/`; older posts live at `/page/2`, `/page/3`, ...
export async function getHomePages(): Promise<HomePage[]> {
  const all = await getAllPosts();
  const totalPages = Math.max(1, Math.ceil(all.length / HOME_PAGE_SIZE));
  return Array.from({ length: totalPages }, (_, i) => ({
    posts: all.slice(i * HOME_PAGE_SIZE, (i + 1) * HOME_PAGE_SIZE),
    currentPage: i + 1,
    totalPages,
  }));
}

export function homePageUrl(page: number): string {
  return page === 1 ? '/' : `/page/${page}`;
}
