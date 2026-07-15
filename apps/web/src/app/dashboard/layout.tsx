'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { CommandPalette } from '@/components/CommandPalette';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, activeWorkspaceId, logout } = useAuthStore();
  const [cmdOpen, setCmdOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    if (!user) { router.push('/login'); return; }
    if (!activeWorkspaceId) { router.push('/onboarding'); return; }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdOpen(open => !open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [user, activeWorkspaceId, router]);

  if (!isMounted || !user || !activeWorkspaceId) {
    return (
      <div className="min-h-screen bg-[#FFFDF5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl border-[3px] border-[#1A1A1A] bg-[#DDD6FE] shadow-[4px_4px_0px_#1A1A1A] flex items-center justify-center">
            <div className="w-5 h-5 rounded-full border-[3px] border-[#1A1A1A] border-t-transparent animate-spin" />
          </div>
          <p className="text-sm font-bold text-[#1A1A1A]/40">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#FFFDF5] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onOpenCmd={() => setCmdOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={typeof window !== 'undefined' ? window.location.pathname : 'path'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  );
}
