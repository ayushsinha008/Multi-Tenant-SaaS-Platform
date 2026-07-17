import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-bold tracking-wide transition-all duration-150 focus-visible:outline-4 focus-visible:outline-lavender-dark focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none border-[3px] border-ink shadow-neo-md active:translate-x-[3px] active:translate-y-[3px] active:shadow-none hover:-translate-y-[1px] hover:shadow-neo-lg',
  {
    variants: {
      variant: {
        default:     'bg-ink text-white hover:bg-ink-dark',
        primary:     'bg-lavender text-ink hover:bg-lavender-dark',
        sky:         'bg-sky text-ink hover:bg-sky-dark',
        mint:        'bg-mint text-ink hover:bg-mint-dark',
        pink:        'bg-pink-pastel text-ink hover:bg-pink-dark',
        yellow:      'bg-yellow-pastel text-ink hover:bg-yellow-dark',
        destructive: 'bg-red-100 text-red-700 border-red-400 shadow-neo-md-red hover:bg-red-200 hover:shadow-neo-lg-red active:shadow-none',
        outline:     'bg-white text-ink hover:bg-cream',
        ghost:       'border-transparent shadow-none bg-transparent hover:bg-ink/5 active:translate-x-0 active:translate-y-0',
        link:        'border-none shadow-none underline-offset-4 hover:underline text-ink active:translate-x-0 active:translate-y-0',
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
