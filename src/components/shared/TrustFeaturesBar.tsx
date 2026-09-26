import React from 'react';

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

export function TrustFeaturesBar() {
  const features: FeatureItem[] = [
    {
      title: '100% Authentic',
      subtitle: 'Certified quality',
      icon: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.3] text-[#2b2018] group-hover:text-[#9e7d56] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12l4 6-10 12L2 9l4-6z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 9h20M12 21L8 9l-2-6M12 21l4-12 2-6" />
        </svg>
      ),
    },
    {
      title: 'Worldwide Shipping',
      subtitle: 'Safe & insured',
      icon: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.3] text-[#2b2018] group-hover:text-[#9e7d56] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18.75 18.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 6.75h11.25v9H3v-9zM14.25 9.75h3.75l2.25 3v3h-6v-6zM3 12h11.25" />
        </svg>
      ),
    },
    {
      title: 'Secure Payments',
      subtitle: 'Your data, our priority',
      icon: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.3] text-[#2b2018] group-hover:text-[#9e7d56] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3s7.5 2.25 7.5 9c0 6-7.5 9-7.5 9S4.5 18 4.5 12c0-6.75 7.5-9 7.5-9z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2.25 2.25L15 9.75" />
        </svg>
      ),
    },
    {
      title: 'Lifetime Support',
      subtitle: "We're here for you",
      icon: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.3] text-[#2b2018] group-hover:text-[#9e7d56] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="w-full bg-[#f6f2ec] border-y border-[#e7ded3] text-[#1e1712] overflow-hidden">
      {/* Mobile: 4 cols stacked icon+text, Desktop: horizontal with dividers */}
      <div className="max-w-7xl mx-auto px-3 sm:px-8 lg:px-12 py-4 sm:py-7 lg:py-9">
        <div className="grid grid-cols-4 divide-x divide-[#e5dacf]/60">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center justify-center gap-1.5 sm:gap-2.5 px-1 sm:px-5 lg:px-6 py-2 sm:py-3 group cursor-default transition-all duration-300 text-center min-w-0"
            >
              {/* Icon */}
              <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                {feature.icon}
              </div>
              {/* Text */}
              <div className="flex flex-col items-center text-center w-full px-0.5 min-w-0">
                <h3 className="font-serif text-[10px] sm:text-sm lg:text-base font-medium text-[#1c1510] leading-tight truncate w-full">
                  {feature.title}
                </h3>
                <p className="text-[8px] sm:text-xs text-[#736557] font-light mt-0.5 leading-tight truncate w-full">
                  {feature.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
