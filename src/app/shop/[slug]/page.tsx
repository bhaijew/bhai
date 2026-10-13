'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { ProductEditModal } from '@/components/shared/ProductEditModal';
import FormattedProductDescription from '@/components/shared/FormattedProductDescription';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = params?.slug as string | undefined;
  const { addToCart, toggleWishlist, isInWishlist, products, deleteProduct } = useShop();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('7');
  const [openAccordion, setOpenAccordion] = useState<string | null>('details');
  const [addedToCart, setAddedToCart] = useState(false);

  // Admin controls state
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user?.role === 'admin') {
          setIsAdmin(true);
        }
      })
      .catch(() => {});
  }, []);


  // Find dynamic product from store
  const currentProduct = useMemo(() => {
    if (!rawSlug) return null;
    return products.find(
      (p) => p.slug === rawSlug || p.id === rawSlug || p.slug === decodeURIComponent(rawSlug)
    ) || null;
  }, [rawSlug, products]);

  // Fallback product details if matching
  const productData = useMemo(() => {
    if (currentProduct) {
      const rawImgs = [
        currentProduct.image,
        ...(Array.isArray(currentProduct.images) ? currentProduct.images : []),
      ].filter(Boolean).map(s => String(s).trim());
      const uniqueImgs = Array.from(new Set(rawImgs));
      const allImgs = uniqueImgs.length > 0 ? uniqueImgs : ['/images/detail-ring-hero.jpg'];

      const resolvedSizes = Array.isArray(currentProduct.sizes) && currentProduct.sizes.length > 0
        ? currentProduct.sizes
        : (currentProduct.size ? [currentProduct.size] : []);

      return {
        id: currentProduct.id,
        name: currentProduct.name,
        category: currentProduct.category || 'Fine Jewellery',
        price: currentProduct.price,
        originalPrice: currentProduct.originalPrice || currentProduct.price,
        metal: currentProduct.metal || '18k Gold',
        weight: currentProduct.weightGrams ? `${currentProduct.weightGrams}g` : '4.5g',
        description: currentProduct.description || `Exquisite handcrafted ${currentProduct.metal || '18k gold'} ${currentProduct.name} designed by master artisans with hallmark certification.`,
        rating: currentProduct.rating || 5,
        reviewCount: currentProduct.reviewCount || 12,
        images: allImgs,
        slug: currentProduct.slug || currentProduct.id,
        sku: currentProduct.sku || `BJ-${currentProduct.id.slice(-4)}`,
        stock: currentProduct.stock ?? 10,
        size: currentProduct.size,
        sizes: resolvedSizes,
      };
    }

    // Default luxury fallback
    return {
      id: rawSlug || 'solara-ring',
      name: rawSlug ? rawSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Solara Diamond Ring',
      category: 'Rings',
      price: 1280,
      originalPrice: 1650,
      metal: '18k Solid Gold',
      weight: '4.2g',
      description: 'A timeless solitaire ring crafted in 18k solid gold with a brilliant-cut diamond. Elegant, classic and made to last forever.',
      rating: 5,
      reviewCount: 12,
      images: [
        '/images/detail-ring-hero.jpg',
        '/images/detail-thumb-1.jpg',
        '/images/detail-thumb-2.jpg',
        '/images/detail-thumb-3.jpg',
        '/images/detail-thumb-4.jpg',
      ],
      slug: rawSlug || 'solara-diamond-ring',
      sku: 'BJ-SLR-1001',
      stock: 10,
      size: '7',
      sizes: ['5', '6', '7', '8', '9'],
    };
  }, [currentProduct, rawSlug]);

  const productGallery = productData.images;

  // Dynamic Sizes based on product data or category
  const sizes = useMemo(() => {
    if (Array.isArray(productData.sizes) && productData.sizes.length > 0) {
      return productData.sizes;
    }
    const cat = (productData.category || '').toLowerCase();
    if (cat.includes('ring')) {
      return ['5', '6', '7', '8', '9'];
    }
    if (cat.includes('necklace') || cat.includes('chain')) {
      return ['16"', '18"', '20"', '22"'];
    }
    if (cat.includes('bangle') || cat.includes('bracelet')) {
      return ['2.4', '2.6', '2.8'];
    }
    return ['Standard'];
  }, [productData.sizes, productData.category]);

  useEffect(() => {
    if (productData.size && sizes.includes(productData.size)) {
      setSelectedSize(productData.size);
    } else if (sizes.length > 0 && (!selectedSize || !sizes.includes(selectedSize))) {
      setSelectedSize(sizes[0]);
    }
  }, [sizes, productData.size]);

  const handleAddToCart = () => {
    addToCart({
      id: productData.id,
      name: productData.name,
      variant: `Size: ${selectedSize}`,
      price: productData.price,
      image: productGallery[0] || '/images/detail-ring-hero.jpg',
      slug: productData.slug,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleToggleWishlist = () => {
    toggleWishlist({
      id: productData.id,
      name: productData.name,
      category: productData.category,
      price: productData.price,
      rating: productData.rating,
      reviewCount: productData.reviewCount,
      image: productGallery[0] || '/images/detail-ring-hero.jpg',
      slug: productData.slug,
    });
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion((prev) => (prev === id ? null : id));
  };

  return (
    <main className="w-full bg-[#faf7f2] min-h-screen text-[#1c1510] pt-20 sm:pt-24 pb-16 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">

        {/* Breadcrumb */}
        <ScrollReveal>
          <nav className="text-xs text-[#8c7e73] font-light mb-4 sm:mb-6 flex items-center gap-1.5">
            <Link href="/" className="hover:text-[#1c1510] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#1c1510] transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-[#1c1510] font-normal truncate">{productData.name}</span>
          </nav>
        </ScrollReveal>

        {/* ── Admin Terminal Controls Toolbar ── */}
        {isAdmin && (
          <div className="mb-6 p-4 rounded-[6px] bg-[#17110c] border border-[#dec29b]/60 text-[#f5efe8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <span className="text-xl p-2 rounded-full bg-[#241a13] border border-[#dec29b]/40">👑</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono uppercase tracking-wider text-[#dec29b]">Admin Product Manager</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-[11px] text-[#b8a798]">
                  Directly edit or delete this item from the live catalog and Supabase database.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="px-4 py-2 rounded-[5px] bg-gradient-to-r from-[#b38b40] to-[#dec29b] text-[#140e0b] font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center gap-1.5"
              >
                <span>✏️</span>
                <span>Edit Product</span>
              </button>
              <button
                type="button"
                onClick={async () => {
                  const targetId = currentProduct?.id || productData.id;
                  if (window.confirm(`Are you sure you want to delete "${productData.name}"?\nThis cannot be undone.`)) {
                    await deleteProduct(targetId);
                    router.push('/shop');
                  }
                }}
                className="px-3.5 py-2 rounded-[5px] bg-red-950/80 border border-red-800 text-red-200 hover:bg-red-900 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <span>🗑️</span>
                <span>Delete</span>
              </button>
              <Link
                href="/admin"
                className="px-3.5 py-2 rounded-[5px] bg-[#241a13] border border-[#dec29b]/40 text-[#dec29b] hover:bg-[#34261c] text-xs font-mono transition-colors"
                title="Go to Admin Panel"
              >
                Admin Panel &rarr;
              </Link>
            </div>
          </div>
        )}


        {/* ── Main Product Detail Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14">

          {/* ── Left Column: Product Gallery ── */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <ScrollReveal delay={50}>
              {/* Main Image Container */}
              <div className="relative w-full aspect-[4/3] sm:aspect-[4/3] rounded-[5px] overflow-hidden bg-[#e8ded4] shadow-xs">
                <Image
                  src={productGallery[activeImageIndex] || productGallery[0] || '/images/detail-ring-hero.jpg'}
                  alt={productData.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover transition-all duration-500"
                />

                {/* Wishlist Button */}
                <button
                  type="button"
                  aria-label="Wishlist"
                  onClick={handleToggleWishlist}
                  className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-xs border border-[#e8ded4] hover:scale-105 transition-all"
                >
                  <svg
                    className={`w-3.5 h-3.5 ${isInWishlist(productData.id) ? 'text-[#c9a87c] fill-current' : 'text-[#8a796c]'}`}
                    fill={isInWishlist(productData.id) ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </button>

                {/* Photo Count Tag */}
                <span className="absolute bottom-3 right-3 text-[10px] text-[#f5efe8] bg-black/60 backdrop-blur-xs px-2.5 py-0.5 rounded-[5px] font-light">
                  {activeImageIndex + 1} / {productGallery.length}
                </span>

                {/* Arrow navigation on image */}
                {productGallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveImageIndex((i) => (i === 0 ? productGallery.length - 1 : i - 1))}
                      aria-label="Previous image"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-xs shadow-xs hover:bg-white"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveImageIndex((i) => (i === productGallery.length - 1 ? 0 : i + 1))}
                      aria-label="Next image"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-xs shadow-xs hover:bg-white"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails Row */}
              {productGallery.length > 1 && (
                <div className="grid grid-cols-5 gap-2 mt-3">
                  {productGallery.map((img, idx) => (
                    <button
                      key={`${img}-${idx}`}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative aspect-square rounded-[5px] overflow-hidden bg-[#e8ded4] border-2 transition-all ${
                        activeImageIndex === idx ? 'border-[#1c1510] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image src={img} alt="Thumbnail" fill loading="lazy" sizes="100px" className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </ScrollReveal>
          </div>

          {/* ── Right Column: Info & Actions ── */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <ScrollReveal delay={100}>
              {/* Category / Metal Tag & Live Showroom Status */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10.5px] font-semibold uppercase tracking-widest text-[#8c6d3d] bg-[#f5efe6] px-2.5 py-0.5 rounded-[4px] border border-[#e6dcce]">
                  {productData.metal || 'Fine Jewellery'} • {productData.category}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50/90 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  In Stock • Bradford Boutique
                </span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-[32px] text-[#1c1510] font-normal leading-tight">
                {productData.name}
              </h1>

              {/* Rating Stars & Reviews */}
              <div className="flex items-center gap-2 mt-2 pb-3 border-b border-[#ebdccb]/60">
                <div className="flex gap-[2px]">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className="w-3.5 h-3.5 text-[#c59d5f]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-[#8a796c] font-light">({productData.reviewCount} verified reviews)</span>
                <span className="text-xs text-[#8a796c] font-light">• SKU: {productData.sku}</span>
              </div>

              {/* Price & Discount Badge */}
              <div className="mt-3.5 flex flex-wrap items-baseline gap-3">
                <span className="font-serif text-3xl sm:text-4xl font-normal text-[#1c1510] tracking-tight">
                  £{Number(productData.price).toLocaleString()}
                </span>
                {productData.originalPrice > productData.price && (
                  <>
                    <span className="text-base text-[#9a897b] line-through font-light">
                      £{Number(productData.originalPrice).toLocaleString()}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-[4px] bg-[#2b2118] text-[#e8dfd5] text-[10.5px] font-semibold uppercase tracking-wider shadow-2xs">
                      Save {Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100)}%
                    </span>
                  </>
                )}
                <span className="w-full text-[11px] text-[#8a796c] block mt-0.5">
                  Price inclusive of UK VAT • Complimentary Worldwide Insured Delivery
                </span>
              </div>

              {/* ── 1. LUXURY SIZE SELECTOR (ABOVE BUTTONS) ── */}
              <div className="mt-5 p-3.5 rounded-[6px] bg-[#f9f6f0] border border-[#e8ded0]">
                <div className="flex items-center justify-between text-xs mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#1c1510]">Select Size:</span>
                    <span className="text-[11px] font-bold text-[#8c6d3d] bg-white px-2.5 py-0.5 rounded-[4px] border border-[#dec29b]/60 shadow-2xs">
                      {selectedSize || sizes[0]}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleAccordion('sizeGuide')}
                    className="text-[#8c6d3d] hover:text-[#1c1510] text-[11px] font-medium tracking-wide underline underline-offset-2 transition-colors flex items-center gap-1"
                  >
                    <span>📏</span>
                    <span>Size Guide</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-[44px] h-10 px-3.5 rounded-[6px] text-xs transition-all flex items-center justify-center ${
                        selectedSize === s
                          ? 'bg-[#1c1510] text-[#faf7f2] font-bold shadow-sm ring-1 ring-[#c59d5f]'
                          : 'bg-white text-[#4a3b2f] border border-[#d8c8b8] hover:border-[#1c1510] hover:bg-[#fbf9f6]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── 2. ACTION BUTTONS: ADD TO BAG & BUY NOW ── */}
              <div className="flex flex-col gap-2.5 mt-4">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full py-3.5 rounded-[6px] bg-[#17120e] text-[#f7f2ea] hover:bg-[#2c2017] active:scale-[0.99] font-semibold text-xs sm:text-[13px] tracking-widest uppercase transition-all shadow-md flex items-center justify-center gap-2.5 border border-[#3b2d22]/40"
                >
                  <svg className="w-4 h-4 text-[#dec29b] stroke-[1.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.669 0-1.189-.578-1.119-1.243l1.263-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z" />
                  </svg>
                  <span>{addedToCart ? '✓ Added to Bag!' : 'Add to Bag'}</span>
                </button>

                <Link
                  href="/checkout"
                  onClick={handleAddToCart}
                  className="w-full py-3.5 rounded-[6px] bg-gradient-to-r from-[#dec29b] to-[#c59d5f] hover:brightness-105 active:scale-[0.99] text-[#140e0a] font-bold text-xs sm:text-[13px] tracking-widest uppercase transition-all shadow-sm text-center border border-[#b88e4d]/40"
                >
                  Buy Now
                </Link>

                {/* Luxury Guarantee Footnote */}
                <p className="text-center text-[10.5px] text-[#8a796c] tracking-wide mt-0.5">
                  🔒 100% Secure Checkout • 14-Day Hassle-Free Returns • Dispatched within 24 Hours
                </p>
              </div>

              {/* ── 3. TRUST ASSURANCE BADGES ── */}
              <div className="grid grid-cols-3 gap-2 py-3.5 my-5 border-y border-[#e8ded4] text-center bg-[#faf7f2]/80">
                <div className="flex flex-col items-center">
                  <svg className="w-4 h-4 text-[#9e7d56] mb-1" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12l4 6-10 12L2 9l4-6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 9h20M7 3l5 18 5-18" />
                  </svg>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-[#1c1510] mt-0.5">{productData.metal}</span>
                  <span className="text-[9px] text-[#8a796c] font-light">UK Hallmarked</span>
                </div>
                <div className="flex flex-col items-center">
                  <svg className="w-4 h-4 text-[#9e7d56] mb-1" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-[#1c1510] mt-0.5">Certified Purity</span>
                  <span className="text-[9px] text-[#8a796c] font-light">Authenticity Assured</span>
                </div>
                <div className="flex flex-col items-center">
                  <svg className="w-4 h-4 text-[#9e7d56] mb-1" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-[#1c1510] mt-0.5">Complimentary</span>
                  <span className="text-[9px] text-[#8a796c] font-light">Insured Shipping</span>
                </div>
              </div>

              {/* ── 4. DETAILED DESCRIPTION & SPECIFICATIONS (COMES AFTER BUTTONS & BADGES) ── */}
              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#dec29b]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#1c1510] font-mono">
                    Craftsmanship &amp; Story
                  </h3>
                </div>
                <FormattedProductDescription
                  description={productData.description}
                  productName={productData.name}
                />
              </div>

              {/* ── 5. PRODUCT ACCORDIONS (AUTHENTICITY, PACKAGING & CARE) ── */}
              <div className="mt-6 divide-y divide-[#e8ded4] border-y border-[#e8ded4]">
                {/* Material & Hallmark Authenticity */}
                <div className="py-3.5">
                  <button
                    type="button"
                    onClick={() => toggleAccordion('material')}
                    className="w-full flex items-center justify-between text-left text-xs font-semibold text-[#1c1510]"
                  >
                    <span>Material &amp; Hallmark Authenticity</span>
                    <span className="text-sm font-light text-[#8a796c]">{openAccordion === 'material' ? '−' : '+'}</span>
                  </button>
                  {openAccordion === 'material' && (
                    <div className="mt-2.5 text-xs text-[#5a483a] font-light leading-relaxed animate-fadeIn space-y-1.5">
                      <p>• <strong>Metal:</strong> {productData.metal || '9ct / 18ct / 22ct Solid Gold'}</p>
                      <p>• <strong>Weight:</strong> {productData.weight || 'Standard'}</p>
                      <p>• <strong>Category:</strong> {productData.category}</p>
                      <p>• <strong>Available Sizes:</strong> {sizes.join(', ')}</p>
                      <p>• <strong>Hallmark Certification:</strong> Independently tested &amp; verified by British Assay Offices.</p>
                    </div>
                  )}
                </div>

                {/* Packaging & Delivery */}
                <div className="py-3.5">
                  <button
                    type="button"
                    onClick={() => toggleAccordion('shipping')}
                    className="w-full flex items-center justify-between text-left text-xs font-semibold text-[#1c1510]"
                  >
                    <span>Complimentary Packaging &amp; Delivery</span>
                    <span className="text-sm font-light text-[#8a796c]">{openAccordion === 'shipping' ? '−' : '+'}</span>
                  </button>
                  {openAccordion === 'shipping' && (
                    <div className="mt-2.5 text-xs text-[#5a483a] font-light leading-relaxed animate-fadeIn space-y-1.5">
                      <p>• <strong>Complimentary Presentation:</strong> Delivered in Bhai Jeweller signature velvet box with protective sleeve.</p>
                      <p>• <strong>Delivery:</strong> Fully insured Royal Mail Special Delivery (tracked &amp; signed).</p>
                      <p>• <strong>Returns:</strong> 14-day hassle-free return or exchange guarantee.</p>
                      <p>• <strong>Showroom Pickup:</strong> Free collection available at our Bradford boutique showroom.</p>
                    </div>
                  )}
                </div>

                {/* Jewellery Care Guide */}
                <div className="py-3.5">
                  <button
                    type="button"
                    onClick={() => toggleAccordion('care')}
                    className="w-full flex items-center justify-between text-left text-xs font-semibold text-[#1c1510]"
                  >
                    <span>Jewellery Care &amp; Longevity</span>
                    <span className="text-sm font-light text-[#8a796c]">{openAccordion === 'care' ? '−' : '+'}</span>
                  </button>
                  {openAccordion === 'care' && (
                    <div className="mt-2.5 text-xs text-[#5a483a] font-light leading-relaxed animate-fadeIn space-y-1.5">
                      <p>• Store in your provided velvet pouch away from moisture and direct sunlight.</p>
                      <p>• Clean gently with warm water, mild soap, and a soft microfiber cloth.</p>
                      <p>• Complimentary lifetime cleaning &amp; inspection available at Bhai Jeweller Bradford.</p>
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>

        {/* ── "You May Also Like" ── */}
        <ScrollReveal delay={150}>
          <div className="mt-12 pt-8 border-t border-[#e8ded4]">
            <h2 className="font-serif text-xl sm:text-2xl text-[#1c1510] font-normal mb-5">
              You May Also Like
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
              {products.filter(p => p.id !== productData.id).slice(0, 4).map((item) => (
                <Link
                  key={item.id}
                  href={`/shop/${item.slug || item.id}`}
                  className="group flex flex-col bg-white rounded-[5px] overflow-hidden border border-[#ede5db] p-2.5 hover:shadow-md transition-all"
                >
                  <div className="relative aspect-square rounded-[5px] overflow-hidden bg-[#f5efe7]">
                    <Image
                      src={item.image || (item.images && item.images[0]) || '/images/shop-prod-2.jpg'}
                      alt={item.name}
                      fill
                      loading="lazy"
                      sizes="200px"
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="font-serif text-xs sm:text-sm font-medium text-[#1c1510] mt-2 group-hover:text-[#9e7d56] transition-colors truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#1c1510] mt-0.5">£{Number(item.price).toFixed(2)}</p>
                </Link>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* ── "Beautifully Gifted" Section ── */}
        <ScrollReveal delay={200}>
          <div className="mt-8 rounded-[5px] bg-[#faf6ee] border border-[#e8ded4] p-4 sm:p-6 flex items-center justify-between gap-4">
            <div className="relative w-20 h-20 sm:w-28 sm:h-24 rounded-[5px] overflow-hidden flex-shrink-0 bg-[#e8ded4]">
              <Image src="/images/detail-gift-box.jpg" alt="Gift Packaging" fill className="object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-sm sm:text-base font-medium text-[#1c1510]">Beautifully Gifted</h3>
              <p className="text-[11px] sm:text-xs text-[#736355] font-light mt-0.5">Make it special with our premium gift packaging.</p>
              <button
                type="button"
                className="mt-2.5 px-3 py-1.5 rounded-[5px] border border-[#1c1510] text-[11px] font-medium text-[#1c1510] hover:bg-[#1c1510] hover:text-white transition-colors"
              >
                Complimentary Gift Box Included
              </button>
            </div>
          </div>
        </ScrollReveal>

      </div>

      {/* Admin Product Edit Modal */}
      {currentProduct && (
        <ProductEditModal
          product={currentProduct}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onDeleted={() => router.push('/shop')}
        />
      )}
    </main>
  );
}

