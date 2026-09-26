import type { Metadata } from 'next';
import { bradfordLocation } from '@/data/locations';
import { getLocationMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema, generateJewelryStoreSchema } from '@/lib/schema';

export const metadata: Metadata = getLocationMetadata(bradfordLocation);

export default function BradfordLocationPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Locations', url: '/locations/bradford' },
    { name: 'Bradford', url: '/locations/bradford' },
  ]);

  const storeSchema = generateJewelryStoreSchema(bradfordLocation);

  return (
    <main className="pt-36 sm:pt-40 pb-20 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto w-full">
      <JsonLd data={breadcrumbSchema} id="bradford-breadcrumbs" />
      <JsonLd data={storeSchema} id="bradford-store-schema" />
      <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#f8f5f0]">
        Jewellery Shop in Bradford
      </h1>
      <p className="mt-3 text-sm sm:text-base text-[#b8ada1] max-w-xl font-light leading-relaxed">
        Bhai Jeweller provides fine gold and silver jewellery, bespoke craftsmanship, and expert
        jeweller services in Bradford, West Yorkshire.
      </p>
    </main>
  );
}
