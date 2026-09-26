'use client';

import React, { useState } from 'react';
import Link from 'next/link';

/* ── Payment Icon SVGs ── */
function PaymentIcons() {
  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
      {/* Visa */}
      <div className="h-5 sm:h-6 px-1.5 sm:px-2 bg-white rounded flex items-center justify-center shadow-xs">
        <svg viewBox="0 0 48 16" className="h-3 sm:h-3.5 w-auto" aria-label="Visa">
          <text x="0" y="13" fontFamily="Arial" fontWeight="bold" fontSize="14" fill="#1A1F71">VISA</text>
        </svg>
      </div>
      {/* Mastercard */}
      <div className="h-5 sm:h-6 px-1.5 sm:px-2 bg-white rounded flex items-center justify-center gap-0.5 shadow-xs">
        <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#EB001B]" />
        <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#F79E1B] -ml-1.5 opacity-90" />
      </div>
      {/* Amex */}
      <div className="h-5 sm:h-6 px-1.5 bg-[#2E77BC] rounded flex items-center justify-center shadow-xs">
        <span className="text-white text-[7.5px] sm:text-[8.5px] font-bold tracking-wider">AMEX</span>
      </div>
      {/* PayPal */}
      <div className="h-5 sm:h-6 px-1.5 sm:px-2 bg-white rounded flex items-center justify-center shadow-xs">
        <span className="text-[#003087] text-[8px] sm:text-[9px] font-extrabold tracking-tight">Pay<span className="text-[#009cde]">Pal</span></span>
      </div>
      {/* Apple Pay */}
      <div className="h-5 sm:h-6 px-2 bg-black border border-white/20 rounded flex items-center justify-center shadow-xs">
        <span className="text-white text-[8px] sm:text-[8.5px] font-medium tracking-tight">Pay</span>
      </div>
      {/* Google Pay */}
      <div className="h-5 sm:h-6 px-1.5 bg-white rounded flex items-center justify-center shadow-xs">
        <span className="text-[8.5px] sm:text-[9.5px] font-medium">
          <span className="text-[#4285F4]">G</span><span className="text-[#EA4335]">o</span><span className="text-[#FBBC04]">o</span><span className="text-[#4285F4]">g</span><span className="text-[#34A853]">l</span><span className="text-[#EA4335]">e</span>
          <span className="text-[#5F6368] ml-0.5">Pay</span>
        </span>
      </div>
    </div>
  );
}

