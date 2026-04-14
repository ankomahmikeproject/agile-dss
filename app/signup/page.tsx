'use client';

import React from 'react';
import SignUpForm from '../components/auth/SignUpForm'; 

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <SignUpForm />
      
      <p className="mt-8 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
       DSS • Secure Onboarding
      </p>
    </main>
  );
}