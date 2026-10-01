import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ScrollReveal } from './ScrollReveal';

export function CTABanner() {
  return (
    <section className="w-full bg-[#faf7f2] py-0 px-0 overflow-hidden">
      <div className="relative w-full max-w-full mx-auto rounded-none overflow-hidden flex items-center min-h-[160px] sm:min-h-[190px] shadow-md bg-[#120e0b]">

        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/category-rings.jpg"
            alt="Own a piece of forever"
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#0e0a07]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0e0a07]/65 via-[#0e0a07]/35 to-[#0e0a07]/50" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full px-5 sm:px-10 lg:px-14 py-8 sm:py-12">
          <div className="flex flex-row items-center justify-between gap-4 sm:gap-8">

            {/* Left: Headline + Subtext */}
            <ScrollReveal direction="right" duration={800} className="flex-1 min-w-0">
              <div>
                <h2 className="font-serif text-[18px] sm:text-[24px] lg:text-[28px] text-[#f5efe8] font-normal leading-tight tracking-tight">
                  Own a piece of forever
                </h2>
                <p className="text-[10px] sm:text-xs text-[#c8bdb5] font-light mt-1 sm:mt-1.5 max-w-xs sm:max-w-md leading-relaxed line-clamp-2">
                  Explore our collection and find the perfect piece for your next chapter.
                </p>
              </div>
            </ScrollReveal>

            {/* Right: Golden Pill Button (matches reference) */}
            <ScrollReveal direction="left" delay={150} duration={800} className="flex-shrink-0">
              <div>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#dec29b] via-[#d8bb93] to-[#cba37b] text-[#17120e] font-medium text-xs sm:text-sm tracking-wide shadow-md hover:brightness-105 active:scale-[0.98] transition-all group whitespace-nowrap"
                >
                  <span>Shop Now</span>
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2] group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </ScrollReveal>

          </div>
        </div>

      </div>
    </section>
  );
}
