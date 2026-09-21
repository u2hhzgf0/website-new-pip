import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Sparkles } from 'lucide-react';

interface ComingSoonProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 sm:py-24 px-4">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center shadow-xl shadow-emerald-500/20">
          <Icon size={36} className="text-white" />
        </div>
      </div>
      <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-4">
        <Sparkles size={14} className="text-amber-500" />
        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Coming soon</span>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">{title}</h1>
      <p className="text-slate-500 dark:text-slate-400 max-w-md text-sm sm:text-base leading-relaxed">{description}</p>
    </div>
  );
};

export default ComingSoon;
