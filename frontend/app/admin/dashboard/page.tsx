// frontend/app/admin/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import API from '../../../services/api';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  LayoutDashboard,
  Check,
  X,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  Trash2,
  Store,
  Layers,
  Code2,
  Eye,
  Search,
  Building2,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Package
} from 'lucide-react';
import Link from 'next/link';

interface AdminStats {
  totalUsers: number;
  totalVendors: number;
  totalSales: number;
  platformCommission: number;
  totalOrders?: number;
  pendingProductsCount?: number;
  pendingShopsCount?: number;
}

interface ProductItem {
  _id: string;
  title: string;
  name?: string;
  description?: string;
  price: number;
  stock?: number;
  category: string;
  status: string;
  liveDemoUrl?: string;
  demoVideo?: string;
  images?: string[];
  image?: string;
  technicalInfo?: {
    framework?: string;
    language?: string;
    database?: string;
    version?: string;
    compatibility?: string;
  };
  shopId?: {
    _id?: string;
    shopName?: string;
    slug?: string;
    userId?: {
      name?: string;
      email?: string;
      phone?: string;
    };
  };
  createdAt?: string;
}

interface PendingShop {
  _id: string;
  shopName: string;
  userId?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

interface UserItem {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  createdAt: string;
}

interface VendorItem {
  _id: string;
  shopName: string;
  slug: string;
  logo?: string;
  banner?: string;
  description?: string;
  commissionRate: number;
  status: 'PENDING' | 'APPROVED' | 'SUSPENDED' | 'REJECTED';
  bankAccount?: string;
  mobilePayment?: string;
  createdAt: string;
  userId?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    createdAt: string;
  };
  stats?: {
    totalProducts: number;
    approvedProducts: number;
    pendingProducts: number;
  };
}

