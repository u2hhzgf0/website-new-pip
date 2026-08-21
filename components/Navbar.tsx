'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, LayoutDashboard, LogOut, Download, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { clearAuth } from '../store/slices/authSlice';
import { useLogoutMutation } from '../store/api/authApi';
import { useGetMyRankQuery } from '../store/api/rankApi';
import { useGetActiveAnnouncementQuery } from '../store/api/announcementApi';
import ThemeToggle from './ThemeToggle';

const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || 'https://api.pipguardianelt.com';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [companyMenuOpen, setCompanyMenuOpen] = useState(false);
  const [mobileCompanyOpen, setMobileCompanyOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const companyMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);
  const [logout] = useLogoutMutation();
  const { data: rankData } = useGetMyRankQuery(undefined, { skip: !isAuthenticated });
  const rankName = rankData?.data?.attributes?.currentRankInfo?.name || 'Starter';

  const { data: announcementData } = useGetActiveAnnouncementQuery(undefined, {
    pollingInterval: 60000,
  });
  const activeAnnouncement = announcementData?.data?.attributes;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }
    // Capture install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setIsInstalled(true));
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setIsInstalled(true);
    setInstallPrompt(null);
    setMobileMenuOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (companyMenuRef.current && !companyMenuRef.current.contains(e.target as Node)) {
        setCompanyMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const companyMenu = [
    {
      heading: 'About Pipguardian',
      items: [
        { label: 'About Us', href: '/about' },
        { label: 'Our Story', href: '/about#story' },
      ],
    },
    {
      heading: 'Trust & Security',
      items: [
        { label: 'Our Values', href: '/about#values' },
        { label: 'Risk Disclosure', href: '#' },
        { label: 'Legal Documents', href: '#' },
      ],
    },
    {
      heading: 'Support & Contact',
      items: [
        { label: 'Support Center', href: '/dashboard/support' },
        { label: 'Contact Us', href: '/#contact' },
        { label: 'Login', href: '/login' },
      ],
    },
  ];

  const isHome = pathname === '/';
  const getLink = (id: string) => isHome ? `#${id}` : `/#${id}`;
  // Home's hero has a permanently dark photo background, so the navbar needs forced
  // white text while floating over it, unscrolled. Everywhere else the navbar sits
  // directly on the page's own (theme-aware) background.
  const overHero = isHome && !isScrolled;
  const navLinkClass = overHero ? 'text-white' : 'text-slate-700 dark:text-slate-300';
  const navHeadingClass = overHero ? 'text-white' : 'text-slate-900 dark:text-white';
  const pillContainerClass = overHero
    ? 'bg-white/10 border-white/10'
    : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800';

  const handleLogout = async () => {
    setDropdownOpen(false);
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) await logout({ refreshToken }).unwrap();
    } catch {}
    dispatch(clearAuth());
    router.push('/');
  };

  const avatarContent = user?.image
    ? <img src={`${IMAGE_BASE}${user.image}`} alt="Profile" className="w-9 h-9 rounded-full object-cover border-2 border-brand-500/40" />
    : (
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-slate-950 font-bold text-sm border-2 border-brand-500/40">
        {user?.firstName?.[0]}{user?.lastName?.[0]}
      </div>
    );

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            {overHero ? (
              <img src="/images/pip-light-lolgos.png" alt="Pipguardian" className="h-8 sm:h-9 w-auto" />
            ) : (
              <>
                <img src="/images/pip-dark-logo.png" alt="Pipguardian" className="h-8 sm:h-9 w-auto dark:hidden" />
                <img src="/images/pip-light-lolgos.png" alt="Pipguardian" className="h-8 sm:h-9 w-auto hidden dark:block" />
              </>
            )}
          </Link>

          {/* Desktop Nav — pill container */}
          <div className={`hidden lg:flex items-center gap-0.5 rounded-full border px-1.5 py-1.5 transition-colors ${pillContainerClass}`}>
            <a href={isHome ? "#" : "/"} className={`whitespace-nowrap px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors text-sm font-medium ${navLinkClass}`}>Home</a>

            <div className="relative" ref={companyMenuRef}>
              <button
                onClick={() => setCompanyMenuOpen(!companyMenuOpen)}
                className={`flex items-center gap-1 whitespace-nowrap px-3 py-1.5 rounded-full transition-colors text-sm font-medium ${pathname === '/about' ? 'bg-brand-500/15 text-brand-400' : `hover:bg-white/10 ${navLinkClass}`}`}
              >
                Company
                <ChevronDown size={14} className={`transition-transform ${companyMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {companyMenuOpen && (
                <div className="absolute left-0 mt-3 w-[640px] max-w-[90vw] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 grid grid-cols-3 gap-2 z-50">
                  {companyMenu.map((col) => (
                    <div key={col.heading} className="p-3">
                      <h4 className="text-slate-900 dark:text-white font-bold text-sm mb-2 px-3">{col.heading}</h4>
                      <ul className="space-y-1">
                        {col.items.map((item) => (
                          <li key={item.label}>
                            <Link
                              href={item.href}
                              onClick={() => setCompanyMenuOpen(false)}
                              className="block px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-500 text-sm font-medium transition-colors"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <a href={getLink('plans')} className={`whitespace-nowrap px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors text-sm font-medium ${navLinkClass}`}>Investment Plans</a>
            <a href={getLink('calculator')} className={`whitespace-nowrap px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors text-sm font-medium ${navLinkClass}`}>Calculator</a>
          </div>

          {/* Desktop Right — auth-aware, controls grouped in their own pill container */}
          <div className="hidden lg:flex items-center gap-3">
            {!isAuthenticated && (
              <Link href="/login" className={`whitespace-nowrap hover:text-brand-400 font-medium text-sm ${navHeadingClass}`}>Login</Link>
            )}

            <div className={`flex items-center gap-1 rounded-full border px-2 py-1.5 transition-colors ${pillContainerClass}`}>
              <ThemeToggle className="!bg-transparent !border-transparent" />
              {isAuthenticated && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full hover:bg-white/10 focus:outline-none transition-colors"
                  >
                    {avatarContent}
                    <div className="text-left">
                      <p className={`text-sm font-semibold leading-tight ${navHeadingClass}`}>{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-brand-400 font-medium">{rankName}</p>
                    </div>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-3 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50">
                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-400 transition-colors"
                      >
                        <LayoutDashboard size={15} />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-red-500 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <LogOut size={15} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {!isAuthenticated && (
              <Link
                href="/register"
                className="bg-brand-500 hover:bg-brand-600 text-slate-950 px-6 py-2.5 rounded-full font-bold text-sm transition-transform hover:scale-105 shadow-lg shadow-brand-500/20"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            <ThemeToggle />
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={navHeadingClass}>
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Announcement Ticker — only shown when an active announcement exists */}
      {activeAnnouncement && (
        <div className="w-full mt-3 sm:mt-4 bg-white/90 dark:bg-slate-900/80 border-t border-b border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden py-2">
          <div className="ticker-track">
            <span className="ticker-item text-sm font-medium text-brand-600 dark:text-brand-400">{activeAnnouncement.text}</span>
            <span className="ticker-item text-sm font-medium text-brand-600 dark:text-brand-400">{activeAnnouncement.text}</span>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex flex-col space-y-4 shadow-2xl">
          <a href={isHome ? "#" : "/"} onClick={() => setMobileMenuOpen(false)} className="text-slate-600 dark:text-slate-300 hover:text-brand-400 font-medium block">Home</a>

          <div>
            <button
              onClick={() => setMobileCompanyOpen(!mobileCompanyOpen)}
              className={`flex items-center justify-between w-full font-medium ${pathname === '/about' ? 'text-brand-400' : 'text-slate-600 dark:text-slate-300 hover:text-brand-400'}`}
            >
              Company
              <ChevronDown size={16} className={`transition-transform ${mobileCompanyOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileCompanyOpen && (
              <div className="mt-3 pl-3 space-y-4 border-l border-slate-200 dark:border-slate-800">
                {companyMenu.map((col) => (
                  <div key={col.heading}>
                    <p className="text-slate-400 dark:text-slate-600 text-xs font-bold uppercase tracking-wider mb-1.5">{col.heading}</p>
                    <div className="space-y-2">
                      {col.items.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => { setMobileMenuOpen(false); setMobileCompanyOpen(false); }}
                          className="block text-sm text-slate-600 dark:text-slate-300 hover:text-brand-400"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <a href={getLink('plans')} onClick={() => setMobileMenuOpen(false)} className="text-slate-600 dark:text-slate-300 hover:text-brand-400 font-medium block">Investment Plans</a>
          <a href={getLink('calculator')} onClick={() => setMobileMenuOpen(false)} className="text-slate-600 dark:text-slate-300 hover:text-brand-400 font-medium block">Calculator</a>

          <div className="h-px bg-slate-200 dark:bg-slate-800 my-2"></div>

          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 px-1">
                {avatarContent}
                <span className="text-slate-900 dark:text-white font-medium text-sm">{user?.firstName} {user?.lastName}</span>
              </div>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-brand-400 font-medium"
              >
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <button
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="flex items-center gap-2 text-red-500 dark:text-red-400 hover:text-red-400 dark:hover:text-red-300 font-medium text-left"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-slate-900 dark:text-white hover:text-brand-400 font-medium block">Login</Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="bg-brand-500 text-slate-950 px-6 py-3 rounded-lg font-bold text-center block">Get Started</Link>
            </>
          )}

          {/* Install App button — only shown when browser supports PWA install and not yet installed */}
          {!isInstalled && installPrompt && (
            <>
              <div className="h-px bg-slate-200 dark:bg-slate-800 my-2"></div>
              <button
                onClick={handleInstall}
                className="flex items-center gap-2.5 w-full px-4 py-3 rounded-lg bg-brand-500/10 border border-brand-500/30 text-brand-400 font-semibold text-sm hover:bg-brand-500/20 transition-colors"
              >
                <Download size={16} />
                Add to Home Screen
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
