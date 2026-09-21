'use client'

import React, { useState } from 'react';
import Reveal from '@/components/Reveal';

const tabs = [
  {
    label: 'Wallet & Transactions',
    img: '/images/payment-routes.DRH4Qr8r.webp',
    title: 'One Wallet For Everything',
    desc: 'Deposit, invest, and withdraw from a single wallet balance with a full transaction history you can audit anytime.',
  },
  {
    label: 'Referral Network',
    img: '/images/mam.B6pwl1nC.webp',
    title: 'Build A Team, Earn Together',
    desc: 'Invite investors, track your network structure, and earn commission on every level of activity underneath you.',
  },
  {
    label: 'Rank & Rewards',
    img: '/images/Built for Ambitious Traders.webp',
    title: 'Progress Has A Payoff',
    desc: 'Move up through 7 ranks — from Starter to Ambassador — unlocking higher rewards as your team grows.',
  },
  {
    label: 'Notifications',
    img: '/images/free-signals.CQSoIKKu.webp',
    title: 'Stay In The Loop',
    desc: 'Real-time alerts for deposits, profit distributions, rank changes, and platform announcements.',
  },
  {
    label: 'Support Center',
    img: '/images/communication.BJaEDjmN.webp',
    title: "We're Here When You Need Us",
    desc: 'Raise a support ticket straight from your dashboard and track every reply in one place.',
  },
];

const PlatformFeatures = () => {
  const [active, setActive] = useState(0);

  return (
    <section className="py-12 sm:py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-brand-500 text-sm font-bold uppercase tracking-wider">Platform</span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white mt-3 mb-4">
            Everything You Need, In One Dashboard
          </h2>
        </Reveal>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-14">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold border transition-colors ${
                active === i
                  ? 'bg-brand-500 border-brand-500 text-slate-950'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-brand-500/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-16 items-center">
          <Reveal className="order-2 md:order-1">
            <h3 className="text-xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
              {tabs[active].title}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-lg leading-relaxed">
              {tabs[active].desc}
            </p>
          </Reveal>
          <Reveal delay={0.1} className="order-1 md:order-2 flex justify-center">
            <img src={tabs[active].img} alt={tabs[active].label} className="w-40 h-40 sm:w-64 sm:h-64 object-contain" />
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default PlatformFeatures;
