import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '@/components/shared/ScrollReveal';

export interface PolicySection {
  number: string;
  title: string;
  content: string;
  bullets?: string[];
}

interface PolicyLayoutProps {
  title: string;
  subtitle: string;
  heroImage: string;
  breadcrumbLabel: string;
  lastUpdated?: string;
  sections: PolicySection[];
  activeSlug: 'terms' | 'privacy' | 'refund-policy' | 'return-policy';
}

const policyTabs = [
  { name: 'Terms & Conditions', href: '/terms', slug: 'terms' },
  { name: 'Privacy Policy', href: '/privacy', slug: 'privacy' },
  { name: 'Refund Policy', href: '/refund-policy', slug: 'refund-policy' },
  { name: 'Return Policy', href: '/return-policy', slug: 'return-policy' },
];

export default function PolicyLayout({
  title,
  subtitle,
  heroImage,
  breadcrumbLabel,
  lastUpdated = 'September 25, 2026',
  sections,
  activeSlug,
}: PolicyLayoutProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-screen bg-[#faf7f2] text-[#1c1510] flex flex-col selection:bg-[#dec29b]/30">
      
      {/* ── LUXURY HERO HEADER BANNER (Matches user mockup exactly) ── */}
      <section className="relative w-full min-h-[260px] sm:min-h-[320px] md:min-h-[380px] bg-[#140e0b] overflow-hidden flex items-end">
        {/* Background Luxury Jewelry Image */}
        <Image
          src={heroImage}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-85 scale-100 transition-transform duration-1000 hover:scale-105"
        />

        {/* Gradient Overlays for perfect legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#140e0b] via-[#140e0b]/55 to-[#140e0b]/75" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(222,194,155,0.12),transparent_70%)] pointer-events-none" />

        {/* Hero Content Container */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8 md:px-12 pb-8 sm:pb-12 pt-16 sm:pt-20">
          <ScrollReveal direction="up">
            <div className="max-w-2xl">
              {/* Monogram Brand Sub-tag */}
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <span className="text-[9.5px] sm:text-[11px] tracking-[0.32em] uppercase text-[#dec29b] font-medium">
                  BHAI JEWELLER
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#dec29b]/60" />
                <span className="text-[8px] sm:text-[9.5px] tracking-[0.25em] uppercase text-[#c8bdb5] font-light">
                  BRADFORD
                </span>
              </div>

              {/* Page Heading */}
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#f5efe8] font-normal leading-[1.15] tracking-tight">
                {title}
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm md:text-base text-[#c8bdb5] font-light mt-2 sm:mt-3 leading-relaxed max-w-xl">
                {subtitle}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── BREADCRUMB & QUICK POLICY TABS BAR ── */}
      <div className="w-full bg-[#f2ebd9]/70 border-b border-[#e5dcce] sticky top-0 md:top-[80px] z-30 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 md:px-12 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#7d6f63] font-light">
            <Link href="/" className="hover:text-[#1c1510] transition-colors">
              Home
            </Link>
            <span className="text-[#a8998c]">›</span>
            <span className="text-[#1c1510] font-normal">{breadcrumbLabel}</span>
          </nav>

          {/* Quick Policy Switcher Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-0.5">
            {policyTabs.map((tab) => {
              const isActive = tab.slug === activeSlug;
              return (
                <Link
                  key={tab.slug}
                  href={tab.href}
                  className={`text-[11px] px-3 py-1 rounded-full whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#1c1510] text-[#f5efe8] shadow-xs font-medium'
                      : 'bg-white/80 border border-[#ded3c5] text-[#6b5c50] hover:text-[#1c1510] hover:bg-white'
                  }`}
                >
                  {tab.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── MAIN POLICY CONTENT BODY ── */}
      <main className="w-full flex-1 max-w-5xl mx-auto px-5 sm:px-8 md:px-12 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Main Legal Content (Desktop: 8 cols / Mobile: full) */}
          <div className="lg:col-span-8 bg-white/70 border border-[#ede5db] rounded-2xl p-6 sm:p-10 md:p-12 shadow-xs backdrop-blur-xs">
            <div className="space-y-8 sm:space-y-10">
              {sections.map((sec, idx) => (
                <ScrollReveal key={sec.number} delay={idx * 30} direction="up">
                  <div id={`section-${sec.number}`} className="group">
                    {/* Numbered Heading */}
                    <h2 className="font-serif text-lg sm:text-xl md:text-[22px] text-[#1c1510] font-normal mb-2.5 sm:mb-3 flex items-baseline gap-2">
                      <span className="font-mono text-sm sm:text-base text-[#9e7d56] font-medium">
                        {sec.number}.
                      </span>
                      <span>{sec.title}</span>
                    </h2>

                    {/* Body paragraph */}
                    <p className="text-xs sm:text-sm text-[#57493e] font-light leading-relaxed">
                      {sec.content}
                    </p>

                    {/* Optional Bullet Points */}
                    {sec.bullets && sec.bullets.length > 0 && (
                      <ul className="mt-3 space-y-2 pl-4 sm:pl-5 border-l-2 border-[#dec29b]/40">
                        {sec.bullets.map((bullet, bIdx) => (
                          <li
                            key={bIdx}
                            className="text-xs sm:text-[13px] text-[#615246] font-light leading-relaxed flex items-start gap-2"
                          >
                            <span className="text-[#9e7d56] text-sm leading-none mt-0.5">•</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Last Updated Timestamp */}
            <div className="mt-10 pt-6 border-t border-[#ede5db] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#8a796c] font-light">
              <p>
                <span className="text-[#1c1510] font-medium">Last updated:</span> {lastUpdated}
              </p>
              <p className="text-[11px] text-[#9a897b]">
                Bhai Jeweller • Bradford Showroom, UK
              </p>
            </div>
          </div>

          {/* Sidebar / Concierge Help Card (Desktop: 4 cols) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-[160px]">
            {/* Assistance Card */}
            <ScrollReveal delay={100} direction="up">
              <div className="p-6 rounded-2xl bg-[#140e0b] text-[#f5efe8] border border-[#2d221a] shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-28 h-28 bg-[radial-gradient(ellipse_at_top_right,rgba(222,194,155,0.15),transparent_70%)] pointer-events-none" />
                
                <div className="w-9 h-9 rounded-full border border-[#dec29b]/60 flex items-center justify-center bg-[#1e1713] mb-3.5 shadow-sm">
                  <svg className="w-4 h-4 text-[#dec29b]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                  </svg>
                </div>

                <h3 className="font-serif text-lg text-[#f5efe8] font-normal mb-1">
                  Need Help or Advice?
                </h3>
                <p className="text-xs text-[#c8bdb5] font-light leading-relaxed mb-4">
                  Our jewellery specialists are here to assist with any policy, custom order, or sizing question.
                </p>

                <div className="space-y-2.5 text-xs text-[#e8ded4] font-light">
                  <a
                    href="mailto:support@bhaijeweller.com"
                    className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#1e1713] border border-[#2e231c] hover:border-[#dec29b]/60 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 text-[#dec29b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    <span>support@bhaijeweller.com</span>
                  </a>

                  <a
                    href="tel:+441274722606"
                    className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#1e1713] border border-[#2e231c] hover:border-[#dec29b]/60 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 text-[#dec29b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    <span>+44 1274 722606</span>
                  </a>
                </div>

                <div className="mt-4 pt-4 border-t border-[#231a14] flex items-center justify-between">
                  <span className="text-[11px] text-[#9a897b]">Bradford Showroom</span>
                  <Link
                    href="/contact"
                    className="text-xs text-[#dec29b] font-medium hover:underline inline-flex items-center gap-1"
                  >
                    Visit Us →
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Quick All Policies Card */}
            <ScrollReveal delay={150} direction="up">
              <div className="p-5 rounded-2xl bg-white/70 border border-[#ede5db] shadow-xs">
                <h4 className="text-[10.5px] tracking-[0.25em] uppercase text-[#9e7d56] font-medium mb-3">
                  Legal & Customer Policies
                </h4>
                <ul className="space-y-2">
                  {policyTabs.map((tab) => (
                    <li key={tab.slug}>
                      <Link
                        href={tab.href}
                        className={`text-xs flex items-center justify-between py-1.5 px-2.5 rounded-lg transition-colors ${
                          tab.slug === activeSlug
                            ? 'bg-[#1c1510] text-[#f5efe8] font-medium'
                            : 'text-[#6b5c50] hover:bg-[#ede4d8]/60 hover:text-[#1c1510]'
                        }`}
                      >
                        <span>{tab.name}</span>
                        <span className="text-[11px]">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </aside>

        </div>
      </main>

      {/* ── FLOATING SCROLL TO TOP BUTTON (Matching image) ── */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="fixed bottom-20 md:bottom-8 right-5 sm:right-8 z-40 w-10 h-10 rounded-full bg-[#1c1510]/90 hover:bg-[#1c1510] text-[#dec29b] border border-[#dec29b]/40 shadow-xl backdrop-blur-sm flex items-center justify-center active:scale-95 transition-all group"
      >
        <svg className="w-4 h-4 stroke-[2.5] group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
        </svg>
      </button>

    </div>
  );
}
