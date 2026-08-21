import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const points = [
  { title: 'Direct Sponsor Commission', desc: 'Earn on every investor you refer directly.' },
  { title: 'Generation Commission', desc: 'Earn on activity from your wider team network.' },
  { title: 'Rank-Based Rewards', desc: 'Unlock higher rewards as your team hits milestones.' },
  { title: 'Team Growth Tools', desc: 'Track your network structure from your dashboard.' },
];

const ReferralCTA = () => {
  return (
    <section className="py-12 sm:py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
        <div className="flex justify-center order-2 lg:order-1">
          <img src="/images/handshake.ChU5aiGk.webp" alt="" className="w-56 sm:w-80 object-contain" />
        </div>
        <div className="order-1 lg:order-2">
          <span className="text-brand-500 text-sm font-bold uppercase tracking-wider">Referral Program</span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white mt-3 mb-6 leading-tight">
            Grow With Pipguardian&apos;s Referral Program
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            {points.map((point, i) => (
              <div key={i}>
                <h4 className="text-slate-900 dark:text-white font-bold text-sm mb-1">{point.title}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">{point.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-slate-950 rounded-full font-bold text-sm transition-colors"
            >
              Start Referring
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/investing-info"
              className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-brand-500 hover:text-brand-500 rounded-full font-semibold text-sm transition-colors"
            >
              See Full Rank Structure
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReferralCTA;
