import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 border-[2px] border-[#1A1A1A] px-3 py-1 text-xs font-bold tracking-wide transition-colors rounded-full',
  {
    variants: {
      variant: {
        default:     'bg-[#1A1A1A] text-white',
        sky:         'bg-[#BAE6FD] text-[#1A1A1A]',
        lavender:    'bg-[#DDD6FE] text-[#1A1A1A]',
        mint:        'bg-[#BBF7D0] text-[#1A1A1A]',
        pink:        'bg-[#FBCFE8] text-[#1A1A1A]',
        yellow:      'bg-[#FEF08A] text-[#1A1A1A]',
        orange:      'bg-[#FED7AA] text-[#1A1A1A]',
        destructive: 'bg-red-100 text-red-700 border-red-300',
        outline:     'bg-white text-[#1A1A1A]',
        success:     'bg-[#BBF7D0] text-[#1A1A1A]',
        secondary:   'bg-[#FFFDF5] text-[#1A1A1A]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
