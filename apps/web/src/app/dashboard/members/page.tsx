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
    <div className="space-y-12 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-[4px] border-black pb-8 gap-8">
        <div>
          <h1 className="text-7xl font-black tracking-tighter text-black uppercase leading-none">
            Team<br/><span className="text-[#00FF4C]" style={{ WebkitTextStroke: '3px black' }}>Directory</span>
          </h1>
          <p className="text-xl font-bold text-black/70 mt-4 uppercase">Manage personnel and access roles.</p>
        </div>
        <Button onClick={() => setIsInviteOpen(true)} className="bg-[#00FF4C] text-black border-[3px] border-black shadow-[4px_4px_0_0_#000000] hover:bg-black hover:text-[#00FF4C] hover:shadow-none hover:translate-x-1 hover:translate-y-1 h-16 px-8 text-lg">
          <UserPlus className="w-6 h-6 mr-2" strokeWidth={3} />
          Invite Member
        </Button>
      </div>

      <div className="border-[4px] border-black bg-white shadow-[12px_12px_0_0_#000000] overflow-visible pb-12 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-black border-l-[4px] border-b-[4px] border-black flex items-center justify-center -mr-[4px] -mt-[4px]">
          <Users className="w-16 h-16 text-[#00FF4C]" strokeWidth={1} />
        </div>
        
        <div className="overflow-visible pt-16 px-8">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="text-xl text-black font-black uppercase tracking-tighter border-b-[4px] border-black">
              <tr>
                <th className="py-4 px-4 border-r-[4px] border-black">Operative</th>
                <th className="py-4 px-4 border-r-[4px] border-black">Clearance</th>
                <th className="py-4 px-4 border-r-[4px] border-black">Status</th>
                <th className="py-4 px-4 border-r-[4px] border-black">Onboarded</th>
                <th className="py-4 px-4 text-right">Directives</th>
              </tr>
            </thead>
            <tbody className="divide-y-[4px] divide-black font-bold uppercase">
              {members.map((member: any) => (
                <tr key={member._id} className="hover:bg-[#00FF4C] transition-colors group">
                  <td className="py-6 px-4 border-r-[4px] border-black">
                    <div className="flex items-center gap-4">
                      <div className="border-[3px] border-black rounded-none overflow-hidden">
                        <Avatar src={member.userId?.avatar} fallback={member.userId?.name || member.email} />
                      </div>
                      <div>
                        <div className="text-xl font-black text-black leading-none">{member.userId?.name || 'Pending Invite'}</div>
                        <div className="text-black/60 text-sm mt-1">{member.email || member.userId?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-4 border-r-[4px] border-black">
                    <div className="flex items-center gap-2 text-black">
                      {member.role === 'OWNER' ? <Shield className="w-5 h-5 text-black" strokeWidth={3} /> : <Users className="w-5 h-5 text-black" strokeWidth={3} />}
                      <span className="text-lg font-black tracking-tighter">{member.role}</span>
                    </div>
                  </td>
                  <td className="py-6 px-4 border-r-[4px] border-black">
                    <Badge variant={member.status === 'ACTIVE' ? 'success' : 'secondary'}>
                      {member.status}
                    </Badge>
                  </td>
                  <td className="py-6 px-4 text-black border-r-[4px] border-black text-lg">
                    {new Date(member.joinedAt || member.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-6 px-4 text-right relative">
                    {member.role !== 'OWNER' && (
                      <div ref={openActionId === member._id ? actionRef : null}>
                        <button 
                          onClick={() => setOpenActionId(openActionId === member._id ? null : member._id)}
                          className={`p-3 border-[3px] border-black transition-colors ${openActionId === member._id ? 'bg-black text-[#00FF4C]' : 'bg-white text-black hover:bg-black hover:text-[#00FF4C] opacity-0 group-hover:opacity-100'}`}
                        >
                          <MoreHorizontal className="w-5 h-5" strokeWidth={3} />
                        </button>
                        
                        <AnimatePresence>
                          {openActionId === member._id && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.1 }}
                              className="absolute right-16 top-6 w-56 bg-white border-[4px] border-black shadow-[8px_8px_0_0_#000000] z-50 flex flex-col"
                            >
                              {member.role === 'MEMBER' ? (
                                <button
                                  onClick={() => updateRole.mutate({ id: member._id, role: 'ADMIN' })}
                                  className="w-full px-4 py-3 text-left font-black text-black hover:bg-black hover:text-[#00FF4C] flex items-center gap-3 border-b-[2px] border-black transition-colors"
                                >
                                  <ArrowUpCircle className="w-5 h-5" strokeWidth={3} />
                                  ELEVATE TO ADMIN
                                </button>
                              ) : (
                                <button
                                  onClick={() => updateRole.mutate({ id: member._id, role: 'MEMBER' })}
                                  className="w-full px-4 py-3 text-left font-black text-black hover:bg-black hover:text-white flex items-center gap-3 border-b-[2px] border-black transition-colors"
                                >
                                  <ArrowDownCircle className="w-5 h-5" strokeWidth={3} />
                                  DEMOTE TO MEMBER
                                </button>
                              )}
                              <button
                                onClick={() => removeMember.mutate(member._id)}
                                className="w-full px-4 py-3 text-left font-black text-black bg-[#FF0000] hover:bg-black hover:text-[#FF0000] flex items-center gap-3 transition-colors"
                              >
                                <Trash2 className="w-5 h-5" strokeWidth={3} />
                                TERMINATE
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
          <div className="p-16 border-t-[4px] border-black bg-[#ECECEC]">
            <EmptyState
              icon={Users}
              title="NO OPERATIVES DETECTED"
              description="Transmit an invitation to expand your operational capacity."
              primaryAction={{ label: 'INITIATE INVITE', onClick: () => setIsInviteOpen(true) }}
            />
          </div>
        )}
      </div>

      <Modal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} title="Transmit Invitation" description="Deploy an encrypted email token to recruit personnel.">
        <form onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          inviteMember.mutate(fd.get('email') as string);
        }} className="space-y-6">
          {errorMsg && (
            <div className="p-4 bg-[#FF0000] border-[4px] border-black text-black font-black uppercase shadow-[4px_4px_0_0_#000000]">
              {errorMsg}
            </div>
          )}
          <div>
            <label className="block text-xl font-black text-black mb-2 uppercase tracking-tighter">Target Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-4 w-6 h-6 text-black" strokeWidth={2} />
              <Input name="email" type="email" required placeholder="colleague@example.com" className="pl-14 h-14" />
            </div>
          </div>
          <div className="pt-6 flex justify-end gap-4 border-t-[4px] border-black mt-8">
            <Button variant="ghost" type="button" onClick={() => setIsInviteOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={inviteMember.isPending} className="bg-black text-[#00FF4C] hover:bg-[#00FF4C] hover:text-black h-14 px-8">
              {inviteMember.isPending ? 'TRANSMITTING...' : 'SEND INVITE'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
