'use client'

import React from 'react';
import { ScanLine } from 'lucide-react';

const STEPS = [
  'Scan the vendor QR code shown at the store counter.',
  'Add each product line, quantity, and price just like a POS bill.',
  'Review the subtotal, discount, and estimated wallet bonus before sending.',
  'The vendor approves the request and the reward distribution runs automatically.',
];

const ScanQrContent = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Scan QR Code</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Scan a partner vendor&apos;s QR code, add items like a POS bill, and send the purchase for approval.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-start">
        {/* Scanner */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-10 flex flex-col items-center text-center tilt-card-flat">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-5">
            <ScanLine size={28} className="text-emerald-500" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Ready to Scan</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mb-6">
            Open the camera, scan the vendor QR, then build the bill with products, quantities, and prices.
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-colors"
          >
            <ScanLine size={16} />
            Open Scanner
          </button>
        </div>

        {/* How it works */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 tilt-card-flat">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-5">How it works</h2>
          <ol className="space-y-4">
            {STEPS.map((step, i) => (
              <li key={step} className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ScanQrContent;
