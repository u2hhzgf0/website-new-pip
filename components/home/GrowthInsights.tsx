'use client'

import React from 'react';
import { Wallet, LineChart, Users, Trophy, Bell, Smartphone } from 'lucide-react';
import Reveal from '@/components/Reveal';

const points = [
  { icon: Wallet, title: 'Wallet & Transaction History', desc: 'Every deposit and withdrawal, logged and searchable.' },
  { icon: LineChart, title: 'Profit & ROI Tracking', desc: 'See exactly what each active plan has paid out so far.' },
  { icon: Users, title: 'Referral & Commission Breakdown', desc: 'A full view of your network and what it has earned you.' },
  { icon: Trophy, title: 'Rank Progress', desc: 'Track how close you are to your next rank milestone.' },
  { icon: Bell, title: 'Notifications', desc: 'Stay ahead of every payout, approval, and announcement.' },
];

const GrowthInsights = () => {
  return (
    <section className="py-12 sm:py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
        <div>
          <Reveal>
            <span className="text-brand-500 text-sm font-bold uppercase tracking-wider">Your Dashboard</span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white mt-3 mb-6 sm:mb-8 leading-tight">
              Track Your Growth With Real-Time Insights
            </h2>
          </Reveal>
          <div className="space-y-4 sm:space-y-5">
            {points.map((point, i) => (
              <Reveal key={i} delay={Math.min(i * 0.08, 0.4)}>
                <div className="flex items-start gap-4">
                  <div className="bg-brand-500/10 text-brand-500 rounded-lg p-2.5 shrink-0">
                    <point.icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-slate-900 dark:text-white font-bold text-sm sm:text-base">{point.title}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">{point.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal direction="left" delay={0.1} className="flex justify-center">
          <div className="relative w-56 sm:w-72 h-[420px] sm:h-[540px] rounded-[2.5rem] border-8 border-slate-900 dark:border-slate-800 bg-slate-950 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-brand-900/40 to-slate-950" />
            <div className="relative p-5 sm:p-6 flex flex-col h-full">
              <div className="flex items-center gap-2 text-brand-400 mb-6">
                <Smartphone size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">Dashboard</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
                <p className="text-slate-400 text-[10px] mb-1">Wallet Balance</p>
                <p className="text-white font-bold text-xl">$4,285.60</p>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <p className="text-slate-400 text-[10px] mb-1">Today's Profit</p>
                  <p className="text-brand-400 font-bold text-sm">+$32.40</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <p className="text-slate-400 text-[10px] mb-1">Current Rank</p>
                  <p className="text-white font-bold text-sm">Executive</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex-1">
                <p className="text-slate-400 text-[10px] mb-2">Referral Network</p>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-2">
                  <div className="h-full w-3/5 bg-brand-500 rounded-full" />
                </div>
                <p className="text-slate-500 text-[10px]">12 of 20 to next rank</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default GrowthInsights;
