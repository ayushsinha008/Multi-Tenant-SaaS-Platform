'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';

export default function OnboardingPage() {
  const router = useRouter();
  const setActiveWorkspace = useAuthStore((state) => state.setActiveWorkspace);
  const user = useAuthStore((state) => state.user);
  
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [name, setName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [workspaceId, setLocalWorkspaceId] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const queryClient = useQueryClient();

  const { data: invitationsData } = useQuery({
    queryKey: ['invitations'],
    queryFn: async () => {
      const res = await api.get('/auth/me/invitations');
      return res.data;
    }
  });

  const acceptInvite = useMutation({
    mutationFn: async (id: string) => { 
      const res = await api.post(`/auth/me/invitations/${id}/accept`); 
      return res.data;
    },
    onSuccess: (data) => { 
      queryClient.invalidateQueries({ queryKey: ['invitations'] }); 
      queryClient.invalidateQueries({ queryKey: ['organizations'] }); 
      setLocalWorkspaceId(data.member.organizationId);
      setActiveWorkspace(data.member.organizationId);
      setStep(3);
    }
  });

  const rejectInvite = useMutation({
    mutationFn: async (id: string) => { await api.post(`/auth/me/invitations/${id}/reject`); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['invitations'] }); }
  });

  const invitations = invitationsData?.invitations || [];

  const joinOrg = useMutation({
    mutationFn: async (code: string) => {
      setErrorMsg('');
      const res = await api.post('/organizations/join', { inviteCode: code });
      return res.data;
    },
    onSuccess: (data) => {
      setLocalWorkspaceId(data.organization._id);
      setActiveWorkspace(data.organization._id);
      setStep(3); // Skip invite step if joining
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.message || 'Failed to join workspace. Invalid code.');
    }
  });

  const createOrg = useMutation({
    mutationFn: async (name: string) => {
      setErrorMsg('');
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const res = await api.post('/organizations', { name, slug });
      return res.data;
    },
    onSuccess: (data) => {
      setLocalWorkspaceId(data.organization._id);
      setActiveWorkspace(data.organization._id);
      setStep(2);
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.message || 'Failed to create workspace. Please try again.');
    }
  });

  const nextStep = () => {
    if (step === 3) {
      router.push('/dashboard');
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <div className="rounded-2xl border-[3px] border-ink bg-white p-8 md:p-10 shadow-neo-lg space-y-6">
      
      {/* Step Indicators */}
      <div className="flex items-center gap-2 mb-4">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full border-[1.5px] border-ink transition-colors duration-300 ${
              step >= i ? 'bg-lavender' : 'bg-cream'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-sky border-[2px] border-ink flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-ink" strokeWidth={2.5} />
                </div>
                <span className="text-xs font-bold text-ink/40 uppercase tracking-widest">Step 01</span>
              </div>
              <h2 className="text-2xl font-bold text-ink tracking-tight">
                {mode === 'create' ? 'Create your workspace' : 'Join a workspace'}
              </h2>
              <p className="text-sm font-medium text-ink/40 mt-1">
                {mode === 'create' 
                  ? `Welcome ${user?.name}! Let's get your workspace set up.`
                  : `Welcome ${user?.name}! Enter an invite code to join your team.`}
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border-[2px] border-red-300 text-xs font-semibold text-red-600">
                {errorMsg}
              </div>
            )}

            {invitations.length > 0 && (
              <div className="p-4 rounded-xl border-[2px] border-ink bg-sky/20 space-y-3">
                <p className="text-sm font-bold text-ink">Pending Invitations</p>
                {invitations.map((invite: any) => (
                  <div key={invite._id} className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between p-3 bg-white rounded-lg border-[2px] border-ink shadow-neo-xs">
                    <p className="text-sm font-medium leading-snug text-ink">
                      Join <span className="font-bold">{invite.organizationId?.name}</span>
                    </p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => acceptInvite.mutate(invite._id)}
                        disabled={acceptInvite.isPending}
                        className="flex-1 sm:flex-none px-3 py-1.5 bg-mint border-[2px] border-ink rounded-lg text-xs font-bold hover:bg-mint-dark transition-colors"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => rejectInvite.mutate(invite._id)}
                        disabled={rejectInvite.isPending}
                        className="flex-1 sm:flex-none px-3 py-1.5 bg-cream border-[2px] border-ink rounded-lg text-xs font-bold hover:bg-red-50 transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex bg-cream p-1 rounded-xl border-[2px] border-ink">
              <button 
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${mode === 'create' ? 'bg-ink text-white' : 'text-ink/50 hover:text-ink'}`}
                onClick={() => { setMode('create'); setErrorMsg(''); }}
              >
                Create New
              </button>
              <button 
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${mode === 'join' ? 'bg-ink text-white' : 'text-ink/50 hover:text-ink'}`}
                onClick={() => { setMode('join'); setErrorMsg(''); }}
              >
                Join Existing
              </button>
            </div>

            {mode === 'create' ? (
              <div>
                <label className="block text-xs font-bold text-ink mb-2">Workspace Name</label>
                <Input
                  autoFocus
                  placeholder="e.g. Acme Corp"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && name.trim() && createOrg.mutate(name.trim())}
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-ink mb-2">Invite Code</label>
                <Input
                  autoFocus
                  placeholder="e.g. A1B2C3D4"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && inviteCode.trim() && joinOrg.mutate(inviteCode.trim())}
                />
              </div>
            )}

            <Button
              className="w-full"
              disabled={(mode === 'create' ? (createOrg.isPending || !name.trim()) : (joinOrg.isPending || !inviteCode.trim()))}
              onClick={() => mode === 'create' ? createOrg.mutate(name.trim()) : joinOrg.mutate(inviteCode.trim())}
              variant="sky"
            >
              {mode === 'create' ? (createOrg.isPending ? 'Creating...' : 'Continue') : (joinOrg.isPending ? 'Joining...' : 'Join Workspace')}
              <ArrowRight className="w-4 h-4 ml-2" strokeWidth={3} />
            </Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-lavender border-[2px] border-ink flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-ink" strokeWidth={2.5} />
                </div>
                <span className="text-xs font-bold text-ink/40 uppercase tracking-widest">Step 02</span>
              </div>
              <h2 className="text-2xl font-bold text-ink tracking-tight">Invite your team</h2>
              <p className="text-sm font-medium text-ink/40 mt-1">Collaboration works better together. Add some colleagues.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-2">Email Address</label>
              <Input
                placeholder="colleague@example.com"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={nextStep}>Skip</Button>
              <Button 
                variant="primary"
                className="flex-1" 
                disabled={!inviteEmail.trim()}
                onClick={async () => {
                  if (inviteEmail) {
                    try {
                      await api.post(`/organizations/${workspaceId}/invite`, { email: inviteEmail, role: 'MEMBER' });
                    } catch (e) {}
                  }
                  nextStep();
                }}
              >
                Send Invite
              </Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-full border-[3px] border-ink bg-mint flex items-center justify-center mx-auto shadow-neo-sm animate-float">
              <CheckCircle2 className="w-8 h-8 text-ink" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-ink tracking-tight">You're all set!</h2>
              <p className="text-sm font-medium text-ink/40 mt-1.5">Your organization node is online. Let's enter the workspace.</p>
            </div>

            <Button className="w-full mt-4" variant="mint" onClick={() => router.push('/dashboard')}>
              Go to Dashboard
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
