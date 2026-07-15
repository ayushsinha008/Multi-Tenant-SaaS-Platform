'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Quote, Sparkles, Star, Zap } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#FFFDF5] text-[#1A1A1A] font-sans selection:bg-[#FEF08A]">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#1A1A1A10_1px,transparent_1px),linear-gradient(to_bottom,#1A1A1A10_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Left side - Branding & Hero (hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden z-10 border-r-[4px] border-[#1A1A1A] bg-[#BAE6FD]">
        
        <div className="relative z-10 flex items-center gap-4 font-black text-2xl text-[#1A1A1A] uppercase tracking-tight">
          <div className="w-14 h-14 rounded-2xl bg-[#DDD6FE] border-[4px] border-[#1A1A1A] flex items-center justify-center shadow-[6px_6px_0px_#1A1A1A] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#1A1A1A] transition-all cursor-pointer">
            <Sparkles className="w-7 h-7 text-[#1A1A1A]" strokeWidth={3} />
          </div>
          <span className="text-3xl">ReadyNest</span>
        </div>
        
        <div className="relative z-10 max-w-lg mt-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-7xl font-black text-[#1A1A1A] leading-[1.1] uppercase tracking-tight mb-8">
              Work <br/>
              <span className="bg-[#FEF08A] px-4 py-1 border-[4px] border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] inline-block -rotate-2 mt-4 hover:rotate-0 transition-transform cursor-default">Together</span><br/>
              <span className="inline-block mt-4">Like Magic.</span>
            </h1>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-3xl border-[4px] border-[#1A1A1A] bg-white p-8 shadow-[8px_8px_0px_#1A1A1A] relative mt-16"
          >
            <h2 className="text-xl text-[#1A1A1A] font-bold leading-relaxed">
              "Migrating to ReadyNest was incredibly smooth. The brutalist UI is so refreshing, and the Kanban boards make our updates crystal clear."
            </h2>
            <div className="mt-8 flex items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-[#DDD6FE] border-[4px] border-[#1A1A1A] flex items-center justify-center font-black text-xl text-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A]">
                SW
              </div>
              <div>
                <p className="text-lg font-black uppercase text-[#1A1A1A]">Sarah Walker</p>
                <p className="text-xs font-bold text-[#1A1A1A]/60 uppercase tracking-widest mt-1">VP Ops @ TechNova</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 font-bold text-[#1A1A1A]/60 uppercase tracking-widest text-sm flex gap-8 mt-12">
          <span>© {new Date().getFullYear()} ReadyNest</span>
          <span>System Secure</span>
        </div>
      </div>

      {/* Right side - Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10 bg-[#FFFDF5]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md relative"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
