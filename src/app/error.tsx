'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <div className="max-w-md">
        <h2 className="text-xl font-bold text-white">Something went wrong</h2>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          {error?.message || 'An unexpected error occurred while processing the request.'}
        </p>
      </div>
      <Button
        onClick={() => reset()}
        variant="glow"
        size="sm"
        leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
      >
        Retry Operation
      </Button>
    </div>
  );
}
