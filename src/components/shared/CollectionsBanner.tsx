import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ScrollReveal } from './ScrollReveal';

export function CollectionsBanner() {
  return (
    <section className="w-full bg-[#faf7f2] py-0 px-0 overflow-hidden">
      <div className="relative w-full max-w-full mx-auto rounded-none overflow-hidden min-h-[300px] sm:min-h-[360px] lg:min-h-[400px] flex items-center bg-[#120e0b] shadow-md">

        {/* Background: jewellery image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/category-bracelets.jpg"
            alt="Fine jewellery crafted for every chapter"
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover object-[75%_center] sm:object-center"
          />
          {/* Gradients ensuring high legibility */}
          <div className="absolute inset-0 bg-[#0d0a07]/55" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0a07]/95 via-[#0d0a07]/75 to-transparent w-full md:w-3/4" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full px-5 sm:px-10 lg:px-14 py-8 sm:py-12">
          <div className="flex items-center justify-between">

            {/* Left: Text block */}
            <ScrollReveal direction="right" duration={800}>
              <div className="max-w-xs sm:max-w-sm lg:max-w-md">
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#dec29b] font-medium mb-3">
                  OUR COLLECTIONS
                </p>
                <h2 className="font-serif text-[26px] sm:text-[36px] lg:text-[42px] text-[#f5efe8] font-normal leading-[1.12] tracking-tight mb-3 sm:mb-4">
                  Crafted for<br />every chapter
                </h2>
                <p className="text-[12px] sm:text-[13px] text-[#c8bdb5] font-light leading-relaxed mb-6 sm:mb-7 max-w-[280px] sm:max-w-[320px]">
                  From everyday elegance to life&apos;s biggest moments, our jewellery is designed to be part of your story — today and always.
                </p>
                <Link
                  href="/collections"
                  className="
                    inline-flex items-center gap-2
                    px-5 sm:px-6 py-2.5 sm:py-3 rounded-full
                    border border-[#d8bb93]/60 text-[#f5efe8]
                    text-xs tracking-wide font-light
                    hover:border-[#d8bb93] hover:bg-[#d8bb93]/15
                    transition-all duration-300 group
                  "
                >
                  Discover Our Craft
                  <svg
                    className="w-3.5 h-3.5 stroke-[2] transition-transform duration-300 group-hover:translate-x-0.5"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </ScrollReveal>

            {/* Right: Circular FINE JEWELLERY Watermark (matches reference) */}
            <ScrollReveal direction="zoom" delay={200} duration={800}>
              <div className="hidden sm:flex flex-col items-center justify-center mr-4 lg:mr-8 opacity-40 select-none pointer-events-none">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-dashed border-[#dec29b]/60 flex items-center justify-center">
                  <span className="text-[9px] tracking-[0.25em] text-[#dec29b] uppercase font-light text-center px-2">
                    FINE JEWELLERY
                  </span>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>

      </div>
    </section>
  );
}
