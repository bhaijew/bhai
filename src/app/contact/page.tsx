'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
    }
  };

  return (
    <main className="w-full bg-[#faf7f2] min-h-screen text-[#1c1510] pb-0">

      {/* ── Top Hero Banner ── */}
      <section className="relative w-full h-[200px] sm:h-[240px] md:h-[280px] bg-[#120e0b] overflow-hidden flex items-center justify-center text-center">
        <Image
          src="/images/category-necklaces.jpg"
          alt="Contact Us"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-90 hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120e0b]/85 via-[#120e0b]/40 to-[#120e0b]/55" />

        <div className="relative z-10 px-4 max-w-xl">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#f5efe8] font-normal leading-tight drop-shadow-md">
            Contact Us
          </h1>
          <p className="text-xs sm:text-sm text-[#e8ded4] font-light mt-2 drop-shadow-xs">
            We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* ── Main Content Container ── */}
      <div className="max-w-4xl mx-auto px-2.5 sm:px-5 pt-4 pb-2 sm:pt-6 sm:pb-4">

        {/* Breadcrumb */}
        <nav className="text-xs text-[#8c7e73] font-light mb-5 flex items-center gap-1.5">
          <Link href="/" className="hover:text-[#1c1510] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#1c1510] font-normal">Contact</span>
        </nav>

        {/* ── Section: Get in Touch (matches screen 5) ── */}
        <section className="mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1510] font-normal mb-2">
            Get in Touch
          </h2>
          <p className="text-xs sm:text-sm text-[#6b5c50] font-light leading-relaxed mb-6">
            Have a question, need assistance or want to learn more about our 21ct gold collections? Our team is here to help.
          </p>

          {/* 3 Contact Cards (Sitting directly on background) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">

            {/* Visit Store */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#f0e6d8] border border-[#e2d6c8] flex items-center justify-center flex-shrink-0 text-[#9e7d56]">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-sm sm:text-base font-medium text-[#1c1510]">Visit Our Showroom</h3>
                <p className="text-xs text-[#6b5c50] font-light mt-0.5 leading-relaxed">
                  Bradford, West Yorkshire, United Kingdom
                </p>
              </div>
            </div>

            {/* Call Us */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#f0e6d8] border border-[#e2d6c8] flex items-center justify-center flex-shrink-0 text-[#9e7d56]">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-sm sm:text-base font-medium text-[#1c1510]">Call Us</h3>
                <p className="text-xs text-[#6b5c50] font-light mt-0.5 leading-relaxed">
                  +44 1274 000 000
                </p>
                <p className="text-[10.5px] text-[#9a897b] font-light">Mon – Sat, 10:00 – 18:00</p>
              </div>
            </div>

            {/* Email Us */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#f0e6d8] border border-[#e2d6c8] flex items-center justify-center flex-shrink-0 text-[#9e7d56]">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-sm sm:text-base font-medium text-[#1c1510]">Email Us</h3>
                <p className="text-xs text-[#6b5c50] font-light mt-0.5 leading-relaxed">
                  info@bhaijeweller.co.uk
                </p>
                <p className="text-[10.5px] text-[#9a897b] font-light">We reply within 24 hours</p>
              </div>
            </div>

          </div>
        </section>

        {/* ── Section: Send Us a Message (Sitting directly on background) ── */}
        <section className="mb-12">
          <h3 className="font-serif text-xl sm:text-2xl text-[#1c1510] font-normal mb-5">
            Send Us a Message
          </h3>

          {submitted ? (
            <div className="p-6 rounded-xl bg-[#f6efe7] border border-[#dec29b]/50 text-center animate-fadeIn">
              <p className="font-serif text-xl text-[#1c1510]">Thank you for reaching out!</p>
              <p className="text-xs text-[#6b5c50] font-light mt-1">
                Your message has been received. Our concierge team will contact you shortly.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-4 px-5 py-2 rounded-full border border-[#1c1510] text-xs font-light hover:bg-[#1c1510] hover:text-[#f5efe8] transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#1c1510] mb-1.5">
                  Full Name <span className="text-[#a83232]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e2d6c8] bg-white text-xs text-[#1c1510] placeholder-[#9a897b] outline-none focus:border-[#1c1510] transition-colors shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1c1510] mb-1.5">
                  Email Address <span className="text-[#a83232]">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e2d6c8] bg-white text-xs text-[#1c1510] placeholder-[#9a897b] outline-none focus:border-[#1c1510] transition-colors shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1c1510] mb-1.5">
                  Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e2d6c8] bg-white text-xs text-[#1c1510] outline-none focus:border-[#1c1510] transition-colors cursor-pointer shadow-2xs"
                >
                  <option value="general">General Enquiry</option>
                  <option value="bespoke">Bespoke Ring Consultation</option>
                  <option value="order">Order Tracking & Sizing</option>
                  <option value="wholesale">Private Showroom Appointment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1c1510] mb-1.5">
                  Message <span className="text-[#a83232]">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we assist you today?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e2d6c8] bg-white text-xs text-[#1c1510] placeholder-[#9a897b] outline-none focus:border-[#1c1510] transition-colors resize-none shadow-2xs"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#1c1510] text-[#f5efe8] font-medium text-xs sm:text-sm tracking-wide hover:bg-[#33261d] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Send Message</span>
                <span>→</span>
              </button>
            </form>
          )}
        </section>

        {/* ── Interactive Map / Direction Card (matches bottom of screen 5) ── */}
        <section className="relative rounded-[5px] overflow-hidden border border-[#ede5db] bg-white shadow-xs">
          <div className="relative w-full h-48 sm:h-64 bg-[#e8ded4]">
            <Image
              src="/images/contact-map.jpg"
              alt="Bradford Showroom Location"
              fill
              className="object-cover"
            />
            {/* Map Pin Marker Overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1c1510] text-[#f5efe8] px-3 py-1.5 rounded-xl shadow-lg border border-[#dec29b]/40 flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-[#dec29b]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <span className="text-xs font-serif">Bhai Jeweller Bradford</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 flex items-center justify-between bg-white border-t border-[#ede5db]">
            <div>
              <h4 className="font-serif text-sm font-medium text-[#1c1510]">Bhai Jeweller Bradford</h4>
              <p className="text-[11px] text-[#6b5c50] font-light">West Yorkshire, United Kingdom</p>
            </div>

            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#1c1510] text-[#1c1510] text-xs font-light hover:bg-[#1c1510] hover:text-[#f5efe8] transition-all"
            >
              <span>Get Directions</span>
              <span>→</span>
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}
