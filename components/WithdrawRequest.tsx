'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { Wallet, AlertCircle, ArrowUpRight, CheckCircle, Loader2, Star, Bookmark, X, TrendingUp, Clock, Landmark, Check } from 'lucide-react';
import { useGetActiveGatewaysQuery } from '@/store/api/paymentGatewayApi';
import { useGetWalletQuery } from '@/store/api/walletApi';
import { useCreateWithdrawalMutation, useGetMyTransactionsQuery } from '@/store/api/transactionApi';
import { useGetSavedAccountsQuery } from '@/store/api/savedAccountApi';
import type { SavedAccount } from '@/store/api/savedAccountApi';

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

const WithdrawRequest = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [selectedGateway, setSelectedGateway] = useState('');
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [selectedSavedAccount, setSelectedSavedAccount] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showInvestFirstModal, setShowInvestFirstModal] = useState(false);
  const [requestsStatusFilter, setRequestsStatusFilter] = useState('all');

  // Fetch wallet data
  const { data: walletResponse, isLoading: walletLoading } = useGetWalletQuery();
  const wallet = walletResponse?.data?.attributes;
  const balance = wallet?.balance || 0;
  const totalDeposit = Number(wallet?.totalDeposit ?? 0);
  const pendingWithdrawals = Number(wallet?.pendingWithdrawals ?? 0);
  /** Withdrawals require at least one deposit / investment on record */
  const canRequestWithdrawal = totalDeposit > 0;

  // Recent withdrawal requests, for the "Recent Requests" panel
  const { data: transactionsData } = useGetMyTransactionsQuery({ page: 1, limit: 20, type: 'withdraw' });
  const recentRequests = (transactionsData?.data?.attributes?.results || []) as any[];

  const openInvestFirstModal = () => setShowInvestFirstModal(true);

  // Fetch active gateways for withdrawal
  const { data: gatewaysResponse, isLoading: gatewaysLoading } = useGetActiveGatewaysQuery({ purpose: 'withdraw' });
  const gateways = gatewaysResponse?.data?.attributes || [];

  // Fetch saved accounts
  const { data: savedAccountsResponse } = useGetSavedAccountsQuery();
  const savedAccounts: SavedAccount[] = (savedAccountsResponse?.data?.attributes as any)?.results || [];

  // Create withdrawal mutation
  const [createWithdrawal, { isLoading: submitting }] = useCreateWithdrawalMutation();

  const selectedGatewayData = gateways.find((g: any) => g.id === selectedGateway);

  // Filter saved accounts matching the selected gateway type
  const filteredSavedAccounts = selectedGatewayData
    ? savedAccounts.filter((a: SavedAccount) =>
        (selectedGatewayData.type === 'crypto' && a.accountType === 'crypto') ||
        (selectedGatewayData.type === 'bank' && a.accountType === 'bank')
      )
    : [];

  const handleSavedAccountSelect = (accountId: string) => {
    setSelectedSavedAccount(accountId);
    if (accountId) {
      const account = savedAccounts.find((a: SavedAccount) => a.id === accountId);
      if (account) {
        if (account.accountType === 'crypto') {
          setWalletAddress(account.walletAddress || '');
          setAccountNumber('');
          setAccountName('');
        } else if (account.accountType === 'bank') {
          setAccountNumber(account.bankDetails?.accountNumber || '');
          setAccountName(account.bankDetails?.accountName || '');
          setWalletAddress('');
        }
      }
    } else {
      setWalletAddress('');
      setAccountNumber('');
      setAccountName('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!canRequestWithdrawal) {
      openInvestFirstModal();
      return;
    }

    if (!selectedGateway) {
      setError('Please select a withdrawal method');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    const requiredBalance = parseFloat(amount) * 1.15;
    if (requiredBalance > balance) {
      setError(`Insufficient balance. You need $${requiredBalance.toFixed(2)} (withdrawal amount + 15%) but your balance is $${balance.toFixed(2)}.`);
      return;
    }

    if (selectedGatewayData?.type === 'crypto' && !walletAddress) {
      setError('Please enter your wallet address');
      return;
    }

    if (selectedGatewayData?.type === 'bank' && (!accountNumber || !accountName)) {
      setError('Please enter your bank account details');
      return;
    }

    try {
      const withdrawalData: any = {
        amount: parseFloat(amount),
        paymentGatewayId: selectedGateway,
      };

      if (selectedGatewayData?.type === 'crypto') {
        withdrawalData.walletAddress = walletAddress;
      } else if (selectedGatewayData?.type === 'bank') {
        // If using a saved account, include full bank details
        const savedAccount = selectedSavedAccount
          ? savedAccounts.find((a: SavedAccount) => a.id === selectedSavedAccount)
          : null;
        if (savedAccount?.bankDetails) {
          withdrawalData.bankDetails = {
            bankName: savedAccount.bankDetails.bankName,
            accountNumber: savedAccount.bankDetails.accountNumber,
            accountName: savedAccount.bankDetails.accountName,
            routingNumber: savedAccount.bankDetails.routingNumber,
            swiftCode: savedAccount.bankDetails.swiftCode,
          };
        } else {
          withdrawalData.bankDetails = {
            accountNumber,
            accountName,
          };
        }
      }

      await createWithdrawal(withdrawalData).unwrap();

      setSuccess(true);
      setAmount('');
      setWalletAddress('');
      setAccountNumber('');
      setAccountName('');
      setSelectedGateway('');
      setSelectedSavedAccount('');

      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to submit withdrawal request. Please try again.');
    }
  };

  if (walletLoading || gatewaysLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="animate-spin text-emerald-500 mx-auto mb-4" size={32} />
          <p className="text-slate-500 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {showInvestFirstModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowInvestFirstModal(false)}
              className="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-amber-500/15 p-3 rounded-xl text-amber-400">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white pr-8">Invest first</h3>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
              You need to make a deposit or investment before you can request a withdrawal. Your total deposit is currently{' '}
              <span className="text-slate-900 dark:text-white font-semibold">${totalDeposit.toFixed(2)}</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/dashboard/plans/invest"
                onClick={() => setShowInvestFirstModal(false)}
                className="flex-1 text-center py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-sm hover:opacity-95 transition-opacity"
              >
                View investment plans
              </Link>
              <button
                type="button"
                onClick={() => setShowInvestFirstModal(false)}
                className="flex-1 py-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-1 mb-4 sm:mb-6">
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{currentUser?.firstName} {currentUser?.lastName}</p>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Withdraw Funds</h2>
          <span className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">Request a secure payout to your wallet</span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
          <Wallet size={14} /> Available ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl card-lift">

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5 sm:mb-8">
              <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg p-2 sm:p-3 text-center tilt-card-flat min-w-0">
                <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500 font-semibold mb-1 truncate">Withdrawable</p>
                <p className="text-xs sm:text-base font-bold text-slate-900 dark:text-white truncate">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg p-2 sm:p-3 text-center tilt-card-flat min-w-0">
                <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500 font-semibold mb-1 truncate">Confirmed</p>
                <p className="text-xs sm:text-base font-bold text-slate-900 dark:text-white truncate">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg p-2 sm:p-3 text-center tilt-card-flat min-w-0">
                <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500 font-semibold mb-1 truncate">In Queue</p>
                <p className="text-xs sm:text-base font-bold text-slate-900 dark:text-white truncate">${pendingWithdrawals.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>

            {!canRequestWithdrawal && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="text-amber-400 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-amber-200 font-medium text-sm">Deposit required</p>
                  <p className="text-amber-200/80 text-xs mt-1">
                    You must invest or deposit before withdrawals are enabled.{' '}
                    <button
                      type="button"
                      onClick={openInvestFirstModal}
                      className="text-emerald-400 font-semibold underline hover:text-emerald-300"
                    >
                      Learn more
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mb-6 flex items-start gap-3">
                <CheckCircle className="text-emerald-500 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-emerald-400 font-medium">Withdrawal Request Submitted!</p>
                  <p className="text-emerald-300/80 text-sm mt-1">Your withdrawal request has been submitted successfully and is pending approval.</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="text-rose-500 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-rose-400 font-medium">Error</p>
                  <p className="text-rose-300/80 text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Withdraw Amount */}
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Withdraw Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 font-bold text-2xl">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg pl-10 pr-20 py-4 text-slate-900 dark:text-white text-2xl sm:text-3xl font-bold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setAmount((Math.floor((balance / 1.15) * 100) / 100).toString())}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-emerald-500 px-2.5 py-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    MAX
                  </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-2 text-center">
                  You can request up to ${(balance / 1.15).toLocaleString('en-US', { maximumFractionDigits: 2 })} right now
                  {selectedGatewayData && ` — minimum ${selectedGatewayData.minWithdraw}`}
                </p>
                {balance > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-3">
                    {[0.25, 0.5, 0.75, 1].map((pct) => {
                      const maxRequestable = balance / 1.15;
                      const value = Math.floor(maxRequestable * pct * 100) / 100;
                      return (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setAmount(value.toString())}
                          className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-full hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        >
                          {pct === 1 ? 'Max' : `${pct * 100}%`}
                        </button>
                      );
                    })}
                  </div>
                )}
                {parseFloat(amount) > 0 && parseFloat(amount) * 1.15 > balance && (
                  <p className="text-red-500 text-xs mt-3 flex items-center justify-center">
                    <AlertCircle size={12} className="mr-1" />
                    Insufficient balance. Required: ${(parseFloat(amount) * 1.15).toFixed(2)} (amount + 15% service fee)
                  </p>
                )}
              </div>

              {/* Step 2: Payment Method */}
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Payment Method</label>
                <p className="text-xs text-slate-500 dark:text-slate-500 mb-3">Choose where you want to receive funds</p>
                <div className="space-y-2">
                  {gateways.map((gateway: any) => (
                    <button
                      key={gateway.id}
                      type="button"
                      onClick={() => {
                        setSelectedGateway(gateway.id);
                        setSelectedSavedAccount('');
                        setWalletAddress('');
                        setAccountNumber('');
                        setAccountName('');
                      }}
                      className={`w-full flex items-center justify-between gap-3 p-3.5 rounded-lg border transition-colors ${
                        selectedGateway === gateway.id
                          ? 'border-emerald-500 bg-emerald-500/5'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {gateway.type === 'crypto' ? <Wallet size={18} className="text-slate-500 dark:text-slate-400" /> : <Landmark size={18} className="text-slate-500 dark:text-slate-400" />}
                        <div className="text-left">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{gateway.name} <span className="text-slate-400 dark:text-slate-600 font-normal">({gateway.currency})</span></p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-500">
                            Min ${gateway.minWithdraw} · Max ${gateway.maxWithdraw}
                            {gateway.withdrawFee > 0 && ` · Fee ${gateway.withdrawFeeType === 'percentage' ? gateway.withdrawFee + '%' : '$' + gateway.withdrawFee}`}
                          </p>
                        </div>
                      </div>
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        selectedGateway === gateway.id ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {selectedGateway === gateway.id && <Check size={12} className="text-white" strokeWidth={3} />}
                      </span>
                    </button>
                  ))}
                  {gateways.length === 0 && (
                    <p className="text-slate-500 dark:text-slate-500 text-sm py-4 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                      No payment methods available right now
                    </p>
                  )}
                </div>
              </div>

              {/* Step 3: Withdrawal Account Details */}
              {selectedGatewayData && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                    {selectedGatewayData.type === 'crypto' ? 'Wallet Address' : 'Bank Account Details'}
                  </label>

                  {/* Saved Accounts Suggestion */}
                  {filteredSavedAccounts.length > 0 && (
                    <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <Bookmark size={14} className="text-emerald-500" />
                        <span className="font-medium">Your Saved Accounts</span>
                      </div>
                      <div className="grid gap-2">
                        {filteredSavedAccounts.map((account: SavedAccount) => (
                          <button
                            key={account.id}
                            type="button"
                            onClick={() => handleSavedAccountSelect(account.id)}
                            className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between ${
                              selectedSavedAccount === account.id
                                ? 'border-emerald-500 bg-emerald-500/10 text-slate-900 dark:text-white'
                                : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                selectedSavedAccount === account.id ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                              }`}>
                                {account.accountType === 'crypto' ? <Wallet size={14} /> : <Bookmark size={14} />}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{account.label}</span>
                                  {account.isDefault && (
                                    <Star size={12} className="text-emerald-500 fill-emerald-500" />
                                  )}
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-500 mt-0.5 font-mono">
                                  {account.accountType === 'crypto'
                                    ? `${account.walletAddress?.slice(0, 10)}...${account.walletAddress?.slice(-8)}`
                                    : `${account.bankDetails?.bankName} — ****${account.bankDetails?.accountNumber?.slice(-4)}`
                                  }
                                </p>
                              </div>
                            </div>
                            {selectedSavedAccount === account.id && (
                              <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                      {selectedSavedAccount && (
                        <button
                          type="button"
                          onClick={() => handleSavedAccountSelect('')}
                          className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                          Clear selection and enter manually
                        </button>
                      )}
                    </div>
                  )}

                  {/* Manual Entry — Crypto Wallet Address */}
                  {selectedGatewayData.type === 'crypto' && (
                    <div>
                      {filteredSavedAccounts.length > 0 && !selectedSavedAccount && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Or enter a wallet address manually:</p>
                      )}
                      {filteredSavedAccounts.length === 0 && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Enter your {selectedGatewayData.currency} wallet address:</p>
                      )}
                      <input
                        type="text"
                        value={walletAddress}
                        onChange={(e) => { setWalletAddress(e.target.value); if (selectedSavedAccount) setSelectedSavedAccount(''); }}
                        placeholder="e.g. 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                        className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors font-mono text-sm ${selectedSavedAccount ? 'opacity-60' : ''}`}
                        readOnly={!!selectedSavedAccount}
                        required
                      />
                      <p className="text-xs text-amber-400 mt-2 flex items-start gap-1">
                        <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                        Double-check your wallet address. Funds sent to wrong addresses cannot be recovered.
                      </p>
                    </div>
                  )}

                  {/* Manual Entry — Bank Account Details */}
                  {selectedGatewayData.type === 'bank' && (
                    <div className="space-y-4">
                      {filteredSavedAccounts.length > 0 && !selectedSavedAccount && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">Or enter bank details manually:</p>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Account Number</label>
                        <input
                          type="text"
                          value={accountNumber}
                          onChange={(e) => { setAccountNumber(e.target.value); if (selectedSavedAccount) setSelectedSavedAccount(''); }}
                          placeholder="Enter your account number"
                          className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors ${selectedSavedAccount ? 'opacity-60' : ''}`}
                          readOnly={!!selectedSavedAccount}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Account Name</label>
                        <input
                          type="text"
                          value={accountName}
                          onChange={(e) => { setAccountName(e.target.value); if (selectedSavedAccount) setSelectedSavedAccount(''); }}
                          placeholder="Enter account holder name"
                          className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors ${selectedSavedAccount ? 'opacity-60' : ''}`}
                          readOnly={!!selectedSavedAccount}
                          required
                        />
                      </div>
                      {selectedGatewayData.bankDetails && (
                        <div className="bg-blue-500/5 border border-blue-500/30 rounded-lg p-4">
                          <p className="text-blue-400 text-xs font-medium mb-2">Bank Details</p>
                          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                            {selectedGatewayData.bankDetails.bankName && <p>Bank: {selectedGatewayData.bankDetails.bankName}</p>}
                            {selectedGatewayData.bankDetails.accountNumber && <p>Account: {selectedGatewayData.bankDetails.accountNumber}</p>}
                            {selectedGatewayData.bankDetails.swiftCode && <p>SWIFT: {selectedGatewayData.bankDetails.swiftCode}</p>}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Instructions */}
              {selectedGatewayData?.instructions && (
                <div className="bg-slate-100/30 dark:bg-slate-800/30 border border-slate-300 dark:border-slate-700 rounded-lg p-4">
                  <p className="text-slate-600 dark:text-slate-300 text-xs whitespace-pre-wrap">{selectedGatewayData.instructions}</p>
                </div>
              )}

              {/* Summary */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Summary</h4>
                <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                  <div className="flex justify-between px-4 py-2.5">
                    <span className="text-slate-500 dark:text-slate-400">Requested Amount</span>
                    <span className="font-semibold text-slate-900 dark:text-white">${(parseFloat(amount) || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between px-4 py-2.5">
                    <span className="text-slate-500 dark:text-slate-400">Payment Method</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{selectedGatewayData?.name || '—'}</span>
                  </div>
                  <div className="flex justify-between px-4 py-2.5">
                    <span className="text-slate-500 dark:text-slate-400">Service Charge (15%)</span>
                    <span className="font-semibold text-rose-500">-${((parseFloat(amount) || 0) * 0.15).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between px-4 py-3 bg-emerald-500/5">
                    <span className="font-bold text-slate-900 dark:text-white">You will Receive</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">${(parseFloat(amount) || 0).toFixed(2)}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-2">
                  The 15% service charge is deducted from your wallet balance in addition to the amount you receive.
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={
                    submitting ||
                    !selectedGateway ||
                    !amount ||
                    parseFloat(amount) * 1.15 > balance
                  }
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-4 px-4 rounded-lg shadow-lg shadow-emerald-500/20 transform hover:-translate-y-1 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={18} />
                      Processing...
                    </>
                  ) : (
                    <>
                      Submit Request
                      <ArrowUpRight size={18} className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-6 card-lift">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h4 className="text-slate-900 dark:text-white font-bold text-sm sm:text-base">Recent Requests</h4>
              <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-500 flex items-center gap-1">
                <Clock size={11} /> Latest {Math.min(recentRequests.length, 12)}
              </span>
            </div>
            {recentRequests.length > 0 && (
              <select
                value={requestsStatusFilter}
                onChange={(e) => setRequestsStatusFilter(e.target.value)}
                className="w-full mb-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
            )}
            {recentRequests.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-500 text-sm py-6 text-center">No withdrawal requests yet</p>
            ) : recentRequests.filter((tx) => requestsStatusFilter === 'all' || tx.status === requestsStatusFilter).length === 0 ? (
              <p className="text-slate-500 dark:text-slate-500 text-sm py-6 text-center">No requests match this filter</p>
            ) : (
              <div className="space-y-3">
                {recentRequests
                  .filter((tx) => requestsStatusFilter === 'all' || tx.status === requestsStatusFilter)
                  .slice(0, 12)
                  .map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                        <Clock size={14} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          ${(tx.amount ?? tx.netAmount ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-500">{timeAgo(tx.createdAt)}</p>
                      </div>
                    </div>
                    <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(tx.status)}`}>
                      {tx.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <Link href="/dashboard/withdraw/history" className="block text-center text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm hover:underline font-medium mt-4">
              View full history
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-6 card-lift">
            <h4 className="text-slate-900 dark:text-white font-bold text-sm sm:text-base mb-3 sm:mb-4">Important Information</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 mr-2 shrink-0"></span>
                Withdrawals are processed within 24 hours.
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 mr-2 shrink-0"></span>
                Minimum withdrawal amount is $10.00.
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 mr-2 shrink-0"></span>
                Ensure your wallet address is correct. We are not responsible for funds sent to wrong addresses.
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 mr-2 shrink-0"></span>
                A 2% fee applies to bank transfers. Crypto withdrawals are free.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawRequest;
