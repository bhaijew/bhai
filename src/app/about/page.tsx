'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="w-full bg-[#faf7f2] min-h-screen text-[#1c1510] pb-4 md:pb-6">

      {/* ── Top Hero Banner (matches screen 4 mockup) ── */}
      <section className="relative w-full h-[180px] sm:h-[220px] md:h-[260px] bg-[#120e0b] overflow-hidden flex items-center justify-center text-center">
        <Image
          src="/images/category-rings.jpg"
          alt="About Us"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-90 hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120e0b]/85 via-[#120e0b]/40 to-[#120e0b]/55" />

        <div className="relative z-10 px-4 max-w-xl">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#f5efe8] font-normal leading-tight drop-shadow-md">
            About Us
          </h1>
          <p className="text-xs sm:text-sm text-[#e8ded4] font-light mt-2 drop-shadow-xs">
            More than jewellery, it&apos;s our passion.
          </p>
        </div>
      </section>

      {/* ── Main Content Container ── */}
      <div className="max-w-4xl mx-auto px-2.5 sm:px-5 pt-4 pb-2 sm:pt-6 sm:pb-4">

        {/* Breadcrumb */}
        <nav className="text-xs text-[#8c7e73] font-light mb-5 flex items-center gap-1.5">
          <Link href="/" className="hover:text-[#1c1510] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#1c1510] font-normal">About</span>
        </nav>

        {/* ── Section: Timeless Craftsmanship (matches screen 4) ── */}
        <section className="mb-8">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#a09080] font-medium mb-1">
            OUR STORY
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1510] font-normal leading-tight mb-3">
            Timeless Craftsmanship,<br className="hidden sm:block" /> Modern Elegance
          </h2>
          <p className="text-xs sm:text-sm text-[#6b5c50] font-light leading-relaxed mb-4">
            At AURELIA JEWELS / BHAI JEWELLER, we believe jewellery is more than an accessory — it&apos;s a reflection of your story. Founded with a passion for timeless beauty, we create exquisite pieces that blend traditional craftsmanship with modern design.
          </p>

          {/* Goldsmith / Artisan Photo */}
          <div className="relative w-full aspect-[16/8] rounded-[5px] overflow-hidden bg-[#e8ded4] shadow-xs">
            <Image
              src="/images/detailed_col_1.jpg"
              alt="Artisan crafting jewellery"
              fill
              sizes="(max-width: 1024px) 100vw, 800px"
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </section>

        {/* ── Stats Counter Row (matches screen 4: 10+ / 50K+ / 100%) ── */}
        <section className="grid grid-cols-3 divide-x divide-[#e8ded4] border-y border-[#e8ded4] py-4 mb-8 text-center">
          <div className="px-2">
            <p className="font-serif text-2xl sm:text-3xl font-medium text-[#1c1510]">10+</p>
            <p className="text-[10px] sm:text-xs text-[#8a796c] font-light mt-1">Years of Experience</p>
          </div>
          <div className="px-2">
            <p className="font-serif text-2xl sm:text-3xl font-medium text-[#1c1510]">50K+</p>
            <p className="text-[10px] sm:text-xs text-[#8a796c] font-light mt-1">Happy Customers</p>
          </div>
          <div className="px-2">
            <p className="font-serif text-2xl sm:text-3xl font-medium text-[#1c1510]">100%</p>
            <p className="text-[10px] sm:text-xs text-[#8a796c] font-light mt-1">Authentic Products</p>
          </div>
        </section>

        {/* ── Our Values (matches screen 4 list with icons) ── */}
        <section className="mb-8">
          <h3 className="font-serif text-xl sm:text-2xl text-[#1c1510] font-normal mb-4">
            Our Values
          </h3>

          <div className="space-y-3">
            {/* Value 1 */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-[5px] bg-white border border-[#ede5db] shadow-xs">
              <div className="w-8 h-8 rounded-full bg-[#1c1510] text-[#dec29b] flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12l4 6-10 12L2 9l4-6z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 9h20M7 3l5 18 5-18" />
                </svg>
              </div>
              <div>
                <h4 className="font-serif text-sm font-medium text-[#1c1510]">Exceptional Quality</h4>
                <p className="text-xs text-[#6b5c50] font-light mt-0.5 leading-relaxed">
                  We use only the finest materials and every piece is crafted with care.
                </p>
              </div>
            </div>

            {/* Value 2 */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-[5px] bg-white border border-[#ede5db] shadow-xs">
              <div className="w-8 h-8 rounded-full bg-[#1c1510] text-[#dec29b] flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <div>
                <h4 className="font-serif text-sm font-medium text-[#1c1510]">Timeless Designs</h4>
                <p className="text-xs text-[#6b5c50] font-light mt-0.5 leading-relaxed">
                  Classic styles that never go out of fashion.
                </p>
              </div>
            </div>

            {/* Value 3 */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-[5px] bg-white border border-[#ede5db] shadow-xs">
              <div className="w-8 h-8 rounded-full bg-[#1c1510] text-[#dec29b] flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-serif text-sm font-medium text-[#1c1510]">Customer First</h4>
                <p className="text-xs text-[#6b5c50] font-light mt-0.5 leading-relaxed">
                  Your trust and satisfaction mean everything to us.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Banner: Crafted with Love (matches screen 4 card) ── */}
        <section className="relative rounded-[5px] overflow-hidden bg-[#120e0b] text-[#f5efe8] p-5 sm:p-7 mb-8 shadow-sm">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-img.jpg"
              alt="Crafted with Love"
              fill
              sizes="(max-width: 1024px) 100vw, 800px"
              className="object-cover opacity-55"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#120e0b]/90 via-[#120e0b]/75 to-transparent" />
          </div>

          <div className="relative z-10 max-w-sm">
            <h3 className="font-serif text-2xl text-[#f5efe8] font-normal leading-snug">
              Crafted with Love
            </h3>
            <p className="text-xs text-[#c8bdb5] font-light mt-1.5 mb-4 leading-relaxed">
              Every piece tells a story — including yours.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#dec29b] text-[#f5efe8] text-xs font-light hover:bg-[#dec29b]/15 transition-all"
            >
              Explore Our Collection →
            </Link>
          </div>
        </section>

        {/* ── Team Section: A Team That Cares (matches screen 4) ── */}
        <section className="mb-2">
          <h3 className="font-serif text-xl sm:text-2xl text-[#1c1510] font-normal mb-1.5">
            A Team That Cares
          </h3>
          <p className="text-xs text-[#6b5c50] font-light leading-relaxed mb-3">
            Our dedicated team of designers, artisans and jewellery experts work together to bring your dream pieces to life.
          </p>

          <div className="relative w-full aspect-[16/8] rounded-[5px] overflow-hidden bg-[#e8ded4] shadow-xs mb-3">
            <Image
              src="/images/detailed_col_3.jpg"
              alt="Jewellery workshop artisans"
              fill
              sizes="(max-width: 1024px) 100vw, 800px"
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#1c1510] text-[#1c1510] text-xs font-light hover:bg-[#1c1510] hover:text-white transition-colors"
          >
            Learn More →
          </Link>
        </section>

      </div>
    </main>
  );
}
