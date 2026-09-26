import type { Category } from '@/types';

/**
 * Category Data Access Layer
 * Ready for database/CMS connection without inserting fake or unverified content.
 */

const categories: Category[] = [];

export async function getAllCategories(): Promise<Category[]> {
  return categories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const category = categories.find((c) => c.slug === slug);
  return category || null;
}
