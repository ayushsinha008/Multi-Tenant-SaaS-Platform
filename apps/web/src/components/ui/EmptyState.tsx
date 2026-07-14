import * as React from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, primaryAction, secondaryAction }: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-white/10 bg-[#111827]/50"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 mb-6">
        <Icon className="w-8 h-8 text-indigo-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
        {description}
      </p>
      
      {(primaryAction || secondaryAction) && (
        <div className="flex items-center gap-3">
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
          {primaryAction && (
            <Button onClick={primaryAction.onClick}>
              {primaryAction.label}
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
}
