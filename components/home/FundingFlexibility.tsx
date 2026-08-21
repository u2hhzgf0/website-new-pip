import React from 'react';

const cards = [
  {
    img: '/images/payment-routes.DRH4Qr8r.webp',
    title: 'Multiple Payment Gateways',
    desc: 'Fund your account through several supported deposit gateways, managed from your dashboard.',
  },
  {
    img: '/images/regional.BUIxpM4n.webp',
    title: 'Regional Availability',
    desc: "Available payment options can vary by region — your dashboard shows what's active for your account.",
  },
  {
    img: '/images/client-zone.D-yjmLMI.webp',
    title: 'Manage Everything In Your Dashboard',
    desc: 'Saved withdrawal accounts, transaction history, and account status — all in one client zone.',
  },
  {
    img: '/images/communication.BJaEDjmN.webp',
    title: 'Clear Funding Communication',
    desc: 'Status updates and notifications keep you informed on every deposit and withdrawal request.',
  },
];

const FundingFlexibility = () => {
  return (
    <section className="py-12 sm:py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-brand-500 text-sm font-bold uppercase tracking-wider">Funding &amp; Payments</span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white mt-3 mb-4">
            Fund Your Account With Flexibility
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {cards.map((card, i) => (
            <div
              key={i}
              className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-8 flex items-center gap-5 sm:gap-8 hover:border-brand-500/40 transition-colors"
            >
              <img src={card.img} alt="" className="w-16 h-16 sm:w-20 sm:h-20 object-contain shrink-0" />
              <div>
                <h3 className="text-slate-900 dark:text-white font-bold text-sm sm:text-lg mb-1.5">{card.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FundingFlexibility;
