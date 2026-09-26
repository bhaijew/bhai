'use client';

import React, { useState } from 'react';

const announcements = [
  'Free worldwide shipping on all orders over $150  |  Handcrafted with passion in the UK',
  'Complimentary luxury gift packaging on every order  |  Bespoke service',
  'Fine jewellery showroom in Bradford, West Yorkshire  |  Private viewings available',
];

export function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? announcements.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === announcements.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="hidden md:block relative z-50 w-full overflow-hidden bg-[#16120f] border-b border-[#2a221d] text-[#c9bfb5] text-xs tracking-wider transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2.5 flex items-center justify-between">
        {/* Empty left spacer to keep text perfectly centered */}
        <div className="w-12 sm:w-16 hidden sm:block" />

        {/* Center rotating announcement */}
        <div className="flex-1 text-center font-light select-none px-2 transition-all duration-300 min-w-0">
          <span className="truncate block">{announcements[currentIndex]}</span>
        </div>

        {/* Right chevron controls */}
        <div className="flex items-center gap-2 text-[#9e9387] pl-2">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous announcement"
            className="p-1 hover:text-[#f3ede6] transition-colors focus:outline-none"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next announcement"
            className="p-1 hover:text-[#f3ede6] transition-colors focus:outline-none"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
