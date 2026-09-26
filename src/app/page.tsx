import type { Metadata } from 'next';
import { getHomeMetadata } from '@/lib/seo';
import {
  HeroSection,
  TrustFeaturesBar,
  CollectionsBanner,
  CuratedCollections,
  FeaturedProducts,
  OurStory,
  TestimonialsSection,
  CTABanner,
} from '@/components/shared';

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




