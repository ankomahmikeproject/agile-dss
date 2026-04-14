'use client';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface Result {
  id: string;
  name: string;
  score: number;
}

interface ResultsViewProps {
  results: Result[];
  weights: Record<string, number>;
  sector: string;
  aiInsight?: string; 
}

export default function ResultsView({ results, weights, sector, aiInsight }: ResultsViewProps) {
  const { user, login } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const handlePrint = () => window.print();

  const getFallbackInsight = (name: string, score: number) => {
    if (score >= 85) return `Strategic Alignment: ${name} is the optimal choice for ${sector || 'your organization'}. Its core architecture directly addresses your high-priority scaling and governance needs with minimal friction.`;
    if (score >= 70) return `Strong Fit: ${name} is a resilient candidate. While it matches most of your primary drivers, some minor tailoring of engineering practices may be required to reach full efficiency.`;
    return `Alternative Option: While ${name} is viable, the suitability index suggests it may not be the most efficient path forward given your current constraints.`;
  };

  const handleSaveResult = async () => {
    if (!user) {
      alert("Security Protocol: Please log in to save this assessment.");
      login(); 
      return;
    }
    setIsSaving(true);
    try {
      const response = await fetch('/api/evaluations/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.uid, 
          sector: sector || "General", 
          weights, 
          results,
          aiInsight 
        })
      });
      if (response.ok) alert(`✅ Saved: ${results[0].name} logged successfully.`);
      else alert(`❌ Save Failed.`);
    } catch (error) {
      alert("❌ Network Error.");
    } finally {
      setIsSaving(false);
    }
  };

  if (results.length === 0) return null;

  return (
    <div className="mt-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 print:space-y-12 print:mt-0">
      
      <div className="hidden print:flex items-center justify-between border-b-2 border-slate-900 pb-8 mb-10">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Agile-Decision</h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Support</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-900 uppercase tracking-widest">Strategic Audit Report</p>
          <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">REF: {new Date().getFullYear()}-{sector?.toUpperCase().slice(0,3) || 'GEN'}</p>
        </div>
      </div>

      <div className="flex justify-between items-end px-2 print:hidden">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Analysis Results</h2>
          <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest">MCDA Model: Simple Additive Weighting</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden text-white border border-white/10 transition-all duration-500 
        print:bg-none print:bg-white print:text-slate-900 print:border-2 print:border-slate-900 print:shadow-none print:p-8 print:rounded-3xl">
        
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/20 rounded-full blur-[80px] print:hidden" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl mb-8 print:bg-slate-900 print:text-white">
            Recommendation Index
          </div>

          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 mb-8">
            <h3 className="text-6xl font-black tracking-tighter print:text-slate-900 print:text-5xl">
              {results[0].name}
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-blue-400 dark:text-blue-500 print:text-slate-900">
                {results[0].score.toFixed(0)}%
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 print:text-slate-500">Match Accuracy</span>
            </div>
          </div>

          <div className="max-w-3xl border-l-2 border-blue-500/40 dark:border-blue-500/20 pl-8 py-2 print:border-slate-900">
            <p className="text-slate-200 dark:text-slate-300 text-lg font-medium leading-relaxed italic print:text-slate-800 print:not-italic print:text-base">
              "{aiInsight || getFallbackInsight(results[0].name, results[0].score)}"
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-sm relative transition-all duration-500 
        print:border-none print:p-0 print:shadow-none">
        
        <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-10 border-b border-slate-50 dark:border-slate-800/50 pb-4 print:text-slate-900 print:border-slate-900 print:border-b-2">
          Competitive Performance Matrix
        </h4>
        
        <div className="grid gap-8">
          {results.map((r, index) => (
            <div key={r.id} className="group relative print:break-inside-avoid">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[10px] font-black text-slate-400 print:text-slate-900 print:border-slate-900">
                    {index + 1}
                  </div>
                  <span className="text-base font-bold text-slate-800 dark:text-slate-200 print:text-slate-900">{r.name}</span>
                </div>
                <span className="text-sm font-black text-slate-900 dark:text-white print:text-slate-900">{r.score.toFixed(1)}%</span>
              </div>
              
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden print:bg-slate-100 print:border print:border-slate-200">
                <div 
                  className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-1000 print:bg-slate-900"
                  style={{ width: `${Math.min(r.score, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 print:hidden">
          <button onClick={handleSaveResult} disabled={isSaving} className="flex-1 bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white text-white font-black py-5 px-8 rounded-2xl transition-all shadow-xl active:scale-[0.98]">
            {isSaving ? "Saving..." : "Save Assessment"}
          </button>
          <button onClick={handlePrint} className="flex-1 bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-white text-slate-900 dark:text-white font-black py-5 px-8 rounded-2xl transition-all hover:bg-slate-50 dark:hover:bg-slate-800">
            Export PDF Report
          </button>
        </div>
      </div>
    </div>
  );
}