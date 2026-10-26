// frontend/components/Navbar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { Code, ShoppingBag, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo / Brand Name */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Code className="w-7 h-7 text-indigo-600" />
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-gray-900">
              aito
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
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

          {/* Mobile Right Icons & Hamburger Button */}
          <div className="flex items-center gap-3 md:hidden">
            <Link href="/cart" className="p-2 text-gray-700 hover:text-indigo-600">
              <ShoppingBag className="w-6 h-6" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-gray-700 hover:text-indigo-600 py-1"
          >
            Marketplace
          </Link>

          {user ? (
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm font-semibold text-gray-800 bg-gray-50 p-2.5 rounded-lg">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-600" />
                  {user.name}
                </span>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase">
                  {user.role}
                </span>
              </div>

              {user.role?.toLowerCase() === 'admin' && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full text-xs bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 rounded-lg shadow-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin Panel
                </Link>
              )}

              {user.role?.toLowerCase() === 'vendor' && (
                <Link
                  href="/vendor/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Vendor Dashboard
                </Link>
              )}

              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full text-sm font-semibold text-red-600 bg-red-50 py-2.5 rounded-lg hover:bg-red-100 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center text-sm font-semibold text-gray-700 bg-gray-100 py-2.5 rounded-lg hover:bg-gray-200"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center text-sm font-semibold bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}