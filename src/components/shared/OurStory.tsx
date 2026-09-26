import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ScrollReveal } from './ScrollReveal';

function BotanicalDecoration() {
  return (
    <svg viewBox="0 0 120 180" fill="none" className="w-16 h-24 sm:w-20 sm:h-28 lg:w-28 lg:h-40 text-[#c9b49a] opacity-50 select-none pointer-events-none" aria-hidden="true">
      <path d="M60 170 C60 170 58 120 60 80 C62 40 60 20 60 10" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      <path d="M60 90 C40 80 18 70 15 50 C12 30 35 35 55 75" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none"/>
      <path d="M60 100 C80 85 102 72 106 52 C110 32 87 38 62 80" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none"/>
      <path d="M60 60 C45 50 30 42 28 30" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"/>
      <path d="M60 70 C75 58 88 50 92 36" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"/>
      <path d="M38 38 C34 28 28 30 28 30 C32 34 38 38 38 38Z" stroke="currentColor" strokeWidth="0.7"/>
      <path d="M84 44 C90 34 92 36 92 36 C88 40 84 44 84 44Z" stroke="currentColor" strokeWidth="0.7"/>
      <path d="M60 10 C56 4 60 0 60 0 C64 0 65 5 60 10Z" stroke="currentColor" strokeWidth="0.8"/>
      <path d="M60 130 C44 122 38 108 42 98 C50 105 58 120 60 130Z" stroke="currentColor" strokeWidth="0.8" fill="none"/>
      <path d="M60 145 C76 136 82 121 78 111 C70 118 62 134 60 145Z" stroke="currentColor" strokeWidth="0.8" fill="none"/>
    </svg>
  );
}

export function OurStory() {
  return (
    <section className="w-full bg-[#f6efe7] overflow-hidden py-0 px-0">
      <div className="max-w-full w-full mx-auto px-0">
        <div className="flex flex-row items-stretch rounded-none overflow-hidden bg-[#f6efe7]">

          {/* Left: Editorial Photo (matches reference split) */}
          <div className="relative w-[38%] sm:w-[40%] flex-shrink-0 min-h-[220px] sm:min-h-[320px]">
            <ScrollReveal direction="right" duration={850} className="w-full h-full relative min-h-[220px] sm:min-h-[320px]">
              <Image
                src="/images/hero-model.jpg"
                alt="A woman adorned with Bhai Jeweller pieces"
                fill
                sizes="(max-width: 640px) 40vw, (max-width: 1024px) 35vw, 420px"
                className="object-cover object-[65%_25%]"
                priority={false}
              />
            </ScrollReveal>
          </div>

          {/* Centre/Right: Text and Details */}
          <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-12 py-5 sm:py-8 bg-[#f6efe7] relative">
            <ScrollReveal direction="left" delay={150} duration={850}>
              <p className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#a09080] font-medium mb-1.5 sm:mb-2">
                OUR STORY
              </p>
              <h2 className="font-serif text-[18px] sm:text-[28px] lg:text-[34px] text-[#1c1510] font-normal leading-[1.15] tracking-tight mb-2 sm:mb-3">
                Elegance is a feeling
              </h2>
              <p className="text-[11px] sm:text-xs lg:text-[13px] text-[#6b5e54] font-light leading-relaxed mb-4 sm:mb-6 max-w-md line-clamp-4 sm:line-clamp-none">
                At <span className="font-medium text-[#4a3a2a] tracking-wide">BHAI JEWELLER</span>, we believe jewellery is more than an accessory — it&apos;s a reflection of who you are. Our mission is to create timeless pieces that carry your story, your style and your dreams.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 sm:gap-2 self-start px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-[#c0a882] text-[#3d2e20] text-[11px] sm:text-xs tracking-wide font-light hover:border-[#9e7d56] hover:bg-[#ecdccc]/40 transition-all group"
              >
                Learn More
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2] group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </ScrollReveal>

            {/* Botanical Watermark on the Right */}
            <div className="hidden sm:flex absolute right-4 bottom-4 flex-col items-center pointer-events-none opacity-40">
              <BotanicalDecoration />
              <p className="font-serif italic text-[#9e8268] text-[12px]">Timeless By Design</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
