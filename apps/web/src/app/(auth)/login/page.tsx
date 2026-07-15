'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { motion } from 'framer-motion';
import { ShieldCheck, LogIn, ArrowRight } from 'lucide-react';
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
      // 1. Authenticate with Firebase
      const result = await signInWithPopup(auth, googleProvider);

      // 2. Send token to our backend to create a JWT session cookie
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
      <div className="text-center mb-10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center ring-8 ring-indigo-50/50"
        >
          <LogIn className="w-8 h-8" strokeWidth={2} />
        </motion.div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
          Welcome back
        </h1>
        <p className="text-base text-slate-500 max-w-[280px] mx-auto">
          Sign in to access your workspace and manage your team.
        </p>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: 'auto' }} 
          className="mb-6 p-4 bg-red-50 rounded-xl border border-red-100 flex items-start gap-3"
        >
          <div className="mt-0.5 text-red-500 shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <p className="text-sm font-medium text-red-700 leading-tight">{error}</p>
        </motion.div>
      )}

      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-semibold py-3.5 px-6 rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform duration-300">
              <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.79 15.72 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
              <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.72 17.57C14.73 18.23 13.48 18.63 12 18.63C9.14 18.63 6.7 16.7 5.84 14.11H2.17V16.96C3.98 20.55 7.69 23 12 23Z" fill="#34A853"/>
              <path d="M5.84 14.11C5.62 13.45 5.5 12.74 5.5 12C5.5 11.26 5.62 10.55 5.84 9.89V7.04H2.17C1.43 8.52 1 10.21 1 12C1 13.79 1.43 15.48 2.17 16.96L5.84 14.11Z" fill="#FBBC05"/>
              <path d="M12 5.38C13.61 5.38 15.06 5.93 16.2 7.02L19.36 3.86C17.46 2.09 14.97 1 12 1C7.69 1 3.98 3.45 2.17 7.04L5.84 9.89C6.7 7.3 9.14 5.38 12 5.38Z" fill="#EA4335"/>
            </svg>
            <span>Continue with Google</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all absolute right-5" />
          </>
        )}
      </button>

      <div className="mt-8 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-100" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-white text-slate-400">or</span>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          Don't have an account? <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">Sign up</Link>
        </p>
      </div>

      <div className="mt-12 flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
        <ShieldCheck className="w-4 h-4" />
        <span>Secure authentication via Google</span>
      </div>
    </div>
  );
}
