/**
 * Central constants for Bhai Jeweller
 * Single source of truth for site URLs, brand configuration, and SEO defaults.
 */

// Normalized base site URL (strictly without trailing slash)
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bhaijeweller.co.uk';
export const SITE_URL = rawSiteUrl.replace(/\/+$/, '');

export const SITE_CONFIG = {
  name: 'Bhai Jeweller',
  legalName: 'Bhai Jeweller',
  url: SITE_URL,
  locale: 'en_GB',
  defaultTitle: 'Bhai Jeweller | Jewellery Shop in Bradford, West Yorkshire',
  titleTemplate: '%s | Bhai Jeweller',
  defaultDescription:
    'Bhai Jeweller is a premier jewellery business based in Bradford, West Yorkshire, offering fine gold jewellery, silver jewellery, and bespoke designs.',
  primaryKeywords: [
    'Jewellery',
    'Jeweller',
    'Gold Jewellery',
    'Silver Jewellery',
    'Jewellery Shop Bradford',
  ] as const,
  location: {
    city: 'Bradford',
    region: 'West Yorkshire',
    country: 'United Kingdom',
    countryCode: 'GB',
  },
  routes: {
    home: '/',
    shop: '/shop',
    collections: '/collections',
    locations: '/locations/bradford',
    about: '/about',
    contact: '/contact',
  },
  disallowedRobotsPaths: ['/admin', '/admin/*', '/dashboard', '/dashboard/*', '/api', '/api/*'] as const,
};
