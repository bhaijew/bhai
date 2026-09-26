'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';

export default function PaymentPage() {
  const { cart, clearCart } = useShop();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile' | 'bank' | 'cod'>('card');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderPlaced(true);
    clearCart();
  };

  return (
    <main className="w-full bg-[#faf7f2] min-h-screen text-[#1c1510] pt-20 sm:pt-24 pb-20 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">

        {/* ── Breadcrumb & Header (matches screen 4 mockup) ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 sm:mb-8">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1c1510] font-normal leading-tight">
              Payment Method
            </h1>
            <p className="text-xs sm:text-sm text-[#8a796c] font-light mt-1">
              Choose your preferred payment method.
            </p>
          </div>

          <nav className="text-xs text-[#8c7e73] font-light flex items-center gap-1.5 self-start sm:self-auto">
            <Link href="/" className="hover:text-[#1c1510] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/checkout" className="hover:text-[#1c1510] transition-colors">Checkout</Link>
            <span>/</span>
            <span className="text-[#1c1510] font-normal">Payment</span>
          </nav>
        </div>

        {orderPlaced ? (
          <div className="max-w-xl mx-auto bg-white rounded-2xl border border-[#dec29b]/60 p-8 sm:p-12 text-center my-8 shadow-md animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-[#faf4ec] border border-[#dec29b] text-2xl flex items-center justify-center mx-auto mb-4">
              ✓
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1510] font-normal">
              Order Confirmed!
            </h2>
            <p className="text-xs sm:text-sm text-[#736355] font-light mt-2 leading-relaxed">
              Thank you for shopping with <strong>Bhai Jeweller</strong>. Your order <strong>#BJ-{Math.floor(100000 + Math.random() * 900000)}</strong> has been received and is being prepared with master craftsmanship.
            </p>
            <div className="mt-6 p-4 rounded-xl bg-[#faf6ee] text-xs text-[#6b5c50] text-left space-y-1.5">
              <p>• Estimated Delivery: 2-4 Business Days</p>
              <p>• Tracking link sent to your registered email & phone</p>
              <p>• Fully insured Royal Mail / Express Courier Delivery</p>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/shop"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#1c1510] text-[#f5efe8] text-xs font-light hover:bg-[#33261d] transition-all"
              >
                Continue Shopping
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-[#ded3c5] text-[#1c1510] text-xs font-light hover:bg-[#f0e8dc] transition-all"
              >
                Return to Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

            {/* ── Left Column: Payment Options & Card Form (matches screen 4) ── */}
            <div className="lg:col-span-7 flex flex-col gap-6">

              {/* Payment Options Radio Group */}
              <div className="bg-white rounded-2xl border border-[#ede5db] p-5 sm:p-6 shadow-xs">
                <h2 className="text-xs tracking-wider uppercase text-[#8a796c] font-medium mb-4">
                  Payment Options
                </h2>

                <div className="space-y-3">

                  {/* Option 1: Credit / Debit Card */}
                  <label
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[#1c1510] bg-[#faf6f0]'
                        : 'border-[#ede5db] hover:border-[#ded3c5]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === 'card' ? 'border-[#1c1510]' : 'border-[#b5a89c]'
                      }`}>
                        {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-[#1c1510]" />}
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-[#1c1510]">
                        Credit / Debit Card
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-[#8a796c]">
                      <span className="px-2 py-0.5 rounded bg-white border border-[#ded3c5] text-[10px] font-semibold text-[#1a1f71]">VISA</span>
                      <span className="px-2 py-0.5 rounded bg-white border border-[#ded3c5] text-[10px] font-semibold text-[#eb001b]">MC</span>
                    </div>
                  </label>

                  {/* Option 2: Mobile Wallet */}
                  <label
                    onClick={() => setPaymentMethod('mobile')}
                    className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'mobile'
                        ? 'border-[#1c1510] bg-[#faf6f0]'
                        : 'border-[#ede5db] hover:border-[#ded3c5]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === 'mobile' ? 'border-[#1c1510]' : 'border-[#b5a89c]'
                      }`}>
                        {paymentMethod === 'mobile' && <div className="w-2 h-2 rounded-full bg-[#1c1510]" />}
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-[#1c1510]">
                        JazzCash / Easypaisa / Apple Pay
                      </span>
                    </div>
                    <svg className="w-5 h-5 text-[#8c7a6b]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <rect x="5" y="2" width="14" height="20" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                      <line x1="12" y1="18" x2="12.01" y2="18" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </label>

                  {/* Option 3: Bank Transfer */}
                  <label
                    onClick={() => setPaymentMethod('bank')}
                    className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'bank'
                        ? 'border-[#1c1510] bg-[#faf6f0]'
                        : 'border-[#ede5db] hover:border-[#ded3c5]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === 'bank' ? 'border-[#1c1510]' : 'border-[#b5a89c]'
                      }`}>
                        {paymentMethod === 'bank' && <div className="w-2 h-2 rounded-full bg-[#1c1510]" />}
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-[#1c1510]">
                        Direct Bank Wire Transfer
                      </span>
                    </div>
                    <svg className="w-5 h-5 text-[#8c7a6b]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.5H4.5V21h15zM2.25 21h19.5" />
                    </svg>
                  </label>

                  {/* Option 4: Cash on Delivery */}
                  <label
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-[#1c1510] bg-[#faf6f0]'
                        : 'border-[#ede5db] hover:border-[#ded3c5]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        paymentMethod === 'cod' ? 'border-[#1c1510]' : 'border-[#b5a89c]'
                      }`}>
                        {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-[#1c1510]" />}
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-[#1c1510]">
                        Cash on Delivery
                      </span>
                    </div>
                    <svg className="w-5 h-5 text-[#8c7a6b]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <rect x="2" y="6" width="20" height="12" rx="2" />
                      <circle cx="12" cy="12" r="2" />
                      <path d="M6 12h.01M18 12h.01" />
                    </svg>
                  </label>

                </div>
              </div>

              {/* Card Details Form (matches screen 4 mockup) */}
              <div className="bg-white rounded-2xl border border-[#ede5db] p-5 sm:p-6 shadow-xs">
                <h3 className="font-serif text-base sm:text-lg text-[#1c1510] font-normal pb-3 mb-4 border-b border-[#e8ded4]">
                  Card Details
                </h3>

                <form onSubmit={handlePay} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#1c1510] mb-1.5">
                      Card Number <span className="text-[#a83232]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="1234 5678 9101 2456"
                      value={cardData.number}
                      onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] placeholder-[#9a897b] outline-none focus:border-[#1c1510] transition-colors tracking-widest font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#1c1510] mb-1.5">
                      Name on Card <span className="text-[#a83232]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter name as on card"
                      value={cardData.name}
                      onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] placeholder-[#9a897b] outline-none focus:border-[#1c1510] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#1c1510] mb-1.5">
                        Expiry Date <span className="text-[#a83232]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="MM / YY"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] placeholder-[#9a897b] outline-none focus:border-[#1c1510] transition-colors font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#1c1510] mb-1.5">
                        CVV <span className="text-[#a83232]">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        placeholder="123"
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-[#ded3c5] bg-[#fdfbf7] text-xs text-[#1c1510] placeholder-[#9a897b] outline-none focus:border-[#1c1510] transition-colors font-mono"
                      />
                    </div>
                  </div>

                  {/* Pay Now Button */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-full bg-[#1c1510] text-[#f5efe8] font-medium text-xs sm:text-sm tracking-wide hover:bg-[#33261d] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md"
                    >
                      Pay Now • ${total.toLocaleString()}
                    </button>
                    <p className="text-[10.5px] text-[#8a796c] text-center mt-2.5 font-light flex items-center justify-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-[#9e7d56]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                      <span>Your payment information is encrypted and secure</span>
                    </p>
                  </div>
                </form>
              </div>

            </div>

            {/* ── Right Column: Order Summary (matches screen 4) ── */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="bg-white rounded-2xl border border-[#ede5db] p-5 sm:p-6 shadow-xs">
                <h2 className="font-serif text-lg sm:text-xl text-[#1c1510] font-normal pb-4 border-b border-[#e8ded4]">
                  Order Summary
                </h2>

                {/* Mini Item List */}
                <div className="divide-y divide-[#f0e8dc] py-2">
                  {cart.length === 0 ? (
                    <p className="text-xs text-[#8a796c] font-light py-2 italic text-center">Your cart is empty</p>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="py-2 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-[#f5efe7] border border-[#e8ded4] flex-shrink-0">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div>
                            <h4 className="font-serif text-xs font-medium text-[#1c1510] truncate max-w-[170px] sm:max-w-[200px]">
                              {item.name}
                            </h4>
                            <p className="text-[10.5px] text-[#8a796c] font-light">Qty: {item.quantity}</p>
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
              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
