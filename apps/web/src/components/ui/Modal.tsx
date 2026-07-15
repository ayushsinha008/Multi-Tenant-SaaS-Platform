import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  accentColor?: string;
}

export function Modal({ isOpen, onClose, title, description, children, accentColor = '#DDD6FE' }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#1A1A1A]/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', duration: 0.4, bounce: 0.3 }}
              className="w-full max-w-lg overflow-hidden rounded-2xl border-[3px] border-[#1A1A1A] bg-white shadow-[8px_8px_0px_#1A1A1A] pointer-events-auto"
            >
              {/* Header */}
              <div
                className="px-7 py-5 border-b-[3px] border-[#1A1A1A] flex items-center justify-between"
                style={{ backgroundColor: accentColor }}
              >
                <div>
                  <h2 className="text-xl font-bold text-[#1A1A1A] tracking-tight">{title}</h2>
                  {description && (
                    <p className="text-sm font-medium text-[#1A1A1A]/60 mt-0.5">{description}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl border-[2px] border-[#1A1A1A] bg-white flex items-center justify-center hover:bg-[#1A1A1A] hover:text-white transition-colors shadow-[2px_2px_0px_#1A1A1A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-7 overflow-y-auto max-h-[75vh] bg-[#FFFDF5]">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
