import type { Metadata } from 'next';
import { getProductBySlug } from '@/data/products';
import { getProductMetadata, createMetadata } from '@/lib/seo';
import { formatSlugToTitle } from '@/lib/utils';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema, generateProductSchema } from '@/lib/schema';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (product) {
    return getProductMetadata(product);
  }

  const title = formatSlugToTitle(slug);
  return createMetadata({
    title: `${title} | Bhai Jeweller`,
    description: `View ${title} at Bhai Jeweller in Bradford. Fine gold and silver jewellery craftsmanship.`,
    path: `/products/${slug}`,
  });
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const title = product?.name || formatSlugToTitle(slug);

  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Shop', url: '/shop' },
    { name: title, url: `/products/${slug}` },
  ]);

  return (
    <main className="p-8">
      <JsonLd data={breadcrumbs} id="product-breadcrumbs" />
      {product && <JsonLd data={generateProductSchema(product)} id="product-schema" />}
      <h1 className="font-serif text-3xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-neutral-600">
        {product?.description || `Fine jewellery piece from Bhai Jeweller.`}
      </p>
    </main>
  );
}
