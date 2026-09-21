'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  BookOpen,
  Globe2,
  Users,
  Radio,
  Wallet,
  Gift,
  Share2,
  Trophy,
  TrendingUp,
  ArrowRight,
  Sparkles,
  User,
  X,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Award,
  LucideIcon,
} from 'lucide-react';

const IMG_HERO =
  'https://res.cloudinary.com/dshkbza19/image/upload/v1775451078/trading_tcnxuf.png';
const IMG_CERT_GOOD_STANDING =
  'https://res.cloudinary.com/dshkbza19/image/upload/v1775466152/IMG_20260406_120242_hclhno.png';
const IMG_CERT_INCORPORATION =
  'https://res.cloudinary.com/dshkbza19/image/upload/v1775466166/IMG_20260406_120348_xsrk0r.png';
const IMG_CERT_EXTRA =
  'https://res.cloudinary.com/dhah2ypd9/image/upload/v1776789493/WhatsApp_Image_2026-04-20_at_1.31.29_PM_p6dkuk.jpg';

const forexStats = [
  { icon: TrendingUp, value: '$6T+', label: 'Daily trading volume' },
  { icon: Clock, value: '24 / 5', label: 'Market hours' },
  { icon: Globe2, value: 'Global', label: 'Financial centres' },
];

const hubs = [
  {
    city: 'London',
    title: 'Largest forex hub',
    detail: 'Handles over $2.5 trillion in transactions daily (about 35–40% of global volume).',
  },
  {
    city: 'New York',
    title: 'Bridges sessions',
    detail: 'Second-largest trading market — about $1.3 trillion daily (~18–20% of global trades). Connects Asian and US sessions.',
  },
  {
    city: 'Tokyo',
    title: 'Biggest hub in Asia',
    detail: 'Roughly $500–600 billion daily (6–8% of global activity). Sets early momentum for JPY pairs.',
  },
];

const partnershipBenefits = [
  { icon: Users, title: 'Personal management', text: 'Dedicated support for your trading needs. Access to expert trading signals and strategies.' },
  { icon: Radio, title: 'Signal management', text: 'Structured delivery and management of trading signals aligned with your plan.' },
  { icon: Wallet, title: 'Fund management', text: 'Professional handling of client funds according to platform policies.' },
  { icon: Gift, title: 'Rewards', text: 'Exclusive partner incentives and bonuses.' },
  { icon: Share2, title: 'Referral commission', text: 'Earn commissions as an Introducing Broker.' },
  { icon: Trophy, title: 'Club income', text: 'Extra earnings through community and club programmes.' },
];

/** Labels matching brochure-style “Types of Income” screen */
const incomeTypesBrochure = [
  'Direct sponsor commission',
  'Monthly salary',
  'Team generation income',
  'Global royalty',
  'Rank incentive',
];

const rankRows = [
  { rank: 'Starter', target: '(8–12)%', salary: '—', condition: 'Entry level', bonus: '—' },
  { rank: 'Executive', target: '$12,000', salary: '$250', condition: '5 users · 1 leg 50% / other 50% · personal invest $500', bonus: 'Smartphone' },
  { rank: 'Sr. Executive', target: '$36,000', salary: '$500', condition: '10 users · 1 leg 50% / other 50% · personal invest $1,000', bonus: 'Laptop' },
  { rank: 'Director', target: '$100,000', salary: '$1,000', condition: '15 users · 1 leg 50% / other 50% · personal invest $2,000', bonus: 'International tour' },
  { rank: 'National Leader', target: '$250,000', salary: '$2,000', condition: '20 users · 1 leg 50% / other 50% · personal invest $3,000', bonus: '150 CC bike' },
  { rank: 'Global Leader', target: '$500,000', salary: '$3,000', condition: '25 users · 1 leg 50% / other 50% · personal invest $5,000', bonus: '250 CC bike' },
  { rank: 'Ambassador', target: '$1M', salary: '$5,000', condition: '30 users · 1 leg 50% / other 50% · personal invest $10,000', bonus: 'Car' },
];

