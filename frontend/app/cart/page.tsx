// frontend/app/cart/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import API from '../../services/api';
import Link from 'next/link';
import { 
  ShoppingBag, 
  ArrowLeft, 
  Download, 
  Key, 
  CheckCircle2, 
  Clock, 
  Store, 
  FileCode,
  Trash2,
  Plus,
  Minus,
  Phone,
  Building,
  MapPin,
  ShieldCheck,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface OrderItem {
  productId: {
    _id?: string;
    title?: string;
    slug?: string;
    images?: string[];
    category?: string;
  } | string;
  shopId: {
    _id?: string;
    shopName?: string;
    slug?: string;
  } | string;
  title: string;
  price: number;
  quantity: number;
}

interface CustomerOrder {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: {
    address: string;
    city: string;
    phone: string;
  };
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

export default function CartAndOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalAmount, itemCount } = useCart();
  
  const [activeTab, setActiveTab] = useState<'cart' | 'orders'>('cart');
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [selectedLicenseOrder, setSelectedLicenseOrder] = useState<CustomerOrder | null>(null);

  // Checkout address state with user autofill
  const [shippingAddress, setShippingAddress] = useState({
    address: 'Dhaka, Bangladesh',
    city: 'Dhaka',
    phone: '',
  });

  // Autofill user's phone if saved
  useEffect(() => {
    if (user?.phone) {
      setShippingAddress((prev) => ({
        ...prev,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  // Fetch past orders
  useEffect(() => {
    let ignore = false;
    const fetchOrders = async () => {
      if (!user) {
        if (!ignore) setLoadingOrders(false);
        return;
      }
      try {
        const res = await API.get('/orders/my-orders');
        if (!ignore && res.data.success) {
          setOrders(res.data.orders || []);
        }
      } catch (err) {
        if (!ignore) console.error('Failed to fetch orders:', err);
      } finally {
        if (!ignore) setLoadingOrders(false);
      }
    };

    fetchOrders();
    return () => {
      ignore = true;
    };
  }, [user]);

  const handleCartCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('Please log in to complete your checkout.');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    if (!shippingAddress.phone) {
      alert('Please enter your contact phone number.');
      return;
    }

    setOrdering(true);
    try {
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress,
      };

      const response = await API.post('/orders/create', orderData);

      if (response.data.success) {
        alert('🎉 Order placed successfully! Software licenses have been registered.');
        clearCart();
        setActiveTab('orders');
        // Refresh orders
        const res = await API.get('/orders/my-orders');
        if (res.data.success) {
          setOrders(res.data.orders || []);
        }
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setOrdering(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-indigo-600" />
            Software Cart & Digital License Center
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your selected software packages, instant checkout, and licensed downloads.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-2 rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-gray-200 gap-6">
        <button
          onClick={() => setActiveTab('cart')}
          className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'cart'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Active Cart ({itemCount})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Key className="w-4 h-4" />
          My Purchased Licenses ({orders.length})
        </button>
      </div>

      {/* TAB 1: SHOPPING CART & CHECKOUT */}
      {activeTab === 'cart' && (
        <div>
          {cartItems.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Your software cart is empty</h2>
              <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
                You haven&apos;t added any software, scripts, or SaaS tools yet. Explore verified software from top developers on our marketplace!
              </p>
              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md"
                >
                  Explore Software Catalog
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Cart Items (7 cols) */}
              <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <h2 className="text-base font-bold text-gray-900">
                    Cart Items ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                  </h2>
                  <button
                    onClick={clearCart}
                    className="text-xs text-red-600 hover:text-red-700 font-medium transition"
                  >
                    Clear All
                  </button>
                </div>

                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="py-4 first:pt-0 last:pb-0 flex gap-4 items-center">
                      {/* Thumbnail */}
                      <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <FileCode className="w-6 h-6" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-grow space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                          {item.category}
                        </span>
                        <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{item.title}</h3>
                        {item.shopName && (
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Store className="w-3 h-3 text-indigo-500" /> {item.shopName}
                          </p>
                        )}
                        <p className="text-sm font-extrabold text-indigo-600">৳{item.price.toLocaleString()}</p>
                      </div>

                      {/* Quantity & Delete */}
                      <div className="flex flex-col items-end gap-3 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.productId)}
                          className="text-gray-400 hover:text-red-600 transition"
                          title="Remove Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="p-1 hover:bg-gray-200 text-gray-600 transition"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-gray-800">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="p-1 hover:bg-gray-200 text-gray-600 transition"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Checkout & Autofill Form (5 cols) */}
              <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-gray-200 shadow-sm space-y-6">
                <div className="border-b pb-3">
                  <h2 className="text-lg font-bold text-gray-900">Order Summary & Checkout</h2>
                  <p className="text-xs text-gray-500">Instant digital code delivery upon order placement</p>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({itemCount} items)</span>
                    <span className="font-semibold text-gray-900">৳{totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Instant Digital Delivery</span>
                    <span className="font-semibold text-emerald-600 uppercase font-mono">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>License Verification Fee</span>
                    <span className="font-semibold text-emerald-600 uppercase font-mono">৳0</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-base font-extrabold text-gray-900">
                    <span>Total Amount</span>
                    <span className="text-indigo-600">৳{totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout Form with Autofilled Profile */}
                <form onSubmit={handleCartCheckout} className="space-y-3.5 pt-2">
                  {user ? (
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 uppercase mb-1">
                        Buyer Account (Auto-filled)
                      </label>
                      <input
                        type="text"
                        disabled
                        value={`${user.name} (${user.email})`}
                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 font-semibold"
                      />
                    </div>
                  ) : (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                      You are not signed in. Please{' '}
                      <Link href="/login" className="font-bold underline text-amber-900">
                        Login here
                      </Link>{' '}
                      to link your software licenses.
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 uppercase mb-1">
                      Contact Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="01700000000"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 uppercase mb-1">
                      City / Location
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 uppercase mb-1">
                      Delivery Address / Organization
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={shippingAddress.address}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={ordering || !user}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    {ordering ? 'Processing Software Order...' : `Confirm Order (৳${totalAmount.toLocaleString()})`}
                  </button>

                  <div className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1.5 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Instant license delivery to your registered email
                  </div>
                </form>
              </div>

            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY LICENSES & PURCHASED ORDERS */}
      {activeTab === 'orders' && (
        <div>
          {!user ? (
            <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4 bg-white rounded-3xl border border-gray-200">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                <Key className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Sign in to view your software licenses</h2>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Log in to inspect your generated license keys, download repositories, and access developer support.
              </p>
              <Link
                href="/login"
                className="inline-block px-6 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-sm"
              >
                Sign In Now
              </Link>
            </div>
          ) : loadingOrders ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-4 shadow-sm">
              <FileCode className="w-12 h-12 text-gray-300 mx-auto" />
              <h2 className="text-lg font-bold text-gray-800">No software purchases found</h2>
              <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
                You haven&apos;t placed any software orders yet. When you complete an order, your license keys and code downloads will be listed here.
              </p>
              <button
                onClick={() => setActiveTab('cart')}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
              >
                Return to Cart
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden"
                >
                  {/* Order Top Bar */}
                  <div className="bg-gray-50 p-4 sm:px-6 border-b border-gray-200 flex flex-wrap justify-between items-center gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-4 text-gray-600">
                      <div>
                        <span className="text-gray-400">Order ID:</span>{' '}
                        <span className="font-mono font-semibold text-gray-900">{order._id}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Placed:</span>{' '}
                        <span className="font-medium text-gray-800">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold uppercase text-[10px] tracking-wide ${
                          order.paymentStatus === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        <Clock className="w-3 h-3" /> {order.paymentStatus || 'PENDING'}
                      </span>
                      <span className="text-sm font-extrabold text-gray-900">
                        ৳{order.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 sm:p-6 divide-y divide-gray-100">
                    {order.items.map((item, idx) => {
                      const productObj = typeof item.productId === 'object' ? item.productId : null;
                      const shopObj = typeof item.shopId === 'object' ? item.shopId : null;

                      return (
                        <div
                          key={idx}
                          className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                        >
                          <div className="space-y-1">
                            {shopObj && (
                              <div className="flex items-center gap-1 text-[11px] text-indigo-600 font-semibold">
                                <Store className="w-3 h-3" />
                                <span>{shopObj.shopName}</span>
                              </div>
                            )}
                            <h3 className="font-bold text-gray-900 text-base">
                              {item.title}
                            </h3>
                            <p className="text-xs text-gray-500">
                              Quantity: {item.quantity} × ৳{item.price.toLocaleString()}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            {productObj?._id && (
                              <Link
                                href={`/products/${productObj._id}`}
                                className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-semibold transition"
                              >
                                <ExternalLink className="w-3.5 h-3.5" /> Product Page
                              </Link>
                            )}
                            <button
                              type="button"
                              onClick={() => setSelectedLicenseOrder(order)}
                              className="inline-flex items-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                            >
                              <Key className="w-3.5 h-3.5" /> View License & Access
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Order Footer */}
                  <div className="bg-gray-50/50 px-4 sm:px-6 py-3 border-t border-gray-100 text-[11px] text-gray-500 flex flex-wrap justify-between items-center gap-2">
                    <div>
                      <span className="font-medium text-gray-700">Recipient Phone:</span>{' '}
                      {order.shippingAddress.phone} ({order.shippingAddress.city})
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified Digital License
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* License & Access Modal */}
      {selectedLicenseOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl relative">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Digital Software License Key</h3>
                <p className="text-xs text-gray-500 font-mono">Order Reference #{selectedLicenseOrder._id}</p>
              </div>
              <button
                onClick={() => setSelectedLicenseOrder(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900 space-y-1">
                  <p className="font-bold">Original License Registered</p>
                  <p className="text-emerald-700">
                    This digital license has been officially generated and registered to{' '}
                    <strong>{user?.email || 'buyer'}</strong>.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Your Software License Key
                </label>
                <div className="p-3 bg-gray-100 font-mono text-sm text-indigo-700 font-bold rounded-xl border border-gray-200 select-all flex items-center justify-between">
                  <span>
                    EITO-{selectedLicenseOrder._id.slice(-8).toUpperCase()}-LIC-
                    {selectedLicenseOrder._id.slice(0, 4).toUpperCase()}
                  </span>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-800 uppercase">Download & Deployment Guidelines:</h4>
                <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
                  <li>Check your registered email ({user?.email}) for the direct download link and repository invitation.</li>
                  <li>In case of custom installation or source code questions, contact developer support via WhatsApp.</li>
                  <li>Keep this key registered in your environment file (`LICENSE_KEY=...`) for software updates.</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t">
              <button
                type="button"
                onClick={() => setSelectedLicenseOrder(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition"
              >
                Close
              </button>
              <a
                href={`https://wa.me/8801700000000?text=${encodeURIComponent(
                  `Hello aito team! I need assistance regarding my software license order #${selectedLicenseOrder._id}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                <Download className="w-3.5 h-3.5" /> Support on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
