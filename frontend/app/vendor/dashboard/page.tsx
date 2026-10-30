// frontend/app/vendor/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import API from '../../../services/api';
import { 
  PlusCircle, 
  ShoppingBag, 
  DollarSign, 
  Code2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ExternalLink,
  Edit3,
  Trash2,
  RefreshCw,
  Phone,
  Mail,
  UserCheck,
  TrendingUp,
  FileCode,
  Sparkles,
  Layers,
  Video,
  X
} from 'lucide-react';
import Link from 'next/link';

interface TechnicalInfo {
  framework?: string;
  language?: string;
  database?: string;
  version?: string;
  compatibility?: string;
}

interface VendorProduct {
  _id: string;
  title: string;
  description: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number;
  category: string;
  images?: string[];
  image?: string;
  demoVideo?: string;
  liveDemoUrl?: string;
  adminDemoUrl?: string;
  technicalInfo?: TechnicalInfo;
  features?: string[];
  downloadUrl?: string;
  githubRepoUrl?: string;
  documentationUrl?: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'CHANGES_REQUESTED' | 'REJECTED' | 'SUSPENDED';
  adminFeedback?: string;
  createdAt: string;
}

interface VendorOrderItem {
  productId: string;
  shopId: string;
  title: string;
  price: number;
  quantity: number;
}

interface VendorOrder {
  orderId: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  shippingAddress?: {
    address?: string;
    city?: string;
    phone?: string;
  };
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  items: VendorOrderItem[];
  orderRevenue: number;
}