const rankDetailCards = [
  {
    title: 'Executive',
    conditions: ['Create 5 accounts', 'Total team deposit $12,000', '1 leg 50% / other leg 50%', 'Personal investment $500'],
    benefits: ['Fixed salary $250', 'Generation commission on team client profit', 'Global royalty 1% on total company client profit', 'Smartphone'],
  },
  {
    title: 'Sr. Executive',
    conditions: ['Create 10 accounts', 'Total team deposit $36,000', '1 leg 50% / other leg 50%', 'Personal investment $1,000'],
    benefits: ['Fixed salary $500', 'Generation commission on team client profit', 'Global royalty 1% on total company client profit', 'Laptop'],
  },
  {
    title: 'Director',
    conditions: ['Create 15 accounts', 'Total team deposit $100,000', '1 leg 50% / other leg 50%', 'Personal investment $2,000'],
    benefits: ['Fixed salary $1,000', 'Generation commission on team client profit', 'Global royalty 1% on total company client profit', 'International tour'],
  },
  {
    title: 'National Leader',
    conditions: ['Create 20 accounts', 'Total team deposit $250,000', '1 leg 50% / other 50%', 'Personal investment $3,000'],
    benefits: ['Fixed salary $2,000', 'Generation commission on team client profit', 'Global royalty 1% on total company client profit', '150 CC bike'],
  },
  {
    title: 'Global Leader',
    conditions: ['Create 25 accounts', 'Total team deposit $500,000', '1 leg 50% / other leg 50%', 'Personal investment $5,000'],
    benefits: ['Fixed salary $3,000', 'Generation commission on team client profit', 'Global royalty 1% on total company client profit', '250 CC bike'],
  },
  {
    title: 'Ambassador',
    conditions: ['Create 30 accounts', 'Total team deposit $1,000,000', '1 leg 50% / other 50%', 'Personal investment $10,000'],
    benefits: ['Fixed salary $5,000', 'Generation commission on team client profit', 'Global royalty 1% on total company client profit', 'Car'],
  },
];

const compensationOverview = [
  { label: 'Direct sponsor', value: '5% of client deposit' },
  { label: 'Monthly salary', value: 'Fixed per rank (see table)' },
  { label: 'Generation', value: "26% on clients' profit" },
  { label: 'Global royalty', value: '5% on total company client profit (overview)' },
  { label: 'Rank incentive', value: 'Fixed on rank achievement' },
];

function PipWordmark({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="bg-gradient-to-br from-brand-400 to-brand-600 p-1.5 rounded-md">
        <TrendingUp className="h-5 w-5 text-slate-950" />
      </div>
      <span className="text-xl font-serif font-bold tracking-wide text-slate-900 dark:text-white leading-none">
        Pip<span className="text-brand-500">guardian</span><span className="text-brand-400 text-xs font-bold ml-0.5 align-bottom">elt</span>
      </span>
    </div>
  );
}

