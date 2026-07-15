'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Quote, CheckCircle2 } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Left side - Branding & Hero */}
      <div className="hidden lg:flex w-[55%] relative flex-col justify-between p-12 overflow-hidden bg-slate-900">
        {/* Modern animated background elements */}
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex items-center gap-3 font-bold text-2xl text-white">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="tracking-tight">Omnistack</span>
        </div>
        
        <div className="relative z-10 max-w-xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
              The modern standard for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">workspace management.</span>
            </h1>
            <ul className="space-y-4 mb-12">
              {['Seamless cross-team collaboration', 'Advanced Kanban boards & analytics', 'Enterprise-grade security'].map((item, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                  className="flex items-center gap-3 text-slate-300 text-lg"
                >
                  <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6"
          >
            <Quote className="w-8 h-8 text-indigo-400 mb-3" />
            <h2 className="text-lg text-slate-200 leading-relaxed font-medium">
              "Migrating our workspaces to Omnistack was incredibly smooth. Collaboration features and Kanban boards make our updates super clear."
            </h2>
            <div className="mt-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center font-bold text-sm text-white shadow-inner">
                SW
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Sarah Walker</p>
                <p className="text-xs text-slate-400">VP of Operations at TechNova</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-widest">
          <span>© {new Date().getFullYear()} Omnistack Inc.</span>
          <span>System Secure · SSL Active</span>
        </div>
      </div>

      {/* Right side - Forms */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-12 relative bg-white">
        <div className="absolute inset-0 bg-slate-50/50 lg:hidden" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md relative z-10"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
