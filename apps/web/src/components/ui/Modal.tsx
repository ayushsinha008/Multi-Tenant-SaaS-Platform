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
            className="fixed inset-0 z-50 bg-[#00FF4C]/90"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 50, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 50, rotate: 2 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="w-full max-w-2xl overflow-hidden border-[4px] border-black bg-white shadow-[16px_16px_0_0_#000000] pointer-events-auto"
            >
              <div className="flex flex-col h-full max-h-[85vh]">
                <div className="px-8 py-6 border-b-[4px] border-black flex items-center justify-between sticky top-0 bg-white z-10">
                  <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter text-black leading-none">{title}</h2>
                    {description && <p className="text-base font-bold text-black/60 mt-2 uppercase">{description}</p>}
                  </div>
                  <Button variant="ghost" size="icon" onClick={onClose} className="border-[3px] border-black bg-black text-[#00FF4C] hover:bg-[#00FF4C] hover:text-black shadow-none w-12 h-12 rounded-none absolute top-4 right-4">
                    <X className="w-6 h-6" />
                  </Button>
                </div>
                <div className="p-8 overflow-y-auto bg-[#ECECEC]">
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
