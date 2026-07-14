'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length >= 8) {
      // Send new password to api
      setSuccess(true);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Create new password
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Please enter your new password below.
        </p>
      </div>

      {!success ? (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              New Password
            </label>
            <div className="mt-1">
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                placeholder="••••••••"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">Must be at least 8 characters long.</p>
          </div>

          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </form>
      ) : (
        <div className="mt-8 bg-green-50 dark:bg-green-900/20 p-6 rounded-lg text-center">
          <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
          <h3 className="text-green-800 dark:text-green-400 font-medium text-lg">Password Updated</h3>
          <p className="text-sm text-green-700 dark:text-green-500 mt-1 mb-6">
            Your password has been successfully reset. You can now log in with your new credentials.
          </p>
          <Link href="/login">
            <Button className="w-full">Continue to Login</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
