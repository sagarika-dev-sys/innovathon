import React from 'react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-pulse" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin" />
      </div>
      <div className="text-center">
        <h3 className="text-sm font-semibold text-slate-200">Loading PeerSync Engine</h3>
        <p className="text-xs text-slate-500 mt-1">Synchronizing campus pool...</p>
      </div>
    </div>
  );
}
