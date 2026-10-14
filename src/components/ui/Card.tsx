import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glow?: 'indigo' | 'cyan' | 'none';
  variant?: 'glass' | 'solid';
}

export default function Card({
  children,
  className = '',
  hoverEffect = false,
  glow = 'none',
  variant = 'glass',
  ...props
}: CardProps) {
  const baseStyles = 'rounded-2xl transition-all duration-300 relative overflow-hidden';
  
  const variantStyles = {
    glass: 'glass-panel',
    solid: 'bg-slate-900 border border-slate-800',
  };

  const hoverStyles = hoverEffect ? 'glass-panel-hover' : '';

  const glowStyles = {
    none: '',
    indigo: 'hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)] hover:border-indigo-500/50',
    cyan: 'hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)] hover:border-cyan-500/50',
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${glowStyles[glow]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-6 pb-3 border-b border-white/[0.06] ${className}`}>{children}</div>;
}

export function CardBody({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-6 pt-3 border-t border-white/[0.06] bg-white/[0.01] ${className}`}>{children}</div>;
}
