import type { LocationData } from '@/types';

/**
 * Location Data Access Layer
 * Contains verified business location details for Bradford, West Yorkshire.
 * Strictly adheres to rule: NO fake street addresses, phone numbers, ratings, or hours.
 */

export const bradfordLocation: LocationData = {
  id: 'bradford',
  slug: 'bradford',
  name: 'Bhai Jeweller Bradford',
  city: 'Bradford',
  region: 'West Yorkshire',
  country: 'United Kingdom',
  countryCode: 'GB',
  seoTitle: 'Jewellery Shop in Bradford | Bhai Jeweller',
  seoDescription:
    'Visit Bhai Jeweller in Bradford, West Yorkshire for exquisite gold and silver jewellery, bespoke craftsmanship, and timeless designs.',
  // Optional fields left undefined until verified by business owner:
  // streetAddress: undefined,
  // postalCode: undefined,
  // telephone: undefined,
  // email: undefined,
  // openingHours: undefined,
  // geo: undefined,
};

const locations: LocationData[] = [bradfordLocation];

export async function getAllLocations(): Promise<LocationData[]> {
  return locations;
}

export async function getLocationBySlug(slug: string): Promise<LocationData | null> {
  const location = locations.find((l) => l.slug === slug);
  return location || null;
}
