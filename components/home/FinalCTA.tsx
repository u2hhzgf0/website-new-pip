'use client'

import React from 'react';
import Link from 'next/link';
import Reveal from '@/components/Reveal';

const FinalCTA = () => {
  return (
    <section className="py-12 sm:py-20 bg-slate-50 dark:bg-slate-950 px-4 sm:px-6 lg:px-8">
      <Reveal className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-slate-900 p-8 sm:p-16 text-center">
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white mb-3 sm:mb-4">
          Choose How You Want To Grow With Pipguardian
        </h2>
        <p className="text-brand-50/90 text-sm sm:text-lg mb-8 max-w-2xl mx-auto">
          Open an account, explore investment plans, or start building your referral network today.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-brand-700 rounded-full font-bold text-sm sm:text-base hover:-translate-y-1 transition-transform"
          >
            Start Trading
          </Link>
          <a
            href="#plans"
            className="w-full sm:w-auto px-8 py-3.5 border border-white/40 text-white rounded-full font-semibold text-sm sm:text-base hover:bg-white/10 transition-colors"
          >
            Explore Plans
          </a>
          <Link
            href="/investing-info"
            className="w-full sm:w-auto px-8 py-3.5 text-white/90 font-semibold text-sm sm:text-base hover:text-white transition-colors"
          >
            Become a Partner
          </Link>
        </div>
      </Reveal>
    </section>
  );
};

export default FinalCTA;
