'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface HeroSectionProps {
  brandPretitle?: string;
  headlineLine1?: string;
  headlineLine2?: string;
  headlineLine3?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  featuredCollectionTitle?: string;
  featuredCollectionSubtitle?: string;
  featuredCollectionHref?: string;
}

export function HeroSection({
  brandPretitle = 'BHAI JEWELLER',
  headlineLine1 = 'Jewellery, made',
  headlineLine2 = 'unforgettable',
  headlineLine3 = '',
  description = 'Timeless pieces for modern souls. Discover fine jewellery designed to celebrate your most precious moments.',
  primaryCtaText = 'Shop Collection',
  primaryCtaHref = '/collections',
  featuredCollectionTitle = 'Diamond Elegance',
  featuredCollectionSubtitle = 'Classic pieces, endless beauty.',
  featuredCollectionHref = '/collections/gold-jewellery',
}: HeroSectionProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <section className="relative w-full min-h-[420px] sm:min-h-[540px] lg:min-h-screen bg-[#120e0b] overflow-hidden flex items-center pt-16 sm:pt-24 lg:pt-20">
      {/* Background Hero Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/images/hero-img.jpg"
          alt="Fine luxury jewellery campaign"
          fill
          priority
          sizes="100vw"
          className="object-cover object-right transition-transform duration-1000 scale-100"
        />

        {/* Cinematic Lighting Overlays */}
        {/* Left dark gradient ensuring text is razor-sharp on left, leaving right model 100% clear */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#120e0b]/95 via-[#120e0b]/60 to-transparent w-full sm:w-1/2 lg:w-[45%]" />

        {/* Subtle bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#120e0b]/80 via-transparent to-[#120e0b]/30" />
      </div>

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 w-full py-6 sm:py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          {/* Left Column: Brand, Headline, Paragraph, Single CTA */}
          <div className="lg:col-span-7 xl:col-span-8 max-w-lg">
            {/* Pre-title Tag */}
            <p className="text-[9px] sm:text-xs tracking-[0.32em] uppercase text-[#dec29b] font-medium mb-1.5 sm:mb-3">
              {brandPretitle}
            </p>

            {/* Main Headline (matches exact reference with high-fashion editorial styling) */}
            <h1 className="font-serif text-[28px] sm:text-5xl lg:text-[68px] xl:text-[76px] leading-[1.08] text-[#f9f6f0] tracking-tight font-normal mb-2 sm:mb-4">
              {headlineLine1}
              <br />
              <span className="italic font-light text-gold-bright">{headlineLine2}</span>
              {headlineLine3 && (
                <>
                  <br />
                  <span>{headlineLine3}</span>
                </>
              )}
            </h1>

            {/* Subtitle / Description */}
            <p className="text-[11px] sm:text-sm lg:text-base text-[#cfc6bc] leading-relaxed max-w-[260px] sm:max-w-md mb-4 sm:mb-7 font-light line-clamp-3 sm:line-clamp-none">
              {description}
            </p>

            {/* CTA Buttons (matches exact reference design: Gold Pill + Outline Pill) */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-10">
              <Link
                href={primaryCtaHref}
                className="inline-flex items-center gap-2 sm:gap-2.5 px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full bg-gradient-to-r from-[#dec29b] via-[#ebd7be] to-[#cba37b] text-[#140e0a] font-semibold text-[11px] sm:text-sm tracking-wide shadow-[0_8px_25px_-4px_rgba(222,194,155,0.4)] hover:shadow-[0_12px_32px_-4px_rgba(222,194,155,0.6)] hover:brightness-105 active:scale-[0.98] transition-all duration-300 group whitespace-nowrap"
              >
                <span>{primaryCtaText}</span>
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-300 group-hover:translate-x-1 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full border border-[#f9f6f0]/40 hover:border-[#dec29b] text-[#f9f6f0] hover:text-[#dec29b] hover:bg-[#dec29b]/10 text-[11px] sm:text-sm font-light tracking-wide transition-all duration-300 whitespace-nowrap"
              >
                Explore Our Story
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Pagination Indicator: Bottom Right of Hero (matches exact reference) */}
      <div className="absolute bottom-3 sm:bottom-8 right-4 sm:right-10 lg:right-16 z-20 flex items-center gap-3.5 text-[11px] sm:text-xs font-light tracking-widest text-[#a89b8d]">
        {[0, 1, 2].map((idx) => {
          const label = `0${idx + 1}`;
          const isActive = activeSlide === idx;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setActiveSlide(idx)}
              className={`relative pb-1 transition-all ${
                isActive
                  ? 'text-[#f5eee6] font-medium'
                  : 'text-[#807264] hover:text-[#f5eee6]'
              }`}
            >
              <span>{label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#dec29b]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Right Floating Glassmorphic Feature Card — desktop only */}
      <div className="hidden lg:block lg:absolute lg:top-[26%] xl:top-[28%] lg:right-12 xl:right-24 z-20">
        <Link
          href={featuredCollectionHref}
          className="block w-72 md:w-[290px] rounded-[28px] bg-gradient-to-b from-[#e3d3c2]/92 via-[#d7c4b2]/92 to-[#cbb8a5]/95 backdrop-blur-2xl border border-white/60 p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.45)] group hover:shadow-[0_25px_60px_rgba(0,0,0,0.55)] transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-[0.24em] uppercase text-[#4d3e31] font-semibold">
              FEATURED COLLECTION
            </span>
          </div>

          <h2 className="font-serif text-2xl text-[#1c1510] mt-1 font-normal tracking-wide group-hover:text-[#433529] transition-colors leading-snug">
            {featuredCollectionTitle}
          </h2>

          <p className="text-xs text-[#544639] font-normal mt-0.5">
            {featuredCollectionSubtitle}
          </p>

          <div className="mt-3">
            <div className="w-7 h-7 rounded-full border border-[#4d3e31]/40 flex items-center justify-center text-[#2b2119] group-hover:bg-[#1c1510] group-hover:text-[#f8f5f0] group-hover:border-[#1c1510] transition-all">
              <svg className="w-3.5 h-3.5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </div>

          <div className="relative mt-3.5 w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#d9c8b6] shadow-sm">
            <Image
              src="/images/featured-ring.jpg"
              alt="Diamond Elegance ring"
              fill
              sizes="300px"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
        </Link>
      </div>
    </section>
  );
}
