'use client';

import React, { useState, useEffect } from 'react';
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
  heroImage?: string;
  featuredCollectionTitle?: string;
  featuredCollectionSubtitle?: string;
  featuredCollectionHref?: string;
  featuredImage?: string;
}

const HERO_SLIDES = [
  {
    tag: 'BRITISH CRAFTSMANSHIP',
    titleLine1: 'Jewellery, made',
    titleLine2: 'unforgettable',
    titleLine3: 'Royal Heritage',
    desc: 'Timeless pieces for modern souls. Discover fine jewellery designed to celebrate your most precious moments.',
    image: '/images/hero-img.jpg',
    featuredTitle: 'Solara Diamond Ring',
    featuredSubtitle: 'Handcrafted in 21ct Gold with certified diamond.',
    featuredImage: '/images/featured-ring.jpg',
  },
  {
    tag: 'NEW 2026 BRIDAL COLLECTION',
    titleLine1: 'Pure Brilliance,',
    titleLine2: 'crafted forever',
    titleLine3: 'Handmade in UK',
    desc: 'Bespoke bridal sets, custom engagement rings, and timeless heirlooms hallmarked with highest British standards.',
    image: '/images/shop-banner.jpg',
    featuredTitle: 'Royal Drop Necklace',
    featuredSubtitle: 'Artisan handcrafted solid gold choker necklace.',
    featuredImage: '/images/shop-prod-3.jpg',
  },
  {
    tag: 'BESPOKE MASTERPIECES',
    titleLine1: 'Designed by You,',
    titleLine2: 'perfected by us',
    titleLine3: 'Private Viewings',
    desc: 'Visit our flagship showroom in Bradford, West Yorkshire for exclusive bespoke private design consultations.',
    image: '/images/category-bracelets.jpg',
    featuredTitle: 'Chandelier Earrings',
    featuredSubtitle: 'Sparkling diamond drops set in 21ct yellow gold.',
    featuredImage: '/images/shop-prod-4.jpg',
  },
];

