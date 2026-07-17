'use client';

import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { Users, UserPlus, Mail, Shield, MoreHorizontal, Trash2, ArrowUpCircle, ArrowDownCircle, Search, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';

const roleConfig: Record<string, { variant: any; icon: any }> = {
  'Admin':  { variant: 'lavender',  icon: Shield },
  'Member': { variant: 'sky',       icon: Users },
};

export default function MembersPage() {
  const queryClient = useQueryClient();
  const activeWorkspaceId = useAuthStore((state) => state.activeWorkspaceId);
  const currentUser = useAuthStore((state) => state.user);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const actionRef = useRef<HTMLDivElement>(null);

  const handleCopyCode = () => {
    if (!organization?.inviteCode) return;
    navigator.clipboard.writeText(organization.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (actionRef.current && !actionRef.current.contains(e.target as Node)) setOpenActionId(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['members', activeWorkspaceId],
    queryFn: async () => { const res = await api.get('/members'); return res.data.members; },
    enabled: !!activeWorkspaceId
  });

  const { data: organization } = useQuery({
    queryKey: ['organization', activeWorkspaceId],
    queryFn: async () => { const res = await api.get(`/organizations/${activeWorkspaceId}`); return res.data.organization; },
    enabled: !!activeWorkspaceId
  });

  const inviteMember = useMutation({
    mutationFn: async (email: string) => {
      setErrorMsg('');
      const res = await api.post('/members/invite', { email, role: 'Member' });
      return res.data;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['members'] }); setIsInviteOpen(false); },
    onError: (err: any) => { setErrorMsg(err.response?.data?.error || err.response?.data?.message || 'Failed to invite'); }
  });

  const updateRole = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => { await api.patch(`/members/${id}/role`, { role }); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['members'] }); setOpenActionId(null); }
  });

  const removeMember = useMutation({
    mutationFn: async (id: string) => { if (confirm('Remove this member?')) await api.delete(`/members/${id}`); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['members'] }); setOpenActionId(null); }
  });

  const filtered = members.filter((m: any) => {
    if (!search) return true;
    return (m.userId?.name || '').toLowerCase().includes(search.toLowerCase()) ||
           (m.email || m.userId?.email || '').toLowerCase().includes(search.toLowerCase());
  });

  // Get current logged-in user's role in this workspace
  const currentMember = members.find((m: any) => m.userId?._id === currentUser?.id || m.userId?.id === currentUser?.id);
  const currentUserRole = currentMember?.role || 'Member';
  const canManageMembers = currentUserRole === 'Admin';

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-baseline gap-4">
          <span className="text-5xl font-bold text-ink tracking-tighter">
            {isLoading ? '—' : String(members.length).padStart(2, '0')}
          </span>
          <div>
            <h1 className="text-2xl font-bold text-ink tracking-tight leading-none">Members</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs font-medium text-ink/40">People in this workspace</p>
              {organization?.inviteCode && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-cream border-[2px] border-ink rounded-lg text-[11px] font-bold text-ink shadow-neo-xs">
                  <span className="opacity-40 font-semibold">CODE:</span>
                  <span className="tracking-widest font-black">{organization.inviteCode}</span>
                  <button
                    onClick={handleCopyCode}
                    className={`ml-1 p-1 rounded-md border-[1.5px] transition-all ${
                      copied
                        ? 'border-green-500 bg-green-50 text-green-600'
                        : 'border-ink/20 hover:border-ink hover:bg-pink-pastel text-ink/50 hover:text-ink'
                    }`}
                    title={copied ? 'Copied!' : 'Copy invite code'}
                  >
                    {copied
                      ? <Check className="w-3 h-3" strokeWidth={3} />
                      : <Copy className="w-3 h-3" strokeWidth={2.5} />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 h-11 w-52 rounded-xl border-[3px] border-ink bg-white text-sm font-medium text-ink placeholder:text-ink/30 focus:outline-4 focus:outline-lavender-dark focus:outline-offset-0 shadow-neo-sm"
            />
          </div>
          <Button onClick={() => setIsInviteOpen(true)} variant="pink">
            <UserPlus className="w-4 h-4 mr-2" strokeWidth={2.5} />
            Invite
          </Button>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(6)].map((_, i) => <div key={i} className="h-52 rounded-2xl border-[3px] border-ink bg-cream animate-pulse" />)}
        </div>
      ) : members.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No members yet"
          description="Invite your team to collaborate in this workspace."
          accentColor='var(--pink-pastel)'
          primaryAction={{ label: 'Invite Member', onClick: () => setIsInviteOpen(true) }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence>
            {filtered.map((member: any, i: number) => {
              const cfg = roleConfig[member.role] || roleConfig['Member'];
              // For current user's own card, use avatar from auth store (always fresh from Google)
              const isCurrentUser = member.userId?._id === currentUser?.id || member.userId?.id === currentUser?.id;
              const avatarSrc = isCurrentUser ? (currentUser?.avatar || member.userId?.avatar) : member.userId?.avatar;
              return (
                <motion.div
                  key={member._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: i * 0.04 }}
                  className="rounded-2xl border-[3px] border-ink bg-white shadow-neo-md hover:-translate-y-1 hover:shadow-neo-lg transition-all overflow-hidden"
                >
                  {/* Role color band */}
                  <div className="h-1.5" style={{
                    backgroundColor: member.role === 'Admin' ? 'var(--lavender)' : 'var(--sky)'
                  }} />

                  <div className="p-6 flex flex-col items-center text-center gap-4">
                    <div className="relative">
                      <Avatar src={avatarSrc} fallback={member.userId?.name || member.email || '?'} size="xl" />
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-[2px] border-white ${member.status === 'ACTIVE' ? 'bg-[#86EFAC]' : 'bg-[#E5E7EB]'}`} />
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-ink tracking-tight">{member.userId?.name || 'Pending'}</h3>
                      <p className="text-xs font-medium text-ink/40 mt-0.5 truncate max-w-[160px]">
                        {member.email || member.userId?.email}
                      </p>
                    </div>

                    <Badge variant={cfg.variant} className="gap-1.5">
                      <cfg.icon className="w-3 h-3" strokeWidth={2.5} />
                      {member.role}
                    </Badge>
                  </div>

                  {/* Only ADMIN can manage other members */}
                  {canManageMembers && !isCurrentUser && (
                    <div className="border-t-[2px] border-ink/10 px-4 py-3 flex justify-end">
                      <div ref={openActionId === member._id ? actionRef : null} className="relative">
                        <button
                          onClick={() => setOpenActionId(openActionId === member._id ? null : member._id)}
                          className={`p-2 rounded-lg border-[2px] border-transparent transition-colors ${openActionId === member._id ? 'border-ink bg-ink text-white' : 'text-ink/30 hover:text-ink hover:border-ink/20 hover:bg-cream'}`}
                        >
                          <MoreHorizontal className="w-4 h-4" strokeWidth={2} />
                        </button>
                        <AnimatePresence>
                          {openActionId === member._id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -4 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.1 }}
                              className="absolute right-0 bottom-full mb-2 w-44 bg-white rounded-xl border-[3px] border-ink shadow-neo-md z-50 overflow-hidden"
                            >
                              {member.role === 'Member' ? (
                                <button onClick={() => updateRole.mutate({ id: member._id, role: 'Admin' })} className="w-full px-4 py-3 text-left text-sm font-medium text-ink hover:bg-lavender flex items-center gap-2.5 border-b-[2px] border-ink/10 transition-colors">
                                  <ArrowUpCircle className="w-4 h-4" strokeWidth={2} />
                                  Make Admin
                                </button>
                              ) : (
                                <button onClick={() => updateRole.mutate({ id: member._id, role: 'Member' })} className="w-full px-4 py-3 text-left text-sm font-medium text-ink hover:bg-sky flex items-center gap-2.5 border-b-[2px] border-ink/10 transition-colors">
                                  <ArrowDownCircle className="w-4 h-4" strokeWidth={2} />
                                  Make Member
                                </button>
                              )}
                              <button onClick={() => removeMember.mutate(member._id)} className="w-full px-4 py-3 text-left text-sm font-medium text-red-500 hover:bg-red-50 flex items-center gap-2.5 transition-colors">
                                <Trash2 className="w-4 h-4" strokeWidth={2} />
                                Remove
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
          {filtered.length === 0 && search && (
            <div className="col-span-full py-16 text-center">
              <p className="text-sm font-medium text-ink/40">No members match "{search}"</p>
            </div>
          )}
        </div>
      )}

      <Modal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} title="Invite Member" description="Send an invitation to join this workspace." accentColor='var(--pink-pastel)'>
        <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); inviteMember.mutate(fd.get('email') as string); }} className="space-y-5">
          {errorMsg && <div className="p-3 rounded-xl bg-red-50 border-[2px] border-red-300 text-sm font-medium text-red-600">{errorMsg}</div>}
          <div>
            <label className="block text-sm font-bold text-ink mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" strokeWidth={2} />
              <Input name="email" type="email" required placeholder="colleague@company.com" className="pl-11" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsInviteOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={inviteMember.isPending} variant="pink">
              {inviteMember.isPending ? 'Sending...' : 'Send Invite'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
