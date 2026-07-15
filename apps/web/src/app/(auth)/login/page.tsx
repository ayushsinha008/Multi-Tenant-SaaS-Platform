'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { api } from '@/lib/axios';
import Link from 'next/link';

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
        uid: result.user.uid
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div className="mb-10">
        <h1 className="text-4xl font-black text-[#1A1A1A] tracking-tight mb-3">
          Sign In
        </h1>
        <p className="text-sm font-bold text-[#1A1A1A]/60 uppercase tracking-widest">
          Welcome back to ReadyNest
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-[#FEE2E2] rounded-xl border-[3px] border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] flex items-start gap-3">
          <span className="text-[#1A1A1A] font-black mt-px">!</span>
          <p className="text-sm font-bold text-[#1A1A1A]">{error}</p>
        </div>
      )}

      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-white border-[3px] border-[#1A1A1A] text-[#1A1A1A] font-bold py-4 px-6 rounded-xl shadow-[4px_4px_0px_#1A1A1A] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#1A1A1A] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1A1A1A] transition-all disabled:opacity-60 disabled:cursor-not-allowed group"
      >
        {loading ? (
          <div className="w-6 h-6 border-[3px] border-[#1A1A1A] border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.79 15.72 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
              <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.72 17.57C14.73 18.23 13.48 18.63 12 18.63C9.14 18.63 6.7 16.7 5.84 14.11H2.17V16.96C3.98 20.55 7.69 23 12 23Z" fill="#34A853"/>
              <path d="M5.84 14.11C5.62 13.45 5.5 12.74 5.5 12C5.5 11.26 5.62 10.55 5.84 9.89V7.04H2.17C1.43 8.52 1 10.21 1 12C1 13.79 1.43 15.48 2.17 16.96L5.84 14.11Z" fill="#FBBC05"/>
              <path d="M12 5.38C13.61 5.38 15.06 5.93 16.2 7.02L19.36 3.86C17.46 2.09 14.97 1 12 1C7.69 1 3.98 3.45 2.17 7.04L5.84 9.89C6.7 7.3 9.14 5.38 12 5.38Z" fill="#EA4335"/>
            </svg>
            <span className="text-base tracking-tight">Continue with Google</span>
          </>
        )}
      </button>

      <div className="mt-8 flex items-center gap-4">
        <div className="h-[3px] flex-1 bg-[#1A1A1A]/10 rounded-full" />
        <span className="text-xs font-bold text-[#1A1A1A]/40 uppercase tracking-widest">or</span>
        <div className="h-[3px] flex-1 bg-[#1A1A1A]/10 rounded-full" />
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm font-bold text-[#1A1A1A]/60">
          Don't have an account?{' '}
          <Link href="/register" className="text-[#1A1A1A] hover:underline decoration-[3px] underline-offset-4">
            Sign up
          </Link>
        </p>
      </div>

      <div className="mt-12 flex items-center justify-center gap-2 text-xs font-bold text-[#1A1A1A]/40 uppercase tracking-widest">
        <ShieldCheck className="w-4 h-4" strokeWidth={2.5} />
        <span>Secure Authentication</span>
      </div>
    </motion.div>
  );
}
