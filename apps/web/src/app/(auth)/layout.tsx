'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0F172A]">
      {/* Left side - Branding & Hero (hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-[#111827] flex-col justify-between p-12 border-r border-white/10 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-[#6D28D9]/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-2 font-bold text-xl text-white">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6D28D9] to-[#8B5CF6] flex items-center justify-center">
            <span className="text-white font-bold text-sm">O</span>
          </div>
          Omnistack
        </div>
        
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Quote className="w-10 h-10 text-indigo-500/50 mb-6" />
            <h2 className="text-3xl font-medium text-white leading-relaxed">
              "We migrated our entire organization to Omnistack and our productivity doubled in weeks. The unified workflow is unmatched."
            </h2>
            <div className="mt-8 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1F2937] flex items-center justify-center font-bold text-slate-300">
                SW
              </div>
              <div>
                <p className="text-white font-medium">Sarah Walker</p>
                <p className="text-slate-400 text-sm">VP of Engineering at TechNova</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
