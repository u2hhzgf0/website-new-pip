'use client'

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const ThemeToggle = ({ className = '' }: { className?: string }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`relative flex items-center justify-center w-9 h-9 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brand-500 hover:border-brand-500 transition-colors ${className}`}
    >
      <Sun className="w-4 h-4 rotate-0 scale-100 dark:-rotate-90 dark:scale-0 transition-transform duration-300 absolute" />
      <Moon className="w-4 h-4 rotate-90 scale-0 dark:rotate-0 dark:scale-100 transition-transform duration-300 absolute" />
    </button>
  );
};

export default ThemeToggle;
