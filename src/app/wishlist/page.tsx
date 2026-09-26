'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useShop, WishlistItem } from '@/context/ShopContext';
import { ScrollReveal } from '@/components/shared/ScrollReveal';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist, addToCart } = useShop();
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

  const handleAddToCart = (item: WishlistItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      variant: item.category,
      price: item.price,
      image: item.image,
      slug: item.slug,
    });
    setAddedMap((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  return (
    <main className="w-full bg-[#faf7f2] min-h-screen text-[#1c1510] pt-20 sm:pt-24 pb-20 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">

        {/* ── Breadcrumb & Header ── */}
        <ScrollReveal direction="up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 sm:mb-8 border-b border-[#ded3c5] pb-4">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1c1510] font-normal leading-tight">
                My Wishlist {wishlist.length > 0 && <span className="text-lg sm:text-2xl text-[#8a796c]">({wishlist.length})</span>}
              </h1>
              <p className="text-xs sm:text-sm text-[#8a796c] font-light mt-1">
                Save your favourite luxury jewellery pieces for later.
              </p>
            </div>

            <div className="flex items-center gap-4 self-start sm:self-auto">
              {wishlist.length > 0 && (
                <button
                  type="button"
                  onClick={clearWishlist}
                  className="text-xs text-red-700 hover:text-red-900 font-semibold uppercase tracking-wider transition-colors underline underline-offset-4 cursor-pointer"
                >
                  Clear Wishlist
                </button>
              )}

              <nav className="text-xs text-[#8c7e73] font-light flex items-center gap-1.5 uppercase tracking-wider">
                <Link href="/" className="hover:text-[#1c1510] transition-colors">Home</Link>
                <span>/</span>
                <span className="text-[#1c1510] font-semibold">Wishlist</span>
              </nav>
            </div>
          </div>
        </ScrollReveal>

        {wishlist.length === 0 ? (
          <ScrollReveal direction="zoom">
            <div className="bg-white rounded-none border-2 border-[#ded3c5] p-12 text-center my-8 shadow-xs">
              <div className="w-16 h-16 mx-auto mb-4 rounded-none bg-[#1c1510] border-2 border-[#dec29b] flex items-center justify-center text-[#dec29b] shadow-sm">
                <svg className="w-8 h-8 stroke-[1.4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <h2 className="font-serif text-2xl text-[#1c1510]">Your wishlist is empty</h2>
              <p className="text-xs text-[#7d6f63] font-light mt-1.5 mb-6">Explore our bespoke jewellery catalogue and save your favourite designs.</p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-none bg-[#1c1510] text-[#f5efe8] text-xs font-bold uppercase tracking-wider hover:bg-[#33261d] transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Explore Collection →
              </Link>
            </div>
          </ScrollReveal>
        ) : (
          /* ── Product Grid: 2 cols on mobile, 3 cols on desktop ── */
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {wishlist.map((item, idx) => (
              <ScrollReveal key={item.id} delay={idx * 60} direction="up">
                <div
                  className="group flex flex-col bg-white rounded-none overflow-hidden border-2 border-[#ded3c5] hover:border-[#1c1510] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Product Image + Active Heart Button */}
                  <div className="relative w-full aspect-square bg-[#f5efe7] overflow-hidden border-b border-[#ded3c5]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 48vw, (max-width: 1024px) 33vw, 360px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    {/* Active Wishlist Heart (clicking removes it) */}
                    <button
                      type="button"
                      aria-label="Remove from wishlist"
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-none bg-white/95 backdrop-blur-xs flex items-center justify-center shadow-md border border-[#ded3c5] hover:scale-110 active:scale-95 transition-all text-[#c9a87c] cursor-pointer hover:bg-white"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    </button>
                  </div>

                  {/* Product Info & Action */}
                  <div className="p-4 flex flex-col flex-1 justify-between gap-3 bg-white">
                    <div>
                      <span className="text-[10px] tracking-widest text-[#9e7d56] uppercase font-bold block mb-1">
                        {item.category || 'Fine Jewellery'}
                      </span>
                      <Link href={`/shop/${item.slug}`}>
                        <h3 className="font-serif text-sm sm:text-base font-normal text-[#1c1510] leading-snug group-hover:text-[#9e7d56] transition-colors truncate">
                          {item.name}
                        </h3>
                      </Link>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm sm:text-base font-bold font-serif text-[#1c1510]">
                          ${item.price.toLocaleString()}
                        </span>

                        {/* Rating Stars */}
                        <div className="flex items-center gap-1">
                          <div className="flex gap-[1.5px]">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <svg key={s} className="w-2.5 h-2.5 text-[#dec29b]" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-[9.5px] text-[#9a897b]">({item.reviewCount || 10})</span>
                        </div>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      className={`w-full py-2.5 sm:py-3 rounded-none text-xs font-bold uppercase tracking-wider transition-all duration-300 border cursor-pointer shadow-xs ${
                        addedMap[item.id]
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : 'border-[#1c1510] bg-[#1c1510] text-[#f5efe8] hover:bg-[#33261d] active:scale-[0.98]'
                      }`}
                    >
                      {addedMap[item.id] ? '✓ Added to Cart' : 'Add to Shopping Bag'}
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
