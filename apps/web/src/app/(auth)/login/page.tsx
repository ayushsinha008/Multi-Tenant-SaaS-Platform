'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { api } from '@/lib/axios';

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const res = await api.post('/auth/google', {
        email: result.user.email,
        name: result.user.displayName,
        avatar: result.user.photoURL,
        uid: result.user.uid,
      });
      setUser(res.data.user);
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="rounded-2xl border-[3px] border-[#1A1A1A] bg-white shadow-[8px_8px_0px_#1A1A1A] overflow-hidden"
    >
      {/* Top accent strip */}
      <div className="flex h-2">
        <div className="flex-1 bg-[#DDD6FE]" />
        <div className="flex-1 bg-[#BAE6FD]" />
        <div className="flex-1 bg-[#BBF7D0]" />
        <div className="flex-1 bg-[#FBCFE8]" />
        <div className="flex-1 bg-[#FEF08A]" />
      </div>

      <div className="p-8 sm:p-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl border-[3px] border-[#1A1A1A] bg-[#FEF08A] flex items-center justify-center shadow-[3px_3px_0px_#1A1A1A]">
              <Sparkles className="w-5 h-5 text-[#1A1A1A]" strokeWidth={2.5} />
            </div>
            <div className="h-px flex-1 border-t-[2px] border-dashed border-[#1A1A1A]/20" />
          </div>
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight leading-tight mb-2">
            Welcome back 👋
          </h1>
          <p className="text-sm font-medium text-[#1A1A1A]/50">
            Sign in to access your workspace and manage your team.
          </p>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-[#FEE2E2] rounded-xl border-[2px] border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] flex items-start gap-3"
          >
            <div className="w-5 h-5 rounded-full bg-[#1A1A1A] flex items-center justify-center shrink-0 mt-px">
              <span className="text-white text-[10px] font-black">!</span>
            </div>
            <p className="text-sm font-semibold text-[#1A1A1A]">{error}</p>
          </motion.div>
        )}

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-between gap-3 border-[3px] border-[#1A1A1A] bg-white text-[#1A1A1A] font-bold py-4 px-5 rounded-xl shadow-[4px_4px_0px_#1A1A1A] hover:bg-[#FFFDF5] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#1A1A1A] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1A1A1A] transition-all disabled:opacity-60 disabled:cursor-not-allowed group"
        >
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="w-6 h-6 border-[3px] border-[#1A1A1A] border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.79 15.72 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4" />
                <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.72 17.57C14.73 18.23 13.48 18.63 12 18.63C9.14 18.63 6.7 16.7 5.84 14.11H2.17V16.96C3.98 20.55 7.69 23 12 23Z" fill="#34A853" />
                <path d="M5.84 14.11C5.62 13.45 5.5 12.74 5.5 12C5.5 11.26 5.62 10.55 5.84 9.89V7.04H2.17C1.43 8.52 1 10.21 1 12C1 13.79 1.43 15.48 2.17 16.96L5.84 14.11Z" fill="#FBBC05" />
                <path d="M12 5.38C13.61 5.38 15.06 5.93 16.2 7.02L19.36 3.86C17.46 2.09 14.97 1 12 1C7.69 1 3.98 3.45 2.17 7.04L5.84 9.89C6.7 7.3 9.14 5.38 12 5.38Z" fill="#EA4335" />
              </svg>
            )}
            <span className="text-sm tracking-tight">Continue with Google</span>
          </div>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
        </button>

        {/* Feature chips */}
        <div className="mt-8 flex flex-wrap gap-2">
          {[
            { label: 'Projects', color: '#BAE6FD' },
            { label: 'Kanban Boards', color: '#BBF7D0' },
            { label: 'Team Members', color: '#FBCFE8' },
            { label: 'File Uploads', color: '#FEF08A' },
          ].map((chip) => (
            <span
              key={chip.label}
              className="inline-flex items-center px-3 py-1 rounded-lg border-[2px] border-[#1A1A1A] text-[11px] font-bold text-[#1A1A1A] tracking-tight shadow-[2px_2px_0px_#1A1A1A]"
              style={{ backgroundColor: chip.color }}
            >
              {chip.label}
            </span>
          ))}
        </div>

        {/* Security note */}
        <div className="mt-8 pt-6 border-t-[2px] border-dashed border-[#1A1A1A]/15 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#1A1A1A]/30" strokeWidth={2} />
          <span className="text-[11px] font-medium text-[#1A1A1A]/30 tracking-wide">
            Secured by Google OAuth · No passwords stored
          </span>
        </div>
      </div>
    </motion.div>
  );
}
