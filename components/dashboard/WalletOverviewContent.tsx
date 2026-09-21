'use client'

import React from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import {
  ArrowDownLeft, ArrowUpRight, Bot, BarChart3, Clock, Wallet as WalletIcon,
  Loader2, AlertCircle, TrendingUp, Users, Gift,
} from 'lucide-react';
import { useGetWalletQuery, useGetWalletStatsQuery } from '@/store/api/walletApi';
import { useGetMyTransactionsQuery } from '@/store/api/transactionApi';
import { getIncomeIcon } from '@/lib/incomeIcons';

const fmt = (n: number) =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

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

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed': return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
    case 'pending': return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
    case 'processing': return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
    case 'rejected':
    case 'cancelled': return 'bg-rose-500/10 text-rose-500 border border-rose-500/20';
    default: return 'bg-slate-300/10 dark:bg-slate-500/10 text-slate-600 dark:text-slate-500 border border-slate-300/20 dark:border-slate-500/20';
  }
};

const WalletOverviewContent = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const { data: walletData, isLoading: walletLoading, error: walletError } = useGetWalletQuery();
  const { data: walletStatsData } = useGetWalletStatsQuery({});
  const { data: transactionsData, isLoading: transactionsLoading } = useGetMyTransactionsQuery({ page: 1, limit: 10 });

  const wallet = walletData?.data?.attributes;
  const incomeBreakdown = walletStatsData?.data?.attributes?.incomeBreakdown || [];
  const transactions = (transactionsData?.data?.attributes?.results || []) as any[];
  const withdrawals = transactions.filter((tx) => tx.type === 'withdraw');

  const now = new Date();
  const thisMonthCommission = transactions
    .filter((tx) => {
      const d = new Date(tx.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
        && ['profit', 'referral', 'bonus'].includes(tx.type);
    })
    .reduce((sum, tx) => sum + (tx.netAmount ?? 0), 0);

  if (walletLoading || transactionsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="animate-spin text-emerald-500 mx-auto mb-4" size={48} />
          <p className="text-slate-500 dark:text-slate-400">Loading wallet...</p>
        </div>
      </div>
    );
  }

  if (walletError || !wallet) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <AlertCircle className="text-rose-500 mx-auto mb-4" size={48} />
          <p className="text-rose-400 font-medium mb-2">Failed to load wallet</p>
          <p className="text-slate-600 dark:text-slate-500 text-sm">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  const summaryTiles = [
    { label: 'Confirmed', value: fmt(wallet.balance), icon: WalletIcon, tint: 'bg-emerald-500/10 text-emerald-500' },
    { label: 'Pending Withdrawals', value: fmt(wallet.pendingWithdrawals ?? 0), icon: Clock, tint: 'bg-amber-500/10 text-amber-500' },
    { label: 'Total Invested', value: fmt(wallet.totalInvested ?? 0), icon: TrendingUp, tint: 'bg-blue-500/10 text-blue-500' },
    ...incomeBreakdown.slice(0, 3).map((row) => {
      const { icon, tint } = getIncomeIcon(row.category);
      return { label: row.category, value: fmt(row.amount), icon, tint };
    }),
  ];

  return (
    <div className="space-y-4 sm:space-y-8">
      <div>
        <p className="text-slate-500 dark:text-slate-400 text-sm">{currentUser?.firstName} {currentUser?.lastName}</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Wallet</h1>
      </div>

      {/* Balance hero + quick actions */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-5 sm:p-8 text-white shadow-xl shadow-emerald-900/20 card-lift">
        <p className="text-emerald-100 text-sm font-medium mb-1">Available Balance</p>
        <p className="text-3xl sm:text-4xl font-bold mb-5">{fmt(wallet.balance)}</p>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Link href="/dashboard/deposit" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-emerald-700 font-semibold text-sm hover:bg-emerald-50 transition-colors">
            <ArrowDownLeft size={15} /> Deposit
          </Link>
          <Link href="/dashboard/withdraw" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 font-semibold text-sm transition-colors">
            <ArrowUpRight size={15} /> Withdraw
          </Link>
          <Link href="/dashboard/autobots" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 font-semibold text-sm transition-colors">
            <Bot size={15} /> Buy AutoBot
          </Link>
          <Link href="/dashboard/wallet/stats" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 font-semibold text-sm transition-colors">
            <BarChart3 size={15} /> View Stats
          </Link>
        </div>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {summaryTiles.map(({ label, value, icon: Icon, tint }) => (
          <div key={label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 tilt-card-flat">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${tint}`}>
              <Icon size={16} />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs mb-0.5 truncate">{label}</p>
            <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* This Month */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 card-lift">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">This Month</h3>
          <span className="text-xs text-slate-500 dark:text-slate-500">
            {now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
        </div>
        {thisMonthCommission > 0 ? (
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{fmt(thisMonthCommission)}</p>
        ) : (
          <p className="text-slate-500 dark:text-slate-500 text-sm py-4 text-center">No commission income for this month yet.</p>
        )}
      </div>

      {/* Transactions + Withdrawal Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 card-lift">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Transactions</h3>
            <Link href="/dashboard/transactions" className="text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm hover:underline font-medium">See All</Link>
          </div>
          {transactions.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-500 text-sm py-6 text-center">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 6).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      tx.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-500' :
                      tx.type === 'withdraw' ? 'bg-rose-500/10 text-rose-500' :
                      tx.type === 'referral' ? 'bg-blue-500/10 text-blue-500' :
                      tx.type === 'bonus' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-slate-500/10 text-slate-500'
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
                    {tx.type === 'withdraw' ? '-' : '+'}{fmt(tx.netAmount ?? 0)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 card-lift">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Withdrawal Requests</h3>
            <Link href="/dashboard/withdraw/history" className="text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm hover:underline font-medium">Manage</Link>
          </div>
          {withdrawals.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-500 text-sm py-6 text-center">No withdrawal requests yet</p>
          ) : (
            <div className="space-y-3">
              {withdrawals.slice(0, 5).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{fmt(tx.amount ?? tx.netAmount ?? 0)}</p>
                    <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-500 truncate">
                      {tx.transactionId || tx.id} · {timeAgo(tx.createdAt)}
                    </p>
                  </div>
                  <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(tx.status)}`}>
                    {tx.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletOverviewContent;
