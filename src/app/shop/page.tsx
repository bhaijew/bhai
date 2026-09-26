'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useShop, WishlistItem } from '@/context/ShopContext';
import { ScrollReveal } from '@/components/shared/ScrollReveal';

interface Product {
  id: string;
  name: string;
  category: 'Rings' | 'Necklaces' | 'Earrings' | 'Bracelets';
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  image: string;
  slug: string;
}

const allProducts: Product[] = [];

const categories = ['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets'] as const;

export default function ShopPage() {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [addedCartMap, setAddedCartMap] = useState<Record<string, boolean>>({});

  const handleWishlistClick = (p: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      rating: p.rating,
      reviewCount: p.reviewCount,
      image: p.image,
      slug: p.slug,
    });
  };

  const handleAddToCartClick = (p: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: p.id,
      name: p.name,
      variant: p.category,
      price: p.price,
      image: p.image,
      slug: p.slug,
    });
    setAddedCartMap((prev) => ({ ...prev, [p.id]: true }));
    setTimeout(() => {
      setAddedCartMap((prev) => ({ ...prev, [p.id]: false }));
    }, 2000);
  };

  const filteredProducts = useMemo(() => {
    let list = selectedCategory === 'All'
      ? allProducts
      : allProducts.filter((p) => p.category === selectedCategory);

    if (sortBy === 'low') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'high') {
      list = [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [selectedCategory, sortBy]);

  return (
    <main className="w-full bg-[#faf7f2] min-h-screen text-[#1c1510] pb-0">

      {/* ── Top Hero Banner (matches screen 2 mockup) ── */}
      <section className="relative w-full h-[180px] sm:h-[220px] md:h-[260px] bg-[#120e0b] overflow-hidden flex items-center justify-center text-center">
        <Image
          src="/images/shop-banner.jpg"
          alt="Shop Our Collection"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120e0b] via-[#120e0b]/60 to-[#120e0b]/80" />

        <div className="relative z-10 px-4 max-w-xl">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#f5efe8] font-normal leading-tight">
            Shop Our Collection
          </h1>
          <p className="text-xs sm:text-sm text-[#c8bdb5] font-light mt-2">
            Timeless designs for every moment. Handcrafted in 21ct & 18k gold.
          </p>
        </div>
      </section>

      {/* ── Container ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-6">

        {/* Breadcrumb */}
        <nav className="text-xs text-[#8c7e73] font-light mb-6 flex items-center gap-1.5">
          <Link href="/" className="hover:text-[#1c1510] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#1c1510] font-normal">Shop</span>
        </nav>

        {/* Category Pills & Sort Bar (matches screen 2) */}
        <ScrollReveal direction="up" duration={600}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e8dfd5]">
            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-light transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-[#1c1510] text-[#f5efe8] shadow-xs'
                      : 'bg-[#f0e8dc] text-[#6b5c50] hover:bg-[#e4dacf]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs text-[#6b5c50] self-end sm:self-auto">
              <label htmlFor="sortSelect" className="font-light">Sort by:</label>
              <select
                id="sortSelect"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#f0e8dc] border border-[#dfd4c5] rounded-lg px-2.5 py-1 text-xs text-[#1c1510] outline-none cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Product Grid or Clean Empty State (5px square radius) ── */}
        {filteredProducts.length === 0 ? (
          <ScrollReveal direction="zoom" duration={700}>
            <div className="bg-white rounded-[5px] border border-[#ede5db] p-8 sm:p-12 text-center my-8 shadow-xs">
              <div className="w-14 h-14 mx-auto mb-3.5 rounded-full bg-[#faf6f0] border border-[#ede5db] flex items-center justify-center text-[#9e7d56]">
                <svg className="w-7 h-7 stroke-[1.4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
              <h2 className="font-serif text-xl text-[#1c1510]">No products available currently</h2>
              <p className="text-xs text-[#7d6f63] font-light mt-1.5 max-w-md mx-auto">
                Our store is being prepared with exclusive luxury pieces. Please check back soon!
              </p>
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6 pt-6">
            {filteredProducts.map((p, idx) => (
              <ScrollReveal key={p.id} delay={idx * 80} direction="up">
                <Link
                  href={`/shop/${p.slug}`}
                  className="group flex flex-col bg-white rounded-[5px] overflow-hidden border border-[#ede5db] hover:border-[#c9b49a] card-luxury"
                >
                  {/* Product Image + Heart Wishlist Button */}
                  <div className="relative w-full aspect-square bg-[#f5efe7] overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 260px"
                      className="object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out"
                    />

                    {/* Subtle Luxury Hallmark Badge */}
                    <span className="absolute top-2.5 left-2.5 z-10 text-[8.5px] sm:text-[9.5px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[#805f32] border border-[#dec29b]/40 shadow-2xs">
                      {p.category === 'Rings' ? '21ct Gold' : 'Hallmark'}
                    </span>

                    {/* Wishlist Heart Icon */}
                    <button
                      type="button"
                      aria-label="Save to wishlist"
                      onClick={(e) => handleWishlistClick(p, e)}
                      className="absolute top-2.5 right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-xs border border-[#eae0d5] hover:scale-110 active:scale-95 transition-all"
                    >
                      <svg
                        className={`w-3.5 h-3.5 ${isInWishlist(p.id) ? 'text-[#c9a87c] fill-current' : 'text-[#8a796c]'}`}
                        fill={isInWishlist(p.id) ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        strokeWidth="1.8"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-2.5">
                    <div>
                      <h3 className="font-serif text-[13px] sm:text-[15px] font-normal text-[#1c1510] leading-snug group-hover:text-[#9e7d56] transition-colors truncate">
                        {p.name}
                      </h3>
                      <p className="text-[10px] text-[#9a897b] font-light mt-0.5 tracking-wide">{p.category}</p>
                    </div>

                    <div className="mt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-semibold text-[#1c1510]">
                          ${p.price.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-[#a09080] line-through font-light">
                          ${p.originalPrice.toLocaleString()}
                        </span>
                      </div>

                      {/* Rating Stars */}
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex gap-[2px]">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <svg
                              key={s}
                              className="w-2.5 h-2.5 text-[#dec29b]"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-[9.5px] text-[#9a897b]">({p.reviewCount})</span>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      type="button"
                      onClick={(e) => handleAddToCartClick(p, e)}
                      className={`w-full py-1.5 sm:py-2 rounded-full text-[11px] font-light tracking-wide transition-all border ${
                        addedCartMap[p.id]
                          ? 'bg-[#2d7a48] text-white border-[#2d7a48]'
                          : 'border-[#1c1510] text-[#1c1510] hover:bg-[#1c1510] hover:text-[#f5efe8] active:scale-[0.98]'
                      }`}
                    >
                      {addedCartMap[p.id] ? '✓ Added to Cart' : 'Add to Cart'}
                    </button>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        <div className="flex items-center justify-center gap-2 pt-10 pb-12">
          <button
            type="button"
            aria-label="Previous page"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            className="w-8 h-8 rounded-[5px] border border-[#ded3c5] flex items-center justify-center text-xs text-[#8a796c] hover:border-[#1c1510] hover:text-[#1c1510] hover:bg-white active:scale-95 transition-all duration-300 shadow-2xs"
          >
            ‹
          </button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-[5px] text-xs transition-all duration-300 active:scale-95 ${
                currentPage === page
                  ? 'bg-[#1c1510] text-[#f5efe8] font-semibold scale-105 shadow-md border border-[#1c1510]'
                  : 'text-[#6b5c50] font-light hover:bg-[#ebdcb9]/50 hover:text-[#1c1510] border border-transparent'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            aria-label="Next page"
            onClick={() => setCurrentPage((prev) => Math.min(5, prev + 1))}
            className="w-8 h-8 rounded-[5px] border border-[#ded3c5] flex items-center justify-center text-xs text-[#8a796c] hover:border-[#1c1510] hover:text-[#1c1510] hover:bg-white active:scale-95 transition-all duration-300 shadow-2xs"
          >
            ›
          </button>
        </div>
      </div>

      {/* ── "Get Exclusive Offers" Full-Width Edge-To-Edge Section ── */}
      <ScrollReveal direction="up" duration={800}>
        <section className="w-full bg-[#140e0b] border-t border-[#261d16] py-12 sm:py-16 px-4 text-center relative overflow-hidden mt-8 mb-0">
          {/* Subtle center white divider line */}
          <div className="w-20 h-[1.5px] bg-[#f5efe8]/40 mx-auto mb-5 rounded-full" />

          <div className="relative z-10 max-w-md mx-auto">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#f5efe8] font-normal">
              Get Exclusive Offers
            </h2>
            <p className="text-xs sm:text-sm text-[#a89b8d] font-light mt-2">
              Be the first to know about new collections, exclusive previews and special releases.
            </p>
            <div className="flex items-stretch rounded-full border border-[#2e231c] bg-[#1a1410] overflow-hidden mt-6 max-w-sm mx-auto shadow-sm">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-transparent px-4 py-2.5 sm:py-3 text-xs text-[#f5efe8] placeholder-[#736355] outline-none font-light min-w-0"
              />
              <button
                type="button"
                className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 my-0.5 mr-0.5 rounded-full bg-gradient-to-r from-[#dec29b] to-[#cba37b] flex items-center justify-center text-[#1c1510] hover:scale-105 transition-transform"
              >
                →
              </button>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </main>
  );
}
