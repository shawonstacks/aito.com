// frontend/app/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ShoppingBag, Code, Shield } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, user } = useAuth();
  const router = useRouter();

  // If already logged in, redirect appropriately
  useEffect(() => {
    if (user) {
      if (user.role?.toLowerCase() === 'admin') {
        router.push('/admin/dashboard');
      } else if (user.role?.toLowerCase() === 'vendor') {
        router.push('/vendor/dashboard');
      } else {
        router.push('/');
      }
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj.message || 'Login failed. Please verify your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-2">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Login</h2>
          <p className="text-sm text-gray-500">Sign in to browse software and access your digital licenses</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition text-sm shadow-sm"
          >
            {submitting ? 'Signing in...' : 'Sign In as Customer'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-indigo-600 font-semibold hover:underline">
            Register here
          </Link>
        </p>

        {/* Dedicated Portals Switcher */}
        <div className="pt-4 border-t border-gray-100 space-y-2">
          <p className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Dedicated Access Portals
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Link
              href="/vendor/login"
              className="flex items-center justify-center gap-1.5 p-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg font-medium transition"
            >
              <Code className="w-3.5 h-3.5" /> Vendor Portal
            </Link>
            <Link
              href="/admin/login"
              className="flex items-center justify-center gap-1.5 p-2 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg font-medium transition"
            >
              <Shield className="w-3.5 h-3.5" /> Admin Terminal
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
