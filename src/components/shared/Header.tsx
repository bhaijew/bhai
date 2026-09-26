'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShop, ProductItem } from '@/context/ShopContext';

interface HeaderProps {
  brandName?: string;
  brandSubline?: string;
  solidBg?: boolean;
  isRelative?: boolean;
}

const QUICK_TAGS = [
  '21ct Gold',
  'Diamond Rings',
  'Necklaces',
  'Chandelier Earrings',
  'Gold Bangles',
  'Bridal',
  'Solitaire',
  '18k Gold',
];

export function Header({
  brandName = 'BHAI JEWELLER',
  brandSubline = 'BRADFORD',
  solidBg = false,
  isRelative = false,
}: HeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { cartCount, wishlistCount, products } = useShop();
  const router = useRouter();

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isSearchOpen]);

  // Handle ESC key press to close search mode or drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setSearchQuery('');
        setDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  // Real-time live search filter
  const liveResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return products.filter((p: ProductItem) => {
      const nameMatch = p.name?.toLowerCase().includes(q);
      const catMatch = p.category?.toLowerCase().includes(q);
      const metalMatch = p.metal?.toLowerCase().includes(q);
      const descMatch = p.description?.toLowerCase().includes(q);
      const skuMatch = p.sku?.toLowerCase().includes(q);
      const kwMatch = Array.isArray(p.focusKeywords) && p.focusKeywords.some((k) => k.toLowerCase().includes(q));
      return nameMatch || catMatch || metalMatch || descMatch || skuMatch || kwMatch;
    });
  }, [searchQuery, products]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setDrawerOpen(false);
    }
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    router.push(`/shop?search=${encodeURIComponent(tag)}`);
    setIsSearchOpen(false);
    setDrawerOpen(false);
  };

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
          drawerOpen ? 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto' : ''
        } ${
          solidBg || isSearchOpen
            ? 'bg-[#140f0c] shadow-lg border-b border-[#2a2018]'
            : 'bg-gradient-to-b from-[#140f0c]/90 via-[#140f0c]/50 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 h-16 sm:h-20 md:h-24 flex items-center justify-between">

          {/* ── SEARCH OPEN MODE (Full Header Search Bar + Live Dropdown) ── */}
          {isSearchOpen ? (
            <div className="w-full flex items-center justify-between gap-3 animate-fadeIn">

              {/* Logo (Desktop only when search is open) */}
              <Link href="/" onClick={() => setIsSearchOpen(false)} className="hidden md:flex items-center gap-2.5 flex-shrink-0 group">
                <div className="w-8 h-8 rounded-full border border-[#d8bb93]/60 bg-[#1e1713] flex items-center justify-center">
                  <span className="font-serif text-base text-[#dec29b] italic font-semibold">B</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-sm tracking-[0.2em] text-[#f5efe8]">
                    {brandName}
                  </span>
                  <span className="text-[7.5px] tracking-[0.3em] text-[#c0b0a0] uppercase">
                    — {brandSubline} —
                  </span>
                </div>
              </Link>

              {/* Expanded Search Bar Form */}
              <form onSubmit={handleSearchSubmit} className="flex-1 max-w-3xl relative flex items-center mx-1 sm:mx-4">
                <div className="relative w-full flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#d8bb93] absolute left-3.5 stroke-[1.8] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search rings, necklaces, bracelets, 21ct gold, SKU..."
                    className="w-full bg-[#1c1511] text-[#f5efe8] text-xs sm:text-sm placeholder-[#8a796b] border border-[#3d2e24] focus:border-[#d8bb93] rounded-full pl-10 sm:pl-11 pr-10 py-2 sm:py-2.5 outline-none transition-all shadow-inner"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 text-[#9a897b] hover:text-[#f5efe8] text-xs font-semibold p-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </form>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                aria-label="Close search"
                className="flex-shrink-0 px-3 py-1.5 rounded-full border border-[#3d2e24] text-[#d8bb93] hover:text-white hover:bg-[#2a2018] transition-all flex items-center gap-1.5 text-xs font-light"
              >
                <span>Close</span>
                <svg className="w-3.5 h-3.5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

            </div>
          ) : (
            /* ── NORMAL HEADER MODE ── */
            <>
              {/* Left: Mobile Hamburger Button */}
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

              {/* Center (Mobile) / Left (Desktop): Brand Logo */}
              <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group mx-auto md:mx-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center border border-[#d8bb93]/60 rounded-full bg-[#1e1713]/80 backdrop-blur-sm group-hover:border-[#d8bb93] shadow-sm transition-colors">
                  <span className="font-serif text-base sm:text-lg text-[#dec29b] italic font-semibold leading-none select-none">
                    B
                  </span>
                </div>

                <div className="flex flex-col text-center md:text-left">
                  <span className="font-serif text-base sm:text-lg lg:text-xl tracking-[0.24em] text-[#f5efe8] font-normal leading-tight group-hover:text-[#dec29b] transition-colors">
                    {brandName}
                  </span>
                  <span className="text-[8px] sm:text-[9px] tracking-[0.38em] text-[#c0b0a0] font-light uppercase">
                    — {brandSubline} —
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation Links */}
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

              {/* Right Utility Icons */}
              <div className="flex items-center gap-3.5 sm:gap-5 text-[#f5efe8]">
                {/* Search Icon */}
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Search jewellery"
                  className="hover:text-[#d8bb93] transition-colors p-1"
                >
                  <svg className="w-5 h-5 stroke-[1.7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </button>

                {/* Wishlist Icon */}
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

                {/* Shopping Bag Icon */}
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

                {/* Account Icon */}
                <Link
                  href="/account"
                  aria-label="User Account"
                  className="hidden md:block hover:text-[#d8bb93] transition-colors p-1"
                >
                  <svg className="w-5 h-5 stroke-[1.7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </Link>
              </div>
            </>
          )}

        </div>

        {/* ── LIVE SEARCH RESULTS DRAWER & QUICK TAGS OVERLAY ── */}
        {isSearchOpen && (
          <div className="w-full bg-[#16100d] border-b border-[#2e231b] shadow-2xl animate-fadeIn text-[#f5efe8]">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-5 sm:py-6">

              {/* Trending Quick Search Tags */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide text-xs">
                <span className="text-[11px] text-[#9e8d7d] uppercase tracking-wider font-medium mr-1 whitespace-nowrap">
                  Trending:
                </span>
                {QUICK_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className="px-3 py-1 rounded-full bg-[#241a14] hover:bg-[#dec29b] text-[#d4c5b5] hover:text-[#140e0b] border border-[#3b2c21] hover:border-[#dec29b] transition-all text-xs font-light whitespace-nowrap active:scale-95"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Live Search Results View */}
              {searchQuery.trim().length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#261d16]">
                  <div className="flex items-center justify-between mb-3.5">
                    <p className="text-xs text-[#a09080] font-light">
                      Found <strong className="text-[#f5efe8] font-semibold">{liveResults.length}</strong> {liveResults.length === 1 ? 'item' : 'items'} matching &ldquo;<span className="text-[#dec29b]">{searchQuery}</span>&rdquo;
                    </p>
                    {liveResults.length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleSearchSubmit()}
                        className="text-xs text-[#dec29b] hover:underline font-light"
                      >
                        View all in Shop →
                      </button>
                    )}
                  </div>

                  {liveResults.length === 0 ? (
                    <div className="py-6 text-center">
                      <p className="font-serif text-lg text-[#dec29b]">No products found</p>
                      <p className="text-xs text-[#9a897b] font-light mt-1">
                        Try searching for &quot;Gold&quot;, &quot;Ring&quot;, &quot;21ct&quot;, or &quot;Necklace&quot;.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 max-h-[380px] overflow-y-auto pr-1">
                      {liveResults.map((p) => {
                        const imgSrc = p.image || (p.images && p.images[0]) || '/images/detail-ring-hero.jpg';
                        const slug = p.slug || p.id;
                        return (
                          <Link
                            key={p.id}
                            href={`/shop/${slug}`}
                            onClick={() => {
                              setIsSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className="group flex flex-col bg-[#1f1712] border border-[#31231a] hover:border-[#dec29b] rounded-[6px] overflow-hidden p-2 transition-all"
                          >
                            <div className="relative aspect-square w-full rounded-[4px] overflow-hidden bg-[#2a2018]">
                              <Image
                                src={imgSrc}
                                alt={p.name}
                                fill
                                unoptimized={true}
                                sizes="140px"
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <h4 className="font-serif text-xs text-[#f5efe8] group-hover:text-[#dec29b] transition-colors mt-2 font-medium line-clamp-1">
                              {p.name}
                            </h4>
                            <p className="text-[10px] text-[#9e8e80] font-light truncate">
                              {p.metal || p.category}
                            </p>
                            <p className="text-xs font-bold text-[#dec29b] mt-1">
                              £{Number(p.price).toFixed(2)}
                            </p>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        )}
      </header>

      {/* Backdrop overlay when search is open (hides rest of page under dark overlay) */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-md z-30 animate-fadeIn"
          onClick={() => {
            setIsSearchOpen(false);
            setSearchQuery('');
          }}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile Side Navigation Drawer (Slides OVER EVERYTHING including BottomNav - Pure White Theme) ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 z-[100]"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Content - Ultra-Luxury Pure White */}
          <div className="fixed top-0 left-0 bottom-0 w-[86%] max-w-[340px] bg-white text-[#1c1510] border-r border-[#e8ded4] shadow-2xl flex flex-col z-[101] animate-slideRight">

            {/* Drawer Header: Brand + Close button */}
            <div className="p-5 border-b border-[#f0e6dc] flex items-center justify-between bg-white">
              <Link href="/" onClick={() => setDrawerOpen(false)} className="flex items-center gap-2.5">
                <div className="w-8.5 h-8.5 rounded-full border border-[#d8bb93] bg-[#1c1510] flex items-center justify-center shadow-xs">
                  <span className="font-serif text-sm text-[#dec29b] italic font-semibold">B</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-sm tracking-[0.2em] text-[#1c1510] font-medium leading-tight">
                    {brandName}
                  </span>
                  <span className="text-[8px] tracking-[0.3em] text-[#8c7a6b] uppercase">
                    — {brandSubline} —
                  </span>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="w-8.5 h-8.5 rounded-full bg-[#faf7f2] border border-[#e8ded4] flex items-center justify-center text-[#1c1510] hover:bg-[#1c1510] hover:text-white transition-all shadow-2xs"
              >
                <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search Input inside Drawer - Triggers full width search mode */}
            <div className="px-5 pt-4 pb-2 bg-white">
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  setIsSearchOpen(true);
                }}
                className="w-full text-left flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#faf7f2] border border-[#e8ded4] hover:border-[#9e7d56] active:scale-[0.98] transition-all shadow-2xs group cursor-pointer"
              >
                <svg className="w-4 h-4 text-[#9e7d56] stroke-[1.8] flex-shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <span className="text-xs text-[#8c7a6b] font-light truncate">
                  Search rings, necklaces, 21ct gold...
                </span>
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-[#f5eee6] bg-white">
              <nav className="flex flex-col pb-4 space-y-0.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-between py-2.5 px-2 rounded-lg text-[#2c221a] hover:text-[#9e7d56] hover:bg-[#faf7f2] text-sm font-medium tracking-wide transition-all"
                  >
                    <span>{link.name}</span>
                    <svg className="w-3.5 h-3.5 stroke-[1.8] text-[#a8988a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                ))}
              </nav>

              {/* Collections Quick Cards */}
              <div className="pt-4 pb-2">
                <p className="text-[10px] tracking-[0.25em] uppercase text-[#9e7d56] font-semibold mb-3">
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
                      className="p-2.5 rounded-[5px] bg-[#faf7f2] border border-[#ede5db] text-center text-xs font-medium text-[#1c1510] hover:border-[#9e7d56] hover:bg-[#9e7d56]/10 transition-all shadow-2xs"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Customer Service info */}
              <div className="pt-4 space-y-2.5 text-xs text-[#5c4d40] font-light">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#f0e6d8] flex items-center justify-center text-[#9e7d56] flex-shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <span>Bradford, West Yorkshire, UK</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#f0e6d8] flex items-center justify-center text-[#9e7d56] flex-shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <span>+44 (0) 1274 000 000</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#f0e6d8] flex items-center justify-center text-[#9e7d56] flex-shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <span>info@bhaijeweller.co.uk</span>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-[#f0e6dc] bg-[#faf7f2] flex items-center justify-between text-xs text-[#706052]">
              <span>© {new Date().getFullYear()} Bhai Jeweller</span>
              <div className="flex items-center gap-3 font-medium">
                <Link href="/about" onClick={() => setDrawerOpen(false)} className="hover:text-[#9e7d56]">About</Link>
                <Link href="/contact" onClick={() => setDrawerOpen(false)} className="hover:text-[#9e7d56]">Support</Link>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
