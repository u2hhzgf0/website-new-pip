'use client'

import React from 'react';
import { ShieldCheck, Globe, TrendingUp, Users, Award, Target, BarChart2, Linkedin, Twitter } from 'lucide-react';

// ── Team members ──────────────────────────────────────────────────────────────
const TEAM = [
  {
    name: 'Mohammad Ahangari Asl',
    role: 'Senior Forex Trader',
    image: '/images/Mohammad Ahangari Asl.jpg',
    bio: 'A seasoned forex professional with deep expertise in major and exotic currency pairs. Mohammad drives Pipguardianelt\'s core trading strategy, combining technical precision with disciplined risk control.',
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'Ray Dalio',
    role: 'Global Investment Strategist',
    image: '/images/ray dalio.jpg',
    bio: 'Founder of Bridgewater Associates — the world\'s largest hedge fund. Ray is renowned for his "All Weather" portfolio strategy and radical-transparency principles that shaped modern institutional investing.',
    linkedin: 'https://www.linkedin.com/in/raydalio/',
    twitter: 'https://x.com/RayDalio',
  },
  {
    name: 'Cathie Wood',
    role: 'Innovation & Growth Specialist',
    image: '/images/cathie wood.png',
    bio: 'Founder and CEO of ARK Invest. Cathie is a visionary investor focused on disruptive innovation and exponential growth. Her bold, research-driven strategies have redefined modern portfolio management globally.',
    linkedin: 'https://www.linkedin.com/in/cathiewood/',
    twitter: 'https://x.com/CathieDWood',
  },
  {
    name: 'Larry Williams',
    role: 'Technical Analysis Consultant',
    image: '/images/larry williams.png',
    bio: 'A legendary short-term trader and best-selling author who turned $10,000 into over $1.1 million in a world trading championship. Creator of the Williams %R indicator used by traders worldwide.',
    linkedin: '#',
    twitter: 'https://x.com/larrywilliams',
  },
  {
    name: 'Damilare Ogundare',
    role: 'Forex Market Analyst',
    image: '/images/damilare ogundare.jpg',
    bio: 'A sharp market analyst specialising in fundamental and technical confluence across major currency pairs. Damilare delivers consistent, data-driven insights that guide Pipguardianelt\'s daily trading decisions.',
    linkedin: '#',
    twitter: '#',
  },
];

// ── Stats ─────────────────────────────────────────────────────────────────────
const STATS = [
  { label: 'Active Investors', value: '12,500+', icon: Users },
  { label: 'Assets Managed', value: '$150M+', icon: BarChart2 },
  { label: 'Avg. Annual Return', value: '18.4%', icon: TrendingUp },
  { label: 'Years of Experience', value: '10+', icon: Award },
];

// ── Values ────────────────────────────────────────────────────────────────────
const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Bank-Grade Security',
    desc: '256-bit encryption and fully segregated client accounts ensure your funds are always protected.',
  },
  {
    icon: Globe,
    title: 'Global Access',
    desc: 'Invest from anywhere in the world, 24/7, with instant account access across all devices.',
  },
  {
    icon: Target,
    title: 'Transparent Goals',
    desc: 'No hidden fees, no surprises. Every return target and risk level is clearly disclosed upfront.',
  },
  {
    icon: Award,
    title: 'Performance Rewarded',
    desc: 'Our rank-based reward system ensures that your growth and commitment are always recognised.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="bg-slate-950 text-white">

      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gold-500/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
            <span className="text-gold-500 text-sm font-bold uppercase tracking-wider">About Pipguardianelt</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6">
            We Are Building the <span className="text-gold-500">Future of Forex</span> Investing
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
            Pipguardianelt is a professional forex investment platform dedicated to making disciplined, structured, and transparent trading accessible to everyone — regardless of experience level.
          </p>
        </div>
      </section>

      {/* ── Stats Row ───────────────────────────────────────────────────── */}
      <section className="border-y border-slate-800/60 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {STATS.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center text-center gap-2">
                <div className="w-11 h-11 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-1">
                  <Icon size={20} className="text-gold-400" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-white">{value}</p>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Story ───────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <div className="relative order-2 lg:order-1">
              <div className="absolute inset-0 bg-gradient-to-tr from-gold-500/20 to-transparent rounded-3xl transform rotate-2" />
              <img
                src="https://res.cloudinary.com/dshkbza19/image/upload/v1775410956/WhatsApp_Image_2026-04-05_at_6.04.47_PM_uz3rva.jpg"
                alt="Pipguardianelt trading team"
                className="relative z-10 w-full h-[320px] sm:h-[460px] object-cover object-top rounded-2xl border border-slate-800 shadow-2xl"
              />
            </div>
            {/* Text */}
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-4 py-1.5 mb-5">
                <span className="text-gold-500 text-sm font-bold uppercase tracking-wider">Our Story</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-5 leading-tight">
                From a Vision to a <span className="text-gold-500">Global Platform</span>
              </h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                Pipguardianelt was founded with one clear goal — to bridge the gap between professional forex expertise and everyday investors. We saw a world where high-quality trading strategies were locked behind expensive brokerages and inaccessible to regular people.
              </p>
              <p className="text-slate-400 leading-relaxed mb-4">
                Our team of experienced traders, analysts, and risk managers came together to create a platform built on discipline, transparency, and performance. Every trade we make is guided by a structured strategy — not speculation.
              </p>
              <p className="text-slate-400 leading-relaxed">
                Today, Pipguardianelt serves thousands of investors across the globe, providing consistent returns and a career pathway through our unique rank-based reward system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Values ──────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-slate-900/30 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-4 py-1.5 mb-4">
              <span className="text-gold-500 text-sm font-bold uppercase tracking-wider">Our Values</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              What We Stand For
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-gold-500/30 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-gold-400" />
                </div>
                <h3 className="text-white font-bold mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team / Traders ──────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-4 py-1.5 mb-4">
              <span className="text-gold-500 text-sm font-bold uppercase tracking-wider">The Team</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-3">
              The People Behind <span className="text-gold-500">Pipguardianelt</span>
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
              Our team of professionals brings decades of combined trading experience, risk management expertise, and a shared commitment to your financial growth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="group bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden hover:border-gold-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gold-500/5"
              >
                {/* Photo */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-white font-bold text-base leading-tight mb-0.5">{member.name}</h3>
                  <p className="text-gold-400 text-[10px] font-semibold uppercase tracking-wider mb-2">{member.role}</p>
                  <p className="text-slate-400 text-xs leading-relaxed mb-3">{member.bio}</p>

                  {/* Social links */}
                  <div className="flex gap-2">
                    <a
                      href={member.linkedin}
                      target={member.linkedin !== '#' ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-gold-400 hover:border-gold-500/40 transition-colors"
                      aria-label={`${member.name} LinkedIn`}
                    >
                      <Linkedin size={12} />
                    </a>
                    <a
                      href={member.twitter}
                      target={member.twitter !== '#' ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-gold-400 hover:border-gold-500/40 transition-colors"
                      aria-label={`${member.name} Twitter / X`}
                    >
                      <Twitter size={12} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission closing CTA ──────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 border-t border-slate-800/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-5">
            Ready to Grow with <span className="text-gold-500">Pipguardianelt?</span>
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            Join thousands of investors already building wealth through disciplined forex trading. Your journey to financial freedom starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="px-8 py-3 bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold rounded-xl transition-colors text-sm uppercase tracking-wider"
            >
              Get Started
            </a>
            <a
              href="/#contact"
              className="px-8 py-3 bg-transparent border border-slate-700 hover:border-gold-500/50 text-white font-medium rounded-xl transition-colors text-sm"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
