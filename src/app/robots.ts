import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/constants';
import { getCanonicalUrl } from '@/lib/utils';

/**
 * Generates robots.txt adhering to Robots Exclusion Standard.
 * Allows indexing of public ecommerce routes while safeguarding private administration routes.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [...SITE_CONFIG.disallowedRobotsPaths],
    },
    sitemap: getCanonicalUrl('/sitemap.xml'),
  };
}
