import React from 'react';
import Link from 'next/link';
import { ShieldAlert, FileText, Lock, CreditCard, Landmark, Bitcoin } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 pt-10 sm:pt-16 pb-6 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Payment methods strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8 sm:pb-10 mb-10 sm:mb-14 border-b border-slate-200 dark:border-slate-900">
          <p className="text-slate-500 dark:text-slate-500 text-xs sm:text-sm font-medium">Fund your account your way</p>
          <div className="flex items-center gap-4 sm:gap-6 text-slate-400 dark:text-slate-600">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm">
              <CreditCard size={16} /> Card
            </div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm">
              <Landmark size={16} /> Bank Transfer
            </div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm">
              <Bitcoin size={16} /> Crypto
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-10 gap-x-6 sm:gap-x-8 mb-10 sm:mb-14">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2 lg:pr-8">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 leading-none">Pip<span className="text-brand-500">guardian</span><span className="text-green-400 text-xs font-bold ml-0.5 align-bottom">elt</span></h3>
            <p className="text-slate-600 dark:text-slate-500 text-xs sm:text-sm leading-relaxed mb-4 max-w-sm">
              A structured investment platform built for confident growth — flexible plans, transparent payouts, and a rewarding referral network.
            </p>
            <ul className="space-y-1.5 text-slate-500 dark:text-slate-500 text-xs">
              <li>12 Rue de Rivoli, 75004 Paris, France</li>
              <li>Moscow, Russia — Suite 45, Floor 12, Freedom Tower East, 12 Presnenskaya Naberezhnaya, 123112</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold text-sm sm:text-base mb-4 sm:mb-6">Company</h4>
            <ul className="space-y-3 text-slate-500 dark:text-slate-400 text-sm">
              <li><Link href="/about" className="hover:text-brand-500 transition-colors">About Us</Link></li>
              <li><a href="/#about" className="hover:text-brand-500 transition-colors">Why Pipguardian</a></li>
              <li><a href="/#" className="hover:text-brand-500 transition-colors">Referral Program</a></li>
            </ul>
          </div>

          {/* Invest */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold text-sm sm:text-base mb-4 sm:mb-6">Invest</h4>
            <ul className="space-y-3 text-slate-500 dark:text-slate-400 text-sm">
              <li><a href="/#plans" className="hover:text-brand-500 transition-colors">Investment Plans</a></li>
              <li><a href="/#calculator" className="hover:text-brand-500 transition-colors">Profit Calculator</a></li>
              <li><Link href="/dashboard/deposit" className="hover:text-brand-500 transition-colors">Deposit Funds</Link></li>
              <li><Link href="/dashboard/withdraw" className="hover:text-brand-500 transition-colors">Withdraw Funds</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold text-sm sm:text-base mb-4 sm:mb-6">Legal</h4>
            <ul className="space-y-3 text-slate-500 dark:text-slate-400 text-sm">
              <li className="flex items-center"><Lock className="w-3 h-3 mr-2 flex-shrink-0" /><a href="#" className="hover:text-brand-500 transition-colors">Privacy Policy</a></li>
              <li className="flex items-center"><FileText className="w-3 h-3 mr-2 flex-shrink-0" /><a href="#" className="hover:text-brand-500 transition-colors">Terms of Service</a></li>
              <li className="flex items-center"><ShieldAlert className="w-3 h-3 mr-2 flex-shrink-0" /><a href="#" className="hover:text-brand-500 transition-colors">Risk Disclosure</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold text-sm sm:text-base mb-4 sm:mb-6">Support</h4>
            <ul className="space-y-3 text-slate-500 dark:text-slate-400 text-sm">
              <li><a href="/#contact" className="hover:text-brand-500 transition-colors">Contact Us</a></li>
              <li><Link href="/dashboard/support" className="hover:text-brand-500 transition-colors">Support Center</Link></li>
              <li><Link href="/login" className="hover:text-brand-500 transition-colors">Login</Link></li>
              <li><Link href="/register" className="hover:text-brand-500 transition-colors">Create Account</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-200 dark:border-slate-900">
          <div className="text-slate-500 dark:text-slate-600 text-xs sm:text-sm text-center sm:text-left">
            &copy; {year} Pipguardian<span className="text-green-400 text-xs font-bold">elt</span>. All rights reserved.
          </div>
          <ul className="flex items-center gap-x-6 gap-y-2 flex-wrap justify-center text-slate-500 dark:text-slate-500 text-xs sm:text-sm">
            <li><a href="#" className="hover:text-brand-500 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-brand-500 transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-brand-500 transition-colors">Risk Disclosure</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
