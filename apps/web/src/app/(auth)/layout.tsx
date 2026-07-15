'use client';

import * as React from 'react';
import { Sparkles } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FFFDF5] flex items-center justify-center p-4 relative">
      {/* Subtle dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #1A1A1A18 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Decorative blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-64 h-64 bg-[#DDD6FE] rounded-full border-[4px] border-[#1A1A1A] opacity-30 pointer-events-none" />
      <div className="absolute bottom-[-60px] right-[-60px] w-48 h-48 bg-[#BAE6FD] rounded-full border-[4px] border-[#1A1A1A] opacity-30 pointer-events-none" />
      <div className="absolute top-[40%] right-[5%] w-24 h-24 bg-[#FEF08A] rounded-2xl border-[3px] border-[#1A1A1A] opacity-40 rotate-12 pointer-events-none" />

      {/* Branding top-left */}
      <div className="absolute top-6 left-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl border-[3px] border-[#1A1A1A] bg-[#DDD6FE] flex items-center justify-center shadow-[3px_3px_0px_#1A1A1A]">
          <Sparkles className="w-5 h-5 text-[#1A1A1A]" strokeWidth={2.5} />
        </div>
        <span className="text-base font-bold text-[#1A1A1A] tracking-tight">ReadyNest</span>
      </div>

      {/* Footer */}
      <p className="absolute bottom-6 left-0 right-0 text-center text-[11px] font-medium text-[#1A1A1A]/30 tracking-widest uppercase">
        © {new Date().getFullYear()} ReadyNest · All rights reserved
      </p>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
