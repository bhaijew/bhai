'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ScrollReveal } from './ScrollReveal';
import { useShop } from '@/context/ShopContext';

export function CuratedCollections() {
  const { categories } = useShop();

  const displayList = categories.slice(0, 4);

  return (
    <section className="w-full bg-[#faf7f2] py-8 sm:py-14 lg:py-18 text-center">
      <div className="max-w-[1440px] mx-auto px-1.5 sm:px-8 lg:px-12">

        {/* Section Label */}
        <ScrollReveal direction="up">
          <Link
            href="/categories"
            className="inline-block text-xs tracking-[0.28em] text-[#a09080] hover:text-[#805f32] transition-colors font-medium mb-1.5 uppercase"
          >
            Shop by category
          </Link>
          <h2 className="font-serif text-[24px] sm:text-[34px] lg:text-[40px] text-[#1c1510] font-normal tracking-tight leading-tight">
            Find Your Perfect Piece
          </h2>
          <div className="w-12 h-[2px] bg-[#c9b49a] mx-auto mt-2.5 mb-5 sm:mb-8" />
        </ScrollReveal>

        {/* Category Circles */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-8 md:gap-10 lg:gap-12 max-w-6xl mx-auto">
          {displayList.map((item, idx) => (
            <ScrollReveal key={item.id || item.slug} delay={idx * 120} direction="zoom" duration={650}>
              <Link
                href={`/shop?category=${encodeURIComponent(item.name)}`}
                className="group flex flex-col items-center min-w-0"
              >
                {/* Circular Image Container */}
                <div className="relative w-full aspect-square rounded-full overflow-hidden bg-[#e8d9cb] shadow-sm group-hover:shadow-2xl group-hover:shadow-[#cba37b]/30 transition-all duration-500 border-2 border-transparent group-hover:border-[#d8bb93]">
                  <Image
                    src={item.image || '/images/category-rings.jpg'}
                    alt={item.name}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 25vw, (max-width: 1024px) 25vw, 260px"
                    className="object-cover group-hover:scale-[1.08] transition-transform duration-700 ease-out rounded-full"
                  />
                </div>

                {/* Title with Arrow */}
                <div className="mt-2.5 sm:mt-4 flex items-center justify-center w-full gap-0.5 sm:gap-1.5">
                  <h3 className="font-serif text-[11px] sm:text-lg lg:text-[19px] text-[#1c1510] group-hover:text-[#9e7d56] transition-colors font-normal leading-tight truncate">
                    {item.name}
                  </h3>
                  <span className="text-[#9e7d56] text-[10px] sm:text-sm transition-transform duration-300 group-hover:translate-x-1 flex-shrink-0">
                    &rarr;
                  </span>
                </div>

                {/* Subtitle */}
                <p className="text-[9px] sm:text-xs text-[#a0907e] font-light tracking-tight sm:tracking-wide mt-0.5 sm:mt-1 line-clamp-1 text-center">
                  {item.description || 'Subtle luxury crafted in UK'}
                </p>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* View All Categories Link */}
        <div className="mt-8">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-xs font-serif tracking-[0.18em] uppercase text-[#8c6b2d] hover:text-[#523d18] border-b border-[#dec29b] pb-0.5 transition-colors font-medium"
          >
            <span>Explore All {categories.length} Collections & Categories</span>
            <span>&rarr;</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
