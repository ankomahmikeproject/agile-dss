'use client';

import React, { useState } from 'react';
import { auth, db } from '@/lib/firebase'; 
import { doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Eye, EyeOff } from 'lucide-react'; 

export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLoading(true);
    setError('');
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const batch = writeBatch(db);
      const orgRef = doc(db, "organizations", user.uid);
      batch.set(orgRef, {
        name: companyName,
        ownerId: user.uid,
        plan: "trial",
        createdAt: serverTimestamp(),
      });

      const userRef = doc(db, "users", user.uid);
      batch.set(userRef, {
        email: user.email,
        role: "admin",
        organizationId: user.uid,
        createdAt: serverTimestamp(),
      });

      await batch.commit();

      const token = await user.getIdToken();
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        window.location.href = '/dashboard';
      } else {
        throw new Error("Failed to initialize session.");
      }

    } catch (err: any) {
      console.error("SaaS Signup Failure", err);
      if (err.code === 'auth/operation-not-allowed') {
        setError("Configuration Error: Enable Email/Password in Firebase Console.");
      } else if (err.code === 'auth/email-already-in-use') {
        setError("This email is already registered.");
      } else if (err.code === 'auth/weak-password') {
        setError("Password should be at least 6 characters.");
      } else {
        setError("Signup failed. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl mx-auto animate-in fade-in zoom-in duration-300 transition-colors duration-300">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Get Started</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Create your account</p>
      </div>

      <form onSubmit={handleSignUp} className="space-y-5">
        <div>
          <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Company Name</label>
          <input 
            type="text" 
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 dark:focus:ring-blue-900/20 outline-none transition-all font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600"
            placeholder="Algrace Systems"
            required
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 dark:focus:ring-blue-900/20 outline-none transition-all font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600"
            placeholder="ankomah@algrace.com"
            required
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Password</label>
          
          <div className="relative group">
            <input 
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 dark:focus:ring-blue-900/20 outline-none transition-all font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30">
            <p className="text-red-600 dark:text-red-400 text-[11px] font-bold text-center uppercase tracking-wider">{error}</p>
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black py-5 rounded-2xl hover:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white hover:shadow-xl hover:shadow-blue-200 dark:hover:shadow-blue-900/20 transition-all active:scale-[0.98] disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed group"
        >
          <span className="flex items-center justify-center gap-2">
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 dark:border-slate-900/30 border-t-white dark:border-t-slate-900 rounded-full animate-spin" />
                <span>LOADING...</span>
              </>
            ) : (
              "CREATE ACCOUNT"
            )}
          </span>
        </button>
      </form>
      
      <div className="mt-8 text-center">
        <p className="text-slate-400 dark:text-slate-600 text-[11px] font-bold uppercase tracking-widest">
          Secure Infrastructure
        </p>
      </div>
    </div>
  );
}