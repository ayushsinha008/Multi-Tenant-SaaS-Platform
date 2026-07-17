import * as React from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  accentColor?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

// Rotating decoration shapes for each empty state
const decorations = [
  { top: '10%', left: '8%',  size: 40, color: 'var(--lavender)', rotate: 15 },
  { top: '15%', right: '8%', size: 28, color: 'var(--mint)', rotate: -20 },
  { bottom: '12%', left: '12%', size: 32, color: 'var(--pink-pastel)', rotate: 10 },
  { bottom: '10%', right: '10%', size: 36, color: 'var(--yellow-pastel)', rotate: -12 },
];

export function EmptyState({
  icon: Icon,
  title,
  description,
  accentColor = 'var(--lavender)',
  primaryAction,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative flex flex-col items-center justify-center p-16 text-center rounded-2xl border-[3px] border-ink bg-white shadow-neo-lg overflow-hidden"
    >
      {/* Floating decoration shapes */}
      {decorations.map((d, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -6, 0], rotate: [d.rotate, d.rotate + 5, d.rotate] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute rounded-lg border-[2px] border-ink opacity-60"
          style={{
            top: d.top,
            left: (d as any).left,
            right: (d as any).right,
            bottom: (d as any).bottom,
            width: d.size,
            height: d.size,
            backgroundColor: d.color,
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center">
        {/* Icon container */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="flex h-24 w-24 items-center justify-center rounded-2xl border-[3px] border-ink mb-8 shadow-neo-md"
          style={{ backgroundColor: accentColor }}
        >
          <Icon className="w-12 h-12 text-ink" strokeWidth={2} />
        </motion.div>

        <h3 className="text-2xl font-bold text-ink mb-3 tracking-tight">{title}</h3>
        <p className="text-base font-medium text-ink/60 max-w-xs mx-auto mb-8 leading-relaxed">
          {description}
        </p>

        {(primaryAction || secondaryAction) && (
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {secondaryAction && (
              <Button variant="outline" onClick={secondaryAction.onClick} size="lg">
                {secondaryAction.label}
              </Button>
            )}
            {primaryAction && (
              <Button
                onClick={primaryAction.onClick}
                size="lg"
                style={{ backgroundColor: accentColor }}
                className="border-[3px] border-ink"
              >
                {primaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
