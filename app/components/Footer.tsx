'use client';
import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-32 border-t border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950 transition-colors duration-300 print:hidden">
      <div className="max-w-7xl mx-auto px-8 py-14">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          
          <div className="space-y-3 text-center md:text-left">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">
              Agile -DSS
            </h3>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] leading-relaxed">
              Strategic Decision Support & <br className="hidden md:block" /> Digital Infrastructure
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">
                System Operational
              </p>
            </div>
            <p className="text-[9px] font-medium text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em]">
              © {currentYear} • Decision Support Tool
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}