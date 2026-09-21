'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import {
  TrendingUp, ArrowUpRight, ArrowDownLeft, Loader2, AlertCircle,
  Users, Gift, Star, ArrowRight, PieChart as PieChartIcon, Network,
  Check, LineChart,
} from 'lucide-react';
import Link from 'next/link';
import { useGetWalletQuery, useGetWalletStatsQuery } from '@/store/api/walletApi';
import { useGetMyTransactionsQuery } from '@/store/api/transactionApi';
import { useGetMyRankQuery } from '@/store/api/rankApi';
import { useGetReferralStatsQuery } from '@/store/api/referralApi';
import { getIncomeIcon } from '@/lib/incomeIcons';

// Static preview data for widgets with no backend yet (streak/milestones/network activity)
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const AUTOBOT_MILESTONES: Array<'done' | 'active' | 'locked'> = ['done', 'active', 'locked', 'locked', 'locked', 'locked', 'locked', 'locked'];
const NETWORK_ACTIVITY_SAMPLE = [5, 8, 12, 6, 9, 4, 7];

interface TransactionsData {
  results?: any[]
  totalPages?: number
  totalResults?: number
}

// Truncates amounts that would overflow a card; shows full value in a popup on click
const AMOUNT_CHAR_LIMIT = 12; // "$200,598.00" = 11 chars fits; longer gets truncated

