'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Building2, ArrowRight, CheckCircle2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';

export default function OnboardingPage() {
  const router = useRouter();
  const setActiveWorkspace = useAuthStore((state) => state.setActiveWorkspace);
  const user = useAuthStore((state) => state.user);
  
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [workspaceId, setLocalWorkspaceId] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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
    <div className="space-y-8">
      {/* Step Indicators */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${step >= i ? 'bg-indigo-500' : 'bg-white/10'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Create your workspace</h2>
              <p className="text-slate-400">Welcome {user?.name}! Let's get your organization set up.</p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {errorMsg}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Workspace Name</label>
                <Input
                  autoFocus
                  placeholder="e.g. Acme Corp"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && name.trim() && createOrg.mutate(name.trim())}
                />
              </div>
            </div>

            <Button
              className="w-full h-12"
              disabled={createOrg.isPending || !name.trim()}
              onClick={() => createOrg.mutate(name.trim())}
            >
              {createOrg.isPending ? 'Creating...' : 'Continue'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Invite your team</h2>
              <p className="text-slate-400">Collaboration is better together. Invite others to {name}.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <Input
                  placeholder="colleague@example.com"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="ghost" className="w-full" onClick={nextStep}>Skip for now</Button>
              <Button 
                className="w-full" 
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
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2">You're all set!</h2>
              <p className="text-slate-400">Your workspace is ready. Taking you to the dashboard...</p>
            </div>

            <Button className="w-full h-12 mt-8" onClick={() => router.push('/dashboard')}>
              Go to Dashboard
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
