import type { Metadata } from 'next';
import { SITE_CONFIG } from './constants';
import { getCanonicalUrl } from './utils';
import type { Product, Collection, LocationData, SEOMetadataInput } from '@/types';

/**
 * Core metadata factory creating compliant, search-optimized Next.js Metadata objects.
 * Prevents duplicate canonical URLs, enforces British English locale, and configures robots.
 */
export function createMetadata({
  title,
  description,
  path = '',
  keywords,
  noIndex = false,
  image,
  type = 'website',
}: SEOMetadataInput): Metadata {
  const canonical = getCanonicalUrl(path);

  const images = image
    ? [{ url: image.startsWith('http') ? image : getCanonicalUrl(image), width: 1200, height: 630, alt: title }]
    : [];

  const titleConfig = title.includes(SITE_CONFIG.name) ? { absolute: title } : title;

  return {
    title: titleConfig,
    description,
    ...(keywords && keywords.length > 0 ? { keywords } : {}),
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      type,
      ...(images.length > 0 ? { images } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(images.length > 0 ? { images } : {}),
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
  };
}

/**
 * Metadata helper for Home route (/)
 */
export function getHomeMetadata(): Metadata {
  return createMetadata({
    title: SITE_CONFIG.defaultTitle,
    description: SITE_CONFIG.defaultDescription,
    path: '/',
    keywords: [...SITE_CONFIG.primaryKeywords],
  });
}

/**
 * Metadata helper for Shop route (/shop)
 */
export function getShopMetadata(): Metadata {
  return createMetadata({
    title: 'Shop Fine Jewellery in Bradford | Bhai Jeweller',
    description:
      'Explore our curated collections of fine gold jewellery, silver jewellery, and bespoke designs at Bhai Jeweller in Bradford.',
    path: '/shop',
    keywords: ['Shop Jewellery Bradford', 'Gold Jewellery Bradford', 'Fine Jewellery UK'],
  });
}

/**
 * Metadata helper for Collections index (/collections)
 */
export function getCollectionsMetadata(): Metadata {
  return createMetadata({
    title: 'Jewellery Collections | Bhai Jeweller Bradford',
    description:
      'Discover handcrafted jewellery collections from Bhai Jeweller in Bradford, including bridal, gold, and bespoke pieces.',
    path: '/collections',
    keywords: ['Jewellery Collections Bradford', 'Bridal Jewellery', 'Gold Collections'],
  });
}

/**
 * Dynamic metadata helper for individual Collection routes (/collections/[slug])
 */
export function getCollectionMetadata(collection: Collection): Metadata {
  const title = collection.seoTitle || `${collection.name} | Jewellery Collections | Bhai Jeweller`;
  const description =
    collection.seoDescription ||
    `Browse our ${collection.name.toLowerCase()} collection at Bhai Jeweller in Bradford. Quality gold and fine jewellery craftsmanship.`;

  return createMetadata({
    title,
    description,
    path: `/collections/${collection.slug}`,
    image: collection.image,
  });
}

/**
 * Dynamic metadata helper for individual Product routes (/products/[slug])
 */
export function getProductMetadata(product: Product): Metadata {
  const title = product.seoTitle || `${product.name} | Bhai Jeweller`;
  const description =
    product.seoDescription ||
    (product.description ? product.description.slice(0, 160) : `View ${product.name} at Bhai Jeweller in Bradford.`);

  return createMetadata({
    title,
    description,
    path: `/products/${product.slug}`,
    image: product.images?.[0],
  });
}

/**
 * Metadata helper for Location routes (e.g. /locations/bradford)
 */
export function getLocationMetadata(location: LocationData): Metadata {
  const title = location.seoTitle || `Jewellery Shop in ${location.city} | Bhai Jeweller`;
  const description =
    location.seoDescription ||
    `Visit Bhai Jeweller in ${location.city}, ${location.region}. Fine gold and silver jewellery, bespoke craftsmanship, and expert jeweller service.`;

  return createMetadata({
    title,
    description,
    path: `/locations/${location.slug}`,
    keywords: [
      `Jeweller in ${location.city}`,
      `Jewellery Shop ${location.city}`,
      `Gold Jewellery ${location.city}`,
      `${location.city} Jewellers`,
    ],
  });
}

/**
 * Metadata helper for About route (/about)
 */
export function getAboutMetadata(): Metadata {
  return createMetadata({
    title: 'About Bhai Jeweller | Heritage & Craftsmanship in Bradford',
    description:
      'Learn about the heritage, bespoke craftsmanship, and dedication to excellence that define Bhai Jeweller, based in Bradford, West Yorkshire.',
    path: '/about',
    keywords: ['About Bhai Jeweller', 'Bradford Jeweller Heritage', 'Bespoke Jewellery Bradford'],
  });
}

/**
 * Metadata helper for Contact route (/contact)
 */
export function getContactMetadata(): Metadata {
  return createMetadata({
    title: 'Contact Bhai Jeweller | Bradford, West Yorkshire',
    description:
      'Get in touch with Bhai Jeweller in Bradford for bespoke jewellery enquiries, appointments, and customer support.',
    path: '/contact',
    keywords: ['Contact Bhai Jeweller', 'Bradford Jeweller Contact', 'Jewellery Consultation Bradford'],
  });
}
