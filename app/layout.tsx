'use client';

import { useEffect, useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './components/ThemeProvider';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isPreloading, setIsPreloading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsPreloading(false), 1);
    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning className="h-auto">
      <body className={`
        ${isPreloading ? 'preload' : ''} 
        bg-slate-50 dark:bg-slate-950 
        text-slate-900 dark:text-slate-100 
        antialiased font-sans selection:bg-blue-100 selection:text-blue-900 
        overflow-x-hidden transition-colors duration-300
      `}>
        <ThemeProvider>
          <AuthProvider>
            
            <div className="print:hidden">
              <Navbar />
            </div>

            <main className="min-h-screen pt-16">
              {children}
            </main>

            <Footer/>

          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}