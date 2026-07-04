'use client'

import React from 'react';
import { Star, Loader2 } from 'lucide-react';
import { useGetMyRankQuery, useCheckAndUpgradeRankMutation, useGetRankDefinitionsQuery } from '../store/api/rankApi';
import { RankJourney } from './RankJourney';
import { Toast, ToastType } from './Toast';
import { useState } from 'react';

const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || 'https://api.pipguardian.com';

export default function MyRank() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const { data: rankData, refetch: refetchRank } = useGetMyRankQuery();
  const [checkUpgrade, { isLoading: isCheckingUpgrade }] = useCheckAndUpgradeRankMutation();
  const { data: rankDefsData } = useGetRankDefinitionsQuery();

  const rankInfo = rankData?.data?.attributes;
  const rankDefinitions = rankDefsData?.data?.attributes || [];

  const handleCheckRankUpgrade = async () => {
    try {
      const result = await checkUpgrade().unwrap();
      const attrs = result?.data?.attributes as any;
      if (attrs?.upgraded) {
        setToast({ message: `Congratulations! You upgraded to rank ${attrs.newRank}!`, type: 'success' });
        refetchRank();
      } else {
        setToast({ message: 'You do not qualify for an upgrade yet. Keep growing!', type: 'success' });
      }
    } catch {
      setToast({ message: 'Failed to check rank upgrade', type: 'error' });
    }
  };

  if (!rankInfo) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin text-gold-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">My Rank</h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">Your current rank, progress, and full rank journey</p>
      </div>

      {/* Current Rank Card */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-4">
        {/* Rank header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 flex-shrink-0">
              <img
                src={`${IMAGE_BASE}${rankInfo.currentRankInfo.badgeImage}`}
                alt={`${rankInfo.currentRankInfo.name} badge`}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Current Rank</p>
              <p className="text-2xl font-bold text-white">{rankInfo.currentRankInfo.name}</p>
              {rankInfo.currentRankInfo.monthlySalary > 0 && (
                <p className="text-xs text-gold-400 mt-0.5">
                  Monthly Salary: <span className="font-semibold">${rankInfo.currentRankInfo.monthlySalary}</span>
                </p>
              )}
              {rankInfo.currentRankInfo.bonus && (
                <p className="text-xs text-emerald-400">
                  Bonus Reward: <span className="font-semibold">{rankInfo.currentRankInfo.bonus}</span>
                </p>
              )}
            </div>
          </div>

          <button
            onClick={handleCheckRankUpgrade}
            disabled={isCheckingUpgrade || rankInfo.currentRank >= 7}
            className="flex items-center gap-2 bg-gold-500/10 hover:bg-gold-500/20 disabled:opacity-40 text-gold-400 border border-gold-500/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Star size={14} />
            {rankInfo.currentRank >= 7 ? 'Max Rank' : isCheckingUpgrade ? 'Checking…' : 'Check Upgrade'}
          </button>
        </div>

        {/* Progress toward next rank */}
        {rankInfo.nextRankInfo && rankInfo.progress && (
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Progress to {rankInfo.nextRankInfo.name}
            </p>

            {/* Business Volume */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Business Volume</span>
                <span className="text-white">
                  ${rankInfo.progress.businessVolume.current.toLocaleString()} / ${rankInfo.progress.businessVolume.required.toLocaleString()}
                </span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold-500 rounded-full transition-all"
                  style={{ width: `${Math.min(rankInfo.progress.businessVolume.percentage, 100)}%` }}
                />
              </div>
            </div>

            {/* Direct Referrals */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Direct Referrals</span>
                <span className="text-white">
                  {rankInfo.progress.directReferrals.current} / {rankInfo.progress.directReferrals.required}
                </span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${Math.min(rankInfo.progress.directReferrals.percentage, 100)}%` }}
                />
              </div>
            </div>

            {/* Personal Investment */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Personal Investment</span>
                <span className="text-white">
                  ${rankInfo.progress.personalInvestment.current.toLocaleString()} / ${rankInfo.progress.personalInvestment.required.toLocaleString()}
                </span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${Math.min(rankInfo.progress.personalInvestment.percentage, 100)}%` }}
                />
              </div>
            </div>

            {/* Next rank badge */}
            <div className="flex items-center gap-3 mt-2 bg-slate-900/60 rounded-lg p-3">
              <img
                src={`${IMAGE_BASE}${rankInfo.nextRankInfo.badgeImage}`}
                alt={rankInfo.nextRankInfo.name}
                className="w-9 h-9 object-contain opacity-60"
              />
              <div className="text-xs text-slate-400">
                Next: <span className="text-white font-semibold">{rankInfo.nextRankInfo.name}</span>
                {rankInfo.nextRankInfo.bonus && (
                  <span className="text-gold-400"> · {rankInfo.nextRankInfo.bonus}</span>
                )}
              </div>
            </div>

            {/* Leadership chain notice */}
            <div className="flex items-start gap-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2.5 mt-1">
              <span className="text-amber-400 text-sm mt-0.5 flex-shrink-0">⚠</span>
              <p className="text-xs text-amber-300 leading-relaxed">
                {rankInfo.nextRankInfo.level >= 3
                  ? <>To reach <span className="font-semibold text-amber-200">{rankInfo.nextRankInfo.name}</span>, at least one of your direct referrals must already be at <span className="font-semibold text-amber-200">{rankInfo.currentRankInfo.name}</span> rank.</>
                  : <>From <span className="font-semibold text-amber-200">Sr. Executive</span> rank onwards, at least one of your direct referrals must hold the same rank as you before you can advance further.</>
                }
              </p>
            </div>
          </div>
        )}

        {rankInfo.totalSalaryEarned > 0 && (
          <p className="text-xs text-slate-500 pt-1 border-t border-slate-800">
            Total salary earned: <span className="text-white font-medium">${rankInfo.totalSalaryEarned.toLocaleString()}</span>
          </p>
        )}
      </div>

      {/* Rank Journey */}
      {rankDefinitions.length > 0 && (
        <RankJourney
          currentRank={rankInfo.currentRank}
          definitions={rankDefinitions}
          imageBase={IMAGE_BASE}
        />
      )}
    </div>
  );
}
