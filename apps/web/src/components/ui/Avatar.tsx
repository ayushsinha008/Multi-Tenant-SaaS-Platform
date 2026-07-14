import * as React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ src, fallback, size = 'md', className, ...props }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-12 h-12 text-sm',
  };

  return (
    <div
      className={cn(
        'relative flex shrink-0 overflow-hidden border-[3px] border-black bg-black text-[#00FF4C] select-none items-center justify-center font-black shadow-[4px_4px_0_0_#000000]',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt="Avatar" className="aspect-square h-full w-full object-cover" />
      ) : (
        <span>{fallback?.slice(0, 2).toUpperCase() || '?'}</span>
      )}
    </div>
  );
}
