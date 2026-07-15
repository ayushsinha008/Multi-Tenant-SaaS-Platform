'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Zap } from 'lucide-react';
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
    <div className="w-full">
      <div className="text-center mb-12">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-[#FEF08A] border-[4px] border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A] flex items-center justify-center -rotate-6 hover:rotate-0 transition-transform cursor-pointer"
        >
          <Zap className="w-12 h-12 text-[#1A1A1A]" strokeWidth={2.5} fill="#1A1A1A" />
        </motion.div>
        
        <h1 className="text-4xl sm:text-5xl font-black text-[#1A1A1A] uppercase tracking-tight mb-4">
          Welcome Back
        </h1>
        <p className="text-sm font-bold text-[#1A1A1A]/60 max-w-[280px] mx-auto uppercase tracking-widest leading-relaxed">
          Sign in to access your dashboard and manage everything.
        </p>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-10 p-5 bg-[#FECACA] rounded-2xl border-[4px] border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] flex items-start gap-4 transform -rotate-2"
        >
          <div className="mt-0.5 text-[#1A1A1A]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <p className="text-sm font-black text-[#1A1A1A] uppercase">{error}</p>
        </motion.div>
      )}

      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-4 bg-white border-[4px] border-[#1A1A1A] text-[#1A1A1A] font-black py-5 px-6 rounded-2xl shadow-[8px_8px_0px_#1A1A1A] hover:bg-[#FBCFE8] hover:shadow-[12px_12px_0px_#1A1A1A] hover:-translate-y-1 active:translate-y-[4px] active:shadow-[0px_0px_0px_#1A1A1A] transition-all disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest text-sm sm:text-base group"
      >
        {loading ? (
          <div className="w-7 h-7 border-[4px] border-[#1A1A1A] border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform">
              <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.79 15.72 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
              <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.72 17.57C14.73 18.23 13.48 18.63 12 18.63C9.14 18.63 6.7 16.7 5.84 14.11H2.17V16.96C3.98 20.55 7.69 23 12 23Z" fill="#34A853"/>
              <path d="M5.84 14.11C5.62 13.45 5.5 12.74 5.5 12C5.5 11.26 5.62 10.55 5.84 9.89V7.04H2.17C1.43 8.52 1 10.21 1 12C1 13.79 1.43 15.48 2.17 16.96L5.84 14.11Z" fill="#FBBC05"/>
              <path d="M12 5.38C13.61 5.38 15.06 5.93 16.2 7.02L19.36 3.86C17.46 2.09 14.97 1 12 1C7.69 1 3.98 3.45 2.17 7.04L5.84 9.89C6.7 7.3 9.14 5.38 12 5.38Z" fill="#EA4335"/>
            </svg>
            <span>Google Login</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" strokeWidth={3} />
          </>
        )}
      </button>

      <div className="mt-12 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-[4px] border-[#1A1A1A]/10 rounded-full" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-6 bg-[#FFFDF5] text-xs font-black text-[#1A1A1A]/40 uppercase tracking-[0.2em]">or</span>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-xs font-black text-[#1A1A1A]/60 uppercase tracking-[0.1em]">
          New here? <Link href="/register" className="text-[#1A1A1A] hover:bg-[#FEF08A] px-3 py-2 rounded-xl border-[3px] border-transparent hover:border-[#1A1A1A] hover:shadow-[4px_4px_0px_#1A1A1A] transition-all ml-1">Sign up fast</Link>
        </p>
      </div>

      <div className="mt-16 flex items-center justify-center gap-3 text-[10px] font-black text-[#1A1A1A]/40 uppercase tracking-[0.25em]">
        <ShieldCheck className="w-5 h-5" strokeWidth={2.5} />
        <span>Secure Auth Enabled</span>
      </div>
    </div>
  );
}
