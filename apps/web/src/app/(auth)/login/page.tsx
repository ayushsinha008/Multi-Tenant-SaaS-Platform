'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
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
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const res = await api.post('/auth/login', { email, password });
      setUser(res.data.user);
      router.push('/dashboard'); // Let the dashboard layout handle onboarding redirect if no workspaces
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white tracking-tight">Welcome back</h1>
        <p className="mt-2 text-slate-400">Sign in to your account to continue</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <Input name="email" type="email" placeholder="you@example.com" required />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-300">Password</label>
              <Link href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
                Forgot password?
              </Link>
            </div>
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
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-400 text-center">{error}</p>
          </motion.div>
        )}

        <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="text-center text-sm text-slate-400">
        Don't have an account?{' '}
        <Link href="/register" className="font-medium text-indigo-400 hover:text-indigo-300">
          Create one now
        </Link>
      </div>
    </div>
  );
}
