'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Sparkles } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const res = await api.post('/auth/register', { name, email, password });
      setUser(res.data.user);
      router.push('/onboarding');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border-[3px] border-[#1A1A1A] bg-white p-8 md:p-10 shadow-[6px_6px_0px_#1A1A1A] space-y-6">
      
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-[#FBCFE8] border-[2px] border-[#1A1A1A] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#1A1A1A]" strokeWidth={2.5} />
          </div>
          <span className="text-xs font-bold text-[#1A1A1A]/40 uppercase tracking-widest">Sign Up</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight leading-none">Create an account</h1>
        <p className="mt-1.5 text-sm font-medium text-[#1A1A1A]/40">Get started with your free 14-day trial</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-2">Full Name</label>
            <Input name="name" type="text" placeholder="John Doe" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-2">Email Address</label>
            <Input name="email" type="email" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-2">Password</label>
            <div className="relative">
              <Input 
                name="password" 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                required 
                className="pr-10"
              />
              <button 
                type="button" 
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30 hover:text-[#1A1A1A] transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
            <p className="text-[11px] font-semibold text-[#1A1A1A]/30 mt-1.5">Must be at least 8 characters long</p>
          </div>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-red-50 rounded-xl border-[2px] border-red-300">
            <p className="text-xs font-semibold text-red-600 text-center">{error}</p>
          </motion.div>
        )}

        <Button type="submit" className="w-full text-sm font-bold" variant="pink" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <div className="text-center text-xs font-medium text-[#1A1A1A]/40 pt-2 border-t-[2px] border-[#1A1A1A]/5">
        Already have an account?{' '}
        <Link href="/login" className="font-bold text-[#DDD6FE] hover:text-[#C4B5FD] hover:underline">
          Sign in instead
        </Link>
      </div>
    </div>
  );
}
