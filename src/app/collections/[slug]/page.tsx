import type { Metadata } from 'next';
import { getCollectionBySlug } from '@/data/collections';
import { getCollectionMetadata, createMetadata } from '@/lib/seo';
import { formatSlugToTitle } from '@/lib/utils';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema, generateCollectionSchema } from '@/lib/schema';

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  if (collection) {
    return getCollectionMetadata(collection);
  }

  const title = formatSlugToTitle(slug);
  return createMetadata({
    title: `${title} | Jewellery Collections | Bhai Jeweller`,
    description: `Explore our ${title.toLowerCase()} collection at Bhai Jeweller in Bradford. Exquisite craftsmanship and fine jewellery.`,
    path: `/collections/${slug}`,
  });
}

export default async function CollectionDetailPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  const title = collection?.name || formatSlugToTitle(slug);

  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Collections', url: '/collections' },
    { name: title, url: `/collections/${slug}` },
  ]);

  const collectionSchema = generateCollectionSchema(
    collection || {
      id: slug,
      slug,
      name: title,
      description: `Collection of ${title.toLowerCase()} at Bhai Jeweller.`,
    }
  );

  return (
    <main className="p-8">
      <JsonLd data={breadcrumbs} id="collection-breadcrumbs" />
      <JsonLd data={collectionSchema} id="collection-schema" />
      <h1 className="font-serif text-3xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-neutral-600">
        {collection?.description || `Browse fine ${title.toLowerCase()} at Bhai Jeweller.`}
      </p>
    </main>
  );
}
