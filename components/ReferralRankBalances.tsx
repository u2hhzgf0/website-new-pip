'use client'

import React from 'react';
import { Users, Loader2 } from 'lucide-react';
import { useGetMyReferralBalancesByRankQuery } from '../store/api/rankApi';

const formatMoney = (value: number) =>
  `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/**
 * Shows the total current wallet balance of the user's direct referrals,
 * grouped by the referral's rank (first 3 ranks only).
 */
export function ReferralRankBalances({ imageBase }: { imageBase: string }) {
  const { data, isLoading, isError } = useGetMyReferralBalancesByRankQuery();
  const summary = data?.data?.attributes;

  return (
    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-5 card-lift">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Referral Balance by Rank</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Total wallet balance of your direct referrals at each rank
          </p>
        </div>
        {summary && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {summary.totalReferrals} referral{summary.totalReferrals === 1 ? '' : 's'} ·{' '}
            <span className="font-semibold text-slate-900 dark:text-white">{formatMoney(summary.totalBalance)}</span>
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="animate-spin text-emerald-500" size={24} />
        </div>
      ) : isError || !summary ? (
        <p className="text-sm text-slate-500 dark:text-slate-400 py-4">Could not load referral balances.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {summary.ranks.map((rank) => (
            <div
              key={rank.level}
              className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-4"
            >
              <div className="w-12 h-12 flex-shrink-0 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${imageBase}${rank.badgeImage}`}
                  alt=""
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold truncate">
                  {rank.name}
                </p>
                <p className="text-lg font-bold text-slate-900 dark:text-white truncate">{formatMoney(rank.totalBalance)}</p>
                <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <Users size={12} /> {rank.referralCount} referral{rank.referralCount === 1 ? '' : 's'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
