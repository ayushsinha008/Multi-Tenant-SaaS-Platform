import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full border-[3px] border-black bg-white px-4 py-2 text-sm font-bold text-black shadow-[4px_4px_0_0_#000000] ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-black placeholder:text-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF4C] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus-visible:shadow-[6px_6px_0_0_#000000] focus-visible:-translate-y-0.5 focus-visible:-translate-x-0.5",
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
