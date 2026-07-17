'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  fallback: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
};

// Pastel colors for avatar fallback backgrounds
const colorPalette = [
  'bg-sky', // sky
  'bg-lavender', // lavender
  'bg-mint', // mint
  'bg-pink-pastel', // pink
  'bg-yellow-pastel', // yellow
  'bg-orange-pastel', // orange
];

function getColor(name: string) {
  const idx = name.charCodeAt(0) % colorPalette.length;
  return colorPalette[idx];
}

export function Avatar({ src, fallback, className, size = 'md' }: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);

  // Reset error state if src changes
  React.useEffect(() => {
    setImgError(false);
  }, [src]);

  const initials = fallback
    ? fallback.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const bgColor = getColor(fallback || '?');

  if (src && !imgError) {
    return (
      <div className={cn('rounded-full border-[3px] border-ink overflow-hidden shrink-0', sizeMap[size], className)}>
        <img
          src={src}
          alt={fallback}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-full border-[3px] border-ink flex items-center justify-center font-bold text-ink shrink-0 shadow-neo-xs',
        bgColor,
        sizeMap[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
