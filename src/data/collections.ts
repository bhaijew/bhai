import type { Collection } from '@/types';

/**
 * Collection Data Access Layer
 * Supports structured collections such as baby-jewellery, gold-jewellery, and bridal-jewellery.
 * Ready for database/CMS connection without inserting fake products or unverified claims.
 */

const collections: Collection[] = [];

export async function getAllCollections(): Promise<Collection[]> {
  return collections;
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  const collection = collections.find((c) => c.slug === slug);
  return collection || null;
}
