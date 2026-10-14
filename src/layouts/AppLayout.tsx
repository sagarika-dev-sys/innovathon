'use client';

import React from 'react';
import Navbar from '@/components/ui/Navbar';

export interface AppLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
}

export default function AppLayout({ children, showNavbar = true }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {showNavbar && <Navbar />}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
