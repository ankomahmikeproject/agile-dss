'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { Menu, X, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  useEffect(() => {
    async function fetchOrg() {
      if (user?.uid) {
        const docRef = doc(db, "organizations", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCompanyName(docSnap.data().name);
        }
      }
    }
    fetchOrg();
  }, [user]);

  const displayName = companyName || user?.displayName?.split(' ')[0] || "IT Manager";

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between items-center h-20 gap-8">
          
          <div className="flex items-center gap-10">
            <Link href="/" className="flex-shrink-0 group flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-all shadow-xl shadow-blue-500/20">
                <span className="text-white font-black text-sm tracking-tighter">DSS</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                  Agile-Decision
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                  Support
                </span>
              </div>
            </Link>

            {user && !loading && (
              <nav className="hidden lg:flex items-center border-l border-slate-200 dark:border-slate-800 ml-2 pl-10 gap-8">
                <Link 
                  href="/history" 
                  className="text-[10px] font-black text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 uppercase tracking-[0.4em] transition-all"
                >
                  History
                </Link>
              </nav>
            )}
          </div>

          <div className="flex items-center gap-4 sm:gap-8">
            
            <div className="flex items-center gap-2">
              {!loading && <ThemeToggle />}
              
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

            {user ? (
              <div className="hidden lg:flex items-center gap-6 pl-6 border-l border-slate-200 dark:border-slate-800">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] leading-none mb-1.5">
                    {timeGreeting}
                  </span>
                  <span className="text-sm font-black text-slate-900 dark:text-white leading-none">
                    {displayName}
                  </span>
                </div>
                
                <div className="relative group">
                   <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 shadow-xl ring-1 ring-slate-200 dark:ring-slate-700 overflow-hidden">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                          {displayName.charAt(0)}
                        </div>
                      )}
                   </div>
                </div>

                <button
                  onClick={logout}
                  className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800 text-[10px] font-black text-slate-500 hover:text-red-600 dark:hover:text-red-400 uppercase tracking-widest rounded-xl transition-all border border-slate-200 dark:border-slate-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              !loading && (
                <Link href="/login" className="hidden lg:block px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl active:scale-95 transition-all">
                  Secure Access
                </Link>
              )
            )}
          </div>
        </div>
      </div>

      <div className={`
        lg:hidden overflow-hidden transition-all duration-500 ease-in-out bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800
        ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className="px-6 py-8 space-y-6">
          {user && (
            <>
              <Link href="/history" onClick={() => setIsMobileMenuOpen(false)} className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.4em]">
                History
              </Link>
              <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.4em]">
                Analysis Engine
              </Link>
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <button onClick={logout} className="text-[11px] font-black text-red-500 uppercase tracking-[0.4em]">
                  LogOut
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}