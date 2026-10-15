// frontend/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, User, LogOut, Store } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Store className="w-7 h-7 text-indigo-600" />
          <span className="font-bold text-xl text-gray-900 tracking-tight">
            MultiVendor<span className="text-indigo-600">Hub</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-gray-600 hover:text-indigo-600 font-medium">
            Shop
          </Link>

          {/* Cart Icon */}
          <Link href="/cart" className="relative text-gray-600 hover:text-indigo-600">
            <ShoppingBag className="w-6 h-6" />
          </Link>

          {/* Conditional Rendering based on Auth State */}
          {user ? (
            <div className="flex items-center gap-4 border-l pl-4 border-gray-200">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <User className="w-4 h-4 text-indigo-600" />
                <span>{user.name}</span>
                <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full uppercase font-bold">
                  {user.role}
                </span>
              </div>

              {/* Vendor & Admin Action Buttons */}
              {user.role === 'VENDOR' && (
                <Link href="/vendor/dashboard" className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-md hover:bg-indigo-100 transition">
                  Vendor Panel
                </Link>
              )}
              {user.role === 'ADMIN' && (
                <Link href="/admin/pending-shops" className="text-xs bg-amber-50 text-amber-600 px-3 py-1.5 rounded-md hover:bg-amber-100 transition">
                  Admin Panel
                </Link>
              )}

              <button
                onClick={logout}
                className="text-gray-500 hover:text-red-600 transition flex items-center gap-1 text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 border-l pl-4 border-gray-200">
              <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-indigo-600">
                Login
              </Link>
              <Link href="/register" className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}