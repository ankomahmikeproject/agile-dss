'use client';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-8 h-8" />;

  const isDark = theme === 'dark';

  return (
    <div className="relative group flex items-center justify-center">
      <button
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
        aria-label="Toggle Theme"
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-yellow-500 group-hover:rotate-45 transition-transform" />
        ) : (
          <Moon className="w-4 h-4 text-slate-600 group-hover:-rotate-12 transition-transform" />
        )}
      </button>

      <div className="absolute top-12 scale-0 group-hover:scale-100 transition-all duration-200 origin-top">
        <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap border border-white/10 dark:border-slate-200">
          Switch to {isDark ? 'Light' : 'Dark'} Mode
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-white rotate-45 border-l border-t border-white/10 dark:border-slate-200" />
        </div>
      </div>
    </div>
  );
}