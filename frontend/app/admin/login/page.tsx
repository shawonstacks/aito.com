// frontend/app/admin/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert, Lock, Mail, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role?.toUpperCase() === 'ADMIN') {
      router.push('/admin/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password, 'ADMIN');
      router.push('/admin/dashboard');
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj.message || 'Administrator authentication failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/30 via-slate-950 to-black pointer-events-none" />

      <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-amber-500/30 space-y-6 relative z-10 text-white">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/40 rounded-2xl flex items-center justify-center mx-auto text-amber-400 shadow-inner">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <span className="inline-block text-[11px] font-bold tracking-widest uppercase bg-amber-500/10 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30">
            Internal Systems
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight">Super Admin Portal</h1>
          <p className="text-xs text-slate-400">
            Restricted administrative terminal. Authorized personnel only.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-950/50 p-3.5 text-xs text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Admin Identifier / Email
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aito.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Admin Security Key
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-slate-950 font-bold py-3 rounded-xl transition text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? 'Authenticating Terminal...' : 'Authenticate Super Admin'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 text-center space-y-1">
          <p className="text-[11px] text-amber-300 font-medium">System Admin Credentials</p>
          <p className="text-[11px] text-slate-400 font-mono">admin@aito.com &bull; Key: 123456</p>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <Link href="/login" className="hover:text-slate-300 inline-flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Return to Marketplace
          </Link>
          <span className="flex items-center gap-1 text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> RBAC Enforced
          </span>
        </div>

      </div>
    </div>
  );
}

