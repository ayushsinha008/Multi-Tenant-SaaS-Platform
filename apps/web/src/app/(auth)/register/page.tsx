'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { getFirebaseAuth } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { api } from '@/lib/axios';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const setActiveWorkspace = useAuthStore((state) => state.setActiveWorkspace);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSignUp = async () => {
    setError('');
    setLoading(true);

    try {
      const { auth, googleProvider } = getFirebaseAuth();
      const result = await signInWithPopup(auth, googleProvider);

      const res = await api.post('/auth/google', { 
        email: result.user.email,
        name: result.user.displayName,
        avatar: result.user.photoURL,
        uid: result.user.uid
      });
      
      setUser(res.data.user);
      
      try {
        const orgRes = await api.get('/organizations');
        if (orgRes.data.organizations && orgRes.data.organizations.length > 0) {
          setActiveWorkspace(orgRes.data.organizations[0]._id);
          router.push('/dashboard');
        } else {
          router.push('/onboarding');
        }
      } catch (err) {
        router.push('/onboarding');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sign up with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border-[3px] border-ink bg-white p-8 md:p-10 shadow-neo-lg space-y-6">
      
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-pink-pastel border-[2px] border-ink flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-ink" strokeWidth={2.5} />
          </div>
          <span className="text-xs font-bold text-ink/40 uppercase tracking-widest">Sign Up</span>
        </div>
        <h1 className="text-2xl font-bold text-ink tracking-tight leading-none">Create an account</h1>
        <p className="mt-1.5 text-sm font-medium text-ink/40">Get started with your free 14-day trial</p>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-red-50 rounded-xl border-[2px] border-red-300">
          <p className="text-xs font-semibold text-red-600 text-center">{error}</p>
        </motion.div>
      )}

      <button
        onClick={handleGoogleSignUp}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-white border-[3px] border-ink text-ink font-bold py-4 px-6 rounded-xl shadow-neo-md hover:-translate-y-1 hover:shadow-neo-lg active:translate-y-[2px] active:shadow-neo-xs transition-all disabled:opacity-60 disabled:cursor-not-allowed group"
      >
        {loading ? (
          <div className="w-6 h-6 border-[3px] border-ink border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.79 15.72 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
              <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.72 17.57C14.73 18.23 13.48 18.63 12 18.63C9.14 18.63 6.7 16.7 5.84 14.11H2.17V16.96C3.98 20.55 7.69 23 12 23Z" fill="#34A853"/>
              <path d="M5.84 14.11C5.62 13.45 5.5 12.74 5.5 12C5.5 11.26 5.62 10.55 5.84 9.89V7.04H2.17C1.43 8.52 1 10.21 1 12C1 13.79 1.43 15.48 2.17 16.96L5.84 14.11Z" fill="#FBBC05"/>
              <path d="M12 5.38C13.61 5.38 15.06 5.93 16.2 7.02L19.36 3.86C17.46 2.09 14.97 1 12 1C7.69 1 3.98 3.45 2.17 7.04L5.84 9.89C6.7 7.3 9.14 5.38 12 5.38Z" fill="#EA4335"/>
            </svg>
            <span className="text-base tracking-tight">Sign up with Google</span>
          </>
        )}
      </button>

      <div className="text-center text-xs font-medium text-ink/40 pt-6 border-t-[2px] border-ink/5 mt-6">
        Already have an account?{' '}
        <Link href="/login" className="font-bold text-ink hover:underline decoration-[2px] underline-offset-4">
          Sign in instead
        </Link>
      </div>
      
      <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-ink/30 uppercase tracking-widest mt-4">
        <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2.5} />
        <span>Secure Authentication</span>
      </div>
    </div>
  );
}
