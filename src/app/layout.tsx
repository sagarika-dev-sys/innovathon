import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/ui/Navbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'PeerSync Engine — Algorithmic Campus Teaming & Skill Matching',
  description: 'Synthesize Pareto-optimal hackathon teams with deterministic combinatorial skill matching and peer availability scoring.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
