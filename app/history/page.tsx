'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, ChevronRight } from 'lucide-react';

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchHistory = async () => {
    if (!user?.uid) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/evaluations/history?userId=${user.uid}`);
      
      if (!res.ok) throw new Error("Could not retrieve archive");
      
      const data = await res.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ History Sync Failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (user) fetchHistory();
      else setLoading(false);
    }
  }, [user?.uid, authLoading]);

  const deleteRecord = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); 
    if (!confirm("Are you sure you want to delete this record?")) return;

    try {
      const res = await fetch(`/api/evaluations/history?id=${id}&userId=${user?.uid}&mode=single`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setHistory(prev => prev.filter(item => item.id !== id));
      } else {
        const errData = await res.json();
        alert(`Delete failed: ${errData.error || 'Unauthorized'}`);
      }
    } catch (err) {
      alert("System Error: Could not reach the DSS Archive.");
    }
  };

  const clearAllHistory = async () => {
    if (!user?.uid || history.length === 0) return;
    if (!confirm(`CRITICAL: This will permanently delete all ${history.length} records. Proceed?`)) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/evaluations/history?userId=${user.uid}&mode=all`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setHistory([]);
      } else {
        alert("Mass deletion failed. Database access restricted.");
      }
    } catch (err) {
      console.error("Batch Purge Error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewReport = (item: any) => {
    const reportData = {
      results: item.results,
      weights: item.weights,
      sector: item.sector,
      isHistoryView: true
    };
    sessionStorage.setItem('dss_report_rehydrate', JSON.stringify(reportData));
    router.push('/'); 
  };

  if (loading || authLoading) return <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
  </div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Audit Archive</h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400 font-medium italic">Manage and re-examine your decision history.</p>
          </div>
          
          <div className="flex items-center gap-4">
            {history.length > 0 && (
              <button 
                onClick={clearAllHistory}
                disabled={isDeleting}
                className="text-[10px] font-black text-red-500 hover:text-red-600 uppercase tracking-widest px-4 py-2 border border-red-200 dark:border-red-900/30 rounded-xl bg-red-50/50 dark:bg-red-950/20 transition-all active:scale-95"
              >
                {isDeleting ? "Deleting..." : "Clear all"}
              </button>
            )}
            <Link href="/" className="text-[10px] font-black text-white bg-blue-600 px-6 py-3 rounded-xl hover:bg-blue-700 uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20">
               New Analysis
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sector</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Recommendation</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {history.length > 0 ? (
                  history.map((item: any) => (
                    <tr 
                      key={item.id} 
                      onClick={() => handleViewReport(item)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group cursor-pointer"
                    >
                      <td className="px-8 py-6 text-sm font-bold text-slate-500 dark:text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded uppercase tracking-wider">
                          {item.sector}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-base font-black text-slate-800 dark:text-slate-200">
                        {item.recommendation}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-end gap-4">
                           <span className="text-sm font-black text-slate-900 dark:text-white mr-2">
                             {item.score?.toFixed(1) || 0}%
                           </span>
                           
                           <button 
                             onClick={(e) => deleteRecord(e, item.id)}
                             className="p-2 text-slate-300 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400 transition-colors"
                           >
                             <Trash2 size={16} />
                           </button>

                           <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              <ChevronRight size={14} strokeWidth={3} />
                           </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-slate-400 dark:text-slate-600 font-medium italic">
                      No assessment records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}