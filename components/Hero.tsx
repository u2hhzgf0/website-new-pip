'use client'

import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronRight, Layers, Percent, Users, Headset } from 'lucide-react';
import Link from 'next/link';
import Reveal from '@/components/Reveal';

const Hero = () => {
  const [tickerIndex, setTickerIndex] = useState(0);
  const [serverTime, setServerTime] = useState('');
  const recentDeposits = [
    { user: 'AlexM***', amount: 500, time: '2s ago' },
    { user: 'SarahK***', amount: 1200, time: '5s ago' },
    { user: 'CryptoKing', amount: 5000, time: '12s ago' },
    { user: 'Investor88', amount: 350, time: '18s ago' },
    { user: 'WealthGen', amount: 2500, time: '25s ago' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % recentDeposits.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [recentDeposits.length]);

  // Rendered client-side only (via useEffect) so the server-rendered markup and
  // the first client render match exactly — computing this during render would
  // differ between SSR and hydration (real clock time moves between the two)
  // and trigger a hydration mismatch.
  useEffect(() => {
    const update = () => setServerTime(new Date().toLocaleTimeString());
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { icon: Layers, label: '7 Reward Ranks', sub: 'Starter to Ambassador' },
    { icon: Percent, label: '5% Direct Commission', sub: 'On every referral' },
    { icon: Users, label: '26% Team Commission', sub: 'Across your network' },
    { icon: Headset, label: '24/7 Support', sub: 'Real people, real help' },
  ];

  return (
    <div className="relative flex flex-col justify-center overflow-hidden bg-slate-950">
      {/* Video background — dark overlays on top keep the text readable */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        >
          <source src="/images/crypto-chart-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_10%,rgba(34,197,94,0.25),transparent)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/65 to-slate-950/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20" />
      </div>

      <Reveal as="div" duration={0.7} className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 text-left pt-36 sm:pt-48 pb-16 sm:pb-24">
        <div className="inline-flex items-center space-x-2 bg-slate-800/50 border border-slate-700 rounded-full px-3 sm:px-4 py-1.5 mb-6 sm:mb-8 backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse"></span>
          <span className="text-xs sm:text-sm text-slate-300 font-medium">Platform Live &amp; Paying</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif font-bold text-white mb-4 sm:mb-6 leading-tight max-w-4xl">
          Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600">Wealth.</span>
          <br />
          <span className="text-2xl sm:text-5xl md:text-7xl text-slate-400 font-sans font-light">Secure Your Future.</span>
        </h1>

        <p className="text-sm sm:text-lg md:text-xl text-slate-400 max-w-2xl mb-6 sm:mb-10 leading-relaxed px-0">
          Pipguardian is a structured investment platform built for confident growth — flexible plans, transparent payouts, and a reward-driven referral network.
        </p>

        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-start space-y-3 sm:space-y-0 sm:space-x-6 px-0">
          <a href="#plans" className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-transparent border border-slate-600 text-white hover:border-brand-500 hover:text-brand-400 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 flex items-center justify-center group">
            View Plans
            <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <Link href="/dashboard" className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-slate-950 rounded-full font-bold text-sm sm:text-base shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center">
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </Reveal>

      {/* Live Ticker */}
      <div className="relative z-10 w-full bg-slate-900/80 border-t border-slate-800 backdrop-blur-md py-2.5 sm:py-4">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center justify-center sm:justify-between">
          <div className="hidden sm:flex items-center space-x-2 text-brand-400 font-semibold uppercase tracking-widest text-xs">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span>Live Transactions</span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 overflow-hidden">
             <div className="flex items-center space-x-1.5 sm:space-x-2 text-slate-300 animate-fade-in transition-all duration-500" key={tickerIndex}>
                <span className="text-xs sm:text-sm font-medium">Latest:</span>
                <span className="text-white font-bold text-xs sm:text-sm">{recentDeposits[tickerIndex].user}</span>
                <span className="text-green-400 font-mono font-bold text-xs sm:text-sm">+${recentDeposits[tickerIndex].amount}</span>
                <span className="text-[10px] sm:text-xs text-slate-500">({recentDeposits[tickerIndex].time})</span>
             </div>
          </div>

          <div className="hidden sm:block text-slate-500 text-xs">
            Server Time: {serverTime}
          </div>
        </div>
      </div>

      {/* Stats strip — auto-scrolling marquee, right to left */}
      <div className="relative z-10 w-full bg-gradient-to-r from-brand-700 via-brand-600 to-brand-700 overflow-hidden py-6 sm:py-8">
        <div className="stats-marquee-track">
          {Array.from({ length: 8 }).flatMap((_, setIndex) =>
            stats.map((stat, i) => (
              <div key={`${setIndex}-${i}`} className="flex items-center gap-3 shrink-0 px-6 sm:px-10">
                <div className="bg-white/15 rounded-xl p-2.5 shrink-0">
                  <stat.icon size={20} className="text-white" />
                </div>
                <div className="text-left whitespace-nowrap">
                  <p className="text-white font-bold text-sm sm:text-base leading-tight">{stat.label}</p>
                  <p className="text-white/70 text-xs">{stat.sub}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
