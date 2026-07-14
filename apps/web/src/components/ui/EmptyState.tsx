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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-16 text-center border-[4px] border-black bg-[#00FF4C] shadow-[12px_12px_0_0_#000000] relative overflow-hidden"
    >
      {/* Background massive icon/text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black/5 select-none pointer-events-none w-full flex justify-center items-center">
        <Icon className="w-96 h-96" strokeWidth={1} />
      </div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex h-24 w-24 items-center justify-center border-[3px] border-black bg-white mb-8 shadow-[4px_4px_0_0_#000000] transform -rotate-3 hover:rotate-0 transition-transform">
          <Icon className="w-12 h-12 text-black" strokeWidth={2.5} />
        </div>
        <h3 className="text-4xl font-black uppercase text-black mb-4 tracking-tighter leading-none">{title}</h3>
        <p className="text-lg font-bold text-black/70 max-w-lg mx-auto mb-10 leading-snug uppercase">
          {description}
        </p>
        
        {(primaryAction || secondaryAction) && (
          <div className="flex items-center gap-4">
            {secondaryAction && (
              <Button variant="outline" onClick={secondaryAction.onClick} className="bg-white hover:bg-black hover:text-[#00FF4C]">
                {secondaryAction.label}
              </Button>
            )}
            {primaryAction && (
              <Button onClick={primaryAction.onClick} className="bg-black text-[#00FF4C] hover:bg-white hover:text-black">
                {primaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
