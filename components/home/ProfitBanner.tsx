import React from 'react';

const ProfitBanner = () => {
  return (
    <section className="py-12 sm:py-24 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
        <div>
          <span className="text-brand-500 text-xs sm:text-sm font-bold uppercase tracking-wider">Daily Profit Distribution</span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold mt-3 mb-4 leading-tight">
            <span className="text-brand-500">Earn Daily.</span>
            <br />
            <span className="text-slate-900 dark:text-white">Credited Automatically.</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-lg leading-relaxed mb-6 sm:mb-8 max-w-lg">
            Every active investment plan distributes profit on a set schedule, credited straight to your wallet —
            exact rates and payout timing depend on the plan you choose.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6">
            <a
              href="#plans"
              className="w-full sm:w-auto text-center px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-brand-400 to-brand-600 text-slate-950 rounded-full font-bold text-sm sm:text-base hover:-translate-y-0.5 transition-transform"
            >
              View Plan Rates
            </a>
            <a
              href="/investing-info"
              className="w-full sm:w-auto text-center px-6 sm:px-8 py-3 sm:py-3.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-brand-500 hover:text-brand-500 rounded-full font-semibold text-sm sm:text-base transition-colors"
            >
              Learn More
            </a>
          </div>
          <p className="text-slate-400 dark:text-slate-600 text-xs leading-relaxed">
            Profit distribution and rates vary by investment plan. See each plan&apos;s details for exact terms.{' '}
            <a href="/investing-info" className="underline hover:text-brand-500">Terms apply</a>
          </p>
        </div>

        <div className="flex items-center justify-center">
          <img src="/images/download.webp" alt="" className="w-full max-w-md object-contain" />
        </div>
      </div>
    </section>
  );
};

export default ProfitBanner;
