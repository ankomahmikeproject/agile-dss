'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function HistoryMiniList({ onSelect }: { onSelect: (item: any) => void }) {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      fetch(`/api/evaluations/history?userId=${user.uid}`)
        .then(async (res) => {
          if (!res.ok) {
            const text = await res.text();
            throw new Error(`Server Error ${res.status}: ${text}`);
          }
          return res.json();
        })
        .then(data => {
          setHistory(Array.isArray(data) ? data.slice(0, 3) : []);
          setLoading(false);
        })
        .catch(err => {
          console.error("📋 History MiniList Error:", err);
          setHistory([]);
          setLoading(false);
        });
    }
  }, [user]);

  if (loading) return <div className="h-20 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-3xl" />;

  if (history.length === 0) return (
    <p className="text-slate-400 dark:text-slate-600 italic text-sm">No past records found.</p>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {history.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item)}
          className="group text-left p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] hover:border-blue-500 transition-all shadow-sm hover:shadow-md"
        >
          <p className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">
            {new Date(item.createdAt).toLocaleDateString()}
          </p>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors leading-tight mb-4">
            {item.recommendation}
          </h4>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-[10px] font-black text-slate-400 uppercase">{item.sector}</span>
            <span className="text-xs font-black text-slate-900 dark:text-white">
              {item.score?.toFixed(0) || 0}%
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}