import { SITE_CONFIG } from './constants';
import { getCanonicalUrl } from './utils';
import type { Product, Collection, LocationData, BreadcrumbItem } from '@/types';

/**
 * Reusable JSON-LD schema generators adhering strictly to schema.org standards.
 * Guaranteed zero fake reviews, ratings, prices, or fake business addresses.
 */

export function generateOrganizationSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    legalName: SITE_CONFIG.legalName,
    url: getCanonicalUrl('/'),
  };
}

export function generateJewelryStoreSchema(location?: Partial<LocationData>): Record<string, unknown> {
  const storeUrl = location?.slug
    ? getCanonicalUrl(`/locations/${location.slug}`)
    : getCanonicalUrl('/');

  const address: Record<string, string> = {
    '@type': 'PostalAddress',
    addressLocality: location?.city || SITE_CONFIG.location.city,
    addressRegion: location?.region || SITE_CONFIG.location.region,
    addressCountry: location?.countryCode || SITE_CONFIG.location.countryCode,
  };

  if (location?.postalCode) {
    address.postalCode = location.postalCode;
  }
  if (location?.streetAddress) {
    address.streetAddress = location.streetAddress;
  }

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'JewelryStore'],
    name: location?.name || SITE_CONFIG.name,
    url: storeUrl,
    address,
  };

  if (location?.telephone) {
    schema.telephone = location.telephone;
  }

  if (location?.email) {
    schema.email = location.email;
  }

  if (location?.openingHours && location.openingHours.length > 0) {
    schema.openingHours = location.openingHours;
  }

  if (location?.geo) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: location.geo.latitude,
      longitude: location.geo.longitude,
    };
  }

  return schema;
}

export function generateProductSchema(product: Product): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    url: getCanonicalUrl(`/products/${product.slug}`),
  };

  if (product.images && product.images.length > 0) {
    schema.image = product.images;
  }

  if (product.sku) {
    schema.sku = product.sku;
  }

  if (product.material) {
    schema.material = product.material;
  }

  schema.brand = {
    '@type': 'Brand',
    name: product.brand || SITE_CONFIG.name,
  };

  if (product.price !== undefined) {
    const offer: Record<string, unknown> = {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'GBP',
      url: getCanonicalUrl(`/products/${product.slug}`),
    };

    if (product.availability) {
      offer.availability = `https://schema.org/${product.availability}`;
    }

    schema.offers = offer;
  }

  return schema;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: getCanonicalUrl(item.url),
    })),
  };
}

export function generateCollectionSchema(
  collection: Collection,
  products?: Product[]
): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collection.name,
    description: collection.description,
    url: getCanonicalUrl(`/collections/${collection.slug}`),
  };

  if (collection.image) {
    schema.image = collection.image;
  }

  if (products && products.length > 0) {
    schema.mainEntity = {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: getCanonicalUrl(`/products/${product.slug}`),
        name: product.name,
      })),
    };
  }

  return schema;
}

export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
