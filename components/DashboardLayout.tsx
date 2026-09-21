'use client'

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useLogoutMutation } from '../store/api/authApi';
import { clearAuth } from '../store/slices/authSlice';
import { Toast, ToastType } from './Toast';
import {
  LayoutDashboard,
  ArrowUpRight,
  ArrowDownLeft,
  PieChart,
  History,
  Users,
  Ticket,
  Settings,
  LogOut,
  Bell,
  Menu,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  BookOpen,
  Trophy,
  CreditCard,
  QrCode,
  ShoppingBag,
  Store,
  Bot,
  Gift,
  Award,
  Target,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { MenuGroup } from '@/types';
import NotificationsDropdown from './NotificationsDropdown';
import { useGetMyNotificationsQuery, useGetUnreadCountQuery, useMarkAllAsReadMutation, type Notification } from '@/store/api/notificationApi';
import { useGetWalletQuery } from '@/store/api/walletApi';
import { useGetMyRankQuery } from '@/store/api/rankApi';
import { useGetActiveAnnouncementQuery } from '@/store/api/announcementApi';
import { ProfileAvatar } from './ProfileAvatar';
import BottomNav from './BottomNav';
import PageTransition from './PageTransition';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const user = useSelector((state: RootState) => state.auth.user);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Fetch notifications from API
  const { data: notificationsData } = useGetMyNotificationsQuery();
  const { data: unreadCountData } = useGetUnreadCountQuery();
  const { data: walletData } = useGetWalletQuery();
  const { data: rankData } = useGetMyRankQuery();
  const { data: announcementData } = useGetActiveAnnouncementQuery(undefined, { pollingInterval: 60000 });
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const notifications: Notification[] = notificationsData?.data?.attributes || [];
  const unreadCount = unreadCountData?.data?.attributes?.count || 0;
  const wallet = walletData?.data?.attributes;
  const balance = wallet?.balance || 0;
  const rankInfo = rankData?.data?.attributes;
  const activeAnnouncement = announcementData?.data?.attributes;
  const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || 'https://api.pipguardian.com';

  const pathname = usePathname();

  // Initialize expanded state based on current path to keep menus open
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    'Wallet': pathname.includes('/deposit') || pathname.includes('/wallet'),
    'Withdraw': pathname.includes('/withdraw'),
    'Plans': pathname.includes('/plans'),
    'Referral': pathname.includes('/referrals'),
    'Support': pathname.includes('/support')
  });

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const handleLogout = async () => {
    setShowLogoutConfirm(false);

    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await logout({ refreshToken }).unwrap();
      }
      dispatch(clearAuth());

      setToast({
        message: 'Logged out successfully. See you soon!',
        type: 'success'
      });

      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (error) {
      // Even if logout fails, clear local auth
      dispatch(clearAuth());
      setToast({
        message: 'Logged out successfully.',
        type: 'success'
      });
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead().unwrap();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const menuGroups: MenuGroup[] = [
    {
      section: 'Overview',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { label: 'Investing Info', icon: BookOpen, path: '/investing-info' },
        { label: 'Smart Member', icon: CreditCard, path: '/dashboard/smart-member' },
        { label: 'Scan QR', icon: QrCode, path: '/dashboard/scan-qr' },
        { label: 'Shop', icon: ShoppingBag, path: '/dashboard/shop' },
        { label: 'Become a Vendor', icon: Store, path: '/dashboard/become-vendor' },
      ],
    },
    {
      section: 'Financial',
      items: [
        {
          label: 'Wallet',
          icon: ArrowDownLeft,
          subItems: [
            { label: 'Overview', path: '/dashboard/wallet' },
            { label: 'Deposit', path: '/dashboard/deposit' },
            { label: 'Wallet Stats', path: '/dashboard/wallet/stats' }
          ]
        },
        {
          label: 'Withdraw',
          icon: ArrowUpRight,
          subItems: [
            { label: 'Request', path: '/dashboard/withdraw' },
            { label: 'History', path: '/dashboard/withdraw/history' }
          ]
        },
        {
          label: 'Plans',
          icon: PieChart,
          subItems: [
            { label: 'Invest', path: '/dashboard/plans/invest' },
            { label: 'My Plans', path: '/dashboard/plans/my-plans' }
          ]
        },
        { label: 'Transactions', icon: History, path: '/dashboard/transactions' },
        { label: 'Profit History', icon: TrendingUp, path: '/dashboard/profits/history' },
      ],
    },
    {
      section: 'Network',
      items: [
        {
          label: 'Referral',
          icon: Users,
          subItems: [
            { label: 'Overview', path: '/dashboard/referrals' },
            { label: '7-Level Network', path: '/dashboard/referrals/network' }
          ]
        },
      ],
    },
    {
      section: 'Rewards',
      items: [
        { label: 'My Rank', icon: Trophy, path: '/dashboard/my-rank' },
        { label: 'AutoBots', icon: Bot, path: '/dashboard/autobots' },
        { label: 'Incentives', icon: Gift, path: '/dashboard/incentives' },
        { label: 'Achievements', icon: Award, path: '/dashboard/achievements' },
        { label: 'Challenges', icon: Target, path: '/dashboard/challenges' },
      ],
    },
    {
      section: 'Account',
      items: [
        {
          label: 'Support',
          icon: Ticket,
          subItems: [
            { label: 'Create Ticket', path: '/dashboard/support' },
            { label: 'My Tickets', path: '/dashboard/support/tickets' }
          ]
        },
        { label: 'Notifications', icon: Bell, path: '/dashboard/notifications' },
        { label: 'Settings', icon: Settings, path: '/dashboard/settings' },
      ],
    },
  ];

  const isActive = (path?: string) => {
    if (!path) return false;
    if (path === '/investing-info') return false;
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden font-sans relative">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}


      {/* Sidebar + Main row */}
      <div className="flex flex-1 overflow-hidden relative">

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Notifications Dropdown - rendered outside header to avoid stacking context issues */}
      {showNotifications && (
        <>
          <div
            className="fixed inset-0 z-[55]"
            onClick={() => setShowNotifications(false)}
            aria-hidden="true"
          ></div>
          <NotificationsDropdown
            notifications={notifications}
            onClose={() => setShowNotifications(false)}
            onMarkAllRead={handleMarkAllRead}
          />
        </>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl transform scale-100 transition-all">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-500/10 p-2 rounded-full text-red-500">
                <LogOut size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Sign Out</h3>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Are you sure you want to log out of your account?</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                No, Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition-colors shadow-lg shadow-red-600/20"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-[#F7F7FC] dark:bg-slate-900 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo Area */}
          <div className="h-20 flex items-center px-6 border-b border-slate-200/70 dark:border-slate-800">
            <Link href="/dashboard" className="flex items-center">
              <img src="/images/pip-dark-logo.png" alt="Pipguardian" className="h-8 w-auto dark:hidden" />
              <img src="/images/pip-dark-logo.png" alt="Pipguardian" className="h-8 w-auto hidden dark:block" />
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
            {menuGroups.map((group) => (
              <div key={group.section}>
                <p className="px-3 pt-4 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 first:pt-1">
                  {group.section}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <div key={item.label}>
                      {item.subItems ? (
                        <div>
                          <button
                            onClick={() => toggleMenu(item.label)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                              item.subItems.some(sub => isActive(sub.path))
                                ? 'text-slate-900 dark:text-white bg-white dark:bg-slate-800 shadow-sm shadow-slate-900/5'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/70 dark:hover:bg-slate-800/60'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <item.icon size={19} />
                              <span className="font-medium text-sm">{item.label}</span>
                            </div>
                            {expandedMenus[item.label] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </button>
                          {expandedMenus[item.label] && (
                            <div className="ml-9 mt-1 space-y-1 border-l border-slate-300 dark:border-slate-700 pl-3">
                              {item.subItems.map((sub) => (
                                <Link
                                  key={sub.label}
                                  href={sub.path || '#'}
                                  onClick={() => setSidebarOpen(false)}
                                  className={`block px-3 py-1.5 text-sm transition-colors rounded-lg ${
                                    isActive(sub.path) ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-500 dark:text-slate-500 hover:text-emerald-500'
                                  }`}
                                >
                                  {sub.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          href={item.path || '#'}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-colors ${
                            isActive(item.path)
                              ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm shadow-slate-900/5'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/70 dark:hover:bg-slate-800/60'
                          }`}
                        >
                          <item.icon size={19} />
                          <span className="font-medium text-sm">{item.label}</span>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* User Profile Snippet in Sidebar Bottom */}
          <div className="p-3 border-t border-slate-200/70 dark:border-slate-800">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center space-x-3 px-3 py-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
            >
              <LogOut size={19} />
              <span className="font-medium text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 sm:h-20 bg-white dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-3 sm:px-6 lg:px-8 sticky top-0 z-10">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden mr-2 sm:mr-4 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <Menu size={22} />
            </button>
            <h1 className="text-base sm:text-xl font-semibold text-slate-900 dark:text-white hidden sm:block">Dashboard</h1>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-6">
            {/* Balance Display - visible on all screens */}
            <div className="flex flex-col items-end mr-1 sm:mr-2">
              <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Balance</span>
              <span className="text-xs sm:text-xl font-bold text-green-400">${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1.5 sm:p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors outline-none"
                aria-label="Notifications"
                aria-expanded={showNotifications}
              >
                <Bell size={18} className="sm:hidden" />
                <Bell size={20} className="hidden sm:block" />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 min-w-[16px] h-[16px] sm:min-w-[18px] sm:h-[18px] bg-red-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* Profile Avatar with Rank Frame */}
            <div className="flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-4 border-l border-slate-200 dark:border-slate-800">
              {/* sm size on mobile, md on desktop */}
              <ProfileAvatar
                src={user?.image ? `${IMAGE_BASE}${user.image}` : null}
                frameSrc={
                  rankInfo?.currentRankInfo?.frameImage
                    ? `${IMAGE_BASE}${rankInfo.currentRankInfo.frameImage}`
                    : null
                }
                initials={`${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`}
                size="xs"
                className="sm:!w-10 sm:!h-10"
              />

              <div className="hidden md:block">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-emerald-500 dark:text-emerald-400 font-medium">
                  {rankInfo?.currentRankInfo?.name || 'Starter'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Announcement Banner — below navbar, above content */}
        {activeAnnouncement && (
          <div className="w-full bg-amber-500/10 border-b border-amber-500/30 overflow-hidden py-2 flex-shrink-0">
            <div className="ticker-track">
              <span className="ticker-item text-sm font-medium text-amber-600 dark:text-amber-400">{activeAnnouncement.text}</span>
              <span className="ticker-item text-sm font-medium text-amber-600 dark:text-amber-400">{activeAnnouncement.text}</span>
            </div>
          </div>
        )}

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-3 pb-24 sm:p-6 lg:p-8 lg:pb-8">
          <div className="max-w-[1600px] mx-auto">
            <PageTransition>{children}</PageTransition>
          </div>
        </main>
      </div>
      </div>{/* end Sidebar + Main row */}

      <BottomNav />
    </div>
  );
};

export default DashboardLayout;
