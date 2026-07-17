import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex w-full h-12 rounded-xl border-[3px] border-ink bg-white px-4 py-2 text-sm font-medium text-ink placeholder:text-ink/30 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-lavender-dark focus-visible:ring-offset-1 focus-visible:border-lavender-dark transition-all disabled:cursor-not-allowed disabled:opacity-50 shadow-neo-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
