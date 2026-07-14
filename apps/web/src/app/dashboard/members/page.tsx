'use client';

import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { Users, UserPlus, Mail, Shield, MoreHorizontal, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';

export default function MembersPage() {
  const queryClient = useQueryClient();
  const activeWorkspaceId = useAuthStore((state) => state.activeWorkspaceId);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  const actionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (actionRef.current && !actionRef.current.contains(e.target as Node)) {
        setOpenActionId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['members', activeWorkspaceId],
    queryFn: async () => {
      const res = await api.get(`/organizations/${activeWorkspaceId}/members`);
      return res.data.members;
    },
    enabled: !!activeWorkspaceId
  });

  const [errorMsg, setErrorMsg] = useState('');

  const inviteMember = useMutation({
    mutationFn: async (email: string) => {
      setErrorMsg('');
      const res = await api.post(`/members/invite`, { email, role: 'MEMBER' });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      setIsInviteOpen(false);
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.message || 'Failed to invite member');
    }
  });

  const updateRole = useMutation({
    mutationFn: async ({ id, role }: { id: string, role: string }) => {
      await api.patch(`/members/${id}/role`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      setOpenActionId(null);
    }
  });

  const removeMember = useMutation({
    mutationFn: async (id: string) => {
      if (confirm('Are you sure you want to remove this member?')) {
        await api.delete(`/members/${id}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      setOpenActionId(null);
    }
  });

  if (isLoading) return <div className="animate-pulse">Loading members...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Team Members</h1>
          <p className="text-slate-400 mt-1">Manage access and roles for your team.</p>
        </div>
        <Button onClick={() => setIsInviteOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>

      <div className="bg-[#111827] border border-white/10 rounded-2xl overflow-hidden shadow-2xl pb-32">
        <div className="overflow-visible">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">Member</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Role</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Joined</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {members.map((member: any) => (
                <tr key={member._id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={member.userId?.avatar} fallback={member.userId?.name || member.email} />
                      <div>
                        <div className="font-medium text-white">{member.userId?.name || 'Pending Invite'}</div>
                        <div className="text-slate-400 text-xs">{member.email || member.userId?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      {member.role === 'OWNER' ? <Shield className="w-3 h-3 text-indigo-400" /> : <Users className="w-3 h-3" />}
                      <span className="font-medium">{member.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={member.status === 'ACTIVE' ? 'success' : 'secondary'}>
                      {member.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {new Date(member.joinedAt || member.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    {member.role !== 'OWNER' && (
                      <div ref={openActionId === member._id ? actionRef : null}>
                        <button 
                          onClick={() => setOpenActionId(openActionId === member._id ? null : member._id)}
                          className={`p-2 rounded-lg transition-colors ${openActionId === member._id ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100'}`}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        
                        <AnimatePresence>
                          {openActionId === member._id && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.1 }}
                              className="absolute right-6 top-12 w-48 bg-[#1f2937] border border-white/10 rounded-xl shadow-2xl py-1 z-50 overflow-hidden"
                            >
                              {member.role === 'MEMBER' ? (
                                <button
                                  onClick={() => updateRole.mutate({ id: member._id, role: 'ADMIN' })}
                                  className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-2"
                                >
                                  <ArrowUpCircle className="w-4 h-4 text-indigo-400" />
                                  Make Admin
                                </button>
                              ) : (
                                <button
                                  onClick={() => updateRole.mutate({ id: member._id, role: 'MEMBER' })}
                                  className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-2"
                                >
                                  <ArrowDownCircle className="w-4 h-4 text-yellow-400" />
                                  Make Member
                                </button>
                              )}
                              <div className="h-px bg-white/10 my-1" />
                              <button
                                onClick={() => removeMember.mutate(member._id)}
                                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                Remove Member
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {members.length === 0 && (
          <div className="p-12">
            <EmptyState
              icon={Users}
              title="No members yet"
              description="Invite your team members to collaborate on projects and tasks."
              primaryAction={{ label: 'Invite Member', onClick: () => setIsInviteOpen(true) }}
            />
          </div>
        )}
      </div>

      <Modal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} title="Invite Team Member" description="Send an email invitation to join your workspace.">
        <form onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          inviteMember.mutate(fd.get('email') as string);
        }} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {errorMsg}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <Input name="email" type="email" required placeholder="colleague@example.com" className="pl-10" />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
            <Button variant="ghost" type="button" onClick={() => setIsInviteOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={inviteMember.isPending}>
              {inviteMember.isPending ? 'Sending...' : 'Send Invite'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
