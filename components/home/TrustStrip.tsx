'use client'

import React from 'react';
import { ShieldCheck, Headset, Eye, Trophy } from 'lucide-react';
import Reveal from '@/components/Reveal';

const items = [
  { icon: ShieldCheck, title: 'Bank-Grade Security', desc: '256-bit encryption on every session.' },
  { icon: Headset, title: '24/7 Support', desc: 'A support ticket away, any time.' },
  { icon: Eye, title: 'Transparent Payouts', desc: 'Full history for every deposit and withdrawal.' },
  { icon: Trophy, title: 'Rank-Based Rewards', desc: 'Grow your team, grow your rewards.' },
];

const TrustStrip = () => {
  return (
    <section className="py-12 sm:py-20 bg-slate-50 dark:bg-slate-950 border-y border-slate-200 dark:border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white">
            Trusted, Transparent, Built For Growth
          </h2>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {items.map((item, i) => (
            <Reveal key={i} delay={Math.min(i * 0.08, 0.4)} className="text-center">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 text-brand-500">
                <item.icon size={26} />
              </div>
              <h4 className="text-slate-900 dark:text-white font-bold text-sm sm:text-base mb-1">{item.title}</h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">{item.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
