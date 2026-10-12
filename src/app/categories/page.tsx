'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { ScrollReveal } from '@/components/shared/ScrollReveal';

export default function CategoriesPage() {
  const { categories, products } = useShop();

  // Compute product count per category
  const categoriesWithCounts = useMemo(() => {
    return categories.map((cat) => {
      const count = products.filter(
        (p) => p.category?.toLowerCase() === cat.name.toLowerCase()
      ).length;
      return {
        ...cat,
        productCount: count,
      };
    });
  }, [categories, products]);

  return (
    <main className="w-full bg-[#0c0907] min-h-screen text-[#f5efe8] selection:bg-[#c5a059] selection:text-[#ffffff] pb-24">
      {/* LUXURY GOLD GLOW AMBIENT BACKGROUND */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#dec29b]/15 via-[#8c6b2d]/5 to-transparent blur-3xl pointer-events-none" />

      {/* HEADER / BREADCRUMB HERO */}
      <section className="relative z-10 pt-28 sm:pt-36 pb-12 sm:pb-16 px-4 sm:px-8 max-w-7xl mx-auto text-center">
        <ScrollReveal direction="up">
          <nav className="flex items-center justify-center gap-2 text-xs font-mono tracking-widest uppercase text-[#a8998c] mb-4">
            <Link href="/" className="hover:text-[#dec29b] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#dec29b]">Categories</span>
          </nav>

          <span className="inline-block px-3 py-1 rounded-[4px] bg-[#1a120c] border border-[#dec29b]/30 text-[11px] font-mono tracking-[0.25em] text-[#dec29b] uppercase mb-4">
            ✦ Bradford Master Atelier ✦
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-[0.15em] text-[#f5efe8] uppercase mb-4">
            FINE JEWELLERY <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b38b40] via-[#f7e7ce] to-[#dec29b]">COLLECTIONS</span>
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-[#b8a798] leading-relaxed font-light">
            Explore our curated collections of hallmarked 22k pure gold, 18k artisan creations, and certified diamond jewelry. Each piece handcrafted in Bradford, West Yorkshire.
          </p>

          <div className="flex items-center justify-center gap-4 mt-8">
            <Link
              href="/shop"
              className="px-6 py-2.5 rounded-[5px] bg-gradient-to-r from-[#b38b40] to-[#dec29b] text-[#140e0b] font-bold text-xs uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-lg shadow-[#b38b40]/20"
            >
              Browse All Products ({products.length})
            </Link>
            <Link
              href="/contact"
              className="px-6 py-2.5 rounded-[5px] bg-[#1a120c] border border-[#dec29b]/40 text-[#dec29b] font-semibold text-xs uppercase tracking-[0.15em] hover:bg-[#251b12] transition-all"
            >
              Bespoke Commission
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* CATEGORIES GRID */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categoriesWithCounts.map((cat, idx) => (
            <ScrollReveal key={cat.id || cat.slug} direction="up" delay={idx * 60}>
              <Link
                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group block relative rounded-[8px] overflow-hidden border border-[#3a2c20] bg-[#140e0a] hover:border-[#dec29b]/80 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-[#b38b40]/10 hover:-translate-y-1"
              >
                {/* Image Container with Luxury Zoom */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1f1610]">
                  <Image
                    src={cat.image || '/images/category-rings.jpg'}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Subtle Gradient Veil */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#140e0a] via-[#140e0a]/40 to-transparent" />

                  {/* Top Badge: Product Count */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1 rounded-[4px] bg-[#0c0907]/85 backdrop-blur-md border border-[#dec29b]/40 text-[10.5px] font-mono uppercase tracking-wider text-[#dec29b]">
                      {cat.productCount} {cat.productCount === 1 ? 'Design' : 'Designs'}
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6 relative">
                  {/* Top Gold Accent Line */}
                  <div className="w-10 h-[2px] bg-[#dec29b] mb-3 group-hover:w-16 transition-all duration-300" />

                  <div className="flex items-center justify-between mb-2">
                    <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-[#f5efe8] group-hover:text-[#dec29b] transition-colors uppercase">
                      {cat.name}
                    </h2>
                    <span className="text-[#dec29b] text-base group-hover:translate-x-1.5 transition-transform duration-300">
                      &rarr;
                    </span>
                  </div>

                  <p className="text-xs text-[#a8998c] line-clamp-2 font-light leading-relaxed mb-4">
                    {cat.description || `Explore our handcrafted ${cat.name.toLowerCase()} collection made with the finest precious metals.`}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-[#2a1f16] text-[11px] font-mono text-[#8c6b2d]">
                    <span className="uppercase tracking-widest group-hover:text-[#dec29b] transition-colors">
                      Explore Collection
                    </span>
                    <span className="text-[10px] text-[#6b594b]">Bradford Hallmarked</span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* QUICK STATS & ASSAY PROMISE */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 mt-20">
        <div className="rounded-[8px] border border-[#3a2c20] bg-[#140e0a]/90 backdrop-blur-md p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="font-serif text-2xl font-bold text-[#dec29b] mb-1">100%</p>
            <p className="text-xs uppercase tracking-wider font-semibold text-[#f5efe8]">UK Assay Certified</p>
            <p className="text-[11px] text-[#8a796c] mt-1">Sheffield & London Hallmarked</p>
          </div>
          <div className="sm:border-x sm:border-[#2a1f16]">
            <p className="font-serif text-2xl font-bold text-[#dec29b] mb-1">Real-Time</p>
            <p className="text-xs uppercase tracking-wider font-semibold text-[#f5efe8]">Live Catalog Sync</p>
            <p className="text-[11px] text-[#8a796c] mt-1">Directly updated from atelier</p>
          </div>
          <div>
            <p className="font-serif text-2xl font-bold text-[#dec29b] mb-1">Bespoke</p>
            <p className="text-xs uppercase tracking-wider font-semibold text-[#f5efe8]">Custom Commissions</p>
            <p className="text-[11px] text-[#8a796c] mt-1">Tailored to your personal taste</p>
          </div>
        </div>
      </section>
    </main>
  );
}