/** Small uppercase icon + label badge used to open every section — keeps the page's rhythm consistent. */
function Eyebrow({
  icon: Icon,
  children,
  dark = false,
}: {
  icon: LucideIcon;
  children: React.ReactNode;
  dark?: boolean;
}) {
  const wrapClass = dark
    ? 'bg-white/5 border-white/10'
    : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800';
  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 mb-4 ${wrapClass}`}>
      <Icon size={15} className="text-brand-500 dark:text-brand-400" />
      <span className="text-xs font-bold uppercase tracking-wider text-brand-500 dark:text-brand-400">{children}</span>
    </div>
  );
}

const certificates = [
  {
    src: IMG_CERT_GOOD_STANDING,
    alt: 'Certificate of Good Standing',
    label: 'Good Standing',
    width: 800,
    height: 1100,
  },
  {
    src: IMG_CERT_INCORPORATION,
    alt: 'Certificate of Incorporation',
    label: 'Incorporation',
    width: 1100,
    height: 800,
  },
  {
    src: IMG_CERT_EXTRA,
    alt: 'Official Registration Document',
    label: 'Registration',
    width: 1100,
    height: 800,
  },
];

const InvestingInfoContent = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex(i => (i! - 1 + certificates.length) % certificates.length);
  const nextImage = () => setLightboxIndex(i => (i! + 1) % certificates.length);

  return (
    <div className="relative overflow-hidden bg-slate-50 dark:bg-[#12151c]">
      {/* —— Hero: trading visual —— */}
      <section className="relative w-full min-h-[560px] sm:min-h-[640px] md:min-h-[720px] [perspective:1400px]">
        <Image
          src={IMG_HERO}
          alt="Trading charts and market data visualization"
          fill
          priority
          className="object-cover object-center scale-105"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/50" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30 mix-blend-overlay" />

        {/* Floating depth orbs */}
        <div className="absolute -top-10 right-[8%] w-72 h-72 rounded-full bg-brand-500/20 blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 left-[6%] w-80 h-80 rounded-full bg-brand-500/10 blur-3xl animate-float-slower" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[560px] sm:min-h-[640px] md:min-h-[720px] flex flex-col justify-center items-center text-center py-16 sm:py-20">
          <div className="inline-flex items-center justify-center gap-2 bg-black/30 border border-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 shadow-lg shadow-black/30">
            <Sparkles className="text-brand-400 w-4 h-4" />
            <span className="text-brand-400/90 text-xs sm:text-sm font-bold uppercase tracking-wider">
              Data-driven trading
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-5 leading-tight max-w-4xl mx-auto drop-shadow-lg [text-shadow:0_8px_30px_rgba(0,0,0,0.45)]">
            Your trading platform for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">
              every day
            </span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed drop-shadow mb-10">
            Forex education, official certificates, partnership benefits, income types, and rank structure — the same investor guide for everyone.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-gradient-to-r from-brand-500 to-brand-700 text-slate-950 font-bold text-sm shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 transition-all hover:-translate-y-1"
            >
              Get started
              <ArrowRight size={18} className="ml-2" />
            </Link>
            <a
              href="#plans"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-white font-semibold text-sm hover:bg-white/10 transition-all hover:-translate-y-1"
            >
              View investment plans
            </a>
          </div>

          {/* Floating glass stat chips — depth layer */}
          <div className="hidden md:flex items-center gap-4 mt-16 [transform-style:preserve-3d]">
            {[
              { label: 'Daily forex volume', value: '$6T+' },
              { label: 'Reward ranks', value: '7' },
              { label: 'Support', value: '24/7' },
            ].map((s, i) => (
              <div
                key={s.label}
                className="tilt-card-flat bg-white/10 border border-white/15 backdrop-blur-md rounded-2xl px-6 py-4 shadow-2xl shadow-black/40"
                style={{ transform: `translateY(${i === 1 ? '-10px' : '0'}) translateZ(0)` }}
              >
                <p className="text-white font-bold text-lg leading-none">{s.value}</p>
                <p className="text-slate-300 text-xs mt-1.5 whitespace-nowrap">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* —— Certificates Gallery —— */}
      <section className="relative z-10 border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#1b202c] py-14 sm:py-20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-500/[0.06] blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <PipWordmark className="justify-center mb-4" />
            <Eyebrow icon={Award}>Legally registered</Eyebrow>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white">Official Registration</h2>
            <p className="text-slate-600 dark:text-slate-500 text-sm mt-2">Saint Lucia — Click any certificate to view full size</p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 [perspective:1400px]">
            {certificates.map((cert, i) => (
              <button
                key={i}
                onClick={() => openLightbox(i)}
                className="tilt-card group relative rounded-2xl overflow-hidden ring-1 ring-white/10 glow-ring bg-slate-50 dark:bg-[#0f1218] cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <Image
                  src={cert.src}
                  alt={cert.alt}
                  width={cert.width}
                  height={cert.height}
                  className="w-full h-80 sm:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                  <span className="text-white text-sm font-semibold">{cert.label}</span>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-1.5">
                    <ZoomIn size={16} className="text-white" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-slate-900 dark:text-white/70 hover:text-slate-900 dark:hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors z-10"
          >
            <X size={22} />
          </button>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 text-slate-900 dark:text-white/70 hover:text-slate-900 dark:hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors z-10"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Image */}
          <div
            className="relative max-w-3xl w-full max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={certificates[lightboxIndex].src}
              alt={certificates[lightboxIndex].alt}
              width={certificates[lightboxIndex].width}
              height={certificates[lightboxIndex].height}
              className="w-full h-auto max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
            <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-slate-900 dark:text-white/60 text-xs bg-black/40 px-3 py-1 rounded-full">
              {lightboxIndex + 1} / {certificates.length} — {certificates[lightboxIndex].label}
            </p>
          </div>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 text-slate-900 dark:text-white/70 hover:text-slate-900 dark:hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors z-10"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}

      {/* Forex intro */}
      <section className="relative z-10 py-14 sm:py-20 border-t border-slate-200/90 dark:border-slate-800/90 bg-slate-50 dark:bg-[#12151c] overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-brand-500/[0.06] blur-3xl pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center">
            <Eyebrow icon={BookOpen}>Investor education</Eyebrow>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white mb-6">Introduction to forex trading</h2>
          <div className="prose prose-invert prose-sm sm:prose-base max-w-none text-slate-500 dark:text-slate-400 space-y-4 text-center mx-auto">
            <p>
              Forex (foreign exchange) is the global market for buying and selling currencies. It is the largest financial market in the world,
              with a daily trading volume of over <strong className="text-slate-700 dark:text-slate-200">$6 trillion</strong>. Traders aim to profit by exchanging one currency for another as prices move.
            </p>
            <p>
              Participants include banks, governments, companies, and individual traders. The market operates <strong className="text-slate-700 dark:text-slate-200">24 hours a day, 5 days a week</strong>,
              across major financial centres worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 [perspective:1400px]">
            {forexStats.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="tilt-card-flat flex flex-col items-center gap-2 bg-white dark:bg-[#1b202c] border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-6"
              >
                <div className="w-10 h-10 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-500">
                  <Icon size={18} />
                </div>
                <p className="text-slate-900 dark:text-white font-bold text-lg leading-none">{value}</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top hubs */}
      <section className="relative z-10 py-12 sm:py-16 border-t border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#1a1d26]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center">
            <Eyebrow icon={Globe2}>Where the market moves</Eyebrow>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white mb-2">Top global trading centres</h2>
          <p className="text-slate-600 dark:text-slate-500 text-sm mb-8 max-w-2xl mx-auto">Three of the most active regions by volume and session overlap.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center [perspective:1400px]">
            {hubs.map((h) => (
              <div
                key={h.city}
                className="tilt-card relative overflow-hidden bg-slate-50 dark:bg-[#1b202c] border border-slate-200 dark:border-slate-800 hover:border-brand-500/30 hover:shadow-2xl hover:shadow-brand-500/10 rounded-2xl p-6 w-full max-w-md text-center"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-400 to-brand-600" />
                <p className="text-brand-500 dark:text-brand-400 font-bold text-lg mb-1">{h.city}</p>
                <p className="text-slate-900 dark:text-white font-semibold mb-2">{h.title}</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{h.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Copy trading */}
      <section className="relative z-10 py-12 border-t border-slate-200/90 dark:border-slate-800/90 bg-gradient-to-r from-brand-500/10 via-[#1b202c] to-[#12151c] overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-brand-500/15 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-1">
            <Copy size={20} />
          </div>
          <p className="text-brand-400 text-sm font-semibold uppercase tracking-wider">Copy trading</p>
          <p className="text-white text-xl sm:text-2xl font-serif font-bold">Follow strategies that fit your risk profile</p>
          <p className="text-slate-400 text-sm">Offered in line with PipGuardian platform rules and availability.</p>
          <span className="text-slate-500 text-sm font-mono">pipguardian.com</span>
        </div>
      </section>

      {/* Partnership */}
      <section className="relative z-10 py-12 sm:py-16 border-t border-slate-200/90 dark:border-slate-800/90 bg-slate-50 dark:bg-[#12151c]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center">
            <Eyebrow icon={Trophy}>Partner with us</Eyebrow>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white mb-2">Partnership benefits</h2>
          <p className="text-slate-600 dark:text-slate-500 text-sm mb-10 max-w-2xl mx-auto">Six pillars of support and opportunity for partners.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center [perspective:1400px]">
            {partnershipBenefits.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="tilt-card flex flex-col items-center text-center gap-3 bg-white dark:bg-[#1b202c] border border-slate-200 dark:border-slate-800 hover:border-brand-500/30 hover:shadow-2xl hover:shadow-brand-500/10 rounded-xl p-5 w-full max-w-sm"
              >
                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center text-brand-500 shadow-inner">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="text-slate-900 dark:text-white font-bold mb-1">{title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Types of Income — brochure style */}
      <section className="relative z-10 py-14 sm:py-20 border-t border-slate-800 bg-gradient-to-b from-[#161a24] to-[#0f1218] overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.08] pointer-events-none" />
        <div className="absolute -top-20 left-1/3 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl animate-float-slow pointer-events-none" />
        <div className="absolute -bottom-24 right-1/4 w-80 h-80 rounded-full bg-brand-500/10 blur-3xl animate-float-slower pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-8">
            <PipWordmark />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-10 sm:mb-12">
            <span className="text-white">Types of </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">Income</span>
          </h2>
          <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3 sm:gap-4 max-w-3xl mx-auto [perspective:1400px]">
            {incomeTypesBrochure.map((label) => (
              <div
                key={label}
                className="tilt-card-flat flex-1 min-w-[200px] sm:min-w-[220px] bg-white text-slate-900 font-semibold text-sm sm:text-base py-3.5 px-4 rounded-md shadow-lg shadow-black/20 border border-white/90"
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Executive rank — diagram + panels (brochure style) */}
      <section className="relative z-10 py-14 sm:py-16 border-t border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#1a1d26]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center">
            <Eyebrow icon={Users}>Growth path</Eyebrow>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-10">
            Rank, salary, incentive &amp; others
          </h2>

          {/* Always-dark spotlight panel — the diagram's white rings/borders are designed for a dark surface, so this stays dark in both themes */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 glow-ring px-6 py-10 sm:px-10 sm:py-14">
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.06] pointer-events-none" />
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
            <div className="relative flex justify-center mb-10">
              <PipWordmark className="justify-center" />
            </div>

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start justify-items-center">
              <div className="flex flex-col items-center w-full max-w-md">
                <p className="text-white font-semibold mb-6 w-full">Executive structure</p>
                <div className="flex flex-col items-center gap-4 mx-auto">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full border-2 border-brand-400/80 bg-white/5 flex items-center justify-center text-white shadow-lg">
                      <User size={28} strokeWidth={1.5} />
                    </div>
                    <span className="text-white font-medium text-sm">Executive</span>
                  </div>
                  <div className="h-8 w-px bg-white/30 shrink-0" />
                  <div className="flex gap-6 sm:gap-10 justify-center">
                    {['A', 'B', 'C'].map((l) => (
                      <div key={l} className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full border-2 border-white/40 bg-white/5 flex items-center justify-center text-white text-sm font-bold">
                          <User size={18} strokeWidth={1.5} />
                        </div>
                        <span className="text-white text-sm font-medium">{l}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6 max-w-xl w-full [perspective:1400px]">
                <div className="tilt-card-flat rounded-xl border-2 border-white/15 bg-white/5 px-5 py-5 sm:px-6 sm:py-6 text-center">
                  <h3 className="text-white font-bold text-lg mb-4">Executive conditions</h3>
                  <ul className="text-slate-300 text-sm space-y-2.5 list-none">
                    <li>Create: 5 accounts</li>
                    <li>Total team deposit $12,000</li>
                    <li>1 leg 50% and other leg 50%</li>
                    <li>Personal investment $500</li>
                  </ul>
                </div>
                <div className="tilt-card-flat rounded-xl border-2 border-brand-500/30 bg-brand-500/5 px-5 py-5 sm:px-6 sm:py-6 text-center">
                  <h3 className="text-brand-400 font-bold text-lg mb-4">Executive benefits</h3>
                  <ul className="text-slate-200 text-sm space-y-2.5 list-none">
                    <li>Fixed salary $250</li>
                    <li>Generation commission — team clients profit</li>
                    <li>Global royalty 1% on total company clients profit</li>
                    <li>Smartphone</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All ranks — cards */}
      <section className="relative z-10 py-12 sm:py-16 border-t border-slate-200/90 dark:border-slate-800/90 bg-slate-50 dark:bg-[#12151c]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center">
            <Eyebrow icon={Trophy}>Every rank, in full</Eyebrow>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white mb-2">All ranks — conditions &amp; benefits</h2>
          <p className="text-slate-600 dark:text-slate-500 text-sm mb-10 max-w-3xl mx-auto">
            Progress from Starter toward Ambassador. Confirm current rules in your dashboard or with support.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 justify-items-center [perspective:1400px]">
            {rankDetailCards.map((card, i) => (
              <div
                key={card.title}
                className={`tilt-card-flat relative overflow-hidden bg-white dark:bg-[#1b202c] border rounded-2xl p-6 sm:p-7 w-full max-w-lg text-center transition-colors ${
                  i === rankDetailCards.length - 1
                    ? 'border-brand-500/40 shadow-2xl shadow-brand-500/10'
                    : 'border-slate-200 dark:border-slate-800 hover:border-brand-500/30 hover:shadow-2xl hover:shadow-brand-500/10'
                }`}
              >
                {i === rankDetailCards.length - 1 && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-400 to-brand-600" />
                )}
                <h3 className="text-xl font-bold text-brand-500 mb-4">{card.title}</h3>
                <p className="text-xs uppercase tracking-wider text-slate-600 dark:text-slate-500 mb-2">Conditions</p>
                <ul className="text-slate-600 dark:text-slate-300 text-sm space-y-2 mb-5 list-none text-center">
                  {card.conditions.map((c) => (
                    <li key={c}>
                      <span className="text-brand-500/80 mr-1">·</span>
                      {c}
                    </li>
                  ))}
                </ul>
                <p className="text-xs uppercase tracking-wider text-slate-600 dark:text-slate-500 mb-2">Benefits</p>
                <ul className="text-slate-500 dark:text-slate-400 text-sm space-y-2 list-none text-center">
                  {card.benefits.map((b) => (
                    <li key={b}>
                      <span className="text-brand-500/90 mr-1">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Summary table */}
      <section className="relative z-10 py-12 sm:py-16 border-t border-slate-200/90 dark:border-slate-800/90 overflow-hidden bg-white dark:bg-[#1a1d26]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center">
            <Eyebrow icon={TrendingUp}>At a glance</Eyebrow>
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-2">Rank overview table</h2>
          <p className="text-slate-600 dark:text-slate-500 text-sm mb-6 max-w-2xl mx-auto">See targets and conditions to upgrade your rank.</p>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-xl shadow-black/5 bg-white dark:bg-[#1b202c] max-w-5xl mx-auto text-left">
            <table className="w-full text-left text-sm min-w-[720px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 font-semibold">Rank</th>
                  <th className="px-4 py-3 font-semibold">Team deposit target</th>
                  <th className="px-4 py-3 font-semibold">Monthly salary</th>
                  <th className="px-4 py-3 font-semibold">Summary condition & reward</th>
                </tr>
              </thead>
              <tbody className="text-slate-600 dark:text-slate-300 divide-y divide-slate-200/90 dark:divide-slate-800/90">
                {rankRows.map((row, i) => (
                  <tr
                    key={row.rank}
                    className={`transition-colors hover:bg-brand-500/[0.04] dark:hover:bg-brand-500/[0.06] ${
                      i === rankRows.length - 1 ? 'bg-brand-500/[0.05] dark:bg-brand-500/[0.05]' : ''
                    }`}
                  >
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      <span className="inline-flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${i === rankRows.length - 1 ? 'bg-brand-500' : 'bg-brand-500'}`} />
                        {row.rank}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.target}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-brand-500 dark:text-brand-400 font-semibold">{row.salary}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                      {row.condition} · <span className="text-slate-600 dark:text-slate-300">{row.bonus}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Compensation bullets */}
      <section className="relative z-10 py-12 sm:py-16 border-t border-slate-200/90 dark:border-slate-800/90 bg-slate-50 dark:bg-[#12151c]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-6">Income at a glance</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto justify-items-center [perspective:1400px]">
            {compensationOverview.map((row) => (
              <div
                key={row.label}
                className="tilt-card-flat border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 bg-white dark:bg-[#1b202c] w-full max-w-sm text-center"
              >
                <p className="text-brand-500 text-xs font-semibold uppercase tracking-wider">{row.label}</p>
                <p className="text-slate-900 dark:text-white text-sm mt-1">{row.value}</p>
              </div>
            ))}
          </div>
          <p className="text-slate-600 dark:text-slate-500 text-xs mt-6 max-w-2xl mx-auto">
            Note: Rank detail cards reference global royalty at 1% on company client profit; the overview may list 5% — rely on your latest agreement and dashboard.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-16 sm:py-24 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.08] pointer-events-none" />
        <div className="absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-brand-500/15 blur-3xl animate-float-slow pointer-events-none" />
        <div className="absolute -bottom-24 right-1/4 w-96 h-96 rounded-full bg-brand-500/15 blur-3xl animate-float-slower pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center">
            <Eyebrow icon={Sparkles} dark>Your move</Eyebrow>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white mb-4 leading-tight">
            From Starter to Global Leader — the position is open for you
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
            Join PipGuardian and prove your potential. Your journey from beginner toward global success starts with a single step.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-gradient-to-r from-brand-500 to-brand-700 text-slate-950 font-bold text-sm shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 transition-all hover:-translate-y-1"
            >
              Take the first step
              <ArrowRight size={18} className="ml-2" />
            </Link>
            <Link
              href="/#plans"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-white font-semibold text-sm hover:bg-white/10 transition-all hover:-translate-y-1"
            >
              View investment plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InvestingInfoContent;
