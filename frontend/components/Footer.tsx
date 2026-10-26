// frontend/components/Footer.tsx
'use client';

import Link from 'next/link';
import { Code, Phone, Mail, MapPin, MessageCircle, ShieldCheck, Download, Headphones } from 'lucide-react';

export default function Footer() {
  // আপনার হোয়াটসঅ্যাপ নম্বর (কান্ট্রি কোড সহ, যেমন: 8801XXXXXXXXX)
  const whatsappNumber = '8801700000000'; 
  const defaultMessage = encodeURIComponent('Hello aito Team! I need support regarding a software product.');

  return (
    <footer className="bg-gray-900 text-gray-300 relative pt-12 pb-8 mt-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Proposition Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 mb-10 border-b border-gray-800 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <Download className="w-8 h-8 text-indigo-500 flex-shrink-0" />
            <div>
              <h4 className="text-white font-semibold text-sm">Instant Digital Delivery</h4>
              <p className="text-gray-400 text-xs">Get access to license keys & code instantly after purchase.</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <ShieldCheck className="w-8 h-8 text-indigo-500 flex-shrink-0" />
            <div>
              <h4 className="text-white font-semibold text-sm">Verified Software & Scripts</h4>
              <p className="text-gray-400 text-xs">100% clean, tested, and secure original code products.</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <Headphones className="w-8 h-8 text-indigo-500 flex-shrink-0" />
            <div>
              <h4 className="text-white font-semibold text-sm">Dedicated Developer Support</h4>
              <p className="text-gray-400 text-xs">Direct technical assistance from software vendors.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-gray-800 text-sm">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Code className="w-7 h-7 text-indigo-500" />
              <span className="font-bold text-xl text-white tracking-tight">
                aito
              </span>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              The premier marketplace for premium software solutions, Web Applications, Mobile Apps, SaaS Platforms, and Developer Tools.
            </p>
            <div className="space-y-2 text-xs text-gray-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-500" /> Dhaka, Bangladesh
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-500" /> support@aito.com
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-500" /> +880 1700-000000
              </p>
            </div>
          </div>

          {/* Software Categories */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase">Software Marketplace</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-indigo-400 transition">Web Scripts & Code</Link></li>
              <li><Link href="/" className="hover:text-indigo-400 transition">Mobile App Source Code</Link></li>
              <li><Link href="/" className="hover:text-indigo-400 transition">SaaS Solutions</Link></li>
              <li><Link href="/" className="hover:text-indigo-400 transition">Plugins & Extensions</Link></li>
              <li><Link href="/cart" className="hover:text-indigo-400 transition">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Vendors & Authors */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase">For Developers</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/register" className="hover:text-indigo-400 transition">Sell Your Software</Link></li>
              <li><Link href="/login" className="hover:text-indigo-400 transition">Vendor Dashboard</Link></li>
              <li><a href="#" className="hover:text-indigo-400 transition">Developer Guidelines</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition">Affiliate Program</a></li>
            </ul>
          </div>

          {/* Help & Support */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase">Help & Legal</h3>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-indigo-400 transition">Help Center & Docs</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition">License Terms</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition">Terms of Service</a></li>
            </ul>
          </div>

        </div>

        {/* Copyright Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 aito - Software & Code Marketplace. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-400">Terms</a>
            <a href="#" className="hover:text-gray-400">Privacy</a>
            <a href="#" className="hover:text-gray-400">Licenses</a>
          </div>
        </div>

      </div>

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=${defaultMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center gap-2 group"
        title="Chat with aito support on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-semibold pr-1">
          Chat with Us
        </span>
      </a>
    </footer>
  );
}