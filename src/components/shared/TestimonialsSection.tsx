'use client';

import React, { useState } from 'react';
import { ScrollReveal } from './ScrollReveal';

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  rating: number;
  initials: string;
  avatarBg: string;
}

const testimonials: Testimonial[] = [
  { id: 't1', quote: '"Absolutely stunning quality and beautifully packaged. I couldn\'t be happier with my purchase!"', name: 'Ayesha Khan', rating: 5, initials: 'AK', avatarBg: 'from-[#c9a87c] to-[#a07850]' },
  { id: 't2', quote: '"The ring is even more beautiful in person. Exceptional service and fast delivery."', name: 'Sarah Malik', rating: 5, initials: 'SM', avatarBg: 'from-[#a07870] to-[#7a5048]' },
  { id: 't3', quote: '"A truly luxurious experience from start to finish. Will definitely shop here again!"', name: 'Zainah Rehman', rating: 5, initials: 'ZR', avatarBg: 'from-[#8a9878] to-[#627058]' },
  { id: 't4', quote: '"I ordered a necklace as a gift and was blown away by the presentation. Gorgeous piece!"', name: 'Fatima Siddiqui', rating: 5, initials: 'FS', avatarBg: 'from-[#9878a0] to-[#705878]' },
  { id: 't5', quote: '"Outstanding customer service and my earrings arrived earlier than expected. Exceptional!"', name: 'Nadia Hussain', rating: 5, initials: 'NH', avatarBg: 'from-[#c9b47c] to-[#9e8850]' },
  { id: 't6', quote: '"The bracelet is even more elegant in person. Perfect gift. Brilliant packaging too!"', name: 'Hira Baig', rating: 5, initials: 'HB', avatarBg: 'from-[#7898a8] to-[#506880]' },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-[3px] mt-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-[11px] h-[11px] ${i < count ? 'text-[#d8bb93]' : 'text-[#3a3028]'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="bg-[#1c1712] border border-[#2c231d] p-4 sm:p-5 flex flex-col h-full" style={{ borderRadius: '5px' }}>
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br ${t.avatarBg} flex-shrink-0 flex items-center justify-center shadow-md`}>
          <span className="text-white text-[10px] sm:text-[11px] font-semibold select-none">{t.initials}</span>
        </div>
        <p className="text-[12px] sm:text-[12.5px] text-[#c8bdb5] font-light leading-relaxed flex-1 pt-0.5">{t.quote}</p>
      </div>
      <div className="mt-4 pt-3 border-t border-[#2c231d]">
        <p className="font-serif text-[13px] sm:text-[14px] text-[#e8e0d6] leading-tight">{t.name}</p>
        <Stars count={t.rating}/>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const [pageMobile, setPageMobile] = useState(0);
  const [pageTablet, setPageTablet] = useState(0);
  const [pageDesktop, setPageDesktop] = useState(0);

  const totalMobile = testimonials.length;          // 6 pages (1 each)
  const totalTablet = Math.ceil(testimonials.length / 2); // 3 pages
  const totalDesktop = Math.ceil(testimonials.length / 3); // 2 pages

  const visibleMobile = [testimonials[pageMobile]];
  const visibleTablet = testimonials.slice(pageTablet * 2, pageTablet * 2 + 2);
  const visibleDesktop = testimonials.slice(pageDesktop * 3, pageDesktop * 3 + 3);

  return (
    <section className="w-full bg-[#120e0b] py-10 sm:py-14 lg:py-20 border-t border-[#1c1611] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">

        {/* Header */}
        <ScrollReveal direction="up">
          <div className="text-center mb-7 sm:mb-10">
            <p className="text-[10px] tracking-[0.32em] uppercase text-[#9e8875] font-medium mb-2">KIND WORDS</p>
            <h2 className="font-serif text-[26px] sm:text-[34px] lg:text-[40px] text-[#f0ece6] font-normal tracking-tight">
              What Our Customers Say
            </h2>
            <div className="w-8 h-[1.5px] bg-[#d8bb93]/40 mx-auto mt-3"/>
          </div>
        </ScrollReveal>

        {/* ── Mobile: 1 card ── */}
        <div className="sm:hidden">
          <ScrollReveal direction="up" delay={150}>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setPageMobile(p => Math.max(0, p-1))} disabled={pageMobile === 0}
                aria-label="Previous"
                className={`flex-shrink-0 text-xl px-1 transition-colors ${pageMobile === 0 ? 'text-[#2e2420]' : 'text-[#8a7a6c] hover:text-[#d8bb93]'}`}>‹</button>
              <div className="flex-1">
                <TestimonialCard t={visibleMobile[0]}/>
              </div>
              <button type="button" onClick={() => setPageMobile(p => Math.min(totalMobile-1, p+1))} disabled={pageMobile === totalMobile-1}
                aria-label="Next"
                className={`flex-shrink-0 text-xl px-1 transition-colors ${pageMobile === totalMobile-1 ? 'text-[#2e2420]' : 'text-[#8a7a6c] hover:text-[#d8bb93]'}`}>›</button>
            </div>
            <div className="flex justify-center gap-1.5 mt-5">
              {Array.from({ length: totalMobile }).map((_, i) => (
                <button key={i} type="button" onClick={() => setPageMobile(i)} aria-label={`Page ${i+1}`}
                  className={`rounded-full transition-all duration-300 ${i === pageMobile ? 'w-4 h-1.5 bg-[#d8bb93]' : 'w-1.5 h-1.5 bg-[#3d3028]'}`}/>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* ── Tablet: 2 cards ── */}
        <div className="hidden sm:block lg:hidden">
          <ScrollReveal direction="up" delay={150}>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setPageTablet(p => Math.max(0, p-1))} disabled={pageTablet === 0}
                aria-label="Previous"
                className={`flex-shrink-0 text-xl px-1 transition-colors ${pageTablet === 0 ? 'text-[#2e2420]' : 'text-[#8a7a6c] hover:text-[#d8bb93]'}`}>‹</button>
              <div className="flex-1 grid grid-cols-2 gap-4">
                {visibleTablet.map(t => <TestimonialCard key={t.id} t={t}/>)}
              </div>
              <button type="button" onClick={() => setPageTablet(p => Math.min(totalTablet-1, p+1))} disabled={pageTablet === totalTablet-1}
                aria-label="Next"
                className={`flex-shrink-0 text-xl px-1 transition-colors ${pageTablet === totalTablet-1 ? 'text-[#2e2420]' : 'text-[#8a7a6c] hover:text-[#d8bb93]'}`}>›</button>
            </div>
            <div className="flex justify-center gap-1.5 mt-6">
              {Array.from({ length: totalTablet }).map((_, i) => (
                <button key={i} type="button" onClick={() => setPageTablet(i)} aria-label={`Page ${i+1}`}
                  className={`rounded-full transition-all duration-300 ${i === pageTablet ? 'w-4 h-1.5 bg-[#d8bb93]' : 'w-1.5 h-1.5 bg-[#3d3028]'}`}/>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* ── Desktop: 3 cards ── */}
        <div className="hidden lg:block">
          <ScrollReveal direction="up" delay={150}>
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => setPageDesktop(p => Math.max(0, p-1))} disabled={pageDesktop === 0}
                aria-label="Previous"
                className={`flex-shrink-0 text-xl px-1 transition-colors ${pageDesktop === 0 ? 'text-[#2e2420]' : 'text-[#8a7a6c] hover:text-[#d8bb93]'}`}>‹</button>
              <div className="flex-1 grid grid-cols-3 gap-4 lg:gap-5">
                {visibleDesktop.map(t => <TestimonialCard key={t.id} t={t}/>)}
              </div>
              <button type="button" onClick={() => setPageDesktop(p => Math.min(totalDesktop-1, p+1))} disabled={pageDesktop === totalDesktop-1}
                aria-label="Next"
                className={`flex-shrink-0 text-xl px-1 transition-colors ${pageDesktop === totalDesktop-1 ? 'text-[#2e2420]' : 'text-[#8a7a6c] hover:text-[#d8bb93]'}`}>›</button>
            </div>
            <div className="flex justify-center gap-2 mt-7">
              {Array.from({ length: totalDesktop }).map((_, i) => (
                <button key={i} type="button" onClick={() => setPageDesktop(i)} aria-label={`Page ${i+1}`}
                  className={`rounded-full transition-all duration-300 ${i === pageDesktop ? 'w-5 h-1.5 bg-[#d8bb93]' : 'w-1.5 h-1.5 bg-[#3d3028]'}`}/>
              ))}
            </div>
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
}
