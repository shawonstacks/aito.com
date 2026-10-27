// frontend/app/vendor/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import API from '../../../services/api';
import { 
  PlusCircle, 
  ShoppingBag, 
  DollarSign, 
  Code, 
  ExternalLink, 
  Upload, 
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

export default function VendorDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New Software Upload Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Web Application',
    demoUrl: '',
    image: '',
  });

  useEffect(() => {
    fetchVendorProducts();
  }, []);

  const fetchVendorProducts = async () => {
    try {
      const response = await API.get('/products/my-products');
      if (response.data.success) {
        setProducts(response.data.products || []);
      }
    } catch (error: any) {
      console.error('Failed to fetch vendor products:', error);
      alert(error.response?.data?.message || 'Failed to load your products. Please log in again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        image: formData.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
      };

      const response = await API.post('/products', payload);
      if (response.data.success) {
        alert('🎉 Software Uploaded Successfully!');
        setShowAddModal(false);
        setFormData({ title: '', description: '', price: '', category: 'Web Application', demoUrl: '', image: '' });
        fetchVendorProducts();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to upload software.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
              <Code className="w-7 h-7 text-indigo-600" />
              Developer & Vendor Portal
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Upload new software, track earnings, and manage client orders.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-3 rounded-xl transition shadow-sm text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Upload New Software
          </button>
        </div>

        {/* Vendor Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Total Net Earnings</p>
              <h3 className="text-xl font-bold text-gray-900">৳32,400</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Listed Products</p>
              <h3 className="text-xl font-bold text-gray-900">{products.length} Items</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Successful Sales</p>
              <h3 className="text-xl font-bold text-gray-900">18 Orders</h3>
            </div>
          </div>
        </div>

        {/* My Software Items Grid */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-gray-900">My Uploaded Software & Scripts</h2>

          {loading ? (
            <div className="py-12 text-center text-gray-400">Loading your software list...</div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((item) => (
                <div key={item._id} className="border border-gray-200 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-indigo-200 transition">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full uppercase">
                      {item.category || 'Script'}
                    </span>
                    <h3 className="font-bold text-gray-900 line-clamp-1">{item.title || item.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                  </div>
                  <div className="flex items-center justify-between border-t pt-3">
                    <span className="font-extrabold text-indigo-600">৳{item.price}</span>
                    <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 text-sm">
              No software listed yet. Click "Upload New Software" to start selling!
            </div>
          )}
        </div>

      </div>

      {/* Upload Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <h3 className="text-xl font-bold text-gray-900 border-b pb-3">Upload Software or Source Code</h3>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Software Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., POS SaaS Web Application"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Price (BDT) *</label>
                  <input
                    type="number"
                    required
                    placeholder="1500"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="Web Application">Web Application</option>
                    <option value="PHP Script">PHP Script</option>
                    <option value="Mobile Source Code">Mobile Source Code</option>
                    <option value="WordPress Plugin">WordPress Plugin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Thumbnail / Preview Image URL</label>
                <input
                  type="text"
                  placeholder="https://example.com/image.png"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Key features, tech stack, and documentation notes..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow-sm"
                >
                  {submitting ? 'Uploading...' : 'Publish Software'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}