'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const defaultAnnouncements = [
  { text: 'Free Insured Worldwide Delivery on Orders Over £150', tag: 'SHIPPING' },
  { text: 'Handcrafted in Bradford, UK — Certified 21ct & 18k British Hallmarked Gold', tag: 'HERITAGE' },
  { text: 'Complimentary Luxury Velvet Gift Packaging with Every Order', tag: 'BESPOKE' },
  { text: 'Private Showroom Viewings Available in Bradford, West Yorkshire', tag: 'VISIT US' },
];

export function AnnouncementBar() {
  const [messages, setMessages] = useState(defaultAnnouncements);
  const [isEnabled, setIsEnabled] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch('/api/announcement')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data) {
          setIsEnabled(resData.data.isEnabled ?? true);
          if (Array.isArray(resData.data.messages) && resData.data.messages.length > 0) {
            const formatted = resData.data.messages.map((m: string, idx: number) => ({
              text: m,
              tag: idx === 0 ? 'SPECIAL OFFER' : idx === 1 ? 'HERITAGE' : 'FEATURED',
            }));
            setMessages(formatted);
          }
        }
      })
      .catch((err) => console.error('Failed to fetch announcement bar config:', err));
  }, []);

  // Auto-rotation timer every 4.5s
  useEffect(() => {
    if (!isEnabled || isPaused || messages.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isEnabled, isPaused, messages.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? messages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % messages.length);
  };

  if (!isEnabled || dismissed || messages.length === 0) return null;

  const currentMsg = messages[currentIndex] || messages[0];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="hidden md:block relative z-50 w-full overflow-hidden bg-gradient-to-r from-[#140e0b] via-[#1c140f] to-[#140e0b] border-b border-[#2e231b] text-[#d6c7ba] text-[11px] sm:text-xs tracking-wider transition-colors duration-300 select-none shadow-xs"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-8 py-2 flex items-center justify-between gap-3">

        {/* Left: Showroom / Trust Badge (Desktop) */}
        <div className="hidden lg:flex items-center gap-2 text-[#a8998a] text-[10.5px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d8bb93] animate-ping" />
          <span className="font-light tracking-widest text-[#dec29b]">Bradford Showroom</span>
          <span className="text-[#5e4f42]">•</span>
          <span className="font-light">Open Today</span>
        </div>

        {/* Center: Animated Rotating Announcement Slide */}
        <div className="flex-1 flex items-center justify-center gap-2 text-center font-light px-2 min-w-0">
          {/* Badge Tag */}
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-[4px] bg-[#dec29b]/15 text-[#dec29b] border border-[#dec29b]/30 text-[9.5px] font-semibold tracking-widest uppercase flex-shrink-0 animate-fadeIn">
            {currentMsg.tag}
          </span>

          <span
            key={currentIndex}
            className="truncate text-[#f0e8df] font-normal transition-all duration-500 animate-slideUpFade"
          >
            {currentMsg.text}
          </span>
        </div>

        {/* Right: Chevron Nav + Dismiss Button */}
        <div className="flex items-center gap-2 text-[#a8998a] flex-shrink-0">
          {messages.length > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous announcement"
                className="w-11 h-11 rounded-full hover:bg-white/10 flex items-center justify-center text-[#c2b2a3] hover:text-[#f8f5f0] transition-colors"
              >
                ‹
              </button>

              <span className="text-[9.5px] text-[#786757] font-mono">
                {currentIndex + 1}/{messages.length}
              </span>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next announcement"
                className="w-11 h-11 rounded-full hover:bg-white/10 flex items-center justify-center text-[#c2b2a3] hover:text-[#f8f5f0] transition-colors"
              >
                ›
              </button>
            </div>
          )}

          {/* Dismiss Button */}
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss announcement"
            className="w-11 h-11 flex items-center justify-center rounded-full text-[#786757] hover:text-[#dec29b] text-xs transition-colors ml-1"
          >
            ✕
          </button>
        </div>

      </div>
    </div>
  );
}
