'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';

interface Product {
  id: string;
  name: string;
  metal: string;
  purity: string;
  price: number;
  image: string;
  alt: string;
  href: string;
}

const row1Products: Product[] = [
  {
    id: 'ring-textured-star',
    name: '21ct Gold Textured Star Ring',
    metal: 'Yellow Gold',
    purity: '875 (21ct)',
    price: 244.22,
    image: '/images/ring-star.jpg',
    alt: '21ct Gold Textured Star Ring',
    href: '/shop',
  },
  {
    id: 'ring-double-chain',
    name: '21ct Gold Double Chain Sparkle Ring',
    metal: 'Yellow Gold',
    purity: '875 (21ct)',
    price: 332.56,
    image: '/images/ring-double-chain.jpg',
    alt: '21ct Gold Double Chain Sparkle Ring',
    href: '/shop',
  },
  {
    id: 'ring-triple-band',
    name: '21ct Gold Triple Band Sparkle Ring',
    metal: 'Yellow Gold',
    purity: '875 (21ct)',
    price: 349.00,
    image: '/images/category-rings.jpg',
    alt: '21ct Gold Triple Band Sparkle Ring',
    href: '/shop',
  },
  {
    id: 'ring-beaded-cut',
    name: '21ct Gold Beaded Diamond Cut Ring',
    metal: 'Yellow Gold',
    purity: '875 (21ct)',
    price: 289.50,
    image: '/images/featured-ring.jpg',
    alt: '21ct Gold Beaded Diamond Cut Ring',
    href: '/shop',
  },
  {
    id: 'ring-crown-solitaire',
    name: '21ct Gold Crown Solitaire Ring',
    metal: 'Yellow Gold',
    purity: '875 (21ct)',
    price: 315.00,
    image: '/images/ring-star.jpg',
    alt: '21ct Gold Crown Solitaire Ring',
    href: '/shop',
  },
  {
    id: 'ring-luxe-chain',
    name: '21ct Gold Luxe Chain Ring',
    metal: 'Yellow Gold',
    purity: '875 (21ct)',
    price: 343.21,
    image: '/images/shop-prod-1.jpg',
    alt: '21ct Gold Luxe Chain Ring',
    href: '/shop',
  },
  {
    id: 'ring-crossover-sparkle',
    name: '21ct Gold Elegant Crossover Ring',
    metal: 'Yellow Gold',
    purity: '875 (21ct)',
    price: 340.61,
    image: '/images/shop-prod-2.jpg',
    alt: '21ct Gold Elegant Crossover Ring',
    href: '/shop',
  },
];

const row2Products: Product[] = [
  {
    id: 'necklace-lumiere',
    name: '21ct Gold Lumière Teardrop Pendant',
    metal: 'Yellow Gold',
    purity: '875 (21ct)',
    price: 420.00,
    image: '/images/category-necklaces.jpg',
    alt: '21ct Gold Lumière Teardrop Pendant',
    href: '/shop',
  },
  {
    id: 'bracelet-eclat',
    name: '21ct Gold Éclat Diamond Cut Bracelet',
    metal: 'Yellow Gold',
    purity: '875 (21ct)',
    price: 390.00,
    image: '/images/category-bracelets.jpg',
    alt: '21ct Gold Éclat Diamond Cut Bracelet',
    href: '/shop',
  },
  {
    id: 'earrings-velora',
    name: '21ct Gold Velora Drop Earrings',
    metal: 'Yellow Gold',
    purity: '875 (21ct)',
    price: 360.00,
    image: '/images/category-earrings.jpg',
    alt: '21ct Gold Velora Drop Earrings',
    href: '/shop',
  },
  {
    id: 'necklace-heritage',
    name: '21ct Gold Heritage Rope Chain',
    metal: 'Yellow Gold',
    purity: '875 (21ct)',
    price: 580.00,
    image: '/images/category-necklaces.jpg',
    alt: '21ct Gold Heritage Rope Chain',
    href: '/shop',
  },
  {
    id: 'bracelet-filigree',
    name: '21ct Gold Filigree Floral Bangle',
    metal: 'Yellow Gold',
    purity: '875 (21ct)',
    price: 610.00,
    image: '/images/category-bracelets.jpg',
    alt: '21ct Gold Filigree Floral Bangle',
    href: '/shop',
  },
  {
    id: 'necklace-royal-drop',
    name: '21ct Gold Royal Diamond Drop Necklace',
    metal: 'Yellow Gold',
    purity: '875 (21ct)',
    price: 495.00,
    image: '/images/shop-prod-3.jpg',
    alt: '21ct Gold Royal Diamond Drop Necklace',
    href: '/shop',
  },
  {
    id: 'earrings-starlight',
    name: '21ct Gold Starlight Chandelier Earrings',
    metal: 'Yellow Gold',
    purity: '875 (21ct)',
    price: 525.00,
    image: '/images/shop-prod-4.jpg',
    alt: '21ct Gold Starlight Chandelier Earrings',
    href: '/shop',
  },
];

function ProductCard({ product }: { product: Product }) {
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
      slug: 'solara-diamond-ring',
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

function ProductRow({ products }: { products: Product[] }) {
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
            className="inline-flex items-center justify-center px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border border-[#c5ad83] text-[#1c1510] text-xs font-light hover:border-[#8f7448] hover:bg-[#ebdcb9]/30 transition-all shadow-xs"
          >
            See all
          </Link>
        </div>

        {/* Two Horizontal Scrollable Rows */}
        <div className="flex flex-col gap-5 sm:gap-8">
          {/* Row 1: Horizontal Scrollable */}
          <div>
            <ProductRow products={row1Products} />
          </div>

          {/* Row 2: Horizontal Scrollable */}
          <div>
            <ProductRow products={row2Products} />
          </div>
        </div>

      </div>
    </section>
  );
}
