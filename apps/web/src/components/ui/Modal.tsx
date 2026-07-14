import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, description, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#0F172A]/80 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#111827] shadow-2xl shadow-black/50 pointer-events-auto"
            >
              <div className="flex flex-col h-full max-h-[85vh]">
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#111827] z-10">
                  <div>
                    <h2 className="text-lg font-semibold text-white">{title}</h2>
                    {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
                  </div>
                  <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full w-8 h-8 -mr-2">
                    <X className="w-4 h-4 text-slate-400" />
                  </Button>
                </div>
                <div className="p-6 overflow-y-auto">
                  {children}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
