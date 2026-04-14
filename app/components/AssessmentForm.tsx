'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChevronRight, ArrowRight, RotateCcw } from 'lucide-react';

interface Criterion {
  id: string;
  name: string;
  description: string;
}

const SECTORS = [
  "Technology & Software",
  "Finance & Banking",
  "Healthcare & Life Sciences",
  "Retail & E-commerce",
  "Manufacturing & Industry 4.0",
  "Government & Public Sector",
  "Renewable Energy & Sustainability",
  "Logistics & Supply Chain",
  "Education & EdTech",
  "Real Estate & PropTech",
  "Media & Entertainment",
  "Telecommunications",
  "Aerospace & Defense",
  "Non-Profit & NGOs"
];

export default function AssessmentForm({ onCalculate }: { onCalculate: (weights: any, sector: string) => void }) {
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [weights, setWeights] = useState<Record<string, number>>({});
  const [selectedSector, setSelectedSector] = useState("");
  const [step, setStep] = useState(1);
  const { user } = useAuth();

  useEffect(() => {
    fetch('/api/criteria')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCriteria(data as Criterion[]);
          const initial: Record<string, number> = {};
          data.forEach((c: Criterion) => (initial[c.id] = 5));
          setWeights(initial);
        }
      })
      .catch(err => console.error("Criteria Load Error:", err));
  }, []);

  const handleInputChange = (id: string, value: string) => {
    const num = parseInt(value);
    if (!isNaN(num) && num >= 1 && num <= 10) {
      setWeights((prev) => ({ ...prev, [id]: num }));
    } else if (value === "") {
      setWeights((prev) => ({ ...prev, [id]: 0 }));
    }
  };

  const canProceedToStep2 = selectedSector !== "";
  const isAssessmentComplete = 
    criteria.length > 0 && 
    Object.keys(weights).length === criteria.length &&
    Object.values(weights).every(v => v > 0);

  return (
    <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl transition-all duration-300">
      
      <div className="flex items-center space-x-3 mb-12">
        <div className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${step >= 1 ? 'bg-blue-600' : 'bg-slate-100 dark:bg-slate-800'}`} />
        <div className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${step >= 2 ? 'bg-blue-600' : 'bg-slate-100 dark:bg-slate-800'}`} />
      </div>

      {step === 1 ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">Organization Context</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Select your industry</p>
          
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Industry Sector</label>
            <div className="relative">
              <select 
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
              >
                <option value="">Select a sector...</option>
                {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronRight size={18} className="rotate-90" />
              </div>
            </div>
          </div>

          <button
            disabled={!canProceedToStep2}
            onClick={() => setStep(2)}
            className="group w-full mt-10 bg-blue-600 text-white font-black py-5 rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-30 flex items-center justify-center gap-3 uppercase text-[11px] tracking-[0.3em] hover:bg-slate-900 dark:hover:bg-white dark:hover:text-slate-900"
          >
            Continue<ChevronRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Characteristics</h2>
            <button 
              onClick={() => setStep(1)} 
              className="flex items-center gap-2 text-[11px] font-black text-blue-600 uppercase tracking-widest hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <RotateCcw size={14} strokeWidth={3} /> Edit Sector
            </button>
          </div>
          
          <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
            {criteria.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-6 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 transition-all hover:border-blue-500/30">
                <div className="space-y-1 pr-6 flex-1">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">{c.name}</label>
                  <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed max-w-md">{c.description}</p>
                </div>
                
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    placeholder="5"
                    value={weights[c.id] || ""}
                    onChange={(e) => handleInputChange(c.id, e.target.value)}
                    className="w-16 p-3 text-center text-lg font-black bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-blue-600 dark:text-blue-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all tabular-nums"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-10 border-t border-slate-100 dark:border-slate-800">
            <button
              disabled={!isAssessmentComplete}
              onClick={() => onCalculate(weights, selectedSector)}
              className="group w-full bg-blue-600 text-white font-black py-6 rounded-xl shadow-2xl shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-20 flex items-center justify-center gap-4 uppercase text-[12px] tracking-[0.4em] hover:bg-slate-900 dark:hover:bg-white dark:hover:text-slate-900"
            >
              Analyze & Generate Results <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-2 " />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}