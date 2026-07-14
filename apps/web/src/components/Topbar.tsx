'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { Search, Bell, Menu, ChevronDown, Check, Briefcase, CheckCircle2, Circle } from 'lucide-react';
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

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (workspaceRef.current && !workspaceRef.current.contains(e.target as Node)) {
        setIsWorkspaceOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
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
    refetchInterval: 30000 // Refetch every 30s
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      await api.patch('/notifications/read-all');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const activeOrg = organizations.find((org: any) => org._id === activeWorkspaceId);
  const notifications = notifData?.notifications || [];
  const unreadCount = notifData?.unreadCount || 0;

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-transparent z-10 w-full mt-4 relative">
      
      {/* Mobile Menu Trigger */}
      <div className="md:hidden">
        <button className="text-slate-400 hover:text-white p-2">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="hidden md:flex items-center text-sm font-medium text-slate-400 relative" ref={workspaceRef}>
        <button 
          onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-md border border-white/10 mr-2 transition-colors text-slate-200"
        >
          <Briefcase className="w-4 h-4 text-indigo-400" />
          {activeOrg?.name || 'No Workspace Selected'}
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </button>
        <span className="mx-2 text-slate-600">/</span>
        <span className="text-slate-200">Dashboard</span>

        {/* Workspace Dropdown */}
        <AnimatePresence>
          {isWorkspaceOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
              className="absolute top-12 left-0 w-64 bg-[#111827] border border-white/10 rounded-xl shadow-2xl py-2 z-50"
            >
              <div className="px-3 pb-2 mb-2 border-b border-white/5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your Workspaces</p>
              </div>
              <div className="max-h-60 overflow-y-auto px-2">
                {organizations.map((org: any) => (
                  <button
                    key={org._id}
                    onClick={() => {
                      setActiveWorkspace(org._id);
                      setIsWorkspaceOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-300 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs uppercase">
                        {org.name[0]}
                      </div>
                      {org.name}
                    </span>
                    {activeWorkspaceId === org._id && <Check className="w-4 h-4 text-indigo-400" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Trigger */}
        <button 
          onClick={onOpenCmd}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#111827] border border-white/10 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
        >
          <Search className="w-4 h-4" />
          <span className="text-sm">Search...</span>
          <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 text-[10px] font-mono border border-white/10">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`relative p-2 transition-colors rounded-lg ${isNotifOpen ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-[#0F172A]" />
            )}
          </button>

          <AnimatePresence>
            {isNotifOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-12 right-0 w-80 sm:w-96 bg-[#111827] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[32rem]"
              >
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                  <div>
                    <h3 className="font-semibold text-white">Notifications</h3>
                    <p className="text-xs text-slate-400 mt-0.5">You have {unreadCount} unread messages</p>
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={() => markAllAsRead.mutate()}
                      className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>
                
                <div className="overflow-y-auto flex-1 p-2 space-y-1">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm">
                      <Bell className="w-8 h-8 mx-auto mb-3 text-slate-600 opacity-50" />
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notif: any) => (
                      <button
                        key={notif._id}
                        onClick={() => {
                          if (!notif.read) markAsRead.mutate(notif._id);
                        }}
                        className={`w-full text-left p-3 rounded-lg transition-colors flex gap-3 ${notif.read ? 'opacity-60 hover:bg-white/5' : 'bg-indigo-500/5 hover:bg-indigo-500/10'}`}
                      >
                        <div className="mt-1 shrink-0">
                          {notif.read ? <Circle className="w-2.5 h-2.5 text-slate-600" /> : <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />}
                        </div>
                        <div>
                          <p className="text-sm text-slate-200 leading-snug">{notif.message}</p>
                          <span className="text-xs text-slate-500 mt-1 block">
                            {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

        {mounted && (
          <Avatar 
            src={user?.avatar} 
            fallback={user?.name || 'U'} 
            className="cursor-pointer border-indigo-500/30 hover:border-indigo-500 transition-colors"
          />
        )}
      </div>
    </header>
  );
}
