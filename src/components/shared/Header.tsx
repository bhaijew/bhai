'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';

interface HeaderProps {
  brandName?: string;
  brandSubline?: string;
  solidBg?: boolean;
  isRelative?: boolean;
}

export function Header({
  brandName = 'BHAI JEWELLER',
  brandSubline = 'BRADFORD',
  solidBg = false,
  isRelative = false,
}: HeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { cartCount, wishlistCount } = useShop();

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop All', href: '/shop' },
    { name: 'Rings', href: '/collections' },
    { name: 'Necklaces', href: '/collections' },
    { name: 'Earrings', href: '/collections' },
    { name: 'Bracelets', href: '/collections' },
    { name: 'Our Story', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header
        className={`${
          isRelative ? 'relative' : 'absolute top-0 md:top-[37px]'
        } left-0 w-full max-w-full z-40 transition-all duration-300 ${
          solidBg
            ? 'bg-[#140f0c] shadow-lg border-b border-[#2a2018]'
            : 'bg-gradient-to-b from-[#140f0c]/90 via-[#140f0c]/50 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 h-16 sm:h-20 md:h-24 flex items-center justify-between">

          {/* ── Left: Mobile Hamburger Button (3 lines) ── */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              className="text-[#f5efe8] hover:text-[#d8bb93] p-1.5 -ml-1 transition-colors"
            >
              <svg className="w-6 h-6 stroke-[1.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              </svg>
            </button>
          </div>

          {/* ── Center (Mobile) / Left (Desktop): Brand Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group mx-auto md:mx-0">
            {/* Stylized Monogram Icon */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center border border-[#d8bb93]/60 rounded-full bg-[#1e1713]/80 backdrop-blur-sm group-hover:border-[#d8bb93] shadow-sm transition-colors">
              <span className="font-serif text-base sm:text-lg text-[#dec29b] italic font-semibold leading-none select-none">
                B
              </span>
            </div>

            {/* Wordmark */}
            <div className="flex flex-col text-center md:text-left">
              <span className="font-serif text-base sm:text-lg lg:text-xl tracking-[0.24em] text-[#f5efe8] font-normal leading-tight group-hover:text-[#dec29b] transition-colors">
                {brandName}
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.38em] text-[#c0b0a0] font-light uppercase">
                — {brandSubline} —
              </span>
            </div>
          </Link>

          {/* ── Desktop Navigation Links ── */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9">
            {navLinks.slice(0, 6).map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[#e2dad1] hover:text-[#d8bb93] text-sm tracking-wide font-normal transition-colors duration-200 relative group py-1"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#d8bb93] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* ── Right Utility Icons: Search, Wishlist, Cart ── */}
          <div className="flex items-center gap-3.5 sm:gap-5 text-[#f5efe8]">
            {/* Search Icon */}
            <button
              type="button"
              aria-label="Search jewellery"
              className="hover:text-[#d8bb93] transition-colors p-1"
            >
              <svg className="w-5 h-5 stroke-[1.7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>

            {/* Wishlist (Heart) Icon — Desktop Only (in bottom nav on mobile) */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="hidden md:block relative hover:text-[#d8bb93] transition-colors p-1"
            >
              <svg className="w-5 h-5 stroke-[1.7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#dec29b] text-[#1c1510] font-bold text-[9px] rounded-full flex items-center justify-center shadow-md">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag Icon with Badge — Desktop Only (in bottom nav on mobile) */}
            <Link
              href="/cart"
              aria-label="Shopping bag"
              className="hidden md:block relative hover:text-[#d8bb93] transition-colors p-1"
            >
              <svg className="w-5 h-5 stroke-[1.7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.669 0-1.189-.578-1.119-1.243l1.263-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#dec29b] text-[#1c1510] font-bold text-[9px] rounded-full flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account / User Icon — Desktop Only */}
            <Link
              href="/login"
              aria-label="Account Login"
              className="hidden md:block hover:text-[#d8bb93] transition-colors p-1"
            >
              <svg className="w-5 h-5 stroke-[1.7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </Link>
          </div>

        </div>
      </header>

      {/* ── Mobile Side Navigation Drawer (Slides from LEFT) ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div className="fixed top-0 left-0 bottom-0 w-[84%] max-w-[340px] bg-[#140f0c] text-[#f5efe8] border-r border-[#2d221a] shadow-2xl flex flex-col z-50 animate-slideRight">

            {/* Drawer Header: Brand + Close button */}
            <div className="p-5 border-b border-[#261d16] flex items-center justify-between">
              <Link href="/" onClick={() => setDrawerOpen(false)} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full border border-[#d8bb93]/50 flex items-center justify-center bg-[#1e1713]">
                  <span className="font-serif text-sm text-[#dec29b] italic font-semibold">B</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-sm tracking-[0.2em] text-[#f5efe8] font-normal leading-tight">
                    {brandName}
                  </span>
                  <span className="text-[8px] tracking-[0.3em] text-[#9a8a7c] uppercase">
                    {brandSubline}
                  </span>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="w-8 h-8 rounded-full border border-[#2d231b] flex items-center justify-center text-[#c8bdb5] hover:text-white hover:border-[#d8bb93] transition-colors"
              >
                <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search Input inside Drawer */}
            <div className="px-5 pt-4 pb-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1c1612] border border-[#2d221a]">
                <svg className="w-4 h-4 text-[#8a7a6c] stroke-[1.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search rings, necklaces..."
                  className="bg-transparent text-xs text-[#f5efe8] placeholder-[#786b5e] outline-none w-full font-light"
                />
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-[#231a14]">
              <nav className="flex flex-col pb-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-between py-2.5 text-[#e8ded4] hover:text-[#d8bb93] text-sm font-light tracking-wide transition-colors"
                  >
                    <span>{link.name}</span>
                    <svg className="w-3.5 h-3.5 stroke-[1.5] text-[#6d5e50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                ))}
              </nav>

              {/* Collections Quick Cards in Drawer */}
              <div className="pt-4 pb-2">
                <p className="text-[10px] tracking-[0.25em] uppercase text-[#9e8875] font-medium mb-3">
                  FEATURED CATEGORIES
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'Rings', href: '/collections' },
                    { name: 'Necklaces', href: '/collections' },
                    { name: 'Earrings', href: '/collections' },
                    { name: 'Bracelets', href: '/collections' },
                  ].map((cat) => (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      onClick={() => setDrawerOpen(false)}
                      className="p-2.5 rounded-lg bg-[#1a1410] border border-[#2b2119] text-center text-xs text-[#cfc2b4] hover:border-[#d8bb93]/50 hover:text-[#dec29b] transition-all"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Customer Service info */}
              <div className="pt-4 space-y-2.5 text-xs text-[#8d7d6f] font-light">
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-[#dec29b] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <span>Showroom: Bradford, West Yorkshire</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-[#dec29b] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  <span>Contact: +44 (0) 1274 000 000</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-[#dec29b] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <span>Support: info@bhaijeweller.co.uk</span>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-[#261d16] bg-[#100c09] flex items-center justify-between text-xs text-[#a09080]">
              <span>© {new Date().getFullYear()} Bhai Jeweller</span>
              <div className="flex items-center gap-3">
                <Link href="/about" onClick={() => setDrawerOpen(false)} className="hover:text-[#dec29b]">About</Link>
                <Link href="/contact" onClick={() => setDrawerOpen(false)} className="hover:text-[#dec29b]">Support</Link>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
