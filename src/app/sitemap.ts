import type { MetadataRoute } from 'next';
import { getCanonicalUrl } from '@/lib/utils';
import { getAllProducts } from '@/data/products';
import { getAllCollections } from '@/data/collections';
import { getAllLocations } from '@/data/locations';

/**
 * Programmatic sitemap generator for search engine crawlers.
 * Dynamically aggregates static routes, locations, collections, and products.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // Core static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: getCanonicalUrl('/'),
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: getCanonicalUrl('/shop'),
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: getCanonicalUrl('/collections'),
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: getCanonicalUrl('/about'),
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: getCanonicalUrl('/contact'),
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Location pages (e.g. /locations/bradford)
  const locations = await getAllLocations();
  const locationRoutes: MetadataRoute.Sitemap = locations.map((location) => ({
    url: getCanonicalUrl(`/locations/${location.slug}`),
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Dynamic collection pages (e.g. /collections/gold-jewellery)
  const collections = await getAllCollections();
  const collectionRoutes: MetadataRoute.Sitemap = collections.map((col) => ({
    url: getCanonicalUrl(`/collections/${col.slug}`),
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Dynamic product pages (e.g. /products/item-slug)
  const products = await getAllProducts();
  const productRoutes: MetadataRoute.Sitemap = products.map((prod) => ({
    url: getCanonicalUrl(`/products/${prod.slug}`),
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  return [...staticRoutes, ...locationRoutes, ...collectionRoutes, ...productRoutes];
}
