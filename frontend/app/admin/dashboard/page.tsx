// frontend/app/admin/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import API from '../../../services/api';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ShieldAlert, 
  LayoutDashboard,
  Check,
  X
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'stats' | 'products' | 'users'>('stats');
  const [products, setProducts] = useState<any[]>([]);
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingShopId, setApprovingShopId] = useState<string | null>(null);

  // Stats Counters
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalSales: 0,
    platformCommission: 0,
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, productsRes, shopsRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/products'),
        API.get('/admin/pending-shops'),
      ]);

      if (statsRes.data.success) {
        setStats({
          totalUsers: statsRes.data.stats.totalUsers || 0,
          totalVendors: statsRes.data.stats.totalVendors || 0,
          totalSales: statsRes.data.stats.totalSales || 0,
          platformCommission: statsRes.data.stats.platformCommission || 0,
        });
      }

      if (productsRes.data.success) {
        setProducts(productsRes.data.products || []);
      }

      if (shopsRes.data.success) {
        setShops(shopsRes.data.shops || []);
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatCardClick = (targetTab: 'stats' | 'products' | 'users') => {
    setActiveTab(targetTab);
  };

  const handleApproveShop = async (shopId: string) => {
    try {
      setApprovingShopId(shopId);
      await API.patch(`/admin/shop-status/${shopId}`, { status: 'APPROVED' });
      await fetchAdminData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to approve shop.');
    } finally {
      setApprovingShopId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
              <LayoutDashboard className="w-7 h-7 text-amber-500" />
              Super Admin Control Panel
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage software approvals, verified vendors, commission rates, and system overview.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
                activeTab === 'stats' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
                activeTab === 'products' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Product Approvals
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
                activeTab === 'users' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Vendor Approvals
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <button
            type="button"
            onClick={() => handleStatCardClick('products')}
            className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 text-left hover:border-indigo-200 hover:shadow-md transition cursor-pointer"
          >
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Platform Earnings (20%)</p>
              <h3 className="text-xl font-bold text-gray-900">৳{Number(stats.platformCommission || 0).toLocaleString()}</h3>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleStatCardClick('products')}
            className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 text-left hover:border-emerald-200 hover:shadow-md transition cursor-pointer"
          >
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Total Software Sales</p>
              <h3 className="text-xl font-bold text-gray-900">৳{Number(stats.totalSales || 0).toLocaleString()}</h3>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleStatCardClick('users')}
            className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 text-left hover:border-amber-200 hover:shadow-md transition cursor-pointer"
          >
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Verified Vendors</p>
              <h3 className="text-xl font-bold text-gray-900">{stats.totalVendors}</h3>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleStatCardClick('users')}
            className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 text-left hover:border-purple-200 hover:shadow-md transition cursor-pointer"
          >
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Total Registered Users</p>
              <h3 className="text-xl font-bold text-gray-900">{stats.totalUsers}</h3>
            </div>
          </button>
        </div>

        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Pending Vendor Shops</h2>
              <span className="text-xs font-semibold bg-amber-50 text-amber-700 px-3 py-1 rounded-full">
                {shops.length} Requests
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-gray-400">Loading vendor requests...</div>
            ) : shops.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3.5">Vendor</th>
                      <th className="px-6 py-3.5">Shop</th>
                      <th className="px-6 py-3.5">Email</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {shops.map((shop) => (
                      <tr key={shop._id} className="hover:bg-gray-50/80 transition">
                        <td className="px-6 py-4 font-semibold text-gray-900">{shop.userId?.name || 'Vendor'}</td>
                        <td className="px-6 py-4">{shop.shopName}</td>
                        <td className="px-6 py-4">{shop.userId?.email || '-'}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">
                            <Clock className="w-3.5 h-3.5" /> Pending
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleApproveShop(shop._id)}
                            disabled={approvingShopId === shop._id}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-semibold rounded-lg transition shadow-sm"
                          >
                            {approvingShopId === shop._id ? 'Approving...' : 'Approve'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-gray-400">No pending vendor requests right now.</div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Submitted Software & Scripts</h2>
              <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
                {products.length} Products
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-gray-400">Loading products...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3.5">Software Title</th>
                      <th className="px-6 py-3.5">Category</th>
                      <th className="px-6 py-3.5">Price</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50/80 transition">
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          {item.title || item.name}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md font-medium">
                            {item.category || 'Script'}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-indigo-600">৳{item.price}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full">
                            <CheckCircle className="w-3.5 h-3.5" /> Published
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition shadow-sm">
                            Approve
                          </button>
                          <button className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition">
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}