'use client';

import React, { useRef, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useShop, ProductItem } from '@/context/ShopContext';

interface DisplayProduct {
  id: string;
  name: string;
  metal: string;
  purity: string;
  price: number;
  image: string;
  alt: string;
  href: string;
}

function ProductCard({ product }: { product: DisplayProduct }) {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const [added, setAdded] = useState(false);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: product.id,
      name: product.name,
      category: product.metal,
      price: product.price,
      rating: 5,
      reviewCount: 12,
      image: product.image,
      slug: product.id,
    });
  };

  const handleCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      variant: product.purity,
      price: product.price,
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="group flex flex-col text-left transition-all duration-300 w-[150px] sm:w-[190px] md:w-[220px] flex-shrink-0 snap-start select-none">
      <Link href={product.href} className="block">
        {/* Product Image Container */}
        <div className="relative w-full aspect-square rounded-[14px] sm:rounded-2xl overflow-hidden bg-[#e5ebf0] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <Image
            src={product.image}
            alt={product.alt}
            fill
            unoptimized={true}
            sizes="(max-width: 640px) 150px, (max-width: 1024px) 200px, 220px"
            className="object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
          />

          {/* Heart Button */}
          <button
            type="button"
            aria-label="Wishlist"
            onClick={handleWishlist}
            className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-xs border border-[#eae0d5] hover:scale-110 active:scale-95 transition-all"
          >
            <svg
              className={`w-3.5 h-3.5 ${isInWishlist(product.id) ? 'text-[#c9a87c] fill-current' : 'text-[#8a796c]'}`}
              fill={isInWishlist(product.id) ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
        </div>

        {/* Card Details */}
        <div className="mt-2.5 sm:mt-3 flex flex-col">
          <h3 className="font-serif text-[13px] sm:text-[15px] font-bold text-[#111111] leading-snug group-hover:text-[#9e7d56] transition-colors line-clamp-2 h-[36px] sm:h-[42px]">
            {product.name}
          </h3>

          <p className="text-[10px] sm:text-xs text-[#8c7e73] font-light mt-1 flex items-center gap-1.5 tracking-tight truncate">
            <span>{product.metal}</span>
            <span className="text-[8px]">•</span>
            <span>{product.purity}</span>
          </p>

          <p className="text-[14px] sm:text-[16px] font-bold text-[#111111] mt-1.5 tracking-tight">
            £{product.price.toFixed(2)}
          </p>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <button
        type="button"
        onClick={handleCart}
        className={`mt-2.5 w-full py-1.5 rounded-full text-[11px] font-light tracking-wide transition-all border ${
          added
            ? 'bg-[#2d7a48] text-white border-[#2d7a48]'
            : 'border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#f5efe8] active:scale-[0.98]'
        }`}
      >
        {added ? '✓ Added' : 'Add to Cart'}
      </button>
    </div>
  );
}

function ProductRow({ products }: { products: DisplayProduct[] }) {
  const rowRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth * 0.75;
      rowRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative w-full group/row my-1">
      {/* Left Navigation Arrow */}
      <button
        type="button"
        onClick={() => handleScroll('left')}
        aria-label="Scroll left"
        className="absolute left-0 sm:left-1 top-[38%] -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#111111] hover:bg-[#9e7d56] active:scale-95 text-white shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none border-2 border-white/90"
      >
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Right Navigation Arrow */}
      <button
        type="button"
        onClick={() => handleScroll('right')}
        aria-label="Scroll right"
        className="absolute right-0 sm:right-1 top-[38%] -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#111111] hover:bg-[#9e7d56] active:scale-95 text-white shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none border-2 border-white/90"
      >
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Scrollable Container */}
      <div
        ref={rowRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-hide px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

export function FeaturedProducts() {
  const { products } = useShop();

  const { row1Products, row2Products } = useMemo(() => {
    if (!products || products.length === 0) {
      return { row1Products: [], row2Products: [] };
    }

    const mapped: DisplayProduct[] = products.map((p: ProductItem) => ({
      id: p.id,
      name: p.name,
      metal: p.metal || p.category || 'Gold',
      purity: p.category === 'Rings' ? '875 (21ct)' : (p.metal || '750 (18k)'),
      price: Number(p.price),
      image: p.image || (p.images && p.images[0]) || '/images/detail-ring-hero.jpg',
      alt: p.name,
      href: `/shop/${p.slug || p.id}`,
    }));

    if (mapped.length <= 1) {
      return { row1Products: mapped, row2Products: [] };
    }

    const mid = Math.ceil(mapped.length / 2);
    return {
      row1Products: mapped.slice(0, mid),
      row2Products: mapped.slice(mid),
    };
  }, [products]);

  return (
    <section className="w-full bg-[#f6efdb] py-7 sm:py-12 lg:py-16">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-7">
          <div>
            <p className="text-[10px] sm:text-xs tracking-[0.24em] uppercase text-[#9e8875] font-medium mb-1">
              JUST LANDED
            </p>
            <h2 className="font-serif text-[24px] sm:text-[32px] lg:text-[36px] text-[#111111] font-normal leading-tight">
              New this week
            </h2>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border border-[#c5ad83] text-[#1c1510] text-xs font-light hover:border-[#8f7448] hover:bg-[#ebdcb9]/30 transition-all shadow-xs group"
          >
            See all
            <svg className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Horizontal Scrollable Rows without duplicates */}
        {row1Products.length === 0 && row2Products.length === 0 ? (
          <div className="bg-[#fdfaf3] rounded-2xl border border-[#e5dabf] p-8 sm:p-12 text-center shadow-2xs">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#f6efdb] border border-[#e5dabf] flex items-center justify-center text-[#9e7d56]">
              <svg className="w-6 h-6 stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <h3 className="font-serif text-lg sm:text-xl text-[#111111] font-normal">No products available currently</h3>
            <p className="text-xs text-[#8c7e73] font-light mt-1 max-w-sm mx-auto">
              Our new luxury collection is launching soon. Stay tuned!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5 sm:gap-8">
            {/* Row 1: Horizontal Scrollable */}
            {row1Products.length > 0 && (
              <div>
                <ProductRow products={row1Products} />
              </div>
            )}

            {/* Row 2: Horizontal Scrollable (Shown when new products are added) */}
            {row2Products.length > 0 && (
              <div>
                <ProductRow products={row2Products} />
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
