'use client'

import React from 'react';
import {
  Sparkles, ArrowRight, Check, Clock, Bot, Wallet, Wifi, Users, ExternalLink,
} from 'lucide-react';
import SmartMemberCard from '@/components/dashboard/SmartMemberCard';

interface MemberPackage {
  code: string;
  name: string;
  price: string;
  validity: string;
  bonus: string;
  autobots: string;
  benefits: string[];
  badge?: string;
}

const PACKAGES: MemberPackage[] = [
  { code: 'PKG 1', name: 'Package 01', price: '$17', validity: '365 days validity', bonus: '$20 SSP award', autobots: '1 AutoBot eq.', benefits: ['Wallet bonus $20', 'Loss protection $50', '1 AutoBot credit'] },
  { code: 'PKG 2', name: 'Package 02', price: '$25', validity: '365 days validity', bonus: '$30 SSP award', autobots: '1 AutoBot eq.', benefits: ['Wallet bonus $30', 'Loss protection $100', '1 AutoBot credit'] },
  { code: 'PKG 3', name: 'Package 03', price: '$30', validity: '365 days validity', bonus: '$50 SSP award', autobots: '1 AutoBot eq.', benefits: ['Wallet bonus $50', 'Loss protection $200', '1 AutoBot credit'] },
  { code: 'PKG 4', name: 'Package 04', price: '$40', validity: '365 days validity', bonus: '$100 SSP award', autobots: '1 AutoBot eq.', benefits: ['Wallet bonus $100', 'Loss protection $250', '1 AutoBot credit'] },
  { code: 'PKG 5', name: 'Package 05', price: '$60', validity: '365 days validity', bonus: '$150 SSP award', autobots: '2 AutoBot eq.', benefits: ['Wallet bonus $150', 'Loss protection $300', '2 AutoBot credits'] },
  { code: 'PKG 6', name: 'Package 06', price: '$70', validity: '365 days validity', bonus: '$200 SSP award', autobots: '2 AutoBot eq.', benefits: ['Wallet bonus $200', 'Loss protection $350', '2 AutoBot credits'] },
  { code: 'PKG 7', name: 'Package 07', price: '$80', validity: '365 days validity', bonus: '$250 SSP award', autobots: '2 AutoBot eq.', benefits: ['Wallet bonus $250', 'Loss protection $400', '2 AutoBot credits'] },
  { code: 'PKG COUPLE', name: 'Family Package (Couple)', price: '$50', validity: '+$5/member', bonus: '$50 SSP award', autobots: '2 AutoBot eq.', benefits: ['Covers you & partner', 'Wallet bonus $50', 'Loss protection $200'], badge: 'Family · up to 2' },
  { code: 'PKG FAMILY', name: 'Family Package (With Children)', price: '$55', validity: 'incl. 1 child · +$5/child', bonus: '$50 SSP award', autobots: '2 AutoBot eq.', benefits: ['Partner + children', 'Wallet bonus $50 (+$20/child)', 'At least 1 child'], badge: 'Family · 1–5 children' },
  { code: 'PKG STUDENT', name: 'Student Package', price: '$20', validity: '365 days validity', bonus: '$10 SSP award', autobots: '1 AutoBot eq.', benefits: ['Learning credit $10', 'Wallet bonus $10', '1 AutoBot credit'] },
  { code: 'VIP 1', name: 'VIP 01', price: '$100', validity: '365 days validity', bonus: '$300 SSP award', autobots: '3 AutoBot eq.', benefits: ['Wallet bonus $300', 'Loss protection $500', '3 AutoBot credits'] },
  { code: 'VIP 2', name: 'VIP 02', price: '$130', validity: '365 days validity', bonus: '$500 SSP award', autobots: '3 AutoBot eq.', benefits: ['Wallet bonus $500', 'Loss protection $500', '3 AutoBot credits'] },
  { code: 'ERLY 1', name: 'Package Early 01', price: '$7', validity: '365 days validity', bonus: '0 SSP award', autobots: '0 AutoBot eq.', benefits: ['Wallet bonus $20', 'Loss protection $50'] },
  { code: 'NFC 1', name: 'Digital NFC Card', price: '$12.50', validity: '365 days validity', bonus: '$10 SSP award', autobots: '1 AutoBot eq.', benefits: ['All Smart Member benefits'] },
];

