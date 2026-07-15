'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck } from 'lucide-react';
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
      // 1. Authenticate with Firebase
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

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
    <div className="relative w-full max-w-md mx-auto">
      {/* Background glowing effects */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-3xl blur-xl opacity-30 animate-pulse" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative rounded-3xl border-[3px] border-[#1A1A1A] bg-white p-8 md:p-10 shadow-[8px_8px_0px_#1A1A1A] overflow-hidden"
      >
        {/* Decorative corner elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-indigo-50 rounded-bl-full -z-10" />
        
        {/* Title Section */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#DDD6FE] border-[3px] border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] flex items-center justify-center rotate-3 hover:rotate-0 transition-transform cursor-pointer"
          >
            <Sparkles className="w-8 h-8 text-[#1A1A1A]" strokeWidth={2} />
          </motion.div>
          <h1 className="text-3xl font-black text-[#1A1A1A] tracking-tight mb-3">
            Welcome to ReadyNest
          </h1>
          <p className="text-sm font-medium text-gray-500 max-w-[250px] mx-auto leading-relaxed">
            Sign in to access your workspace and manage your properties.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            className="mb-6 p-4 bg-red-50 rounded-2xl border-[2px] border-red-200 flex items-start gap-3"
          >
            <div className="mt-0.5 text-red-500">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <p className="text-sm font-bold text-red-700 leading-tight">{error}</p>
          </motion.div>
        )}

        {/* Login Button */}
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98, y: 0 }}
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border-[3px] border-[#1A1A1A] text-[#1A1A1A] font-bold py-4 px-6 rounded-2xl shadow-[4px_4px_0px_#1A1A1A] hover:shadow-[6px_6px_0px_#1A1A1A] hover:bg-gray-50 transition-all disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
        >
          {loading ? (
            <div className="w-6 h-6 border-[3px] border-[#1A1A1A] border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              {/* Google SVG Logo */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.79 15.72 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.72 17.57C14.73 18.23 13.48 18.63 12 18.63C9.14 18.63 6.7 16.7 5.84 14.11H2.17V16.96C3.98 20.55 7.69 23 12 23Z" fill="#34A853"/>
                <path d="M5.84 14.11C5.62 13.45 5.5 12.74 5.5 12C5.5 11.26 5.62 10.55 5.84 9.89V7.04H2.17C1.43 8.52 1 10.21 1 12C1 13.79 1.43 15.48 2.17 16.96L5.84 14.11Z" fill="#FBBC05"/>
                <path d="M12 5.38C13.61 5.38 15.06 5.93 16.2 7.02L19.36 3.86C17.46 2.09 14.97 1 12 1C7.69 1 3.98 3.45 2.17 7.04L5.84 9.89C6.7 7.3 9.14 5.38 12 5.38Z" fill="#EA4335"/>
              </svg>
              <span className="text-base">Continue with Google</span>
            </>
          )}
        </motion.button>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t-2 border-gray-100 flex items-center justify-center gap-2 text-xs font-bold text-gray-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Secure authentication via Google</span>
        </div>
      </motion.div>
    </div>
  );
}

