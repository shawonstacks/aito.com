'use client';

import Link from 'next/link';
import { Store, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

export default function Footer() {
  // Apnar WhatsApp number (Country code shaha, e.g., 88017XXXXXXXX)
  const whatsappNumber = '8801700000000'; 
  const defaultMessage = encodeURIComponent('Hello! I need help regarding MultiVendorHub.');

  return (
    <footer className="bg-gray-900 text-gray-300 relative pt-12 pb-8 mt-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-gray-800 text-sm">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Store className="w-7 h-7 text-indigo-500" />
              <span className="font-bold text-xl text-white tracking-tight">
                MultiVendor<span className="text-indigo-500">Hub</span>
              </span>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              Discover top products from verified vendors. Shop seamlessly across multiple shops with a single multi-vendor cart.
            </p>
            <div className="space-y-2 text-xs text-gray-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-500" /> Dhaka, Bangladesh
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-500" /> support@multivendorhub.com
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-500" /> +880 1700-000000
              </p>
            </div>
          </div>

          {/* Market Links */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase">Shop & Market</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-indigo-400 transition">All Products</Link></li>
              <li><Link href="/cart" className="hover:text-indigo-400 transition">My Cart</Link></li>
              <li><Link href="/register" className="hover:text-indigo-400 transition">Become a Vendor</Link></li>
              <li><Link href="/login" className="hover:text-indigo-400 transition">Vendor Login</Link></li>
            </ul>
          </div>

          {/* Help Links */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase">Help & Support</h3>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-indigo-400 transition">Help Center</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition">Track Order</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition">Shipping & Delivery</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition">Returns & Refunds</a></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase">Company & Legal</h3>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-indigo-400 transition">About Us</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition">Cookie Settings</a></li>
            </ul>
          </div>

        </div>

        {/* Copyright Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 MultiVendorHub. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-400">Terms</a>
            <a href="#" className="hover:text-gray-400">Privacy</a>
            <a href="#" className="hover:text-gray-400">Cookies</a>
          </div>
        </div>

      </div>

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=${defaultMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center gap-2 group"
        title="Chat with us on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-semibold pr-1">
          Chat with Us
        </span>
      </a>
    </footer>
  );
}