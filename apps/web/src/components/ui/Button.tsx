import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base — rounded, bold, thick border, chunky shadow, press effect
  'inline-flex items-center justify-center font-bold tracking-wide transition-all duration-150 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#C4B5FD] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none border-[3px] border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none hover:-translate-y-[1px] hover:shadow-[5px_5px_0px_#1A1A1A]',
  {
    variants: {
      variant: {
        default:     'bg-[#1A1A1A] text-white hover:bg-[#2D2D2D]',
        primary:     'bg-[#DDD6FE] text-[#1A1A1A] hover:bg-[#C4B5FD]',
        sky:         'bg-[#BAE6FD] text-[#1A1A1A] hover:bg-[#7DD3FC]',
        mint:        'bg-[#BBF7D0] text-[#1A1A1A] hover:bg-[#86EFAC]',
        pink:        'bg-[#FBCFE8] text-[#1A1A1A] hover:bg-[#F9A8D4]',
        yellow:      'bg-[#FEF08A] text-[#1A1A1A] hover:bg-[#FDE047]',
        destructive: 'bg-red-100 text-red-700 border-red-400 shadow-[4px_4px_0px_#f87171] hover:bg-red-200 hover:shadow-[5px_5px_0px_#f87171] active:shadow-none',
        outline:     'bg-white text-[#1A1A1A] hover:bg-[#FFFDF5]',
        ghost:       'border-transparent shadow-none bg-transparent hover:bg-[#1A1A1A]/5 active:translate-x-0 active:translate-y-0',
        link:        'border-none shadow-none underline-offset-4 hover:underline text-[#1A1A1A] active:translate-x-0 active:translate-y-0',
      },
      size: {
        default: 'h-11 px-5 text-sm rounded-xl',
        sm:      'h-9 px-4 text-xs rounded-lg',
        lg:      'h-13 px-7 text-base rounded-xl',
        icon:    'h-11 w-11 rounded-xl',
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
    const Comp = asChild ? Slot : 'button';
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
