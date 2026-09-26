import type { Product } from '@/types';

/**
 * Product Data Access Layer
 * Scalable architecture ready to connect to a CMS, Database, or E-commerce API.
 * Currently returns empty state (strictly zero fake products).
 */

const products: Product[] = [];

export async function getAllProducts(): Promise<Product[]> {
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = products.find((p) => p.slug === slug);
  return product || null;
}

export async function getProductsByCollection(collectionSlug: string): Promise<Product[]> {
  return products.filter((p) => p.collection === collectionSlug);
}
