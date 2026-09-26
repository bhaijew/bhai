import { SITE_URL } from './constants';

/**
 * Generates an absolute, canonical URL avoiding:
 * - duplicate canonical URLs
 * - http/https inconsistency
 * - www/non-www inconsistency
 * - trailing slash inconsistency
 */
export function getCanonicalUrl(path = ''): string {
  if (!path || path === '/') {
    return SITE_URL;
  }

  // Handle case where an absolute URL might be passed in
  if (path.startsWith('http://') || path.startsWith('https://')) {
    try {
      const parsed = new URL(path);
      path = parsed.pathname;
    } catch {
      // Fallback to relative cleanup
    }
  }

  // Ensure single leading slash and strip trailing slash
  const cleanPath = path.replace(/\/+/g, '/').replace(/\/+$/, '');
  const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;

  return `${SITE_URL}${normalizedPath}`;
}

/**
 * Formats a hyphenated slug into a title-cased string
 * e.g., "baby-jewellery" -> "Baby Jewellery"
 */
export function formatSlugToTitle(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Utility to conditionally merge class names
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