/* ── Social Icons ── */
function SocialLinks() {
  const socials = [
    {
      name: 'Instagram',
      href: '#',
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      href: '#',
      icon: (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
        </svg>
      ),
    },
    {
      name: 'Pinterest',
      href: '#',
      icon: (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      href: '#',
      icon: (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex items-center gap-2 mt-2 sm:mt-3">
      {socials.map((s) => (
        <Link
          key={s.name}
          href={s.href}
          aria-label={s.name}
          className="w-7 h-7 rounded-full border border-[#2e231c] flex items-center justify-center text-[#8d7e72] hover:border-[#dec29b]/60 hover:text-[#dec29b] transition-all duration-200"
        >
          {s.icon}
        </Link>
      ))}
    </div>
  );
}

/* ── Desktop Newsletter Form ── */
function DesktopNewsletterForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      {submitted ? (
        <p className="text-xs text-[#dec29b] font-light py-2">
          ✓ Subscribed to Bhai Jeweller!
        </p>
      ) : (
        <div className="flex items-stretch rounded-full border border-[#2e231c] bg-[#16110e] overflow-hidden focus-within:border-[#dec29b]/50 transition-colors">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            className="flex-1 bg-transparent px-3.5 py-2 text-xs text-[#c8bdb5] placeholder-[#66584c] outline-none font-light min-w-0"
          />
          <button
            type="submit"
            aria-label="Subscribe"
            className="flex-shrink-0 w-8 h-8 my-0.5 mr-0.5 rounded-full bg-gradient-to-r from-[#dec29b] to-[#cba37b] flex items-center justify-center hover:brightness-105 transition-all text-[#1c1510]"
          >
            <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      )}
    </form>
  );
}

export function Footer() {
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop All', href: '/shop' },
    { name: 'Collections', href: '/collections' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const customerCare = [
    { name: 'Terms & Conditions', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Refund Policy', href: '/refund-policy' },
    { name: 'Return Policy', href: '/return-policy' },
    { name: 'Showroom Support', href: '/contact' },
  ];

  return (
    <footer className="w-full bg-[#0d0907] border-t border-[#1a1410] overflow-hidden text-[#e8ded4] pb-3 md:pb-0">

      {/* ── Mobile Compact View (< md) (matches user's mockup footer) ── */}
      <div className="md:hidden px-4 py-4">

        {/* Brand Logo & Socials Centered */}
        <div className="flex flex-col items-center text-center pb-4 border-b border-[#1c1510]">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-1.5">
            <div className="w-7 h-7 rounded-full border border-[#dec29b]/50 flex items-center justify-center bg-[#1c1510]">
              <span className="font-serif text-sm text-[#dec29b] italic font-semibold leading-none">B</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-serif text-sm tracking-[0.2em] text-[#f5efe8] leading-tight">BHAI JEWELLER</span>
              <span className="text-[7.5px] tracking-[0.3em] text-[#d8cdcf] uppercase font-light">— BRADFORD —</span>
            </div>
          </Link>
          <p className="text-[11px] text-[#e8ded3] font-normal max-w-xs">
            Timeless jewellery crafted for extraordinary moments.
          </p>
          <SocialLinks />
        </div>

        {/* 2-Column Compact Links on Mobile */}
        <div className="grid grid-cols-2 gap-4 py-4 border-b border-[#1c1510] text-left">
          {/* Col 1 */}
          <div>
            <h4 className="text-[10px] tracking-[0.22em] uppercase text-[#dec29b] font-medium mb-2.5">
              Quick Links
            </h4>
            <ul className="space-y-1.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[11.5px] text-[#f5efe8] hover:text-[#dec29b] font-normal transition-colors block">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-[10px] tracking-[0.22em] uppercase text-[#dec29b] font-medium mb-2.5">
              Customer Care
            </h4>
            <ul className="space-y-1.5">
              {customerCare.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[11.5px] text-[#f5efe8] hover:text-[#dec29b] font-normal transition-colors block">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile Quick Links Row */}
        <div className="pt-3 pb-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-[#f0e8e0] font-normal">
          <Link href="/shop" className="hover:text-[#dec29b] transition-colors">Shop</Link>
          <span>•</span>
          <Link href="/about" className="hover:text-[#dec29b] transition-colors">About</Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-[#dec29b] transition-colors">Contact</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-[#dec29b] transition-colors">Terms</Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-[#dec29b] transition-colors">Privacy</Link>
          <span>•</span>
          <Link href="/refund-policy" className="hover:text-[#dec29b] transition-colors">Refunds</Link>
          <span>•</span>
          <Link href="/return-policy" className="hover:text-[#dec29b] transition-colors">Returns</Link>
        </div>

        {/* Mobile Bottom: Copyright & Payment Badges */}
        <div className="pt-1 flex flex-col items-center gap-2 text-center">
          <p className="text-[10px] text-[#d8cdcf] font-normal">
            © {new Date().getFullYear()} Bhai Jeweller, Bradford. All rights reserved.
          </p>
          <PaymentIcons />
        </div>

      </div>

      {/* ── Desktop Multi-column View (>= md) ── */}
      <div className="hidden md:block max-w-7xl mx-auto px-8 lg:px-12 py-12">
        <div className="grid grid-cols-12 gap-8 pb-10 border-b border-[#1c1510]">
          {/* Brand Info */}
          <div className="col-span-5 flex flex-col items-start text-left">
            <Link href="/" className="inline-flex items-center gap-3 group mb-3">
              <div className="w-9 h-9 rounded-full border border-[#dec29b]/50 flex items-center justify-center bg-[#1c1510] group-hover:border-[#dec29b] transition-colors">
                <span className="font-serif text-lg text-[#dec29b] italic font-semibold leading-none">B</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-serif text-base tracking-[0.22em] text-[#f5efe8] leading-tight">BHAI JEWELLER</span>
                <span className="text-[8px] tracking-[0.35em] text-[#9a897b] uppercase font-light">— BRADFORD —</span>
              </div>
            </Link>
            <p className="text-xs text-[#e8ded3] font-normal leading-relaxed max-w-sm">
              Fine jewellery crafted for extraordinary moments. Showroom located in Bradford, West Yorkshire.
            </p>
            <SocialLinks />
          </div>

          {/* Desktop Newsletter */}
          <div className="col-span-7 flex flex-col justify-center">
            <div className="p-5 rounded-2xl bg-[#140e0b] border border-[#231a14] max-w-md ml-auto w-full">
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#dec29b] font-medium mb-1">
                JOIN THE SOCIETY
              </p>
              <h3 className="font-serif text-base text-[#f5efe8] font-normal leading-snug">
                Receive exclusive previews & private invites
              </h3>
              <DesktopNewsletterForm />
            </div>
          </div>
        </div>

        {/* Desktop Links Grid */}
        <div className="grid grid-cols-4 gap-8 pt-8">
          <div>
            <h4 className="text-[10px] tracking-[0.25em] uppercase text-[#dec29b] font-medium mb-3">
              Collections
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-xs text-[#f5efe8] hover:text-[#dec29b] font-normal transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] tracking-[0.25em] uppercase text-[#dec29b] font-medium mb-3">
              Customer Care
            </h4>
            <ul className="space-y-2">
              {customerCare.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-xs text-[#f5efe8] hover:text-[#dec29b] font-normal transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] tracking-[0.25em] uppercase text-[#dec29b] font-medium mb-3.5">
              Bradford Showroom
            </h4>
            <div className="text-xs text-[#f0e8e0] font-normal space-y-2.5">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#1c1510] border border-[#2e231c] flex items-center justify-center flex-shrink-0 text-[#dec29b]">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </span>
                <span className="text-[#f5efe8]">West Yorkshire, UK</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#1c1510] border border-[#2e231c] flex items-center justify-center flex-shrink-0 text-[#dec29b]">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <span className="text-[#f5efe8]">Mon – Sat: 10:00 – 18:00</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#1c1510] border border-[#2e231c] flex items-center justify-center flex-shrink-0 text-[#dec29b]">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </span>
                <span className="text-[#f5efe8]">Private viewings on request</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] tracking-[0.25em] uppercase text-[#dec29b] font-medium mb-3.5">
              Assurance
            </h4>
            <div className="text-xs text-[#f0e8e0] font-normal space-y-2.5">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#1c1510] border border-[#2e231c] flex items-center justify-center flex-shrink-0 text-[#dec29b]">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12l4 6-10 12L2 9l4-6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 9h20M7 3l5 18 5-18" />
                  </svg>
                </span>
                <span className="text-[#f5efe8]">100% Certified Diamonds</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#1c1510] border border-[#2e231c] flex items-center justify-center flex-shrink-0 text-[#dec29b]">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </span>
                <span className="text-[#f5efe8]">Insured Worldwide Delivery</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#1c1510] border border-[#2e231c] flex items-center justify-center flex-shrink-0 text-[#dec29b]">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </span>
                <span className="text-[#f5efe8]">Lifetime Authenticity Warranty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Bottom Bar */}
        <div className="border-t border-[#18120e] mt-8 pt-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-[11px] text-[#f0e8e0] font-normal">
            <Link href="/shop" className="hover:text-[#dec29b] transition-colors">Shop</Link>
            <span>•</span>
            <Link href="/about" className="hover:text-[#dec29b] transition-colors">About</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-[#dec29b] transition-colors">Contact</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-[#dec29b] transition-colors">Terms</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-[#dec29b] transition-colors">Privacy</Link>
            <span>•</span>
            <Link href="/refund-policy" className="hover:text-[#dec29b] transition-colors">Refunds</Link>
            <span>•</span>
            <Link href="/return-policy" className="hover:text-[#dec29b] transition-colors">Returns</Link>
          </div>
          <p className="text-[11px] text-[#d8cdcf] font-normal">
            © {new Date().getFullYear()} Bhai Jeweller, Bradford. All rights reserved.
          </p>
          <PaymentIcons />
        </div>
      </div>

    </footer>
  );
}