export function HeroSection(props: HeroSectionProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  const [heroData, setHeroData] = useState({
    brandPretitle: props.brandPretitle || 'BHAI JEWELLER — BRADFORD',
    headlineLine1: props.headlineLine1 || 'Jewellery, made',
    headlineLine2: props.headlineLine2 || 'unforgettable',
    headlineLine3: props.headlineLine3 || '',
    description: props.description || 'Timeless pieces for modern souls. Discover fine jewellery designed to celebrate your most precious moments.',
    primaryCtaText: props.primaryCtaText || 'Shop Collection',
    primaryCtaHref: props.primaryCtaHref || '/shop',
    heroImage: props.heroImage || '/images/hero-img.jpg',
    featuredTitle: props.featuredCollectionTitle || 'Diamond Elegance',
    featuredSubtitle: props.featuredCollectionSubtitle || 'Classic pieces, endless beauty.',
    featuredHref: props.featuredCollectionHref || '/shop',
    featuredImage: props.featuredImage || '/images/featured-ring.jpg',
  });

  // Fetch live hero settings from API
  useEffect(() => {
    fetch('/api/hero')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data) {
          setHeroData((prev) => ({
            ...prev,
            brandPretitle: resData.data.brandPretitle || prev.brandPretitle,
            headlineLine1: resData.data.headlineLine1 || prev.headlineLine1,
            headlineLine2: resData.data.headlineLine2 || prev.headlineLine2,
            headlineLine3: resData.data.headlineLine3 ?? prev.headlineLine3,
            description: resData.data.description || prev.description,
            primaryCtaText: resData.data.primaryCtaText || prev.primaryCtaText,
            primaryCtaHref: resData.data.primaryCtaHref || prev.primaryCtaHref,
            heroImage: resData.data.heroImage || prev.heroImage,
            featuredTitle: resData.data.featuredTitle || prev.featuredTitle,
            featuredSubtitle: resData.data.featuredSubtitle || prev.featuredSubtitle,
            featuredImage: resData.data.featuredImage || prev.featuredImage,
          }));
        }
      })
      .catch((err) => console.error('Failed to fetch hero section config:', err));
  }, []);

  // Auto-slide transition every 6.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[activeSlide] || HERO_SLIDES[0];
  const bgImg = activeSlide === 0 ? (heroData.heroImage || slide.image) : slide.image;
  const featImg = activeSlide === 0 ? (heroData.featuredImage || slide.featuredImage) : slide.featuredImage;

  return (
    <section className="relative w-full min-h-[460px] sm:min-h-[580px] lg:min-h-[640px] xl:min-h-screen bg-[#100b08] overflow-hidden flex items-center pt-20 sm:pt-28 lg:pt-24 transition-all">

      {/* ── Dynamic Background Image with Smooth Crossfade ── */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        <Image
          key={bgImg}
          src={bgImg}
          alt="Fine luxury jewellery campaign"
          fill
          priority
          unoptimized={true}
          sizes="100vw"
          className="object-cover object-[80%_center] sm:object-center transition-all duration-1000 scale-100 animate-fadeIn"
        />

        {/* Ambient Dark Chocolate & Golden Vignette Lighting Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#100b08]/95 via-[#100b08]/70 to-transparent w-full sm:w-[65%] lg:w-[50%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#100b08] via-transparent to-[#100b08]/40" />
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#dec29b]/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      </div>

      {/* ── Main Hero Container ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 w-full py-8 sm:py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column: Brand, Tag, Dynamic Headline, Description, CTAs */}
          <div className="lg:col-span-7 xl:col-span-8 max-w-xl">

            {/* Top Pill: British Hallmark & Live Ticker */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1e1611]/80 backdrop-blur-md border border-[#3d2e24] shadow-sm mb-3 sm:mb-4 animate-fadeIn">
              <span className="w-2 h-2 rounded-full bg-[#dec29b] animate-ping" />
              <span className="text-[9px] sm:text-[10.5px] font-semibold tracking-[0.24em] text-[#dec29b] uppercase">
                {activeSlide === 0 ? heroData.brandPretitle : slide.tag}
              </span>
            </div>

            {/* Main Headline with Serif Elegance & Shimmer */}
            <h1
              key={activeSlide}
              className="font-serif text-[32px] sm:text-5xl lg:text-[64px] xl:text-[72px] leading-[1.08] text-[#fbf8f5] tracking-tight font-normal mb-3 sm:mb-5 animate-slideUpFade"
            >
              {activeSlide === 0 ? heroData.headlineLine1 : slide.titleLine1}
              <br />
              <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-[#dec29b] via-[#f5efe8] to-[#c59d6e]">
                {activeSlide === 0 ? heroData.headlineLine2 : slide.titleLine2}
              </span>
              {(activeSlide === 0 ? heroData.headlineLine3 : slide.titleLine3) && (
                <>
                  <br />
                  <span className="text-[26px] sm:text-4xl lg:text-5xl text-[#d4c6b8] font-light">
                    {activeSlide === 0 ? heroData.headlineLine3 : slide.titleLine3}
                  </span>
                </>
              )}
            </h1>

            {/* Subtitle / Description */}
            <p
              key={`desc-${activeSlide}`}
              className="text-[12px] sm:text-sm lg:text-[15px] text-[#cfc5ba] leading-relaxed max-w-[280px] sm:max-w-lg mb-5 sm:mb-8 font-light line-clamp-3 sm:line-clamp-none animate-fadeIn"
            >
              {activeSlide === 0 ? heroData.description : slide.desc}
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-10">
              <Link
                href={heroData.primaryCtaHref || '/shop'}
                className="inline-flex items-center gap-2 sm:gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-[#dec29b] via-[#ebd7be] to-[#cba37b] text-[#140e0a] font-semibold text-[11px] sm:text-sm tracking-wide shadow-[0_8px_30px_rgba(222,194,155,0.4)] hover:shadow-[0_12px_36px_rgba(222,194,155,0.6)] hover:brightness-105 active:scale-[0.98] transition-all duration-300 group whitespace-nowrap"
              >
                <span>{heroData.primaryCtaText || 'Explore Collection'}</span>
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 rounded-full border border-[#f9f6f0]/40 hover:border-[#dec29b] text-[#f9f6f0] hover:text-[#dec29b] hover:bg-[#dec29b]/10 text-[11px] sm:text-sm font-light tracking-wide transition-all duration-300 whitespace-nowrap backdrop-blur-xs"
              >
                Our Heritage & Craft
              </Link>
            </div>

            {/* Trust Assurance Bar Pill */}
            <div className="hidden sm:flex items-center gap-6 pt-2 border-t border-[#2d221a] text-xs text-[#a39485] font-light">
              <div className="flex items-center gap-2">
                <span className="text-[#dec29b]">✓</span>
                <span>British Hallmarked Gold</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#dec29b]">✓</span>
                <span>Certified Natural Diamonds</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#dec29b]">✓</span>
                <span>Free Insured UK Delivery</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Slide Carousel Pagination Indicator & Controls ── */}
      <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-10 lg:right-16 z-20 flex items-center gap-4 text-xs font-light text-[#a89b8d] select-none">
        {HERO_SLIDES.map((_, idx) => {
          const isActive = activeSlide === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`flex items-center gap-1.5 transition-all ${
                isActive ? 'text-[#f5eee6] font-semibold scale-105' : 'text-[#706050] hover:text-[#f5eee6]'
              }`}
            >
              <span className="font-mono text-[11px]">0{idx + 1}</span>
              <span className={`h-[2px] rounded-full transition-all duration-500 ${isActive ? 'w-6 sm:w-8 bg-[#dec29b]' : 'w-2 bg-[#423328]'}`} />
            </button>
          );
        })}
      </div>

      {/* ── Right Floating Glassmorphic Featured Showcase Card (Desktop Only) ── */}
      <div className="hidden lg:block lg:absolute lg:top-[22%] xl:top-[25%] lg:right-10 xl:right-20 z-20 animate-fadeIn">
        <Link
          href={activeSlide === 0 ? heroData.featuredHref : '/shop'}
          className="block w-72 md:w-[300px] rounded-[24px] bg-gradient-to-b from-[#1e1612]/92 via-[#18110d]/95 to-[#120d09]/98 backdrop-blur-2xl border border-[#3e3025] hover:border-[#dec29b]/70 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.6)] group transition-all duration-500 hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] tracking-[0.24em] uppercase text-[#dec29b] font-semibold">
              FEATURED PIECE
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#dec29b]/15 text-[#dec29b] text-[9px] font-bold border border-[#dec29b]/30">
              21CT GOLD
            </span>
          </div>

          <h2 className="font-serif text-xl text-[#f9f6f0] mt-2 font-normal tracking-wide group-hover:text-[#dec29b] transition-colors leading-snug truncate">
            {activeSlide === 0 ? heroData.featuredTitle : slide.featuredTitle}
          </h2>

          <p className="text-[11px] text-[#a8998a] font-light mt-1 line-clamp-2">
            {activeSlide === 0 ? heroData.featuredSubtitle : slide.featuredSubtitle}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-[#dec29b] font-medium group-hover:underline flex items-center gap-1">
              <span>View Product</span>
              <span className="text-sm">→</span>
            </span>
            <div className="w-7 h-7 rounded-full border border-[#dec29b]/40 flex items-center justify-center text-[#dec29b] group-hover:bg-[#dec29b] group-hover:text-[#1c1510] transition-all shadow-xs">
              <svg className="w-3.5 h-3.5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </div>

          <div className="relative mt-3.5 w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#241a14] shadow-inner border border-[#35251b]">
            <Image
              src={featImg}
              alt="Featured luxury jewellery piece"
              fill
              unoptimized={true}
              sizes="300px"
              className="object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
            />
          </div>
        </Link>
      </div>

    </section>
  );
}
