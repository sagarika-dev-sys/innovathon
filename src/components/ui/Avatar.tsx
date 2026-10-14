import React from 'react';

export interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  availability?: number;
  className?: string;
}

const colorPairs = [
  'from-indigo-500 to-purple-600',
  'from-cyan-500 to-blue-600',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-violet-500 to-fuchsia-600',
];

export default function Avatar({
  name,
  size = 'md',
  availability,
  className = '',
}: AvatarProps) {
  const getInitials = (str: string) => {
    return str
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const charCodeSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gradient = colorPairs[charCodeSum % colorPairs.length];

  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg font-bold',
  };

  const dotSize = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-3.5 h-3.5',
  };

  const getStatusColor = (avail?: number) => {
    if (avail === undefined) return 'bg-emerald-400';
    if (avail >= 80) return 'bg-emerald-400';
    if (avail >= 50) return 'bg-amber-400';
    return 'bg-rose-400';
  };

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <div
        className={`rounded-full bg-gradient-to-tr ${gradient} text-white font-semibold flex items-center justify-center shadow-inner border border-white/20 select-none ${sizeStyles[size]}`}
      >
        {getInitials(name)}
      </div>
      {availability !== undefined && (
        <span
          title={`Availability: ${availability}%`}
          className={`absolute bottom-0 right-0 rounded-full border-2 border-slate-900 ${getStatusColor(
            availability
          )} ${dotSize[size]}`}
        />
      )}
    </div>
  );
}
