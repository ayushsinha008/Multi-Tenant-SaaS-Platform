'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Quote, Sparkles } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#FFFDF5] text-[#1A1A1A]">
      {/* Left side - Branding & Hero (hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-[#FFFDF5] flex-col justify-between p-12 border-r-[3px] border-[#1A1A1A] overflow-hidden">
        {/* Soft pastel decorative background items */}
        <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-[#BAE6FD] border-[3px] border-[#1A1A1A] rounded-full opacity-20 pointer-events-none -rotate-12" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#FBCFE8] border-[3px] border-[#1A1A1A] rounded-3xl opacity-20 pointer-events-none rotate-12" />

        <div className="relative z-10 flex items-center gap-2.5 font-bold text-xl text-[#1A1A1A]">
          <div className="w-9 h-9 rounded-xl bg-[#DDD6FE] border-[2px] border-[#1A1A1A] flex items-center justify-center shadow-[2px_2px_0px_#1A1A1A]">
            <Sparkles className="w-4.5 h-4.5 text-[#1A1A1A]" strokeWidth={2.5} />
          </div>
          <span>Omnistack</span>
        </div>
        
        <div className="relative z-10 max-w-lg">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border-[3px] border-[#1A1A1A] bg-white p-8 shadow-[4px_4px_0px_#1A1A1A]"
          >
            <Quote className="w-8 h-8 text-[#DDD6FE] mb-4" strokeWidth={3} />
            <h2 className="text-xl font-bold text-[#1A1A1A] leading-relaxed">
              "Migrating our workspaces to Omnistack was incredibly smooth. Collaboration features and Kanban boards make our updates super clear."
            </h2>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#BAE6FD] border-[2px] border-[#1A1A1A] flex items-center justify-center font-bold text-xs">
                SW
              </div>
              <div>
                <p className="text-sm font-bold text-[#1A1A1A]">Sarah Walker</p>
                <p className="text-xs font-semibold text-[#1A1A1A]/40">VP of Operations at TechNova</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 text-xs font-semibold text-[#1A1A1A]/40 uppercase tracking-widest">
          SYSTEM SECURE · SSL ACTIVE
        </div>
      </div>

      {/* Right side - Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute inset-0 bg-[#BAE6FD]/10 opacity-30 lg:hidden" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md relative z-10"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