interface VendorDetailsModalData {
  _id: string;
  shopName: string;
  slug: string;
  logo?: string;
  banner?: string;
  description?: string;
  commissionRate: number;
  status: 'PENDING' | 'APPROVED' | 'SUSPENDED' | 'REJECTED';
  bankAccount?: string;
  mobilePayment?: string;
  createdAt: string;
  userId?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    createdAt: string;
  };
  productsCount: number;
  products: ProductItem[];
  ordersCount: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'pendingProducts' | 'vendors' | 'liveProducts' | 'pendingShops' | 'users'>('pendingProducts');
  
  const [pendingProducts, setPendingProducts] = useState<ProductItem[]>([]);
  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [liveProducts, setLiveProducts] = useState<ProductItem[]>([]);
  const [shops, setShops] = useState<PendingShop[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Vendor Details Modal state
  const [selectedVendorDetails, setSelectedVendorDetails] = useState<VendorDetailsModalData | null>(null);
  const [loadingVendorDetails, setLoadingVendorDetails] = useState(false);
  const [vendorSearch, setVendorSearch] = useState('');

  // Stats Counters
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalVendors: 0,
    totalSales: 0,
    platformCommission: 0,
    pendingProductsCount: 0,
    pendingShopsCount: 0,
  });

  // Action States
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [inspectProduct, setInspectProduct] = useState<ProductItem | null>(null);
  
  // Feedback Modal
  const [feedbackProduct, setFeedbackProduct] = useState<ProductItem | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const fetchAdminData = async () => {
    try {
      const [statsRes, pendingProdRes, vendorsRes, liveProdRes, shopsRes, usersRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/pending-products').catch(() => ({ data: { success: false, products: [] } })),
        API.get('/admin/vendors').catch(() => ({ data: { success: false, vendors: [] } })),
        API.get('/products'),
        API.get('/admin/pending-shops'),
        API.get('/admin/users').catch(() => ({ data: { success: false, users: [] } })),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats || {});
      }
      if (pendingProdRes.data?.success) {
        setPendingProducts(pendingProdRes.data.products || []);
      }
      if (vendorsRes.data?.success) {
        setVendors(vendorsRes.data.vendors || []);
      }
      if (liveProdRes.data?.success) {
        setLiveProducts(liveProdRes.data.products || []);
      }
      if (shopsRes.data?.success) {
        setShops(shopsRes.data.shops || []);
      }
      if (usersRes.data?.success) {
        setUsers(usersRes.data.users || []);
      }
    } catch (error: unknown) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const init = async () => {
      try {
        const [statsRes, pendingProdRes, vendorsRes, liveProdRes, shopsRes, usersRes] = await Promise.all([
          API.get('/admin/stats'),
          API.get('/admin/pending-products').catch(() => ({ data: { success: false, products: [] } })),
          API.get('/admin/vendors').catch(() => ({ data: { success: false, vendors: [] } })),
          API.get('/products'),
          API.get('/admin/pending-shops'),
          API.get('/admin/users').catch(() => ({ data: { success: false, users: [] } })),
        ]);

        if (!ignore) {
          if (statsRes.data.success) setStats(statsRes.data.stats || {});
          if (pendingProdRes.data?.success) setPendingProducts(pendingProdRes.data.products || []);
          if (vendorsRes.data?.success) setVendors(vendorsRes.data.vendors || []);
          if (liveProdRes.data?.success) setLiveProducts(liveProdRes.data.products || []);
          if (shopsRes.data?.success) setShops(shopsRes.data.shops || []);
          if (usersRes.data?.success) setUsers(usersRes.data.users || []);
        }
      } catch (error) {
        if (!ignore) console.error('Failed to init admin dashboard:', error);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    init();
    return () => {
      ignore = true;
    };
  }, []);

  // View Vendor Details and their products
  const handleViewVendorDetails = async (shopId: string) => {
    try {
      setLoadingVendorDetails(true);
      const res = await API.get(`/admin/vendors/${shopId}`);
      if (res.data.success) {
        setSelectedVendorDetails(res.data.vendor);
      }
    } catch (error) {
      console.error('Failed to load vendor details:', error);
      alert('Failed to load vendor details.');
    } finally {
      setLoadingVendorDetails(false);
    }
  };

  // Toggle Vendor Account Status (Suspend / Activate)
  const handleToggleVendorStatus = async (shopId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'APPROVED' ? 'SUSPENDED' : 'APPROVED';
    if (!window.confirm(`Are you sure you want to change this vendor status to ${newStatus}?`)) return;

    try {
      setActionLoadingId(shopId);
      const res = await API.patch(`/admin/shop-status/${shopId}`, { status: newStatus });
      if (res.data.success) {
        await fetchAdminData();
        if (selectedVendorDetails && selectedVendorDetails._id === shopId) {
          setSelectedVendorDetails(prev => prev ? { ...prev, status: newStatus as 'APPROVED' | 'SUSPENDED' } : null);
        }
        alert(`Vendor status updated to ${newStatus}`);
      }
    } catch (error) {
      alert('Failed to update vendor status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Approve Product
  const handleApproveProduct = async (productId: string) => {
    try {
      setActionLoadingId(productId);
      const res = await API.patch(`/admin/product-status/${productId}`, { status: 'APPROVED' });
      if (res.data.success) {
        alert('🎉 Software approved and published to the marketplace!');
        setInspectProduct(null);
        if (selectedVendorDetails) {
          setSelectedVendorDetails(prev => prev ? {
            ...prev,
            products: prev.products.map(p => p._id === productId ? { ...p, status: 'APPROVED' } : p)
          } : null);
        }
        await fetchAdminData();
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || 'Failed to approve product.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Submit Feedback / Request Changes
  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackProduct) return;

    try {
      setActionLoadingId(feedbackProduct._id);
      const res = await API.patch(`/admin/product-status/${feedbackProduct._id}`, {
        status: 'CHANGES_REQUESTED',
        adminFeedback: feedbackMessage,
      });

      if (res.data.success) {
        alert('⚠️ Issues message sent to the vendor! They will receive a notification.');
        setFeedbackProduct(null);
        setFeedbackMessage('');
        setInspectProduct(null);
        if (selectedVendorDetails) {
          setSelectedVendorDetails(prev => prev ? {
            ...prev,
            products: prev.products.map(p => p._id === feedbackProduct._id ? { ...p, status: 'CHANGES_REQUESTED' } : p)
          } : null);
        }
        await fetchAdminData();
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || 'Failed to submit feedback.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Reject Product
  const handleRejectProduct = async (productId: string) => {
    const reason = window.prompt('Please enter the rejection reason:');
    if (reason === null) return;

    try {
      setActionLoadingId(productId);
      await API.patch(`/admin/product-status/${productId}`, {
        status: 'REJECTED',
        adminFeedback: reason || 'Does not meet marketplace quality guidelines.',
      });
      alert('Product rejected.');
      setInspectProduct(null);
      if (selectedVendorDetails) {
        setSelectedVendorDetails(prev => prev ? {
          ...prev,
          products: prev.products.map(p => p._id === productId ? { ...p, status: 'REJECTED' } : p)
        } : null);
      }
      await fetchAdminData();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || 'Failed to reject product.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Approve Shop
  const handleApproveShop = async (shopId: string) => {
    try {
      setActionLoadingId(shopId);
      await API.patch(`/admin/shop-status/${shopId}`, { status: 'APPROVED' });
      await fetchAdminData();
      alert('Vendor shop approved successfully!');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || 'Failed to approve shop.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this software listing permanently?');
    if (!confirmed) return;

    try {
      setActionLoadingId(productId);
      await API.delete(`/products/${productId}`);
      setInspectProduct(null);
      if (selectedVendorDetails) {
        setSelectedVendorDetails(prev => prev ? {
          ...prev,
          products: prev.products.filter(p => p._id !== productId),
          productsCount: Math.max(0, prev.productsCount - 1)
        } : null);
      }
      await fetchAdminData();
      alert('Software listing deleted permanently.');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || 'Failed to delete product.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
              <LayoutDashboard className="w-7 h-7 text-amber-500" />
              Super Admin Control Center
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Verify submitted software packages, inspect vendor profiles and their products, and manage platform operations.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" /> High Privilege Terminal
            </span>
          </div>
        </div>

        {/* Global Platform Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Platform Earnings (20%)</p>
              <h3 className="text-xl font-extrabold text-gray-900">৳{Number(stats.platformCommission || 0).toLocaleString()}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gross Software Volume</p>
              <h3 className="text-xl font-extrabold text-gray-900">৳{Number(stats.totalSales || 0).toLocaleString()}</h3>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('pendingProducts')}
            className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 cursor-pointer hover:border-amber-300 transition"
          >
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Software Reviews Waiting</p>
              <h3 className="text-xl font-extrabold text-amber-600">{pendingProducts.length} Apps</h3>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('vendors')}
            className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 cursor-pointer hover:border-purple-300 transition"
          >
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Registered Vendors</p>
              <h3 className="text-xl font-extrabold text-purple-600">{vendors.length} Vendors</h3>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-200 gap-6 text-sm font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('pendingProducts')}
            className={`pb-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'pendingProducts'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            Software Review Queue ({pendingProducts.length})
          </button>

          <button
            onClick={() => setActiveTab('vendors')}
            className={`pb-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'vendors'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Store className="w-4 h-4" />
            Software Vendors & Their Products ({vendors.length})
          </button>

          <button
            onClick={() => setActiveTab('liveProducts')}
            className={`pb-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'liveProducts'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Live Marketplace Catalog ({liveProducts.length})
          </button>

          <button
            onClick={() => setActiveTab('pendingShops')}
            className={`pb-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'pendingShops'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            Shop Applications ({shops.length})
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'users'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Users className="w-4 h-4" />
            Registered Users ({users.length})
          </button>
        </div>

        {/* TAB 1: SOFTWARE REVIEW QUEUE */}
        {activeTab === 'pendingProducts' && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden space-y-4">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Software Awaiting Admin Verification</h2>
                <p className="text-xs text-gray-500">
                  Inspect the software code, demo site, and technical info before making it live to customers.
                </p>
              </div>
              <span className="text-xs font-bold bg-amber-50 text-amber-700 px-3 py-1 rounded-full">
                {pendingProducts.length} Submissions
              </span>
            </div>

            {loading ? (
              <div className="py-20 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500 mx-auto"></div>
              </div>
            ) : pendingProducts.length === 0 ? (
              <div className="p-16 text-center text-gray-400 text-xs">
                All submitted software has been reviewed! No pending requests right now.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">Software Title</th>
                      <th className="px-6 py-4">Vendor Shop</th>
                      <th className="px-6 py-4">Tech Stack</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Demo Links</th>
                      <th className="px-6 py-4 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pendingProducts.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50/70 transition">
                        <td className="px-6 py-4 font-bold text-gray-900">
                          {item.title}
                          <div className="text-xs text-indigo-600 font-semibold">{item.category}</div>
                        </td>
                        <td className="px-6 py-4 text-xs">
                          <span className="font-semibold text-gray-800">{item.shopId?.shopName || 'Vendor'}</span>
                          <div className="text-gray-400 font-mono text-[11px]">{item.shopId?.userId?.email || '-'}</div>
                        </td>
                        <td className="px-6 py-4 text-xs">
                          {item.technicalInfo?.framework ? (
                            <span className="bg-gray-100 text-gray-800 font-semibold px-2 py-0.5 rounded">
                              {item.technicalInfo.framework}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-bold text-indigo-600">৳{item.price}</td>
                        <td className="px-6 py-4 text-xs">
                          <div className="flex flex-col gap-1">
                            {item.liveDemoUrl && (
                              <a
                                href={item.liveDemoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-600 hover:underline flex items-center gap-1 font-medium"
                              >
                                <ExternalLink className="w-3 h-3" /> Live Demo
                              </a>
                            )}
                            {item.demoVideo && (
                              <a
                                href={item.demoVideo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:underline flex items-center gap-1 font-medium"
                              >
                                <ExternalLink className="w-3 h-3" /> Video Preview
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setInspectProduct(item)}
                              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition cursor-pointer"
                            >
                              Inspect
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApproveProduct(item._id)}
                              disabled={actionLoadingId === item._id}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setFeedbackProduct(item);
                                setFeedbackMessage('');
                              }}
                              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer"
                            >
                              Request Changes
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRejectProduct(item._id)}
                              disabled={actionLoadingId === item._id}
                              className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-xl transition cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SOFTWARE VENDORS & THEIR PRODUCTS */}
        {activeTab === 'vendors' && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden space-y-4">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Registered Software Vendors & Developers</h2>
                <p className="text-xs text-gray-500">
                  Inspect each vendor profile, review their contact information, and see all software products uploaded by each vendor.
                </p>
              </div>

              {/* Search Vendor */}
              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search vendor or email..."
                  value={vendorSearch}
                  onChange={(e) => setVendorSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            {loading ? (
              <div className="py-20 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 mx-auto"></div>
              </div>
            ) : vendors.length === 0 ? (
              <div className="p-16 text-center text-gray-400 text-xs">
                No vendors registered yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">Vendor Shop</th>
                      <th className="px-6 py-4">Developer / Owner</th>
                      <th className="px-6 py-4">Uploaded Software</th>
                      <th className="px-6 py-4">Shop Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {vendors
                      .filter(v => {
                        if (!vendorSearch.trim()) return true;
                        const q = vendorSearch.toLowerCase();
                        return (
                          v.shopName.toLowerCase().includes(q) ||
                          (v.userId?.name || '').toLowerCase().includes(q) ||
                          (v.userId?.email || '').toLowerCase().includes(q)
                        );
                      })
                      .map((vendor) => (
                        <tr key={vendor._id} className="hover:bg-purple-50/30 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                                {vendor.shopName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900">{vendor.shopName}</h4>
                                <span className="text-xs font-mono text-gray-400">/{vendor.slug}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs">
                            <div className="font-semibold text-gray-800">{vendor.userId?.name || 'Developer'}</div>
                            <div className="text-gray-500 flex items-center gap-1 font-mono text-[11px] mt-0.5">
                              <Mail className="w-3 h-3 text-gray-400" />
                              {vendor.userId?.email || 'No email'}
                            </div>
                            {vendor.userId?.phone && (
                              <div className="text-gray-400 flex items-center gap-1 font-mono text-[11px]">
                                <Phone className="w-3 h-3 text-gray-400" />
                                {vendor.userId.phone}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-xs">
                            <div className="flex flex-col gap-1">
                              <span className="font-bold text-gray-900">
                                {vendor.stats?.totalProducts ?? 0} Software Products
                              </span>
                              <div className="flex items-center gap-1.5 text-[10px]">
                                <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-semibold">
                                  {vendor.stats?.approvedProducts ?? 0} Live
                                </span>
                                {(vendor.stats?.pendingProducts ?? 0) > 0 && (
                                  <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-semibold">
                                    {vendor.stats?.pendingProducts} Pending
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                                vendor.status === 'APPROVED'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : vendor.status === 'SUSPENDED'
                                  ? 'bg-red-50 text-red-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {vendor.status === 'APPROVED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                              {vendor.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleViewVendorDetails(vendor._id)}
                                disabled={loadingVendorDetails}
                                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                View Details & Products
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleVendorStatus(vendor._id, vendor.status)}
                                disabled={actionLoadingId === vendor._id}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                                  vendor.status === 'APPROVED'
                                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                }`}
                              >
                                {vendor.status === 'APPROVED' ? 'Suspend' : 'Activate'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LIVE MARKETPLACE CATALOG */}
        {activeTab === 'liveProducts' && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Active Software on Marketplace</h2>
                <p className="text-xs text-gray-500">Currently visible to customers for ordering and digital delivery</p>
              </div>
              <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">
                {liveProducts.length} Active Items
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Software Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Vendor Shop</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Market Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {liveProducts.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50/70 transition">
                      <td className="px-6 py-4 font-bold text-gray-900">
                        <Link href={`/products/${p._id}`} target="_blank" className="hover:text-indigo-600 transition flex items-center gap-1.5">
                          {p.title} <ExternalLink className="w-3 h-3 text-gray-400" />
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md font-medium">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-gray-800">
                        {p.shopId?.shopName || 'Shop'}
                      </td>
                      <td className="px-6 py-4 font-bold text-indigo-600">৳{p.price.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Published
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p._id)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold transition cursor-pointer"
                        >
                          Delete Listing
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: VENDOR APPLICATIONS */}
        {activeTab === 'pendingShops' && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Pending Vendor Shop Applications</h2>
                <p className="text-xs text-gray-500">Approve developers before they can upload software</p>
              </div>
              <span className="text-xs font-bold bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
                {shops.length} Applications
              </span>
            </div>

            {shops.length === 0 ? (
              <div className="p-16 text-center text-gray-400 text-xs">
                No pending shop applications at this moment.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">Applicant</th>
                      <th className="px-6 py-4">Shop Name</th>
                      <th className="px-6 py-4">Contact Email</th>
                      <th className="px-6 py-4">Contact Phone</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {shops.map((s) => (
                      <tr key={s._id} className="hover:bg-gray-50/70 transition">
                        <td className="px-6 py-4 font-bold text-gray-900">{s.userId?.name || 'Vendor'}</td>
                        <td className="px-6 py-4 text-indigo-600 font-semibold">{s.shopName}</td>
                        <td className="px-6 py-4 text-xs font-mono">{s.userId?.email || '-'}</td>
                        <td className="px-6 py-4 text-xs font-mono">{s.userId?.phone || '-'}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleApproveShop(s._id)}
                            disabled={actionLoadingId === s._id}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer"
                          >
                            Approve Vendor
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

        {/* TAB 5: USERS DIRECTORY */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">User Directory</h2>
              <span className="text-xs font-bold bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                {users.length} Users
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Phone</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50/70 transition">
                      <td className="px-6 py-4 font-bold text-gray-900">{u.name}</td>
                      <td className="px-6 py-4 text-xs font-mono">{u.email}</td>
                      <td className="px-6 py-4 text-xs font-mono">{u.phone || '-'}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            u.role === 'ADMIN'
                              ? 'bg-amber-100 text-amber-800'
                              : u.role === 'VENDOR'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* INSPECT PRODUCT SPECS MODAL */}
      {inspectProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{inspectProduct.category}</span>
                <h3 className="text-xl font-extrabold text-gray-900 mt-0.5">{inspectProduct.title}</h3>
                <p className="text-xs text-gray-500 font-mono">ID: {inspectProduct._id}</p>
              </div>
              <button
                type="button"
                onClick={() => setInspectProduct(null)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Technical Specifications */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-indigo-600" /> Technical Architecture
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div>
                  <span className="text-[10px] text-gray-400 font-medium block">Framework</span>
                  <span className="text-xs font-bold text-gray-800">{inspectProduct.technicalInfo?.framework || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-medium block">Language</span>
                  <span className="text-xs font-bold text-gray-800">{inspectProduct.technicalInfo?.language || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-medium block">Database</span>
                  <span className="text-xs font-bold text-gray-800">{inspectProduct.technicalInfo?.database || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-medium block">Version</span>
                  <span className="text-xs font-bold text-gray-800">{inspectProduct.technicalInfo?.version || '1.0.0'}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Overview</h4>
                <p className="text-xs text-gray-700 bg-gray-50 p-4 rounded-2xl border border-gray-100 leading-relaxed whitespace-pre-line">
                  {inspectProduct.description || 'No description provided.'}
                </p>
              </div>

              {/* Demo Links */}
              <div className="flex flex-wrap gap-4 pt-2">
                {inspectProduct.liveDemoUrl && (
                  <a
                    href={inspectProduct.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold rounded-xl transition flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" /> Open Live Application Preview
                  </a>
                )}
                {inspectProduct.demoVideo && (
                  <a
                    href={inspectProduct.demoVideo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold rounded-xl transition flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" /> Watch Demo Video
                  </a>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setInspectProduct(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
              >
                Close
              </button>
              {inspectProduct.status !== 'APPROVED' && (
                <button
                  type="button"
                  onClick={() => handleApproveProduct(inspectProduct._id)}
                  disabled={actionLoadingId === inspectProduct._id}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer"
                >
                  Approve & Publish Live
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK / REQUEST CHANGES MODAL */}
      {feedbackProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl relative">
            <div className="border-b pb-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-500" />
                Request Changes from Vendor
              </h3>
              <p className="text-xs text-gray-500 font-mono mt-0.5">
                Software: {feedbackProduct.title}
              </p>
            </div>

            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Issues / Feedback Notes for Vendor *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Explain what is missing or broken (e.g. 'Live demo URL returned 404, please provide a working preview link and clean documentation.')..."
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900">
                The software status will change to <strong>CHANGES_REQUESTED</strong> and the vendor will immediately receive this message via notification to fix it and resubmit.
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setFeedbackProduct(null);
                    setFeedbackMessage('');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoadingId === feedbackProduct._id}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer"
                >
                  {actionLoadingId === feedbackProduct._id ? 'Sending Notes...' : 'Send Issues to Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VENDOR DETAILS & PRODUCTS CATALOG MODAL */}
      {selectedVendorDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100 relative max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b pb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-xl font-extrabold shadow-md">
                  {selectedVendorDetails.shopName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-extrabold text-gray-900">{selectedVendorDetails.shopName}</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        selectedVendorDetails.status === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-700'
                          : selectedVendorDetails.status === 'SUSPENDED'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {selectedVendorDetails.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">Shop ID: {selectedVendorDetails._id} &bull; Slug: /{selectedVendorDetails.slug}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVendorDetails(null)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Vendor Owner & Profile Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/70 space-y-1.5">
                <div className="flex items-center gap-1.5 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  <Users className="w-3.5 h-3.5 text-purple-600" /> Developer Profile
                </div>
                <div className="font-bold text-gray-900 text-sm">{selectedVendorDetails.userId?.name || 'Developer'}</div>
                <div className="text-gray-600 flex items-center gap-1 font-mono">
                  <Mail className="w-3 h-3 text-gray-400" /> {selectedVendorDetails.userId?.email || 'N/A'}
                </div>
                {selectedVendorDetails.userId?.phone && (
                  <div className="text-gray-600 flex items-center gap-1 font-mono">
                    <Phone className="w-3 h-3 text-gray-400" /> {selectedVendorDetails.userId.phone}
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/70 space-y-1.5">
                <div className="flex items-center gap-1.5 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  <CreditCard className="w-3.5 h-3.5 text-indigo-600" /> Payout & Banking
                </div>
                <div>Commission: <span className="font-bold text-gray-900">{selectedVendorDetails.commissionRate || 5}%</span></div>
                <div>Bank Account: <span className="font-mono text-gray-700">{selectedVendorDetails.bankAccount || 'Not configured'}</span></div>
                <div>Mobile Payment: <span className="font-mono text-gray-700">{selectedVendorDetails.mobilePayment || 'Not configured'}</span></div>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/70 space-y-1.5">
                <div className="flex items-center gap-1.5 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  <Package className="w-3.5 h-3.5 text-emerald-600" /> Activity Summary
                </div>
                <div>Uploaded Software: <span className="font-bold text-gray-900">{selectedVendorDetails.productsCount} Packages</span></div>
                <div>Orders Received: <span className="font-bold text-emerald-600">{selectedVendorDetails.ordersCount} Orders</span></div>
                <div>Member Since: <span className="text-gray-500">{new Date(selectedVendorDetails.createdAt).toLocaleDateString()}</span></div>
              </div>
            </div>

            {/* Vendor's Software Products Catalog */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">
                    Software Products Uploaded by {selectedVendorDetails.shopName} ({selectedVendorDetails.products.length})
                  </h4>
                  <p className="text-xs text-gray-500">Every software package belonging exclusively to this vendor</p>
                </div>
              </div>

              {selectedVendorDetails.products.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-xs bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  This vendor has not uploaded any software packages yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedVendorDetails.products.map((product) => (
                    <div
                      key={product._id}
                      className="p-4 rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-sm bg-white transition space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          {product.images && product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-16 h-16 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                              <Code2 className="w-6 h-6" />
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-gray-900 text-sm">{product.title}</h5>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  product.status === 'APPROVED'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : product.status === 'CHANGES_REQUESTED'
                                    ? 'bg-amber-50 text-amber-700'
                                    : 'bg-purple-50 text-purple-700'
                                }`}
                              >
                                {product.status}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{product.description || 'No description provided'}</p>
                            
                            {/* Tech Stack Chips */}
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                                {product.category}
                              </span>
                              {product.technicalInfo?.framework && (
                                <span className="text-[10px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                                  {product.technicalInfo.framework}
                                </span>
                              )}
                              {product.technicalInfo?.language && (
                                <span className="text-[10px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                                  {product.technicalInfo.language}
                                </span>
                              )}
                              {product.technicalInfo?.database && (
                                <span className="text-[10px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                                  {product.technicalInfo.database}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div className="text-base font-extrabold text-indigo-600">৳{product.price.toLocaleString()}</div>
                          <div className="text-[11px] text-gray-400">Stock: {product.stock || 9999}</div>
                        </div>
                      </div>

                      {/* Links & Quick Actions */}
                      <div className="flex flex-wrap items-center justify-between pt-2 border-t border-gray-100 gap-2 text-xs">
                        <div className="flex items-center gap-3">
                          {product.liveDemoUrl && (
                            <a
                              href={product.liveDemoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:underline flex items-center gap-1 font-semibold"
                            >
                              <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                            </a>
                          )}
                          {product.demoVideo && (
                            <a
                              href={product.demoVideo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
                            >
                              <ExternalLink className="w-3.5 h-3.5" /> Video Demo
                            </a>
                          )}
                          <Link
                            href={`/products/${product._id}`}
                            target="_blank"
                            className="text-gray-500 hover:text-gray-800 flex items-center gap-1 font-semibold"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Product Page
                          </Link>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setInspectProduct(product)}
                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition cursor-pointer"
                          >
                            Inspect Specs
                          </button>
                          {product.status !== 'APPROVED' && (
                            <button
                              type="button"
                              onClick={() => handleApproveProduct(product._id)}
                              disabled={actionLoadingId === product._id}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setFeedbackProduct(product)}
                            className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold transition cursor-pointer"
                          >
                            Request Changes
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(product._id)}
                            disabled={actionLoadingId === product._id}
                            className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedVendorDetails(null)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Close Vendor Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
