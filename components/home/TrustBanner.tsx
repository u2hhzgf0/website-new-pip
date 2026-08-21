import React from 'react';

const TrustBanner = () => {
  return (
    <section className="relative bg-gradient-to-br from-brand-700 via-brand-600 to-slate-900 overflow-hidden">
      <img
        src="/images/A Broader Way To Trade The Markets bg dot map.webp"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen"
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <span className="text-brand-100 text-xs sm:text-sm font-bold uppercase tracking-wider">Built For Growth</span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white mt-3 mb-4 leading-tight">
            Investing Should Feel Structured, Not Uncertain
          </h2>
          <p className="text-brand-50/90 text-sm sm:text-lg leading-relaxed">
            Pipguardian gives you a diversified set of investment plans, transparent daily profit tracking, and a
            dashboard built to show exactly where your money stands — every step of the way.
          </p>
        </div>
        <div className="flex justify-center md:justify-end">
          <a
            href="#plans"
            className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-brand-700 rounded-full font-bold text-sm sm:text-base shadow-lg hover:-translate-y-1 transition-transform"
          >
            Explore Investment Plans
          </a>
        </div>
      </div>
    </section>
  );
};

export default TrustBanner;
