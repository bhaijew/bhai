import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CollectionItem {
  name: string;
  subtitle: string;
  href: string;
  image: string;
  alt: string;
}

const collections: CollectionItem[] = [
  {
    name: 'Rings',
    subtitle: 'Symbols of forever',
    href: '/collections',
    image: '/images/category-rings.jpg',
    alt: 'Diamond and gold rings collection',
  },
  {
    name: 'Necklaces',
    subtitle: 'Grace in every detail',
    href: '/collections',
    image: '/images/category-necklaces.jpg',
    alt: 'Fine gold and diamond necklaces collection',
  },
  {
    name: 'Earrings',
    subtitle: 'Timeless sparkle',
    href: '/collections',
    image: '/images/category-earrings.jpg',
    alt: 'Diamond drop earrings collection',
  },
  {
    name: 'Bracelets',
    subtitle: 'Subtle luxury',
    href: '/collections',
    image: '/images/category-bracelets.jpg',
    alt: 'Gold and diamond bracelets collection',
  },
];

export function CuratedCollections() {
  return (
    <section className="w-full bg-[#faf7f2] py-8 sm:py-14 lg:py-18 text-center">
      <div className="max-w-[1440px] mx-auto px-1.5 sm:px-8 lg:px-12">

        {/* Section Label */}
        <p className="text-[10px] tracking-[0.32em] uppercase text-[#a09080] font-medium mb-1.5">
          SHOP BY CATEGORY
        </p>
        <h2 className="font-serif text-[24px] sm:text-[34px] lg:text-[40px] text-[#1c1510] font-normal tracking-tight leading-tight">
          Find Your Perfect Piece
        </h2>
        <div className="w-12 h-[2px] bg-[#c9b49a] mx-auto mt-2.5 mb-8 sm:mb-12" />

        {/* 4 Category Circles in 1 Single Line (Mobile & Desktop) */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-8 md:gap-10 lg:gap-12 max-w-6xl mx-auto">
          {collections.map((item) => (
            <Link key={item.name} href={item.href} className="group flex flex-col items-center min-w-0">
              {/* Circular Image Container */}
              <div className="relative w-full aspect-square rounded-full overflow-hidden bg-[#e8d9cb] shadow-sm group-hover:shadow-2xl group-hover:shadow-[#cba37b]/30 transition-all duration-500 border-2 border-transparent group-hover:border-[#d8bb93]">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 25vw, (max-width: 1024px) 25vw, 260px"
                  className="object-cover group-hover:scale-[1.08] transition-transform duration-700 ease-out rounded-full"
                />
              </div>

              {/* Title with Arrow */}
              <div className="mt-2.5 sm:mt-4 flex items-center justify-center gap-0.5 sm:gap-1.5">
                <h3 className="font-serif text-[11px] sm:text-lg lg:text-[19px] text-[#1c1510] group-hover:text-[#9e7d56] transition-colors font-normal leading-tight truncate">
                  {item.name}
                </h3>
                <span className="text-[#9e7d56] text-[10px] sm:text-sm transition-transform duration-300 group-hover:translate-x-1 flex-shrink-0">
                  →
                </span>
              </div>

              {/* Subtitle */}
              <p className="text-[9px] sm:text-xs text-[#a0907e] font-light tracking-tight sm:tracking-wide mt-0.5 sm:mt-1 line-clamp-1 text-center">
                {item.subtitle}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
