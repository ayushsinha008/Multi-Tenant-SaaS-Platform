'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { Search, Bell, ChevronDown, Check, Building2, CheckCircle2, Circle } from 'lucide-react';
import { Avatar } from './ui/Avatar';
import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';

export function Topbar({ onOpenCmd }: { onOpenCmd: () => void }) {
  const { user, activeWorkspaceId, setActiveWorkspace } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const queryClient = useQueryClient();

  const workspaceRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (workspaceRef.current && !workspaceRef.current.contains(e.target as Node)) setIsWorkspaceOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setIsNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => setMounted(true), []);

  const { data: organizations = [] } = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const res = await api.get('/organizations');
      return res.data.organizations || [];
    }
  });

  const { data: notifData } = useQuery({
    queryKey: ['notifications', activeWorkspaceId],
    queryFn: async () => {
      const res = await api.get('/notifications');
      return res.data;
    },
    enabled: !!activeWorkspaceId,
    refetchInterval: 30000
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => { await api.patch(`/notifications/${id}/read`); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['notifications'] }); }
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => { await api.patch('/notifications/read-all'); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['notifications'] }); }
  });

  const activeOrg = organizations.find((org: any) => org._id === activeWorkspaceId);
  const notifications = notifData?.notifications || [];
  const unreadCount = notifData?.unreadCount || 0;

  return (
    <header className="h-[72px] flex items-center justify-between px-6 bg-[#FFFDF5] border-b-[3px] border-[#1A1A1A] z-30 shrink-0">

      {/* Workspace switcher */}
      <div className="relative" ref={workspaceRef}>
        <button
          onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-[3px] border-[#1A1A1A] bg-[#BAE6FD] font-bold text-sm text-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#1A1A1A] active:translate-y-[2px] active:shadow-none transition-all"
        >
          <Building2 className="w-4 h-4" strokeWidth={2.5} />
          <span className="max-w-[180px] truncate">{activeOrg?.name || 'Select workspace'}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isWorkspaceOpen ? 'rotate-180' : ''}`} strokeWidth={2.5} />
        </button>

        <AnimatePresence>
          {isWorkspaceOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute top-[calc(100%+8px)] left-0 w-80 bg-white rounded-2xl border-[3px] border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] z-50 overflow-hidden"
            >
              <div className="px-5 py-3.5 border-b-[2px] border-[#1A1A1A] bg-[#BAE6FD]">
                <p className="text-xs font-bold text-[#1A1A1A]/60 uppercase tracking-[0.1em]">Your Workspaces</p>
              </div>
              <div className="max-h-56 overflow-y-auto">
                {organizations.map((org: any) => (
                  <button
                    key={org._id}
                    onClick={() => { setActiveWorkspace(org._id); setIsWorkspaceOpen(false); }}
                    className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-bold text-[#1A1A1A] hover:bg-[#BAE6FD]/30 transition-colors border-b-[1px] border-[#1A1A1A]/10 last:border-b-0"
                  >
                    <span className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg border-[2px] border-[#1A1A1A] bg-[#BAE6FD] flex items-center justify-center font-bold text-sm">
                        {org.name[0]}
                      </div>
                      {org.name}
                    </span>
                    {activeWorkspaceId === org._id && <Check className="w-4 h-4 text-[#1A1A1A]" strokeWidth={3} />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <button
          onClick={onOpenCmd}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl border-[3px] border-[#1A1A1A] bg-white text-sm font-medium text-[#1A1A1A]/40 shadow-[3px_3px_0px_#1A1A1A] hover:bg-[#FFFDF5] hover:text-[#1A1A1A] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#1A1A1A] transition-all"
        >
          <Search className="w-4 h-4" strokeWidth={2} />
          <span className="hidden sm:inline text-sm">Search...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-[#FFFDF5] border-[2px] border-[#1A1A1A]/20 text-xs font-bold text-[#1A1A1A]/40">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`relative p-2.5 rounded-xl border-[3px] border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#1A1A1A] active:translate-y-[2px] active:shadow-none transition-all ${isNotifOpen ? 'bg-[#FEF08A]' : 'bg-white'}`}
          >
            <Bell className="w-5 h-5 text-[#1A1A1A]" strokeWidth={2} />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#FBCFE8] border-[2px] border-[#1A1A1A] text-[#1A1A1A] text-[10px] font-bold flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {isNotifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute top-[calc(100%+8px)] right-0 w-80 sm:w-96 bg-white rounded-2xl border-[3px] border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] z-50 overflow-hidden"
              >
                <div className="px-5 py-3.5 border-b-[2px] border-[#1A1A1A] bg-[#FEF08A] flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-[#1A1A1A]">Notifications</h3>
                    <p className="text-xs font-medium text-[#1A1A1A]/50">{unreadCount} unread</p>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllAsRead.mutate()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-[2px] border-[#1A1A1A] bg-white text-xs font-bold hover:bg-[#BBF7D0] transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                      All read
                    </button>
                  )}
                </div>
                <div className="overflow-y-auto max-h-72">
                  {notifications.length === 0 ? (
                    <div className="p-10 text-center flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-xl border-[2px] border-[#1A1A1A] bg-[#FEF08A] flex items-center justify-center">
                        <Bell className="w-6 h-6 text-[#1A1A1A]/40" strokeWidth={2} />
                      </div>
                      <p className="text-sm font-medium text-[#1A1A1A]/40">All caught up!</p>
                    </div>
                  ) : (
                    notifications.map((notif: any) => (
                      <button
                        key={notif._id}
                        onClick={() => { if (!notif.read) markAsRead.mutate(notif._id); }}
                        className={`w-full text-left px-5 py-4 flex gap-3 border-b-[1px] border-[#1A1A1A]/10 last:border-b-0 transition-colors ${notif.read ? 'hover:bg-[#FFFDF5]' : 'bg-[#FEF08A]/20 hover:bg-[#FEF08A]/40'}`}
                      >
                        <div className="mt-1.5 shrink-0">
                          {notif.read
                            ? <Circle className="w-2.5 h-2.5 text-[#1A1A1A]/20" strokeWidth={2} />
                            : <div className="w-2.5 h-2.5 rounded-full bg-[#FBCFE8] border-[2px] border-[#1A1A1A]" />
                          }
                        </div>
                        <div>
                          <p className={`text-sm font-medium leading-snug ${notif.read ? 'text-[#1A1A1A]/50' : 'text-[#1A1A1A]'}`}>
                            {notif.message}
                          </p>
                          <span className="text-xs font-medium text-[#1A1A1A]/30 mt-1 block">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User avatar */}
        {mounted && (
          <div className="border-[3px] border-[#1A1A1A] rounded-full shadow-[3px_3px_0px_#1A1A1A] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#1A1A1A] transition-all cursor-pointer">
            <Avatar src={user?.avatar} fallback={user?.name || 'U'} size="md" />
          </div>
        )}
      </div>
    </header>
  );
}
