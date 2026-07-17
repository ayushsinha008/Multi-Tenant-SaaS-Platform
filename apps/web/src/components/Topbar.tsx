'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { Search, Bell, ChevronDown, Check, Building2, CheckCircle2, Circle, LogOut, User, Menu } from 'lucide-react';
import { Avatar } from './ui/Avatar';
import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';

import { useRouter } from 'next/navigation';

export function Topbar({ onOpenCmd, onOpenMenu }: { onOpenCmd: () => void, onOpenMenu?: () => void }) {
  const { user, activeWorkspaceId, setActiveWorkspace, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const queryClient = useQueryClient();

  const workspaceRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (workspaceRef.current && !workspaceRef.current.contains(e.target as Node)) setIsWorkspaceOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setIsNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setIsProfileOpen(false);
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

  const { data: invitationsData } = useQuery({
    queryKey: ['invitations'],
    queryFn: async () => {
      const res = await api.get('/auth/me/invitations');
      return res.data;
    },
    refetchInterval: 30000
  });

  const acceptInvite = useMutation({
    mutationFn: async (id: string) => { await api.post(`/auth/me/invitations/${id}/accept`); },
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['invitations'] }); 
      queryClient.invalidateQueries({ queryKey: ['organizations'] }); 
    }
  });

  const rejectInvite = useMutation({
    mutationFn: async (id: string) => { await api.post(`/auth/me/invitations/${id}/reject`); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['invitations'] }); }
  });

  const activeOrg = organizations.find((org: any) => org._id === activeWorkspaceId);
  const notifications = notifData?.notifications || [];
  const invitations = invitationsData?.invitations || [];
  const unreadCount = (notifData?.unreadCount || 0) + invitations.length;

  return (
    <header className="h-[72px] flex items-center justify-between px-6 bg-cream border-b-[3px] border-ink z-30 shrink-0">

      {/* Left Section: Mobile Menu + Workspace switcher */}
      <div className="flex items-center gap-3 relative" ref={workspaceRef}>
        {onOpenMenu && (
          <button 
            onClick={onOpenMenu}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl border-[3px] border-ink bg-white shadow-neo-sm hover:-translate-y-0.5 hover:shadow-neo-md active:translate-y-[2px] active:shadow-none transition-all"
          >
            <Menu className="w-5 h-5 text-ink" strokeWidth={2.5} />
          </button>
        )}
        <div className="relative">
          <button
            onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-[3px] border-ink bg-sky font-bold text-sm text-ink shadow-neo-sm hover:-translate-y-0.5 hover:shadow-neo-md active:translate-y-[2px] active:shadow-none transition-all"
          >
            <Building2 className="w-4 h-4 hidden sm:block" strokeWidth={2.5} />
            <span className="max-w-[120px] sm:max-w-[180px] truncate">{activeOrg?.name || 'Select workspace'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isWorkspaceOpen ? 'rotate-180' : ''}`} strokeWidth={2.5} />
          </button>

        <AnimatePresence>
          {isWorkspaceOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute top-[calc(100%+8px)] left-0 w-80 bg-white rounded-2xl border-[3px] border-ink shadow-neo-lg z-50 overflow-hidden"
            >
              <div className="px-5 py-3.5 border-b-[2px] border-ink bg-sky">
                <p className="text-xs font-bold text-ink/60 uppercase tracking-[0.1em]">Your Workspaces</p>
              </div>
              <div className="max-h-56 overflow-y-auto">
                {organizations.map((org: any) => (
                  <button
                    key={org._id}
                    onClick={() => { setActiveWorkspace(org._id); setIsWorkspaceOpen(false); }}
                    className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-bold text-ink hover:bg-sky/30 transition-colors border-b-[1px] border-ink/10 last:border-b-0"
                  >
                    <span className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg border-[2px] border-ink bg-sky flex items-center justify-center font-bold text-sm">
                        {org.name[0]}
                      </div>
                      {org.name}
                    </span>
                    {activeWorkspaceId === org._id && <Check className="w-4 h-4 text-ink" strokeWidth={3} />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <button
          onClick={onOpenCmd}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl border-[3px] border-ink bg-white text-sm font-medium text-ink/40 shadow-neo-sm hover:bg-cream hover:text-ink hover:-translate-y-0.5 hover:shadow-neo-md transition-all"
        >
          <Search className="w-4 h-4" strokeWidth={2} />
          <span className="hidden sm:inline text-sm">Search...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-cream border-[2px] border-ink/20 text-xs font-bold text-ink/40">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`relative p-2.5 rounded-xl border-[3px] border-ink shadow-neo-sm hover:-translate-y-0.5 hover:shadow-neo-md active:translate-y-[2px] active:shadow-none transition-all ${isNotifOpen ? 'bg-yellow-pastel' : 'bg-white'}`}
          >
            <Bell className="w-5 h-5 text-ink" strokeWidth={2} />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-pink-pastel border-[2px] border-ink text-ink text-[10px] font-bold flex items-center justify-center rounded-full">
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
                className="absolute top-[calc(100%+8px)] right-0 w-80 sm:w-96 bg-white rounded-2xl border-[3px] border-ink shadow-neo-lg z-50 overflow-hidden"
              >
                <div className="px-5 py-3.5 border-b-[2px] border-ink bg-yellow-pastel flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-ink">Notifications</h3>
                    <p className="text-xs font-medium text-ink/50">{unreadCount} unread</p>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllAsRead.mutate()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-[2px] border-ink bg-white text-xs font-bold hover:bg-mint transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                      All read
                    </button>
                  )}
                </div>
                <div className="overflow-y-auto max-h-72">
                  {invitations.map((invite: any) => (
                    <div key={invite._id} className="w-full text-left px-5 py-4 flex flex-col gap-2 border-b-[1px] border-ink/10 bg-sky/20">
                      <div className="flex gap-3">
                        <div className="mt-1.5 shrink-0">
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 border-[2px] border-ink" />
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-snug text-ink">
                            You have been invited to join <span className="font-bold">{invite.organizationId?.name}</span>
                          </p>
                          <span className="text-xs font-medium text-ink/30 mt-1 block">
                            {new Date(invite.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2 ml-5">
                        <button 
                          onClick={() => acceptInvite.mutate(invite._id)}
                          disabled={acceptInvite.isPending}
                          className="px-3 py-1.5 bg-mint border-[2px] border-ink rounded-lg text-xs font-bold shadow-neo-xs hover:-translate-y-0.5 hover:shadow-neo-sm active:translate-y-[1px] active:shadow-none transition-all"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => rejectInvite.mutate(invite._id)}
                          disabled={rejectInvite.isPending}
                          className="px-3 py-1.5 bg-white border-[2px] border-ink rounded-lg text-xs font-bold hover:bg-red-50 transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                  {notifications.length === 0 && invitations.length === 0 ? (
                    <div className="p-10 text-center flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-xl border-[2px] border-ink bg-yellow-pastel flex items-center justify-center">
                        <Bell className="w-6 h-6 text-ink/40" strokeWidth={2} />
                      </div>
                      <p className="text-sm font-medium text-ink/40">All caught up!</p>
                    </div>
                  ) : (
                    notifications.map((notif: any) => (
                      <button
                        key={notif._id}
                        onClick={() => { if (!notif.read) markAsRead.mutate(notif._id); }}
                        className={`w-full text-left px-5 py-4 flex gap-3 border-b-[1px] border-ink/10 last:border-b-0 transition-colors ${notif.read ? 'hover:bg-cream' : 'bg-yellow-pastel/20 hover:bg-yellow-pastel/40'}`}
                      >
                        <div className="mt-1.5 shrink-0">
                          {notif.read
                            ? <Circle className="w-2.5 h-2.5 text-ink/20" strokeWidth={2} />
                            : <div className="w-2.5 h-2.5 rounded-full bg-pink-pastel border-[2px] border-ink" />
                          }
                        </div>
                        <div>
                          <p className={`text-sm font-medium leading-snug ${notif.read ? 'text-ink/50' : 'text-ink'}`}>
                            {notif.message}
                          </p>
                          <span className="text-xs font-medium text-ink/30 mt-1 block">
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

        {/* User profile dropdown */}
        {mounted && (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="block border-[3px] border-ink rounded-full shadow-neo-sm hover:-translate-y-0.5 hover:shadow-neo-md active:translate-y-[2px] active:shadow-none transition-all"
            >
              <Avatar src={user?.avatar} fallback={user?.name || 'U'} size="md" />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-[calc(100%+8px)] right-0 w-56 bg-white rounded-2xl border-[3px] border-ink shadow-neo-lg z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b-[2px] border-ink bg-pink-pastel">
                    <p className="text-sm font-bold text-ink truncate">{user?.name}</p>
                    <p className="text-[10px] font-medium text-ink/60 truncate">{user?.email}</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        router.push('/dashboard/settings');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-ink rounded-xl hover:bg-pink-pastel/40 transition-colors"
                    >
                      <User className="w-4 h-4" strokeWidth={2.5} />
                      Profile Settings
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        logout();
                        router.push('/login');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" strokeWidth={2.5} />
                      Log out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </header>
  );
}