const StatAmount = ({ value, className = '' }: { value: number; className?: string }) => {
  const [showModal, setShowModal] = useState(false);
  const formatted = value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const full = `$${formatted}`;
  const isTruncated = full.length > AMOUNT_CHAR_LIMIT;
  const display = isTruncated ? `${full.slice(0, AMOUNT_CHAR_LIMIT - 3)}...` : full;

  return (
    <>
      <span
        className={`${className} ${isTruncated ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
        onClick={isTruncated ? () => setShowModal(true) : undefined}
        title={isTruncated ? `Click to see full amount: ${full}` : undefined}
      >
        {display}
      </span>
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl p-6 shadow-2xl text-center min-w-[240px] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-widest mb-3">Full Amount</p>
            <p className="text-slate-900 dark:text-white text-3xl font-bold break-all">{full}</p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors px-5 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// Relative "time ago" label for the activity feed
const timeAgo = (dateString: string) => {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
};

const DashboardHome = () => {
  // Check if this is the demo user
  const currentUser = useSelector((state: RootState) => state.auth.user);

  // Fetch data from APIs
  const { isLoading: walletLoading, error: walletError } = useGetWalletQuery();
  const { data: transactionsData, isLoading: transactionsLoading, error: transactionsError } = useGetMyTransactionsQuery({
    page: 1,
    limit: 5,
  });
  // Rank progress, referral network, and income breakdown — each renders its own loading state
  // rather than blocking the whole page, since they're secondary widgets.
  const { data: rankData } = useGetMyRankQuery();
  const { data: referralStatsData } = useGetReferralStatsQuery();
  const { data: walletStatsData } = useGetWalletStatsQuery({});

  const transactionsResponse = (transactionsData?.data?.attributes || {}) as TransactionsData;
  const transactions = transactionsResponse.results || [];
  const rankInfo = rankData?.data?.attributes;
  const referralStats = referralStatsData?.data?.attributes;
  const incomeBreakdown = walletStatsData?.data?.attributes?.incomeBreakdown || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'deposit':
        return 'text-emerald-400';
      case 'withdraw':
        return 'text-rose-400';
      case 'profit':
        return 'text-amber-500';
      case 'investment':
        return 'text-blue-400';
      case 'referral':
        return 'text-purple-400';
      case 'bonus':
        return 'text-amber-400';
      default:
        return 'text-slate-500 dark:text-slate-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
      case 'processing':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      case 'rejected':
      case 'cancelled':
        return 'bg-rose-500/10 text-rose-500 border border-rose-500/20';
      default:
        return 'bg-slate-300/10 dark:bg-slate-500/10 text-slate-600 dark:text-slate-500 border border-slate-300/20 dark:border-slate-500/20';
    }
  };

  if (walletLoading || transactionsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="animate-spin text-emerald-500 mx-auto mb-4" size={48} />
          <p className="text-slate-500 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (walletError) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <AlertCircle className="text-rose-500 mx-auto mb-4" size={48} />
          <p className="text-rose-400 font-medium mb-2">Failed to load dashboard data</p>
          <p className="text-slate-600 dark:text-slate-500 text-sm">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  const rankProgressPct = rankInfo?.progress?.businessVolume?.percentage ?? 0;
  const businessVolumeCurrent = rankInfo?.metrics?.businessVolume ?? 0;
  const businessVolumeRequired = rankInfo?.progress?.businessVolume?.required ?? 0;

  // Preview-only widgets (streak / milestones / network activity) — no backend for these yet
  const todayIdx = (new Date().getDay() + 6) % 7; // JS: 0=Sun..6=Sat → Mon=0..Sun=6
  const claimStreak = 0;
  const milestoneProgress = 30;
  const networkActivity = NETWORK_ACTIVITY_SAMPLE;

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Welcome header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{currentUser?.firstName} {currentUser?.lastName}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Welcome Back</h1>
        </div>
        <Link
          href="/dashboard/wallet/stats"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:border-emerald-300 dark:hover:border-emerald-500/40 transition-colors"
        >
          <LineChart size={16} />
          Open Analytics
        </Link>
      </div>

      {/* Smart Member card teaser */}
      <Link
        href="/dashboard/smart-member"
        className="flex items-center justify-between gap-4 bg-gradient-to-r from-emerald-50 to-emerald-50 dark:from-emerald-500/10 dark:to-emerald-600/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:border-emerald-300 dark:hover:border-emerald-500/40 transition-colors group tilt-card-flat"
      >
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="relative w-24 h-[62px] sm:w-28 sm:h-[73px] rounded-lg overflow-hidden shrink-0 shadow-lg shadow-slate-900/20 ring-1 ring-black/10">
            <Image src="/images/Member_cared_fornt.png" alt="Smart Member card" fill className="object-cover" sizes="112px" />
          </div>
          <div className="min-w-0">
            <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Your Smart Member card</p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">Manage your digital membership card</p>
          </div>
        </div>
        <span className="hidden sm:flex items-center gap-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
          Manage <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </span>
      </Link>

      {/* Main 2-column layout: left = primary widgets, right = activity/summary sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6 items-start">
        {/* ───────── Left column ───────── */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-6">
          {/* Current Rank — real progress from the rank API */}
          <Link
            href="/dashboard/my-rank"
            className="block bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-xl shadow-emerald-900/20 relative overflow-hidden group hover:shadow-2xl transition-all card-lift"
          >
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 flex items-center justify-center">
              <Star size={18} className="text-white fill-white/80" />
            </div>
            <p className="text-emerald-200 text-xs sm:text-sm font-medium mb-1">Current Rank</p>
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">{rankInfo?.currentRankInfo?.name || 'Starter'}</h3>

            <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5">
              <span className="text-emerald-200">
                {rankInfo?.nextRankInfo ? `Progress to ${rankInfo.nextRankInfo.name}` : 'Maximum rank achieved'}
              </span>
              <span className="font-semibold">{Math.round(rankProgressPct)}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/20 rounded-full mb-4 sm:mb-6">
              <div className="h-1.5 bg-gradient-to-r from-amber-400 to-amber-300 rounded-full" style={{ width: `${Math.min(rankProgressPct, 100)}%` }} />
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-emerald-200">Business Volume</span>
              <span className="font-semibold">
                ${businessVolumeCurrent.toLocaleString()} {businessVolumeRequired > 0 && `/ $${businessVolumeRequired.toLocaleString()}`}
              </span>
            </div>
          </Link>

          {/* Team & rank tiles — real referral/rank data */}
          <div className="grid grid-cols-2 gap-3 sm:gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-5 tilt-card-flat">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center mb-2 sm:mb-3">
                <Users size={16} />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs mb-0.5">Team Members</p>
              <p className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">{referralStats?.totalReferrals ?? 0}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-5 tilt-card-flat">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-2 sm:mb-3">
                <Network size={16} />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs mb-0.5">Active Referrals</p>
              <p className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">{referralStats?.activeReferrals ?? 0}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-5 tilt-card-flat">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-2 sm:mb-3">
                <PieChartIcon size={16} />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs mb-0.5">Total Commissions</p>
              <p className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                <StatAmount value={referralStats?.totalEarnings ?? 0} />
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-5 tilt-card-flat">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center mb-2 sm:mb-3">
                <Gift size={16} />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs mb-0.5">Rank Salary Earned</p>
              <p className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                <StatAmount value={rankInfo?.totalSalaryEarned ?? 0} />
              </p>
            </div>
          </div>

          {/* Daily Claim Streak + AutoBot Milestones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg card-lift">
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Daily Claim Streak</h3>
                <span className="text-amber-500 font-bold text-sm">{claimStreak} Days</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {WEEKDAYS.map((day, i) => (
                  <div key={day} className="flex flex-col items-center gap-1.5">
                    <div className={`w-full aspect-square rounded-full flex items-center justify-center ${
                      i === todayIdx
                        ? 'border-2 border-dashed border-amber-400 bg-amber-500/10'
                        : i < claimStreak
                        ? 'bg-emerald-500/15 text-emerald-500'
                        : 'bg-slate-100 dark:bg-slate-800'
                    }`}>
                      {i < claimStreak && <Check size={14} className="text-emerald-500" strokeWidth={3} />}
                    </div>
                    <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-500">{day}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg card-lift">
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">AutoBot Milestones</h3>
                <Link href="/dashboard/autobots" className="text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-medium hover:underline">1 Auto Bot</Link>
              </div>
              <div className="flex items-center justify-between gap-1 mb-4">
                {AUTOBOT_MILESTONES.map((state, i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0 ${
                      state === 'done' ? 'bg-emerald-500 text-white' :
                      state === 'active' ? 'bg-amber-500 text-white' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600'
                    }`}
                  >
                    {state === 'done' ? <Check size={12} strokeWidth={3} /> : i + 1}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5">
                <span className="text-slate-500 dark:text-slate-400">Milestone Progress</span>
                <span className="font-semibold text-slate-900 dark:text-white">{milestoneProgress}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full">
                <div className="h-1.5 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" style={{ width: `${milestoneProgress}%` }} />
              </div>
            </div>
          </div>

          {/* Network AutoBot Activity */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg card-lift">
            <div className="flex items-start justify-between mb-4 sm:mb-5">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Network AutoBot Activity</h3>
              <div className="text-right shrink-0">
                <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-none">{networkActivity[todayIdx]} Today</p>
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-500 mt-1">Your AutoBots: 1</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              {WEEKDAYS.map((day, i) => (
                <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-bold text-white shrink-0 ${
                    i === todayIdx ? 'bg-gradient-to-br from-emerald-500 to-emerald-700' : 'bg-emerald-500'
                  }`}>
                    {networkActivity[i]}
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-500">{day}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-500 mt-4 sm:mt-5">System-wide AutoBot purchases across all users this week</p>
          </div>

          {/* Earnings Breakdown — same real income data as the Earnings Snapshot sidebar, shown as icon rows */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg card-lift">
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Earnings Breakdown</h3>
              <Link href="/dashboard/wallet/stats" className="text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm hover:underline font-medium">Full Report</Link>
            </div>
            {incomeBreakdown.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-500 text-sm py-6 text-center">No earnings recorded yet</p>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {incomeBreakdown.map((row) => {
                  const { icon: Icon, tint } = getIncomeIcon(row.category);
                  return (
                    <div key={row.category} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${tint}`}>
                          <Icon size={16} />
                        </div>
                        <span className="text-sm text-slate-700 dark:text-slate-300 truncate">{row.category}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white shrink-0">
                        ${row.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ───────── Right column (sidebar) ───────── */}
        <div className="space-y-3 sm:space-y-6">
          {/* Recent Activity — real transactions, finally rendered */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg card-lift">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Recent Activity</h3>
              <Link href="/dashboard/transactions" className="text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm hover:underline font-medium">See All</Link>
            </div>
            {transactions.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-500 text-sm py-6 text-center">No transactions yet</p>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {transactions.slice(0, 5).map((tx: any) => (
                  <div key={tx.id} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        tx.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-500' :
                        tx.type === 'withdraw' ? 'bg-rose-500/10 text-rose-500' :
                        tx.type === 'referral' ? 'bg-emerald-500/10 text-emerald-500' :
                        tx.type === 'bonus' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-blue-500/10 text-blue-500'
                      }`}>
                        {tx.type === 'deposit' ? <ArrowDownLeft size={14} /> :
                         tx.type === 'withdraw' ? <ArrowUpRight size={14} /> :
                         tx.type === 'referral' ? <Users size={14} /> :
                         tx.type === 'bonus' ? <Gift size={14} /> :
                         <TrendingUp size={14} />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-white capitalize truncate">{tx.type}</p>
                        <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-500">{timeAgo(tx.createdAt)}</p>
                      </div>
                    </div>
                    <p className={`text-xs sm:text-sm font-bold shrink-0 ${tx.type === 'withdraw' ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {tx.type === 'withdraw' ? '-' : '+'}${tx.netAmount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Earnings Snapshot */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg card-lift">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Earnings Snapshot</h3>
              <Link href="/dashboard/wallet/stats" className="text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm hover:underline font-medium">Full Report</Link>
            </div>
            {incomeBreakdown.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-500 text-sm py-6 text-center">No earnings recorded yet</p>
            ) : (
              <div className="space-y-2.5 sm:space-y-3">
                {incomeBreakdown.map((row) => (
                  <div key={row.category} className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-500 dark:text-slate-400">{row.category}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      ${row.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Network Snapshot */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg card-lift">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">Network Snapshot</h3>
            <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Current Rank</span>
                <span className="font-semibold text-slate-900 dark:text-white">{rankInfo?.currentRankInfo?.name || 'Starter'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Team Users</span>
                <span className="font-semibold text-slate-900 dark:text-white">{referralStats?.totalReferrals ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Business Volume</span>
                <span className="font-semibold text-slate-900 dark:text-white">${businessVolumeCurrent.toLocaleString()}</span>
              </div>
            </div>
            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full mt-3 sm:mt-4">
              <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full" style={{ width: `${Math.min(rankProgressPct, 100)}%` }} />
            </div>
            {businessVolumeRequired > 0 && (
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-500 mt-2">
                {Math.round(rankProgressPct)}% toward {rankInfo?.nextRankInfo?.name || 'next rank'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Row 6: Recent Transactions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg card-lift">
        {/* <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
          <Link href="/dashboard/transactions" className="text-emerald-500 text-xs sm:text-sm hover:underline font-medium">View All</Link>
        </div> */}

        {/* Desktop Table View */}
        {/* <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Transaction ID</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm text-slate-600 dark:text-slate-300">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-600 dark:text-slate-500">
                    <DollarSign className="mx-auto mb-2 text-slate-600" size={40} />
                    <p>No transactions yet</p>
                    <p className="text-xs mt-1">Your transaction history will appear here</p>
                  </td>
                </tr>
              ) : (
                transactions.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-500">{tx.transactionId}</td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center font-medium capitalize ${getTypeColor(tx.type)}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">{formatDate(tx.createdAt)}</td>
                    <td className={`px-6 py-4 font-bold ${
                       tx.type === 'withdraw' ? 'text-rose-400' : 'text-slate-900 dark:text-white'
                    }`}>
                      {tx.type === 'withdraw' ? '-' : '+'}${tx.netAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div> */}

        {/* Mobile Card View */}
        {/* <div className="sm:hidden divide-y divide-slate-200 dark:divide-slate-800">
          {transactions.length === 0 ? (
            <div className="px-4 py-10 text-center text-slate-600 dark:text-slate-500">
              <DollarSign className="mx-auto mb-2 text-slate-600" size={32} />
              <p className="text-sm">No transactions yet</p>
              <p className="text-xs mt-1">Your transaction history will appear here</p>
            </div>
          ) : (
            transactions.map((tx: any) => (
              <div key={tx.id} className="p-3 flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    tx.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-400' :
                    tx.type === 'withdraw' ? 'bg-rose-500/10 text-rose-400' :
                    tx.type === 'profit' ? 'bg-emerald-500/10 text-emerald-500' :
                    'bg-blue-500/10 text-blue-400'
                  }`}>
                    {tx.type === 'deposit' ? <ArrowDownLeft size={14} /> :
                     tx.type === 'withdraw' ? <ArrowUpRight size={14} /> :
                     <DollarSign size={14} />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-900 dark:text-white capitalize">{tx.type}</p>
                    <p className="text-[10px] text-slate-600 dark:text-slate-500">{formatDate(tx.createdAt)}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className={`text-sm font-bold ${tx.type === 'withdraw' ? 'text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                    {tx.type === 'withdraw' ? '-' : '+'}${tx.netAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${getStatusColor(tx.status)}`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div> */}
      </div>

    </div>
  );
};

export default DashboardHome;
