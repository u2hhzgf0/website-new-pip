'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Plus, Wallet, User } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/dashboard/referrals', label: 'Teams', icon: Users },
  { href: '/dashboard/deposit', label: 'Deposit', icon: Plus },
  { href: '/dashboard/wallet/stats', label: 'Wallet', icon: Wallet },
  { href: '/dashboard/settings', label: 'Profile', icon: User },
];

const BottomNav = () => {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);

  return (
    <nav className="lg:hidden fixed bottom-5 inset-x-5 z-40 max-w-[400px] mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg shadow-black/10 rounded-full flex items-stretch">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            className="flex-1 flex items-center justify-center py-4"
          >
            <Icon
              size={24}
              strokeWidth={2}
              className={active ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}
            />
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
