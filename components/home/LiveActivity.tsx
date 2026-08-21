'use client'

import React from 'react';
import { Wallet, TrendingUp } from 'lucide-react';

const recentActivity = [
  { user: 'Muhammad W.', action: 'Withdrawal', amount: 51, time: 'Just now' },
  { user: 'Noman M.', action: 'Deposit', amount: 299, time: '2m ago' },
  { user: 'Bilal A.', action: 'Withdrawal', amount: 295.41, time: '6m ago' },
  { user: 'Ahmad A.', action: 'Deposit', amount: 141.9, time: '11m ago' },
  { user: 'Mohammed S.', action: 'Withdrawal', amount: 200, time: '18m ago' },
];

const LiveActivity = () => {
  return (
    <section className="py-12 sm:py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 items-start">
          <div>
            <span className="text-brand-500 text-sm font-bold uppercase tracking-wider">Live Activity</span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white mt-3 mb-4 sm:mb-6 leading-tight">
              Real Money Moving On The Platform
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-lg mb-6">
              Deposits and withdrawals process straight from your wallet — no manual back-and-forth.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                <Wallet className="text-brand-500 mb-2" size={22} />
                <p className="text-slate-900 dark:text-white font-bold text-lg">Instant</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs">Wallet crediting</p>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                <TrendingUp className="text-brand-500 mb-2" size={22} />
                <p className="text-slate-900 dark:text-white font-bold text-lg">Daily</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs">Profit distribution</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center font-bold text-xs shrink-0">
                    {item.user.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-slate-900 dark:text-white font-semibold text-sm">{item.user}</p>
                    <p className="text-slate-400 dark:text-slate-500 text-xs">{item.action} &middot; {item.time}</p>
                  </div>
                </div>
                <span className={`font-mono font-bold text-sm ${item.action === 'Deposit' ? 'text-green-500' : 'text-slate-600 dark:text-slate-300'}`}>
                  {item.action === 'Deposit' ? '+' : '-'}${item.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveActivity;
