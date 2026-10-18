// frontend/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { Code, ShoppingBag, User, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo / Brand Name */}
          <Link href="/" className="flex items-center gap-2">
            <Code className="w-8 h-8 text-indigo-600" />
            <span className="font-extrabold text-2xl tracking-tight text-gray-900">
              aito<span className="text-indigo-600">.com</span>
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition">
              Marketplace
            </Link>

            <Link href="/cart" className="p-2 text-gray-700 hover:text-indigo-600 relative">
              <ShoppingBag className="w-6 h-6" />
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 bg-gray-100 px-3 py-1.5 rounded-full">
                  <User className="w-4 h-4 text-indigo-600" />
                  {user.name}
                  <span className="ml-1 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase">
                    {user.role}
                  </span>
                </span>

                {user.role?.toLowerCase() === 'admin' && (
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-1 text-xs bg-amber-500 hover:bg-amber-600 text-white font-semibold px-3 py-1.5 rounded-lg shadow-sm transition"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Admin Panel
                  </Link>
                )}

                {user.role?.toLowerCase() === 'vendor' && (
                  <Link
                    href="/vendor/dashboard"
                    className="flex items-center gap-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-3 py-1.5 rounded-lg shadow-sm transition"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Vendor Dashboard
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-semibold bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}