export default function VendorDashboard() {
  const [activeMainTab, setActiveMainTab] = useState<'products' | 'orders'>('products');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<VendorProduct | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [modalTab, setModalTab] = useState<'general' | 'technical' | 'media' | 'delivery'>('general');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    price: '',
    comparePrice: '',
    category: 'Web Application',
    images: '',
    image: '',
    demoVideo: '',
    liveDemoUrl: '',
    adminDemoUrl: '',
    framework: '',
    language: '',
    database: '',
    version: '1.0.0',
    compatibility: '',
    features: '',
    downloadUrl: '',
    githubRepoUrl: '',
    documentationUrl: '',
  });

  const fetchVendorData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        API.get('/products/my-products'),
        API.get('/orders/vendor-orders').catch(() => ({ data: { success: false, orders: [], totalEarnings: 0 } }))
      ]);

      if (productsRes.data.success) {
        setProducts(productsRes.data.products || []);
      }

      if (ordersRes.data?.success) {
        setOrders(ordersRes.data.orders || []);
        setTotalEarnings(ordersRes.data.totalEarnings || 0);
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      console.error('Failed to fetch vendor data:', error);
      alert(err.response?.data?.message || 'Failed to load vendor data. Please verify session.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const init = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          API.get('/products/my-products'),
          API.get('/orders/vendor-orders').catch(() => ({ data: { success: false, orders: [], totalEarnings: 0 } }))
        ]);

        if (!ignore) {
          if (productsRes.data.success) {
            setProducts(productsRes.data.products || []);
          }
          if (ordersRes.data?.success) {
            setOrders(ordersRes.data.orders || []);
            setTotalEarnings(ordersRes.data.totalEarnings || 0);
          }
        }
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        if (!ignore) {
          console.error('Failed to fetch vendor data:', error);
          alert(err.response?.data?.message || 'Failed to load vendor data.');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    init();
    return () => {
      ignore = true;
    };
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      shortDescription: '',
      description: '',
      price: '',
      comparePrice: '',
      category: 'Web Application',
      images: '',
      image: '',
      demoVideo: '',
      liveDemoUrl: '',
      adminDemoUrl: '',
      framework: 'Next.js 16',
      language: 'TypeScript',
      database: 'MongoDB',
      version: '1.0.0',
      compatibility: 'Node 20+',
      features: 'Full Source Code, Responsive Design, Documentation Included',
      downloadUrl: '',
      githubRepoUrl: '',
      documentationUrl: '',
    });
    setModalTab('general');
    setShowModal(true);
  };

  const openEditModal = (product: VendorProduct) => {
    setEditingProduct(product);
    setFormData({
      title: product.title || '',
      shortDescription: product.shortDescription || '',
      description: product.description || '',
      price: String(product.price || ''),
      comparePrice: product.comparePrice ? String(product.comparePrice) : '',
      category: product.category || 'Web Application',
      images: product.images ? product.images.join(', ') : '',
      image: product.image || (product.images && product.images[0]) || '',
      demoVideo: product.demoVideo || '',
      liveDemoUrl: product.liveDemoUrl || '',
      adminDemoUrl: product.adminDemoUrl || '',
      framework: product.technicalInfo?.framework || '',
      language: product.technicalInfo?.language || '',
      database: product.technicalInfo?.database || '',
      version: product.technicalInfo?.version || '1.0.0',
      compatibility: product.technicalInfo?.compatibility || '',
      features: product.features ? product.features.join(', ') : '',
      downloadUrl: product.downloadUrl || '',
      githubRepoUrl: product.githubRepoUrl || '',
      documentationUrl: product.documentationUrl || '',
    });
    setModalTab('general');
    setShowModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const imagesArray = formData.images
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      if (formData.image && !imagesArray.includes(formData.image.trim())) {
        imagesArray.unshift(formData.image.trim());
      }

      const featuresArray = formData.features
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        title: formData.title,
        shortDescription: formData.shortDescription,
        description: formData.description,
        price: Number(formData.price),
        comparePrice: formData.comparePrice ? Number(formData.comparePrice) : 0,
        category: formData.category,
        images: imagesArray.length > 0 ? imagesArray : ['https://images.unsplash.com/photo-1555066931-4365d14bab8c'],
        demoVideo: formData.demoVideo,
        liveDemoUrl: formData.liveDemoUrl,
        adminDemoUrl: formData.adminDemoUrl,
        technicalInfo: {
          framework: formData.framework,
          language: formData.language,
          database: formData.database,
          version: formData.version,
          compatibility: formData.compatibility,
        },
        features: featuresArray,
        downloadUrl: formData.downloadUrl,
        githubRepoUrl: formData.githubRepoUrl,
        documentationUrl: formData.documentationUrl,
        resubmitForApproval: editingProduct ? true : undefined,
      };

      if (editingProduct) {
        await API.put(`/products/${editingProduct._id}`, payload);
        alert('🎉 Software updated & resubmitted for admin approval!');
      } else {
        await API.post('/products', payload);
        alert('🎉 Software submitted! Our Admin team will review and publish your software shortly.');
      }

      setShowModal(false);
      fetchVendorData();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || 'Failed to submit software.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this software listing?');
    if (!confirmed) return;

    try {
      await API.delete(`/products/${productId}`);
      await fetchVendorData();
      alert('Software listing deleted.');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || 'Failed to delete software.');
    }
  };

  // Filter products by status
  const filteredProducts = products.filter((p) => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'APPROVED') return p.status === 'APPROVED';
    if (statusFilter === 'PENDING') return p.status === 'PENDING_APPROVAL';
    if (statusFilter === 'REVISION') return p.status === 'CHANGES_REQUESTED';
    return true;
  });

  const approvedCount = products.filter((p) => p.status === 'APPROVED').length;
  const pendingCount = products.filter((p) => p.status === 'PENDING_APPROVAL').length;
  const revisionCount = products.filter((p) => p.status === 'CHANGES_REQUESTED').length;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Code2 className="w-6 h-6" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Software Author Portal
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Submit your software products, monitor the admin verification pipeline, and review client earnings.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={openAddModal}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-3 rounded-2xl transition shadow-md text-xs sm:text-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Upload New Software
            </button>
          </div>
        </div>

        {/* Real-time Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Net Sales Revenue</p>
              <h3 className="text-xl font-extrabold text-gray-900">৳{totalEarnings.toLocaleString()}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Live in Marketplace</p>
              <h3 className="text-xl font-extrabold text-gray-900">{approvedCount} Apps</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Under Admin Review</p>
              <h3 className="text-xl font-extrabold text-gray-900">{pendingCount} Items</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer Orders</p>
              <h3 className="text-xl font-extrabold text-gray-900">{orders.length} Sold</h3>
            </div>
          </div>
        </div>

        {/* Main Tab Bar */}
        <div className="flex border-b border-gray-200 gap-6">
          <button
            onClick={() => setActiveMainTab('products')}
            className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
              activeMainTab === 'products'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            My Uploaded Software ({products.length})
          </button>

          <button
            onClick={() => setActiveMainTab('orders')}
            className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
              activeMainTab === 'orders'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Client Orders ({orders.length})
          </button>
        </div>

        {/* TAB 1: SOFTWARE PRODUCTS & MODERATION LIFECYCLE */}
        {activeMainTab === 'products' && (
          <div className="space-y-6">
            
            {/* Status Filter Badges */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs font-bold text-gray-500 uppercase mr-1">Filter:</span>
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  statusFilter === 'ALL'
                    ? 'bg-gray-900 text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                All Software ({products.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('APPROVED')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  statusFilter === 'APPROVED'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Live ({approvedCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('PENDING')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  statusFilter === 'PENDING'
                    ? 'bg-amber-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Under Review ({pendingCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('REVISION')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  statusFilter === 'REVISION'
                    ? 'bg-red-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Revision Needed ({revisionCount})
              </button>
            </div>

            {loading ? (
              <div className="py-20 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-4 shadow-sm">
                <FileCode className="w-12 h-12 text-gray-300 mx-auto" />
                <h3 className="text-lg font-bold text-gray-800">No software found</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Click &quot;Upload New Software&quot; above to submit your first software application or tool for verification.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((p) => {
                  const previewImg = (p.images && p.images[0]) || p.image;

                  return (
                    <div
                      key={p._id}
                      className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
                    >
                      <div>
                        {/* Thumbnail & Status Badge */}
                        <div className="relative h-44 bg-gray-100 overflow-hidden">
                          {previewImg ? (
                            <img src={previewImg} alt={p.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Code2 className="w-8 h-8 text-gray-300" />
                            </div>
                          )}

                          {/* Approval Status Badge */}
                          <div className="absolute top-3 left-3">
                            {p.status === 'APPROVED' && (
                              <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                <CheckCircle2 className="w-3 h-3" /> Live on Marketplace
                              </span>
                            )}
                            {p.status === 'PENDING_APPROVAL' && (
                              <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                <Clock className="w-3 h-3" /> Under Admin Review
                              </span>
                            )}
                            {p.status === 'CHANGES_REQUESTED' && (
                              <span className="inline-flex items-center gap-1 bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm animate-pulse">
                                <AlertCircle className="w-3 h-3" /> Revision Required
                              </span>
                            )}
                          </div>

                          <span className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                            {p.category}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="p-5 space-y-3">
                          <h3 className="font-extrabold text-gray-900 text-base line-clamp-1">{p.title}</h3>
                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                            {p.shortDescription || p.description}
                          </p>

                          {/* Tech Stack Pills */}
                          {p.technicalInfo && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {p.technicalInfo.framework && (
                                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-semibold">
                                  {p.technicalInfo.framework}
                                </span>
                              )}
                              {p.technicalInfo.language && (
                                <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md font-semibold">
                                  {p.technicalInfo.language}
                                </span>
                              )}
                              {p.technicalInfo.version && (
                                <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md font-mono">
                                  v{p.technicalInfo.version}
                                </span>
                              )}
                            </div>
                          )}

                          {/* PROMINENT ADMIN FEEDBACK BANNER (If Changes Requested) */}
                          {p.status === 'CHANGES_REQUESTED' && (
                            <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 space-y-1.5 text-xs">
                              <p className="font-bold text-red-900 flex items-center gap-1.5">
                                <AlertCircle className="w-4 h-4 text-red-600" />
                                Admin Review Message:
                              </p>
                              <p className="text-red-700 text-[11px] leading-relaxed">
                                {p.adminFeedback || 'Admin noted issues. Please review your software details, update them, and resubmit.'}
                              </p>
                              <button
                                type="button"
                                onClick={() => openEditModal(p)}
                                className="mt-2 w-full py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-[11px] transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <RefreshCw className="w-3 h-3" /> Fix Issues & Resubmit for Approval
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Footer: Price & Actions */}
                      <div className="p-5 pt-0 border-t border-gray-100 flex items-center justify-between mt-3 pt-3">
                        <div>
                          <span className="text-lg font-extrabold text-indigo-600">৳{p.price.toLocaleString()}</span>
                          {p.comparePrice && p.comparePrice > p.price && (
                            <span className="ml-1.5 text-xs text-gray-400 line-through">
                              ৳{p.comparePrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(p)}
                            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
                            title="Edit Software"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p._id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                            title="Delete Software"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CLIENT ORDERS RECEIVED */}
        {activeMainTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Purchases of Your Software</h2>
                <p className="text-xs text-gray-500">Customer details, contact phone numbers, and revenue earned</p>
              </div>
              <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
                {orders.length} Total Sales
              </span>
            </div>

            {loading ? (
              <div className="py-20 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="py-16 text-center text-gray-400 text-xs">
                No orders placed for your software yet. Once customers order, they will appear here.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">Software Package</th>
                      <th className="px-6 py-4">Buyer Info</th>
                      <th className="px-6 py-4">Delivery Phone</th>
                      <th className="px-6 py-4">Your Revenue</th>
                      <th className="px-6 py-4">Payment</th>
                      <th className="px-6 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((o) => (
                      <tr key={o.orderId} className="hover:bg-gray-50/70 transition">
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          {o.items.map((i) => i.title).join(', ')}
                          <div className="text-xs text-gray-400 font-normal">
                            Qty: {o.items.reduce((acc, i) => acc + i.quantity, 0)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 font-medium text-gray-900 text-xs">
                            <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                            {o.customer?.name || 'Customer'}
                          </div>
                          <div className="text-[11px] text-gray-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {o.customer?.email || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-gray-800">
                          <div className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            {o.shippingAddress?.phone || o.customer?.phone || '-'}
                          </div>
                          <div className="text-[11px] text-gray-400 font-sans">
                            {o.shippingAddress?.city || 'Dhaka'}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-indigo-600">
                          ৳{(o.orderRevenue || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                            o.paymentStatus === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            <Clock className="w-3 h-3" /> {o.paymentStatus || 'PENDING'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-400">
                          {new Date(o.createdAt).toLocaleDateString()}
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

      {/* RICH SOFTWARE UPLOAD & EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {editingProduct ? 'Edit Software & Resubmit' : 'Upload New Software Product'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Provide complete technical information, live demo links, and media previews.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Internal Navigation */}
            <div className="flex border-b border-gray-100 gap-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => setModalTab('general')}
                className={`pb-2 transition ${
                  modalTab === 'general' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                1. General Info
              </button>
              <button
                type="button"
                onClick={() => setModalTab('technical')}
                className={`pb-2 transition ${
                  modalTab === 'technical' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                2. Tech Architecture
              </button>
              <button
                type="button"
                onClick={() => setModalTab('media')}
                className={`pb-2 transition ${
                  modalTab === 'media' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                3. Screenshots & Demo
              </button>
              <button
                type="button"
                onClick={() => setModalTab('delivery')}
                className={`pb-2 transition ${
                  modalTab === 'delivery' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                4. Features & Assets
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              
              {/* SUB-SECTION 1: GENERAL */}
              {modalTab === 'general' && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                      Software Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ChatOps Multi-Cloud Infrastructure Manager"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Price (৳ BDT) *</label>
                      <input
                        type="number"
                        required
                        placeholder="2500"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Compare Price (৳)</label>
                      <input
                        type="number"
                        placeholder="3500"
                        value={formData.comparePrice}
                        onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                        className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                      >
                        <option value="Web Application">Web Application</option>
                        <option value="SaaS Platform">SaaS Platform</option>
                        <option value="PHP Script">PHP Script</option>
                        <option value="Mobile App">Mobile App</option>
                        <option value="WordPress Plugin">WordPress Plugin</option>
                        <option value="Developer Tool">Developer Tool</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                      Short Description (Summary)
                    </label>
                    <input
                      type="text"
                      placeholder="One-liner explaining the core value of this software..."
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                      Full Description & Technical Overview *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Detailed architecture description, installation prerequisites, and setup instructions..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* SUB-SECTION 2: TECHNICAL */}
              {modalTab === 'technical' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Framework</label>
                      <input
                        type="text"
                        placeholder="e.g. Next.js 16, Laravel 11, Flutter 3"
                        value={formData.framework}
                        onChange={(e) => setFormData({ ...formData, framework: e.target.value })}
                        className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Programming Language</label>
                      <input
                        type="text"
                        placeholder="e.g. TypeScript, PHP 8.2, Dart"
                        value={formData.language}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                        className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Database</label>
                      <input
                        type="text"
                        placeholder="e.g. PostgreSQL, MongoDB, MySQL"
                        value={formData.database}
                        onChange={(e) => setFormData({ ...formData, database: e.target.value })}
                        className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Version Release</label>
                      <input
                        type="text"
                        placeholder="1.0.0"
                        value={formData.version}
                        onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                        className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Environment Compatibility</label>
                      <input
                        type="text"
                        placeholder="Node 20+, Docker Ready"
                        value={formData.compatibility}
                        onChange={(e) => setFormData({ ...formData, compatibility: e.target.value })}
                        className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-SECTION 3: MEDIA & DEMOS */}
              {modalTab === 'media' && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                      Main Thumbnail Image URL *
                    </label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/... or uploaded image URL"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                      Screenshots Gallery URLs (Comma-separated)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="https://example.com/shot1.png, https://example.com/shot2.png"
                      value={formData.images}
                      onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                        Live Working Demo URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://demo.mysoftware.com"
                        value={formData.liveDemoUrl}
                        onChange={(e) => setFormData({ ...formData, liveDemoUrl: e.target.value })}
                        className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                        Demo Video URL (YouTube / Vimeo / MP4)
                      </label>
                      <input
                        type="text"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={formData.demoVideo}
                        onChange={(e) => setFormData({ ...formData, demoVideo: e.target.value })}
                        className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-SECTION 4: FEATURES & DELIVERABLES */}
              {modalTab === 'delivery' && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                      Key Features (Comma-separated bullet points)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Role-based Authentication, Stripe Payment Integration, Dark Mode Theme, Docker Compose Setup"
                      value={formData.features}
                      onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                        Download Link / Storage URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://storage.mycloud.com/package.zip"
                        value={formData.downloadUrl}
                        onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                        className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                        Private GitHub Repo URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://github.com/myteam/project"
                        value={formData.githubRepoUrl}
                        onChange={(e) => setFormData({ ...formData, githubRepoUrl: e.target.value })}
                        className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                        Documentation Link
                      </label>
                      <input
                        type="text"
                        placeholder="https://docs.mysoftware.com"
                        value={formData.documentationUrl}
                        onChange={(e) => setFormData({ ...formData, documentationUrl: e.target.value })}
                        className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex gap-2 text-xs">
                  {modalTab !== 'general' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (modalTab === 'delivery') setModalTab('media');
                        else if (modalTab === 'media') setModalTab('technical');
                        else if (modalTab === 'technical') setModalTab('general');
                      }}
                      className="px-3 py-2 text-gray-600 bg-gray-100 rounded-xl font-semibold"
                    >
                      ← Previous
                    </button>
                  )}
                  {modalTab !== 'delivery' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (modalTab === 'general') setModalTab('technical');
                        else if (modalTab === 'technical') setModalTab('media');
                        else if (modalTab === 'media') setModalTab('delivery');
                      }}
                      className="px-3 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl font-semibold"
                    >
                      Next Step →
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl transition shadow-md cursor-pointer"
                  >
                    {submitting
                      ? 'Submitting to Admin...'
                      : editingProduct
                      ? 'Update & Resubmit for Approval'
                      : 'Submit for Admin Approval'}
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
