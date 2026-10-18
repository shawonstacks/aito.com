// frontend/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import { Terminal, ShieldCheck, Cpu } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get('/products');
        if (response.data.success) {
          setProducts(response.data.products);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-gray-50 flex flex-col">
      {/* Software Marketplace Hero Banner */}
      <header className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 text-center border-b border-indigo-900/50">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-2 backdrop-blur-sm">
            <Cpu className="w-4 h-4 text-indigo-400" />
            Premium Software & Web Script Marketplace
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Discover Verified Software & Source Codes
          </h1>

          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Buy original Web Apps, Mobile Source Code, SaaS Tools, and Scripts directly from verified software developers on <span className="text-indigo-400 font-semibold">aito.com</span>.
          </p>

          <div className="flex flex-wrap justify-center gap-6 pt-4 text-xs font-medium text-gray-400">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-indigo-400" /> Instant Source Code Access
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-400" /> 100% Tested & Verified
            </span>
          </div>
        </div>
      </header>

      {/* Main Software Showcase */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Explore Software & Tools</h2>
            <p className="text-sm text-gray-500">Find top-rated code and digital solutions</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
            <p className="text-gray-600 font-medium text-lg">No software listed yet.</p>
            <p className="text-sm text-gray-400 mt-1">Check back soon or register as a developer vendor to upload software!</p>
          </div>
        )}
      </main>
    </div>
  );
}