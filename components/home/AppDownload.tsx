'use client'

import React, { useState, useEffect } from 'react';
import { Smartphone, Wifi, BellRing, Download } from 'lucide-react';
import Reveal from '@/components/Reveal';

const AppDownload = () => {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }
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
  };

  return (
    <section className="py-12 sm:py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 items-center">
          <img
            src="/images/47c69506-ee95-4478-ae69-70f6c84cc9a1.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/40" />

          <Reveal className="relative p-8 sm:p-14">
            <span className="text-brand-400 text-xs sm:text-sm font-bold uppercase tracking-wider">Mobile App</span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white mt-3 mb-4 leading-tight">
              Your Portfolio, In Your Pocket
            </h2>
            <p className="text-slate-400 text-sm sm:text-lg mb-6 sm:mb-8 leading-relaxed">
              Install Pipguardian as an app on your phone for one-tap access to your wallet, plans, and referral network.
            </p>
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="text-center">
                <Wifi className="text-brand-400 mx-auto mb-1.5" size={20} />
                <p className="text-slate-300 text-[11px] sm:text-xs">Works Offline-First</p>
              </div>
              <div className="text-center">
                <BellRing className="text-brand-400 mx-auto mb-1.5" size={20} />
                <p className="text-slate-300 text-[11px] sm:text-xs">Push Notifications</p>
              </div>
              <div className="text-center">
                <Smartphone className="text-brand-400 mx-auto mb-1.5" size={20} />
                <p className="text-slate-300 text-[11px] sm:text-xs">No App Store Needed</p>
              </div>
            </div>
            {isInstalled ? (
              <p className="text-brand-400 font-semibold text-sm">App already installed on this device.</p>
            ) : installPrompt ? (
              <button
                onClick={handleInstall}
                className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3 sm:py-4 bg-brand-500 hover:bg-brand-600 text-slate-950 rounded-full font-bold text-sm sm:text-base transition-colors"
              >
                <Download size={18} />
                Install The App
              </button>
            ) : (
              <p className="text-slate-500 text-sm">
                Open this site in a supported mobile browser and use &quot;Add to Home Screen&quot; from the browser menu.
              </p>
            )}
          </Reveal>
          <div className="relative hidden md:flex items-center justify-center p-10">
            <div className="w-48 h-96 rounded-[2rem] border-4 border-slate-700 bg-slate-950 shadow-2xl flex items-center justify-center">
              <Smartphone className="text-brand-500/40" size={64} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;
