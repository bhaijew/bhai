'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import ScrollReveal from '@/components/shared/ScrollReveal';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart } = useShop();
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: 'Bradford',
    phone: '',
    saveAddress: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/checkout/payment');
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  return (
    <main className="w-full bg-[#faf7f2] min-h-screen text-[#1c1510] pb-20 md:pb-24">

      {/* ── Top Hero Banner (matches screen 3 desktop mockup) ── */}
      <section className="relative w-full h-[180px] sm:h-[220px] bg-[#120e0b] overflow-hidden flex items-center justify-center text-center">
        <Image
          src="/images/checkout-banner.jpg"
          alt="Secure Checkout"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120e0b] via-[#120e0b]/50 to-[#120e0b]/75" />

        <div className="relative z-10 px-4 max-w-xl">
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#f5efe8] font-normal leading-tight">
            Secure Checkout
          </h1>
          <p className="text-xs sm:text-sm text-[#c8bdb5] font-light mt-1.5">
            Complete your order in just a few steps.
          </p>
        </div>
      </section>

      {/* ── Main Container ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-6">

        {/* Breadcrumb */}
        <ScrollReveal>
          <nav className="text-xs text-[#8c7e73] font-light mb-6 flex items-center gap-1.5">
            <Link href="/" className="hover:text-[#1c1510] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/cart" className="hover:text-[#1c1510] transition-colors">Cart</Link>
            <span>/</span>
            <span className="text-[#1c1510] font-normal">Checkout</span>
          </nav>
        </ScrollReveal>

        {/* ── Stepper Navigation ── */}
        <ScrollReveal delay={50}>
          <div className="flex items-center justify-center gap-3 sm:gap-8 pb-8 max-w-2xl mx-auto text-xs sm:text-sm">
            {/* Step 1: Active */}
            <div className="flex items-center gap-2 text-[#1c1510] font-medium">
              <span className="w-6 h-6 rounded-full bg-[#1c1510] text-[#f5efe8] text-xs flex items-center justify-center font-medium shadow-xs">
                1
              </span>
              <span>Shipping</span>
            </div>

            <div className="w-8 sm:w-16 h-[1px] bg-[#d8cdbf]" />

            {/* Step 2 */}
            <Link href="/checkout/payment" className="flex items-center gap-2 text-[#8a796c] hover:text-[#1c1510] font-light transition-colors">
              <span className="w-6 h-6 rounded-full border border-[#ded3c5] text-xs flex items-center justify-center font-medium">
                2
              </span>
              <span>Payment</span>
            </Link>

            <div className="w-8 sm:w-16 h-[1px] bg-[#d8cdbf]" />

            {/* Step 3 */}
            <div className="flex items-center gap-2 text-[#a89b8d] font-light">
              <span className="w-6 h-6 rounded-full border border-[#ded3c5] text-xs flex items-center justify-center font-medium">
                3
              </span>
              <span className="hidden sm:inline">Review & Place Order</span>
              <span className="sm:hidden">Review</span>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Form & Summary Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* ── Left Column: Shipping Form ── */}
          <div className="lg:col-span-7">
            <ScrollReveal delay={100}>
              <div className="bg-white rounded-[5px] border border-[#ede5db] p-5 sm:p-8 shadow-xs">
                <h2 className="font-serif text-lg sm:text-xl text-[#1c1510] font-normal pb-4 mb-5 border-b border-[#e8ded4]">
                  Shipping Address
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#1c1510] mb-1.5">
                      Full Name <span className="text-[#a83232]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-[5px] border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] placeholder-[#9a897b] outline-none focus:border-[#1c1510] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#1c1510] mb-1.5">
                      Address <span className="text-[#a83232]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Street address, apartment, suite, etc."
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-[5px] border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] placeholder-[#9a897b] outline-none focus:border-[#1c1510] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#1c1510] mb-1.5">
                      City <span className="text-[#a83232]">*</span>
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-[5px] border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] outline-none focus:border-[#1c1510] transition-colors cursor-pointer"
                    >
                      <option value="Bradford">Bradford, UK</option>
                      <option value="Leeds">Leeds, UK</option>
                      <option value="London">London, UK</option>
                      <option value="Manchester">Manchester, UK</option>
                      <option value="Birmingham">Birmingham, UK</option>
                      <option value="Dubai">Dubai, UAE</option>
                      <option value="Karachi">Karachi, PK</option>
                      <option value="Lahore">Lahore, PK</option>
                      <option value="Islamabad">Islamabad, PK</option>
                      <option value="New York">New York, USA</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#1c1510] mb-1.5">
                      Phone Number <span className="text-[#a83232]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+44 700 1234567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-[5px] border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] placeholder-[#9a897b] outline-none focus:border-[#1c1510] transition-colors"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="saveAddress"
                      checked={formData.saveAddress}
                      onChange={(e) => setFormData({ ...formData, saveAddress: e.target.checked })}
                      className="rounded border-[#ded3c5] text-[#1c1510] focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="saveAddress" className="text-xs text-[#6b5c50] font-light cursor-pointer">
                      Save this address for future orders
                    </label>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-[5px] bg-[#1c1510] text-[#f5efe8] font-medium text-xs sm:text-sm tracking-wide hover:bg-[#33261d] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md group"
                    >
                      <span>Continue to Payment</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                </form>
              </div>
            </ScrollReveal>
          </div>

          {/* ── Right Column: Order Summary ── */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <ScrollReveal delay={150}>
              <div className="bg-white rounded-[5px] border border-[#ede5db] p-5 sm:p-6 shadow-xs">
                <h2 className="font-serif text-lg sm:text-xl text-[#1c1510] font-normal pb-4 border-b border-[#e8ded4]">
                  Order Summary
                </h2>

                {/* Mini Item List */}
                <div className="divide-y divide-[#f0e8dc] py-2">
                  {cart.length === 0 ? (
                    <p className="text-xs text-[#8a796c] font-light py-2 italic text-center">Your cart is empty</p>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="py-2.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-[5px] overflow-hidden bg-[#f5efe7] border border-[#e8ded4] flex-shrink-0">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div>
                            <h4 className="font-serif text-xs font-medium text-[#1c1510] truncate max-w-[170px] sm:max-w-[200px]">
                              {item.name}
                            </h4>
                            <p className="text-[10.5px] text-[#8a796c] font-light mt-0.5">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-[#1c1510]">
                          ${(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2.5 py-4 border-t border-[#e8ded4] text-xs font-light text-[#6b5c50]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-[#1c1510]">${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-[#2d7a48] font-medium">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Tax</span>
                    <span className="text-[#1c1510]">${tax.toLocaleString()}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center py-4 border-t border-[#e8ded4]">
                  <span className="text-sm font-medium text-[#1c1510]">Total</span>
                  <span className="font-serif text-xl font-semibold text-[#1c1510]">
                    ${total.toLocaleString()}
                  </span>
                </div>

                {/* Security Shield Card */}
                <div className="mt-4 p-3.5 rounded-[5px] bg-[#faf6ee] border border-[#dec29b]/40 flex items-start gap-3">
                  <svg className="w-4 h-4 text-[#9e7d56] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <div>
                    <h4 className="text-xs font-medium text-[#1c1510]">Your order is safe with us</h4>
                    <p className="text-[10.5px] text-[#736355] font-light mt-0.5 leading-snug">
                      We use industry-standard encryption to protect your payment information.
                    </p>
                  </div>
                </div>

              </div>
            </ScrollReveal>
          </div>

        </div>

      </div>
    </main>
  );
}
