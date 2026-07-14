import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30',
        secondary: 'border-transparent bg-slate-800 text-slate-300 hover:bg-slate-700',
        destructive: 'border-transparent bg-red-500/20 text-red-400 hover:bg-red-500/30',
        success: 'border-transparent bg-green-500/20 text-green-400 hover:bg-green-500/30',
        outline: 'text-slate-300 border-white/10',
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
