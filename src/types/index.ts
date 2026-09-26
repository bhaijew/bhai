/**
 * Core type definitions for Bhai Jeweller
 * Designed for scalability to support hundreds of products, collections, and dynamic SEO.
 */

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  images: string[];
  price?: number;
  currency?: string;
  sku?: string;
  brand?: string;
  category?: string;
  collection?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  material?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string;
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
}

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface LocationData {
  id: string;
  slug: string;
  name: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  postalCode?: string;
  streetAddress?: string;
  telephone?: string;
  email?: string;
  openingHours?: string[];
  geo?: LocationCoordinates;
  seoTitle?: string;
  seoDescription?: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface SEOMetadataInput {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
  image?: string;
  type?: 'website' | 'article';
}
