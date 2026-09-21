'use client'

import React from 'react';
import Reveal from '@/components/Reveal';

const items = [
  {
    img: '/images/pamm.DBgK9W6G.webp',
    title: 'Flexible Investment Plans',
    desc: 'Choose from multiple ROI-bearing plans sized to your budget and timeline.',
  },
  {
    img: '/images/payment-routes.DRH4Qr8r.webp',
    title: 'Fast Wallet & Withdrawals',
    desc: 'Deposit, track, and withdraw straight from your dashboard wallet.',
  },
  {
    img: '/images/handshake.ChU5aiGk.webp',
    title: 'Referral Network Rewards',
    desc: 'Earn direct and team commissions as your referral network grows.',
  },
  {
    img: '/images/Built for Ambitious Traders.webp',
    title: 'Rank-Based Growth',
    desc: 'Climb from Starter to Ambassador and unlock bigger rewards along the way.',
  },
];

const WhyUs = () => {
  return (
    <section className="py-12 sm:py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <span className="text-brand-500 text-sm font-bold uppercase tracking-wider">Why Pipguardian</span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white mt-3 mb-4">
            A Broader Way To Grow Your Wealth
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-lg">
            One platform for structured investing, fast payouts, and a rewarding referral network.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {items.map((item, i) => (
            <Reveal key={i} delay={Math.min(i * 0.08, 0.4)}>
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 text-center hover:border-brand-500/40 transition-colors h-full">
                <img src={item.img} alt="" className="w-24 h-24 sm:w-28 sm:h-28 object-contain mx-auto mb-4" />
                <h3 className="text-slate-900 dark:text-white font-bold text-sm sm:text-base mb-2">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
