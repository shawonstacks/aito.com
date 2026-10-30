// frontend/app/vendor/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Code2, Lock, Mail, ArrowRight, ShieldCheck, Terminal, ArrowLeft } from 'lucide-react';

export default function VendorLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.role?.toUpperCase() === 'VENDOR') {
        router.push('/vendor/dashboard');
      } else if (user.role?.toUpperCase() === 'ADMIN') {
        router.push('/admin/dashboard');
      }
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password, 'VENDOR');
      router.push('/vendor/dashboard');
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj.message || 'Vendor login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-900 px-4 py-12 relative overflow-hidden">
      {/* Background Decorative Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-950 pointer-events-none" />

      <div className="max-w-md w-full bg-slate-800/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-indigo-500/20 space-y-6 relative z-10 text-white">
        
        {/* Portal Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-indigo-600/20 border border-indigo-500/40 rounded-2xl flex items-center justify-center mx-auto text-indigo-400 shadow-inner">
            <Code2 className="w-7 h-7" />
          </div>
          <span className="inline-block text-[11px] font-bold tracking-widest uppercase bg-indigo-500/10 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30">
            Developer & Author Portal
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight">Vendor Sign In</h1>
          <p className="text-xs text-slate-400">
            Sign in to upload software, manage client licenses, and review your revenue.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-950/40 p-3.5 text-xs text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Developer Email
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@studio.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Secret Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? 'Authenticating...' : 'Access Vendor Console'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-700/60 flex flex-col gap-3 text-center text-xs">
          <p className="text-slate-400">
            Not yet a verified software vendor?{' '}
            <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2">
              Apply to Sell Your Software
            </Link>
          </p>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2">
            <Link href="/login" className="hover:text-slate-300 inline-flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Customer Sign In
            </Link>
            <span className="flex items-center gap-1 text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> 256-bit Encrypted
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

