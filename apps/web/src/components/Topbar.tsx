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

      <div className="hidden md:flex items-center text-sm font-black text-black relative" ref={workspaceRef}>
        <button 
          onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white border-[3px] border-black shadow-[4px_4px_0_0_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none mr-4 transition-all text-black uppercase tracking-widest"
        >
          <Briefcase className="w-5 h-5 text-[#00FF4C]" strokeWidth={3} />
          {activeOrg?.name || 'No Workspace Selected'}
          <ChevronDown className="w-5 h-5 text-black" strokeWidth={3} />
        </button>
        <span className="mx-2 text-black/50 text-xl font-black">/</span>
        <span className="text-black uppercase tracking-widest text-lg ml-2">Dashboard</span>

        {/* Workspace Dropdown */}
        <AnimatePresence>
          {isWorkspaceOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
              className="absolute top-16 left-0 w-72 bg-white border-[4px] border-black shadow-[8px_8px_0_0_#000000] py-2 z-50"
            >
              <div className="px-4 pb-4 mb-2 border-b-[3px] border-black">
                <p className="text-xs font-black text-black/50 uppercase tracking-widest pt-2">Your Workspaces</p>
              </div>
              <div className="max-h-60 overflow-y-auto px-2">
                {organizations.map((org: any) => (
                  <button
                    key={org._id}
                    onClick={() => {
                      setActiveWorkspace(org._id);
                      setIsWorkspaceOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-black text-black hover:bg-[#00FF4C] hover:border-black transition-colors uppercase border-b-[2px] border-transparent hover:border-black"
                  >
                    <span className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-black flex items-center justify-center text-[#00FF4C] font-black text-sm uppercase">
                        {org.name[0]}
                      </div>
                      {org.name}
                    </span>
                    {activeWorkspaceId === org._id && <Check className="w-6 h-6 text-black" strokeWidth={4} />}
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
          className="flex items-center gap-3 px-4 py-2 bg-white border-[3px] border-black shadow-[4px_4px_0_0_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none text-black transition-all uppercase tracking-widest font-black"
        >
          <Search className="w-5 h-5" strokeWidth={3} />
          <span className="text-sm hidden sm:inline">Search...</span>
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-[#00FF4C] border-[2px] border-black text-xs font-black">
            <span>⌘</span>K
          </kbd>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`relative p-3 border-[3px] border-black transition-all shadow-[4px_4px_0_0_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none ${isNotifOpen ? 'bg-black text-[#00FF4C]' : 'bg-white text-black'}`}
          >
            <Bell className="w-6 h-6" strokeWidth={2.5} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-[#FF0000] border-[2px] border-black" />
            )}
          </button>

          <AnimatePresence>
            {isNotifOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-16 right-0 w-80 sm:w-96 bg-white border-[4px] border-black shadow-[8px_8px_0_0_#000000] z-50 overflow-hidden flex flex-col max-h-[32rem]"
              >
                <div className="p-6 border-b-[4px] border-black flex items-center justify-between bg-[#00FF4C]">
                  <div>
                    <h3 className="font-black text-black uppercase text-xl">Notifications</h3>
                    <p className="text-sm font-bold text-black/70 mt-1 uppercase">You have {unreadCount} unread</p>
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={() => markAllAsRead.mutate()}
                      className="text-xs font-black text-black border-[2px] border-black px-2 py-1 bg-white hover:bg-black hover:text-white transition-colors flex items-center gap-2 uppercase tracking-widest"
                    >
                      <CheckCircle2 className="w-4 h-4" strokeWidth={3} />
                      Read All
                    </button>
                  )}
                </div>
                
                <div className="overflow-y-auto flex-1 p-2 space-y-1">
                  {notifications.length === 0 ? (
                    <div className="p-12 text-center text-black/50 text-sm font-black uppercase tracking-widest">
                      <Bell className="w-16 h-16 mx-auto mb-4 text-black/20" strokeWidth={1} />
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notif: any) => (
                      <button
                        key={notif._id}
                        onClick={() => {
                          if (!notif.read) markAsRead.mutate(notif._id);
                        }}
                        className={`w-full text-left p-4 transition-colors flex gap-4 border-b-[2px] border-black last:border-b-0 ${notif.read ? 'opacity-60 bg-white hover:bg-[#ECECEC]' : 'bg-black text-white hover:bg-black/90'}`}
                      >
                        <div className="mt-1 shrink-0">
                          {notif.read ? <Circle className="w-4 h-4 text-black" strokeWidth={3} /> : <div className="w-4 h-4 bg-[#00FF4C] border-[2px] border-white" />}
                        </div>
                        <div>
                          <p className={`text-sm font-bold uppercase leading-snug ${notif.read ? 'text-black' : 'text-white'}`}>{notif.message}</p>
                          <span className={`text-xs font-bold uppercase mt-2 block ${notif.read ? 'text-black/50' : 'text-[#00FF4C]'}`}>
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
