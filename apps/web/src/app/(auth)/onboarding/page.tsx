'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
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
    <div className="rounded-2xl border-[3px] border-[#1A1A1A] bg-white p-8 md:p-10 shadow-[6px_6px_0px_#1A1A1A] space-y-6">
      
      {/* Step Indicators */}
      <div className="flex items-center gap-2 mb-4">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full border-[1.5px] border-[#1A1A1A] transition-colors duration-300 ${
              step >= i ? 'bg-[#DDD6FE]' : 'bg-[#FFFDF5]'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#BAE6FD] border-[2px] border-[#1A1A1A] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#1A1A1A]" strokeWidth={2.5} />
                </div>
                <span className="text-xs font-bold text-[#1A1A1A]/40 uppercase tracking-widest">Step 01</span>
              </div>
              <h2 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Create your workspace</h2>
              <p className="text-sm font-medium text-[#1A1A1A]/40 mt-1">Welcome {user?.name}! Let's get your workspace set up.</p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border-[2px] border-red-300 text-xs font-semibold text-red-600">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-2">Workspace Name</label>
              <Input
                autoFocus
                placeholder="e.g. Acme Corp"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && name.trim() && createOrg.mutate(name.trim())}
              />
            </div>

            <Button
              className="w-full"
              disabled={createOrg.isPending || !name.trim()}
              onClick={() => createOrg.mutate(name.trim())}
              variant="sky"
            >
              {createOrg.isPending ? 'Creating...' : 'Continue'}
              <ArrowRight className="w-4 h-4 ml-2" strokeWidth={3} />
            </Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#DDD6FE] border-[2px] border-[#1A1A1A] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#1A1A1A]" strokeWidth={2.5} />
                </div>
                <span className="text-xs font-bold text-[#1A1A1A]/40 uppercase tracking-widest">Step 02</span>
              </div>
              <h2 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Invite your team</h2>
              <p className="text-sm font-medium text-[#1A1A1A]/40 mt-1">Collaboration works better together. Add some colleagues.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-2">Email Address</label>
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
            <div className="w-16 h-16 rounded-full border-[3px] border-[#1A1A1A] bg-[#BBF7D0] flex items-center justify-center mx-auto shadow-[3px_3px_0px_#1A1A1A] animate-float">
              <CheckCircle2 className="w-8 h-8 text-[#1A1A1A]" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">You're all set!</h2>
              <p className="text-sm font-medium text-[#1A1A1A]/40 mt-1.5">Your organization node is online. Let's enter the workspace.</p>
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
