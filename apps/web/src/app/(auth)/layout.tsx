'use client';

import * as React from 'react';
import { Sparkles, LayoutDashboard, CheckSquare, Users, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-cream text-ink font-sans">
      {/* Left side - Branding & Visual (hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-center items-center p-12 overflow-hidden border-r-[3px] border-ink bg-lavender">
        {/* Subtle grid on the purple background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1A1A1A15_1px,transparent_1px),linear-gradient(to_bottom,#1A1A1A15_1px,transparent_1px)] bg-[size:32px_32px]"></div>

        <div className="relative z-10 w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-16">
            <div className="w-12 h-12 rounded-xl border-[3px] border-ink bg-white flex items-center justify-center shadow-neo-md">
              <Layers className="w-6 h-6 text-ink" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Omnistack</h1>
          </div>

          {/* Clean value prop */}
          <h2 className="text-4xl font-black tracking-tight leading-[1.1] mb-6">
            Your Workspace, <br />
            <span className="bg-yellow-pastel px-2 py-1 border-[3px] border-ink shadow-neo-md inline-block mt-3">Simplified.</span>
          </h2>
          <p className="text-lg font-medium text-ink/70 mb-12 max-w-sm">
            Everything you need to manage projects, tasks, and teams in one beautifully robust place.
          </p>

          {/* Abstract representation of dashboard */}
          <div className="relative h-64 w-full">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="absolute top-0 left-0 w-3/4 rounded-xl border-[3px] border-ink bg-white p-4 shadow-neo-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-sky border-[2px] border-ink flex items-center justify-center">
                  <LayoutDashboard className="w-4 h-4" />
                </div>
                <div className="h-3 w-24 bg-gray-200 rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full bg-gray-100 rounded-full" />
                <div className="h-2 w-4/5 bg-gray-100 rounded-full" />
              </div>
            </motion.div>

            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute top-16 right-0 w-2/3 rounded-xl border-[3px] border-ink bg-yellow-pastel p-4 shadow-neo-lg"
            >
               <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-white border-[2px] border-ink flex items-center justify-center">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div className="h-3 w-20 bg-ink/20 rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full bg-ink/10 rounded-full" />
                <div className="h-2 w-3/4 bg-ink/10 rounded-full" />
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-0 left-12 w-2/3 rounded-xl border-[3px] border-ink bg-pink-pastel p-4 shadow-neo-lg"
            >
               <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-white border-[2px] border-ink flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div className="h-3 w-16 bg-ink/20 rounded-full" />
              </div>
               <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full border-[2px] border-ink bg-white" />
                  <div className="w-6 h-6 rounded-full border-[2px] border-ink bg-sky" />
                  <div className="w-6 h-6 rounded-full border-[2px] border-ink bg-mint" />
               </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right side - Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
