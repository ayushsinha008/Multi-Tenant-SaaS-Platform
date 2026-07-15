import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex w-full h-12 rounded-xl border-[3px] border-[#1A1A1A] bg-white px-4 py-2 text-sm font-medium text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#C4B5FD] focus-visible:ring-offset-1 focus-visible:border-[#C4B5FD] transition-all disabled:cursor-not-allowed disabled:opacity-50 shadow-[3px_3px_0px_#1A1A1A]',
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
