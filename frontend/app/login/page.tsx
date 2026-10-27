// frontend/app/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const router = useRouter();

  // ইউজার ইতিমধ্যে লগইন করা থাকলে তাকে ড্যাশবোর্ড বা হোমপেজে পাঠিয়ে দেব
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

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-sm text-gray-500">Login to access your account</p>
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
                placeholder="user@example.com"
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
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition text-sm shadow-sm"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Don't have an account?{' '}
          <Link href="/register" className="text-indigo-600 font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}