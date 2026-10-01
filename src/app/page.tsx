import type { Metadata } from 'next';
import { getHomeMetadata } from '@/lib/seo';
import dynamic from 'next/dynamic';
import {
  HeroSection,
  TrustFeaturesBar,
  CollectionsBanner,
} from '@/components/shared';

// Lazy-load below-fold sections — defers JS parsing until user scrolls
const CuratedCollections = dynamic(
  () => import('@/components/shared/CuratedCollections').then(m => ({ default: m.CuratedCollections })),
  { ssr: true }
);
const FeaturedProducts = dynamic(
  () => import('@/components/shared/FeaturedProducts').then(m => ({ default: m.FeaturedProducts })),
  { ssr: true }
);
const OurStory = dynamic(
  () => import('@/components/shared/OurStory').then(m => ({ default: m.OurStory })),
  { ssr: true }
);
const TestimonialsSection = dynamic(
  () => import('@/components/shared/TestimonialsSection').then(m => ({ default: m.TestimonialsSection }))
);
const CTABanner = dynamic(
  () => import('@/components/shared/CTABanner').then(m => ({ default: m.CTABanner })),
  { ssr: true }
);

export const metadata: Metadata = getHomeMetadata();

export default function HomePage() {
  return (
    <main className="w-full max-w-full overflow-x-hidden overflow-hidden">
      <HeroSection />
      <TrustFeaturesBar />
      <CollectionsBanner />
      <CuratedCollections />
      <FeaturedProducts />
      <OurStory />
      <div className="hidden md:block">
        <TestimonialsSection />
      </div>
      <CTABanner />
    </main>
  );
}




