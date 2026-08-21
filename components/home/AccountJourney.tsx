import React from 'react';
import { Check } from 'lucide-react';

const stages = [
  {
    title: 'New Investor',
    desc: 'Guided onboarding, plan selection help, and a clear view of how returns are calculated.',
  },
  {
    title: 'Active Investor',
    desc: 'Multiple concurrent plans, live profit tracking, and fast wallet withdrawals.',
  },
  {
    title: 'Team Builder',
    desc: 'Share your referral link, grow a network, and earn direct and generation commissions.',
  },
  {
    title: 'Rank Achiever',
    desc: 'Hit team-deposit milestones to climb ranks and unlock higher recurring rewards.',
  },
];

const AccountJourney = () => {
  return (
    <section className="py-12 sm:py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
        <div className="flex justify-center order-2 lg:order-1">
          <img src="/images/account-types-graphic.CQHdTBlY.gif" alt="" className="w-56 sm:w-80 object-contain" />
        </div>
        <div className="order-1 lg:order-2">
          <span className="text-brand-500 text-sm font-bold uppercase tracking-wider">Your Journey</span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white mt-3 mb-6 sm:mb-8 leading-tight">
            Built For Every Stage Of Investing
          </h2>
          <div className="space-y-5 sm:space-y-6">
            {stages.map((stage, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="bg-brand-500/10 text-brand-500 rounded-full p-1.5 mt-0.5 shrink-0">
                  <Check size={16} />
                </div>
                <div>
                  <h4 className="text-slate-900 dark:text-white font-bold text-sm sm:text-base mb-1">{stage.title}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">{stage.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccountJourney;
