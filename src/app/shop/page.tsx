'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useShop, WishlistItem } from '@/context/ShopContext';
import { ScrollReveal } from '@/components/shared/ScrollReveal';

const categories = ['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets'] as const;

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialSearch = searchParams.get('search') || searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'All';

  const { addToCart, toggleWishlist, isInWishlist, products } = useShop();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [addedCartMap, setAddedCartMap] = useState<Record<string, boolean>>({});

  // Sync state if URL query param changes
  useEffect(() => {
    const q = searchParams.get('search') || searchParams.get('q') || '';
    setSearchQuery(q);
    const cat = searchParams.get('category');
    if (cat && categories.includes(cat as any)) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const handleWishlistClick = (p: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      rating: p.rating || 5,
      reviewCount: p.reviewCount || 1,
      image: p.image || (p.images && p.images[0]) || '/images/detail-ring-hero.jpg',
      slug: p.slug || p.id,
    });
  };

  const handleAddToCartClick = (p: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: p.id,
      name: p.name,
      variant: p.metal || p.category,
      price: p.price,
      image: p.image || (p.images && p.images[0]) || '/images/detail-ring-hero.jpg',
      slug: p.slug || p.id,
    });
    setAddedCartMap((prev) => ({ ...prev, [p.id]: true }));
    setTimeout(() => {
      setAddedCartMap((prev) => ({ ...prev, [p.id]: false }));
    }, 2000);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    router.replace('/shop');
  };

  const filteredProducts = useMemo(() => {
    let list = selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());

    // Search query filtering
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const nameMatch = p.name?.toLowerCase().includes(q);
        const catMatch = p.category?.toLowerCase().includes(q);
        const metalMatch = p.metal?.toLowerCase().includes(q);
        const descMatch = p.description?.toLowerCase().includes(q);
        const skuMatch = p.sku?.toLowerCase().includes(q);
        const kwMatch = Array.isArray(p.focusKeywords) && p.focusKeywords.some((k) => k.toLowerCase().includes(q));
        return nameMatch || catMatch || metalMatch || descMatch || skuMatch || kwMatch;
      });
    }

    if (sortBy === 'low') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'high') {
      list = [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [selectedCategory, searchQuery, sortBy, products]);

  return (
    <main className="w-full bg-[#faf7f2] min-h-screen text-[#1c1510] pb-0">

      {/* ── Top Hero Banner ── */}
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
            {searchQuery ? `Search Results` : `Shop Our Collection`}
          </h1>
          <p className="text-xs sm:text-sm text-[#c8bdb5] font-light mt-2">
            {searchQuery
              ? `Showing results matching "${searchQuery}"`
              : `Timeless designs for every moment. Handcrafted in 21ct & 18k gold.`}
          </p>
        </div>
      </section>

      {/* ── Container ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-6">

        {/* Breadcrumb & Search Query Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <nav className="text-xs text-[#8c7e73] font-light flex items-center gap-1.5">
            <Link href="/" className="hover:text-[#1c1510] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" onClick={handleClearSearch} className="hover:text-[#1c1510] transition-colors">Shop</Link>
            {searchQuery && (
              <>
                <span>/</span>
                <span className="text-[#1c1510] font-normal truncate">Search: &ldquo;{searchQuery}&rdquo;</span>
              </>
            )}
          </nav>

          {/* Active Search Badge */}
          {searchQuery && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6e5d4f] font-light">
                Found <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'item' : 'items'}
              </span>
              <button
                type="button"
                onClick={handleClearSearch}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#ebd7be]/50 hover:bg-[#ebd7be] text-[#5a4329] text-xs font-medium border border-[#dec29b] transition-all shadow-2xs"
              >
                <span>Clear &ldquo;{searchQuery}&rdquo;</span>
                <span className="text-sm leading-none">✕</span>
              </button>
            </div>
          )}
        </div>

        {/* Search Input Bar + Category Pills + Sort Bar */}
        <ScrollReveal direction="up" duration={600}>
          <div className="flex flex-col gap-4 pb-6 border-b border-[#e8dfd5]">

            {/* In-Page Real Search Input */}
            <div className="relative w-full max-w-xl mx-auto">
              <svg className="w-4 h-4 text-[#9e7d56] absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[1.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by jewellery name, 21ct gold, metal, ring size, SKU..."
                className="w-full bg-white text-[#1c1510] text-xs sm:text-sm placeholder-[#9a897b] border border-[#ded3c5] focus:border-[#9e7d56] rounded-full pl-10 pr-10 py-2.5 outline-none transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8c7e73] hover:text-[#1c1510] text-xs font-semibold p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Chips & Sort Dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
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

          </div>
        </ScrollReveal>

        {/* ── Product Grid or Clean Empty State ── */}
        {filteredProducts.length === 0 ? (
          <ScrollReveal direction="zoom" duration={700}>
            <div className="bg-white rounded-[5px] border border-[#ede5db] p-8 sm:p-12 text-center my-8 shadow-xs">
              <div className="w-14 h-14 mx-auto mb-3.5 rounded-full bg-[#faf6f0] border border-[#ede5db] flex items-center justify-center text-[#9e7d56]">
                <svg className="w-7 h-7 stroke-[1.4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <h2 className="font-serif text-xl text-[#1c1510]">
                {searchQuery ? `No products found matching "${searchQuery}"` : `No products available currently`}
              </h2>
              <p className="text-xs text-[#7d6f63] font-light mt-1.5 max-w-md mx-auto">
                {searchQuery
                  ? `Try checking for spelling errors, searching for general terms like "Gold" or "Ring", or reset your search.`
                  : `Our store is being prepared with exclusive luxury pieces. Please check back soon!`}
              </p>
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="mt-4 px-5 py-2 rounded-full bg-[#1c1510] text-[#f5efe8] text-xs font-light hover:bg-[#382b22] transition-all shadow-xs"
                >
                  Clear Search & View All
                </button>
              )}
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6 pt-6">
            {filteredProducts.map((p, idx) => (
              <ScrollReveal key={p.id} delay={idx * 60} direction="up">
                <Link
                  href={`/shop/${p.slug || p.id}`}
                  className="group flex flex-col bg-white rounded-[5px] overflow-hidden border border-[#ede5db] hover:border-[#c9b49a] card-luxury"
                >
                  {/* Product Image + Heart Wishlist Button */}
                  <div className="relative w-full aspect-square bg-[#f5efe7] overflow-hidden">
                    <Image
                      src={p.image || (p.images && p.images[0]) || '/images/detail-ring-hero.jpg'}
                      alt={p.name}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 260px"
                      className="object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out"
                    />

                    {/* Subtle Luxury Hallmark Badge */}
                    <span className="absolute top-2.5 left-2.5 z-10 text-[8.5px] sm:text-[9.5px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[#805f32] border border-[#dec29b]/40 shadow-2xs">
                      {p.category === 'Rings' ? '21ct Gold' : (p.metal || 'Hallmark')}
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
                      <p className="text-[10px] text-[#9a897b] font-light mt-0.5 tracking-wide">{p.category} • {p.metal || 'Gold'}</p>
                    </div>

                    <div className="mt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-semibold text-[#1c1510]">
                          £{Number(p.price).toLocaleString()}
                        </span>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span className="text-[10px] text-[#a09080] line-through font-light">
                            £{Number(p.originalPrice).toLocaleString()}
                          </span>
                        )}
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
                        <span className="text-[9.5px] text-[#9a897b]">({p.reviewCount || 12})</span>
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
        {filteredProducts.length > 0 && (
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
        )}
      </div>

      {/* ── "Get Exclusive Offers" Full-Width Edge-To-Edge Section ── */}
      <ScrollReveal direction="up" duration={800}>
        <section className="w-full bg-[#140e0b] border-t border-[#261d16] py-12 sm:py-16 px-4 text-center relative overflow-hidden mt-8 mb-0">
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

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#faf7f2] flex items-center justify-center text-[#9e7d56] font-serif text-lg">Loading collection...</div>}>
      <ShopContent />
    </Suspense>
  );
}
