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
    <div className="bg-gray-50 flex flex-col w-full overflow-x-hidden">
      {/* Software Marketplace Hero Banner */}
      <header className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 text-center border-b border-indigo-900/50 w-full">
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            One Smart SaaS Platform. A Simpler Life
          </h1>

          <p className="text-gray-300 text-xs sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Buy original Web Apps, Mobile Source Code, SaaS Tools, and Scripts directly from verified software developers on <span className="text-indigo-400 font-semibold">aito</span>.
          </p>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 pt-2 text-xs font-medium text-gray-400">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-grow w-full">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Explore Software & Tools</h2>
            <p className="text-xs sm:text-sm text-gray-500">Find top-rated code and digital solutions</p>
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
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm px-4">
            <p className="text-gray-600 font-medium text-base sm:text-lg">No software listed yet.</p>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Check back soon or register as a developer vendor to upload software!</p>
          </div>
        )}
      </main>
    </div>
  );
}