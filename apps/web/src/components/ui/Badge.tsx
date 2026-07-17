import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 border-[2px] border-ink px-3 py-1 text-xs font-bold tracking-wide transition-colors rounded-full',
  {
    variants: {
      variant: {
        default:     'bg-ink text-white',
        sky:         'bg-sky text-ink',
        lavender:    'bg-lavender text-ink',
        mint:        'bg-mint text-ink',
        pink:        'bg-pink-pastel text-ink',
        yellow:      'bg-yellow-pastel text-ink',
        orange:      'bg-orange-pastel text-ink',
        destructive: 'bg-red-100 text-red-700 border-red-300',
        outline:     'bg-white text-ink',
        success:     'bg-mint text-ink',
        secondary:   'bg-cream text-ink',
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
