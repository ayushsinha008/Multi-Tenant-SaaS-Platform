import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

const buttonVariants = cva(
  'inline-flex items-center justify-center text-sm font-black uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF4C] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white border-[3px] border-black shadow-[4px_4px_0_0_#000000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
  {
    variants: {
      variant: {
        default: 'bg-white text-black hover:bg-black hover:text-[#00FF4C]',
        destructive: 'bg-[#FF0000] text-white hover:bg-black hover:text-[#FF0000]',
        outline: 'bg-transparent text-black hover:bg-black hover:text-[#00FF4C]',
        secondary: 'bg-[#00FF4C] text-black hover:bg-black hover:text-[#00FF4C]',
        ghost: 'border-transparent shadow-none hover:border-black hover:shadow-[4px_4px_0_0_#000000] text-black hover:bg-white',
        link: 'border-none shadow-none underline-offset-4 hover:underline text-black hover:text-[#00FF4C] active:translate-x-0 active:translate-y-0',
      },
      size: {
        default: 'h-12 py-3 px-6',
        sm: 'h-10 px-4 text-xs',
        lg: 'h-14 px-10 text-base',
        icon: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    // We omit framer motion for simple usage but handle scale on active via tailwind `active:scale-[0.98]`
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
