import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center border-[2px] border-black px-2.5 py-0.5 text-xs font-black uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-[#00FF4C] focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-black text-white shadow-[2px_2px_0_0_#00FF4C]',
        secondary: 'bg-[#ECECEC] text-black shadow-[2px_2px_0_0_#000000]',
        destructive: 'bg-[#FF0000] text-black shadow-[2px_2px_0_0_#000000]',
        outline: 'text-black shadow-[2px_2px_0_0_#00FF4C]',
        success: 'bg-[#00FF4C] text-black shadow-[2px_2px_0_0_#000000]',
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
