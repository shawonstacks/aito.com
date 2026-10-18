// frontend/app/products/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import API from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { ShoppingBag, Store, CheckCircle2, ShieldCheck, Download, ArrowLeft, Phone, MapPin, Building } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Shipping Address Form State
  const [shippingAddress, setShippingAddress] = useState({
    address: 'Dhaka, Bangladesh',
    city: 'Dhaka',
    phone: '',
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await API.get(`/products/${id}`);
        if (response.data.success) {
          setProduct(response.data.product);
        } else if (response.data) {
          setProduct(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('Order korte prothome Login korun!');
      router.push('/login');
      return;
    }

    if (!shippingAddress.phone) {
      alert('Doya kore apnar Phone Number prodan korun.');
      return;
    }

    setOrdering(true);
    try {
      // Apnar Order API Endpoint match kora
      const orderData = {
        items: [
          {
            productId: product._id,
            quantity: 1,
          },
        ],
        shippingAddress,
      };

      const response = await API.post('/orders/create', orderData);

      if (response.data.success) {
        alert('🎉 Software Order Successful! Apnar order ti newa hoyeche.');
        setShowCheckoutModal(false);
        router.push('/cart'); // ba order history page
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Order place korte somoshya hoyeche. Abar chesta korun.');
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-gray-500 font-medium">Software / Product paowa jayni!</p>
        <Link href="/" className="inline-flex items-center gap-2 text-indigo-600 text-sm font-semibold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back Link */}
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 mb-6 transition">
        <ArrowLeft className="w-4 h-4" /> Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
        {/* Left: Product Image */}
        <div className="space-y-4">
          <div className="relative w-full h-80 sm:h-96 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : product.image ? (
              <img
                src={product.image}
                alt={product.title || product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-400 text-sm flex flex-col items-center gap-2">
                <ShoppingBag className="w-12 h-12 text-gray-300" />
                <span>No Preview Image</span>
              </div>
            )}

            <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {product.category || 'Software'}
            </span>
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Vendor/Shop Name */}
            {product.shopId && (
              <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold bg-indigo-50 w-fit px-3 py-1 rounded-full">
                <Store className="w-3.5 h-3.5" />
                <span>Vendor: {product.shopId.shopName || 'Verified Developer'}</span>
              </div>
            )}

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-snug">
              {product.title || product.name}
            </h1>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-indigo-600">৳{product.price}</span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-lg text-gray-400 line-through">৳{product.comparePrice}</span>
              )}
            </div>

            <p className="text-gray-600 text-sm leading-relaxed border-t border-b border-gray-100 py-4">
              {product.description || 'Premium software package with instant code delivery and developer support.'}
            </p>
          </div>

          {/* Action & Features */}
          <div className="space-y-4">
            <button
              onClick={() => {
                if (!user) {
                  alert('Software Order korte prothome Login korun!');
                  router.push('/login');
                } else {
                  setShowCheckoutModal(true);
                }
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-base"
            >
              <ShoppingBag className="w-5 h-5" />
              Buy & Instant Order
            </button>

            <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 pt-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> Instant Source Code
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-green-500" /> Tested & Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout / Address Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl relative">
            <h3 className="text-xl font-bold text-gray-900 border-b pb-3">Complete Your Software Order</h3>

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Product / Software
                </label>
                <input
                  type="text"
                  disabled
                  value={`${product.title || product.name} - ৳${product.price}`}
                  className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-700 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="01700000000"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  City
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Delivery Address / Notes
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={ordering}
                  className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow-sm"
                >
                  {ordering ? 'Placing Order...' : 'Confirm & Place Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}