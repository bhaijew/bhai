'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import ScrollReveal from '@/components/shared/ScrollReveal';

export default function CartPage() {
  const { cart, updateCartQuantity, removeFromCart } = useShop();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const tax = Math.round((subtotal - discount) * 0.1);
  const total = subtotal - discount + tax;

  return (
    <main className="w-full bg-[#faf7f2] min-h-screen text-[#1c1510] pt-20 sm:pt-24 pb-20 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">

        {/* ── Breadcrumb & Header ── */}
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 sm:mb-8">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1c1510] font-normal leading-tight">
                Your Cart {cart.length > 0 && <span className="text-lg sm:text-2xl text-[#8a796c]">({cart.length})</span>}
              </h1>
              <p className="text-xs sm:text-sm text-[#8a796c] font-light mt-1">
                Review your items before checkout
              </p>
            </div>

            <nav className="text-xs text-[#8c7e73] font-light flex items-center gap-1.5 self-start sm:self-auto">
              <Link href="/" className="hover:text-[#1c1510] transition-colors">Home</Link>
              <span>/</span>
              <span className="text-[#1c1510] font-normal">Cart</span>
            </nav>
          </div>
        </ScrollReveal>

        {cart.length === 0 ? (
          <ScrollReveal delay={100}>
            <div className="bg-white rounded-[5px] border border-[#ede5db] p-12 text-center my-8 shadow-xs">
              <div className="w-14 h-14 mx-auto mb-3.5 rounded-[5px] bg-[#faf6f0] border border-[#ede5db] flex items-center justify-center text-[#9e7d56]">
                <svg className="w-7 h-7 stroke-[1.4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.669 0-1.189-.578-1.119-1.243l1.263-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z" />
                </svg>
              </div>
              <h2 className="font-serif text-xl text-[#1c1510]">Your shopping bag is empty</h2>
              <p className="text-xs text-[#7d6f63] font-light mt-1.5 mb-6">Explore our curated collections and discover timeless luxury.</p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-[5px] bg-[#1c1510] text-[#f5efe8] text-xs font-light hover:bg-[#33261d] transition-all"
              >
                Start Shopping →
              </Link>
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

            {/* ── Left Column: Items List ── */}
            <div className="lg:col-span-8 flex flex-col gap-4">

              {/* Desktop Table Header */}
              <div className="hidden md:grid grid-cols-12 pb-3 border-b border-[#e8ded4] text-xs text-[#8a796c] font-light uppercase tracking-wider">
                <span className="col-span-6">Product</span>
                <span className="col-span-2 text-center">Price</span>
                <span className="col-span-2 text-center">Quantity</span>
                <span className="col-span-2 text-right pr-2">Total</span>
              </div>

              {/* Cart Items */}
              <div className="space-y-3 sm:space-y-4">
                {cart.map((item, index) => (
                  <ScrollReveal key={item.id} delay={index * 50}>
                    <div className="group bg-white rounded-[5px] border border-[#ede5db] p-3.5 sm:p-4 hover:border-[#dec29b]/80 transition-all duration-300 shadow-xs flex flex-col md:grid md:grid-cols-12 items-center gap-4">
                      {/* Product Info (Col 1-6) */}
                      <div className="col-span-6 w-full flex items-center gap-3 sm:gap-4">
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-[5px] overflow-hidden bg-[#f5efe7] flex-shrink-0 border border-[#e8ded4]">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="100px"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link href={`/shop/${item.id}`} className="hover:text-[#9e7d56] transition-colors">
                            <h3 className="font-serif text-sm sm:text-base font-normal text-[#1c1510] truncate">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-[11px] text-[#8a796c] font-light mt-0.5">{item.variant}</p>
                          <p className="md:hidden text-xs font-semibold text-[#1c1510] mt-1">
                            £{item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Price (Col 7-8) - Desktop */}
                      <div className="hidden md:block col-span-2 text-center text-sm font-light text-[#1c1510]">
                        £{item.price.toLocaleString()}
                      </div>

                      {/* Quantity Stepper (Col 9-10) */}
                      <div className="col-span-2 w-full md:w-auto flex items-center justify-between md:justify-center">
                        <div className="flex items-center rounded-[5px] border border-[#ded3c5] bg-[#fdfbf7] overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="w-7 h-7 flex items-center justify-center text-xs text-[#6b5c50] hover:bg-[#ede5db] active:scale-95 transition-all"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-xs font-medium text-[#1c1510]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="w-7 h-7 flex items-center justify-center text-xs text-[#6b5c50] hover:bg-[#ede5db] active:scale-95 transition-all"
                          >
                            +
                          </button>
                        </div>

                        {/* Mobile Total & Remove */}
                        <div className="md:hidden flex items-center gap-3">
                          <span className="text-xs font-semibold text-[#1c1510]">
                            £{(item.price * item.quantity).toLocaleString()}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            aria-label="Remove item"
                            className="w-7 h-7 rounded-[5px] flex items-center justify-center text-xs text-[#9a897b] hover:text-[#a83232] hover:bg-[#f6efe7] transition-all"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      {/* Desktop Total & Delete (Col 11-12) */}
                      <div className="hidden md:flex col-span-2 items-center justify-end gap-3 text-right">
                        <span className="text-sm font-semibold text-[#1c1510]">
                          £{(item.price * item.quantity).toLocaleString()}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Remove item"
                          className="w-7 h-7 rounded-[5px] flex items-center justify-center text-xs text-[#9a897b] hover:text-[#a83232] hover:bg-[#f6efe7] transition-all"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              {/* Continue Shopping Link */}
              <div className="pt-3">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1.5 text-xs text-[#6b5c50] hover:text-[#1c1510] font-light transition-colors"
                >
                  <span>←</span>
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>

            {/* ── Right Column: Order Summary Card ── */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              <ScrollReveal delay={150}>
                <div className="bg-white rounded-[5px] border border-[#ede5db] p-5 sm:p-6 shadow-xs">
                  <h2 className="font-serif text-lg sm:text-xl text-[#1c1510] font-normal pb-4 border-b border-[#e8ded4]">
                    Order Summary
                  </h2>

                  <div className="space-y-3 py-4 text-xs font-light text-[#6b5c50] border-b border-[#e8ded4]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-medium text-[#1c1510]">£{subtotal.toLocaleString()}</span>
                    </div>

                    {promoApplied && (
                      <div className="flex justify-between text-[#2d7a48]">
                        <span>Promo Discount (10%)</span>
                        <span>-£{discount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-[#2d7a48] font-medium">Free</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Estimated Tax</span>
                      <span className="text-[#1c1510]">£{tax.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-4 border-b border-[#e8ded4]">
                    <span className="text-sm font-medium text-[#1c1510]">Total</span>
                    <span className="font-serif text-xl sm:text-2xl font-semibold text-[#1c1510]">
                      £{total.toLocaleString()}
                    </span>
                  </div>

                  {/* Checkout CTA Button */}
                  <Link
                    href="/checkout"
                    className="w-full mt-5 py-3.5 rounded-[5px] bg-[#1c1510] text-[#f5efe8] font-medium text-xs sm:text-sm tracking-wide hover:bg-[#33261d] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md group"
                  >
                    <span>Proceed to Checkout</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>

                  {/* Promo Code Input */}
                  <div className="mt-5 pt-4 border-t border-[#f0e8dc]">
                    <label className="block text-[11px] text-[#736355] font-light mb-1.5">
                      Have a promo code?
                    </label>
                    <div className="flex items-center rounded-[5px] border border-[#e2d6c8] bg-[#fbf9f6] overflow-hidden">
                      <input
                        type="text"
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs text-[#1c1510] placeholder-[#9a897b] bg-transparent outline-none font-light min-w-0"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (promoCode.trim().length > 0) setPromoApplied(true);
                        }}
                        className="px-3.5 py-2 bg-[#f0e8dc] text-[#1c1510] text-xs font-medium hover:bg-[#e2d6c8] transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {promoApplied && (
                      <p className="text-[10.5px] text-[#2d7a48] mt-1">✓ Promo code applied successfully!</p>
                    )}
                  </div>

                  {/* 3 Trust Features */}
                  <div className="mt-5 pt-4 border-t border-[#f0e8dc] space-y-2 text-[11px] text-[#7d6e62] font-light">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#9e7d56] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                      </svg>
                      <span><strong>Free Shipping:</strong> On all orders over £150</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#9e7d56] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                      <span><strong>Secure Payment:</strong> 100% protected transactions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#9e7d56] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                      <span><strong>Easy Returns:</strong> Within 7 days hassle-free</span>
                    </div>
                  </div>

                </div>
              </ScrollReveal>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
