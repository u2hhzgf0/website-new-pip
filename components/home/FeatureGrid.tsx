'use client'

import React from 'react';
import Reveal from '@/components/Reveal';

const features = [
  {
    img: '/images/Explore More Markets.webp',
    title: 'Investment Plans',
    desc: 'Multiple ROI-bearing plans with clear duration, min/max deposit, and payout terms.',
  },
  {
    img: '/images/copy-trading.B71bzk8F.webp',
    title: 'Referral Commissions',
    desc: 'Earn a direct commission on every investor you bring to the platform.',
  },
  {
    img: '/images/coins-graphic.BtzN30qG.gif',
    title: 'Rank Progression',
    desc: 'Team-wide deposit milestones unlock higher ranks and bigger recurring rewards.',
  },
  {
    img: '/images/free-signals.CQSoIKKu.webp',
    title: 'Real-Time Notifications',
    desc: 'Never miss a deposit confirmation, profit payout, or platform announcement.',
  },
  {
    img: '/images/ai-trading.Cckrm2y4.webp',
    title: 'Smart Dashboard',
    desc: 'One view of your wallet, active plans, profit history, and team performance.',
  },
];

const FeatureGrid = () => {
  return (
    <section className="py-12 sm:py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-brand-500 text-sm font-bold uppercase tracking-wider">Core Features</span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white mt-3 mb-4">
            Everything Built Around Real Growth
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((f, i) => (
            <Reveal
              key={i}
              delay={Math.min(i * 0.08, 0.4)}
              className={i === features.length - 1 ? 'sm:col-span-2 lg:col-span-1' : ''}
            >
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 flex items-center gap-4 sm:gap-5 hover:border-brand-500/40 transition-colors h-full">
                <img src={f.img} alt="" className="w-20 h-20 sm:w-24 sm:h-24 object-contain shrink-0" />
                <div>
                  <h3 className="text-slate-900 dark:text-white font-bold text-sm sm:text-base mb-1">{f.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
