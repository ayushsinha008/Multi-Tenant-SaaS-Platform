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
  'bg-[#BAE6FD]', // sky
  'bg-[#DDD6FE]', // lavender
  'bg-[#BBF7D0]', // mint
  'bg-[#FBCFE8]', // pink
  'bg-[#FEF08A]', // yellow
  'bg-[#FED7AA]', // orange
];

function getColor(name: string) {
  const idx = name.charCodeAt(0) % colorPalette.length;
  return colorPalette[idx];
}

export function Avatar({ src, fallback, className, size = 'md' }: AvatarProps) {
  const initials = fallback
    ? fallback.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const bgColor = getColor(fallback || '?');

  if (src) {
    return (
      <div className={cn('rounded-full border-[3px] border-[#1A1A1A] overflow-hidden shrink-0', sizeMap[size], className)}>
        <img src={src} alt={fallback} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-full border-[3px] border-[#1A1A1A] flex items-center justify-center font-bold text-[#1A1A1A] shrink-0 shadow-[2px_2px_0px_#1A1A1A]',
        bgColor,
        sizeMap[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