const STEPS = ['Application', 'Review', 'Approved', 'Card Assigned', 'Delivered'];

const PERKS = [
  { icon: Wallet, title: 'Wallet Bonus', text: 'Package-based bonus credited to your wallet balance instantly.' },
  { icon: Bot, title: 'AutoBot Credit', text: 'Every package includes AutoBot credits added straight to your account.' },
  { icon: Wifi, title: 'NFC Tap Access', text: 'Tap your card at any partner event or trading meetup — your profile loads instantly.' },
  { icon: Users, title: 'Priority Support', text: 'Dedicated support line and faster response times for Smart Members.' },
];

const SmartMemberContent = () => {
  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 card-lift">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.06] pointer-events-none" />
        <div className="absolute -top-24 right-0 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 sm:p-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 mb-5">
              <Sparkles size={14} className="text-emerald-400" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400">Smart Member card</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight mb-4">
              Trade smarter.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300">Get rewarded more.</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6 max-w-md">
              Activate from <strong className="text-white">$17</strong> once per year. Get wallet bonus credit, loss protection,
              NFC-tap profile access at partner events, and package-based AutoBot credits added to your account instantly.
            </p>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all"
            >
              Continue Application
              <ArrowRight size={16} />
            </button>
          </div>

          <SmartMemberCard />
        </div>
      </div>

      {/* Packages */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-1">Smart Member packages</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">Compare every plan and its benefits.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {PACKAGES.map((pkg) => (
            <div key={pkg.code} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col tilt-card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">{pkg.code}</p>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{pkg.name}</h3>
                  {pkg.badge && (
                    <span className="inline-block mt-1.5 text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      {pkg.badge}
                    </span>
                  )}
                </div>
                <button type="button" className="shrink-0 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-full px-3 py-1 hover:bg-emerald-500/10 transition-colors">
                  Apply
                </button>
              </div>

              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white leading-none">{pkg.price}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-1">{pkg.validity}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 leading-none">{pkg.bonus}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-1">{pkg.autobots}</p>
                </div>
              </div>

              <ul className="space-y-1.5 mb-4 flex-1">
                {pkg.benefits.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <Check size={13} className="text-emerald-500 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>

              <button type="button" className="text-left text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline mb-3">
                Apply with this package →
              </button>
              <button type="button" className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                <ExternalLink size={12} />
                View full details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Application Status */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 card-lift">
        <div className="flex items-center gap-2 mb-6">
          <Clock size={18} className="text-emerald-500" />
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Application Status</h3>
        </div>
        <div className="flex items-center overflow-x-auto pb-1 -mx-1 px-1">
          {STEPS.map((step, i) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  i === 0 ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600'
                }`}>
                  {i + 1}
                </div>
                <span className={`text-[10px] sm:text-xs whitespace-nowrap ${i === 0 ? 'text-slate-900 dark:text-white font-semibold' : 'text-slate-500 dark:text-slate-500'}`}>
                  {step}
                </span>
              </div>
              {i < STEPS.length - 1 && <div className="flex-1 min-w-[16px] h-px bg-slate-200 dark:bg-slate-800 mx-2 mb-5" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* What you get */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 card-lift">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-5">What you get</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PERKS.map(({ icon: Icon, title, text }) => (
            <div key={title}>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
                <Icon size={18} />
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">{title}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden card-lift">
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Payment History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[560px]">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <th className="px-5 sm:px-6 py-3 font-semibold">Date</th>
                <th className="px-5 sm:px-6 py-3 font-semibold">Type</th>
                <th className="px-5 sm:px-6 py-3 font-semibold">Amount</th>
                <th className="px-5 sm:px-6 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="px-5 sm:px-6 py-10 text-center text-slate-500 dark:text-slate-500">
                  No payment history yet — apply for a package above to get started.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SmartMemberContent;
