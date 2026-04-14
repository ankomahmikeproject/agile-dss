'use client';

import React, { useState, useEffect } from 'react';
import AssessmentForm from '../components/AssessmentForm';
import ResultsView from '../components/ResultsView';
import HistoryMiniList from '../components/HistoryMiniList';

export default function Home() {
  const [view, setView] = useState<'INPUT' | 'LOADING' | 'RESULTS'>('INPUT');
  const [results, setResults] = useState<any[]>([]);
  const [currentWeights, setCurrentWeights] = useState({});
  const [currentSector, setCurrentSector] = useState(""); 
  const [aiInsight, setAiInsight] = useState(""); 
  const [validationError, setValidationError] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const savedReport = sessionStorage.getItem('dss_report_rehydrate');
    if (savedReport) {
      try {
        const parsed = JSON.parse(savedReport);
        setResults(parsed.results);
        setCurrentWeights(parsed.weights);
        setCurrentSector(parsed.sector);
        setAiInsight(parsed.aiInsight || ""); 
        setView('RESULTS');
        sessionStorage.removeItem('dss_report_rehydrate');
      } catch (e) {
        console.error("Hydration Error:", e);
      }
    }
  }, []);

  const handleCalculate = async (weights: any, sector: string) => {
    setValidationError(null);
    if (!sector || sector.trim() === "") {
      setValidationError("Action Required: Please select an Industry Sector.");
      return;
    }

    setView('LOADING'); 
    setCurrentWeights(weights);
    setCurrentSector(sector);
    
    try {
      const minLoadingTime = new Promise(resolve => setTimeout(resolve, 3500));

      const apiRequest = fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weights, sector }) 
      });

      const [response] = await Promise.all([apiRequest, minLoadingTime]);
      
      if (!response.ok) throw new Error("MCDA Engine timeout");
      
      const data = await response.json();

      setResults(data.rankings); 
      setAiInsight(data.aiInsight); 
      
      setView('RESULTS'); 
    } catch (error) {
      console.error("MCDA Engine Error:", error);
      setValidationError("System Error: The Intelligence engine failed to process the request.");
      setView('INPUT');
    }
  };

  if (!hasMounted) return <div className="min-h-screen bg-slate-50 dark:bg-slate-950" />;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        
        <header className="mb-12 border-b border-slate-200 dark:border-slate-800 pb-8 flex justify-between items-end">
          <div>
            <span className="text-blue-600 dark:text-blue-400 font-bold tracking-[0.3em] text-[10px] uppercase mb-2 block">
              DSS | Strategic Advisor
            </span>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
              {view === 'RESULTS' ? 'Analysis Report' : 'Decision Engine'}
            </h1>
          </div>
          {view === 'RESULTS' && (
            <button 
              onClick={() => setView('INPUT')}
              className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline transition-all"
            >
              ← New Assessment
            </button>
          )}
        </header>

        <div className="min-h-[500px] mb-20">
          {view === 'INPUT' && (
            <div className="animate-in fade-in zoom-in duration-500">
              {validationError && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-sm font-bold rounded-r-xl uppercase tracking-tight">
                  {validationError}
                </div>
              )}
              <AssessmentForm onCalculate={handleCalculate} />
            </div>
          )}

          {view === 'LOADING' && (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
              <div className="relative w-24 h-24 mb-10">
                <div className="absolute inset-0 border-8 border-slate-100 dark:border-slate-800 rounded-full" />
                <div className="absolute inset-0 border-8 border-blue-600 rounded-full border-t-transparent animate-spin" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">Consulting AI Strategy</h3>
              <p className="text-slate-400 text-center max-w-xs animate-pulse text-[10px] font-bold uppercase tracking-[0.3em]">
                Synthesizing SAW Rankings with Strategic Logic...
              </p>
            </div>
          )}

          {view === 'RESULTS' && (
            <div className="animate-in slide-in-from-bottom-8 duration-700">
              <ResultsView 
                results={results} 
                weights={currentWeights} 
                sector={currentSector} 
                aiInsight={aiInsight}
              />
            </div>
          )}
        </div>

        <section className="mt-20 pt-12 border-t-2 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
               Recent Operations
             </h3>
          </div>
          <HistoryMiniList onSelect={(item: any) => {
             setResults(item.results);
             setCurrentWeights(item.weights);
             setCurrentSector(item.sector);
             setAiInsight(item.aiInsight || ""); 
             setView('RESULTS');
             window.scrollTo({ top: 0, behavior: 'smooth' });
          }} />
        </section>

      </div>
    </main>
  );
}