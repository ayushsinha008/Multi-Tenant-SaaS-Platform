'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Logic for sending reset email via api
      setSubmitted(true);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Reset password
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      {!submitted ? (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email address
            </label>
            <div className="mt-1">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Send reset link
          </Button>
        </form>
      ) : (
        <div className="mt-8 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
          <Mail className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <h3 className="text-green-800 dark:text-green-400 font-medium">Check your email</h3>
          <p className="text-sm text-green-700 dark:text-green-500 mt-1">
            We sent a password reset link to {email}
          </p>
        </div>
      )}

      <div className="mt-6 text-center">
        <Link href="/login" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to sign in
        </Link>
      </div>
    </div>
  );
}
