// frontend/app/products/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import API from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import { 
  ShoppingBag, 
  Store, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowLeft, 
  Phone, 
  MapPin, 
  Building,
  ExternalLink,
  Code2,
  Database,
  Layers,
  Sparkles,
  Check,
  Plus,
  Play
} from 'lucide-react';
import Link from 'next/link';

interface TechnicalInfo {
  framework?: string;
  language?: string;
  database?: string;
  version?: string;
  compatibility?: string;
}

interface ProductDetail {
  _id: string;
  title?: string;
  name?: string;
  price: number;
  comparePrice?: number;
  description: string;
  shortDescription?: string;
  images?: string[];
  image?: string;
  demoVideo?: string;
  liveDemoUrl?: string;
  category: string;
  technicalInfo?: TechnicalInfo;
  features?: string[];
  status?: string;
  shopId?: {
    _id?: string;
    shopName?: string;
  };
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Shipping Address Form State - Pre-filled from User Session
  const [shippingAddress, setShippingAddress] = useState({
    address: 'Dhaka, Bangladesh',
    city: 'Dhaka',
    phone: '',
  });

  // Autofill user information when user profile is loaded
  useEffect(() => {
    if (user?.phone) {
      setShippingAddress((prev) => ({
        ...prev,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  const getVideoEmbedUrl = (url: string) => {
    if (!url) return '';

    if (url.includes('youtube.com/watch?v=')) {
      const videoId = new URL(url).searchParams.get('v');
      return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    }

    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    }

    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : '';
    }

    return url;
  };

  useEffect(() => {
    let ignore = false;
    const fetchProduct = async () => {
      try {
        const response = await API.get(`/products/${id}`);
        if (!ignore) {
          if (response.data.success) {
            setProduct(response.data.product);
            const firstImg = (response.data.product.images && response.data.product.images[0]) || response.data.product.image;
            if (firstImg) setSelectedImage(firstImg);
          } else if (response.data) {
            setProduct(response.data);
          }
        }
      } catch (error) {
        if (!ignore) console.error('Failed to fetch product:', error);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    if (id) fetchProduct();
    return () => {
      ignore = true;
    };
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      productId: product._id,
      title: product.title || product.name || 'Software',
      price: product.price,
      comparePrice: product.comparePrice,
      category: product.category,
      image: selectedImage || (product.images && product.images[0]) || product.image,
      shopId: product.shopId?._id,
      shopName: product.shopId?.shopName,
    }, 1);

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product) {
      alert('Product not found.');
      return;
    }

    if (!user) {
      alert('Please sign in to complete your software order.');
      router.push('/login');
      return;
    }

    if (!shippingAddress.phone) {
      alert('Please enter your contact phone number.');
      return;
    }

    setOrdering(true);
    try {
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
        alert('🎉 Software Order Successful! Your digital license key has been generated.');
        setShowCheckoutModal(false);
        router.push('/cart');
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || 'Failed to place order. Please try again.');
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
        <p className="text-gray-500 font-medium">Software or digital product not found!</p>
        <Link href="/" className="inline-flex items-center gap-2 text-indigo-600 text-sm font-semibold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </Link>
      </div>
    );
  }

  const allImages = [
    ...(product.images || []),
    ...(product.image && !product.images?.includes(product.image) ? [product.image] : [])
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Link */}
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition">
        <ArrowLeft className="w-4 h-4" /> Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm">
        
        {/* Left Column: Media & Previews (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative w-full h-80 sm:h-96 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center">
            {product.demoVideo ? (
              <iframe
                src={getVideoEmbedUrl(product.demoVideo)}
                title={`${product.title || product.name} demo video`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : selectedImage ? (
              <img
                src={selectedImage}
                alt={product.title || product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-400 text-sm flex flex-col items-center gap-2">
                <ShoppingBag className="w-12 h-12 text-gray-300" />
                <span>No Preview Available</span>
              </div>
            )}

            <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {product.category || 'Software'}
            </span>
          </div>

          {/* Screenshots Gallery Strip */}
          {allImages.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${
                    selectedImage === img ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Demo Links Row */}
          <div className="flex flex-wrap gap-3 pt-2">
            {product.liveDemoUrl && (
              <a
                href={product.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-xs rounded-xl border border-emerald-200 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View Live Demo Site
              </a>
            )}
            {product.demoVideo && (
              <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-50 text-indigo-700 font-medium text-xs rounded-xl">
                <Play className="w-3.5 h-3.5" /> Interactive Video Preview
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Pricing, Specs & CTA (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Vendor Badge */}
            {product.shopId && (
              <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold bg-indigo-50 w-fit px-3 py-1 rounded-full">
                <Store className="w-3.5 h-3.5" />
                <span>Verified Vendor: {product.shopId.shopName}</span>
              </div>
            )}

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
              {product.title || product.name}
            </h1>

            {/* Price Row */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-indigo-600">৳{product.price.toLocaleString()}</span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-lg text-gray-400 line-through">৳{product.comparePrice.toLocaleString()}</span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-gray-600 text-sm leading-relaxed border-t border-b border-gray-100 py-3.5">
              {product.shortDescription || product.description}
            </p>

            {/* Technical Specifications Badge Grid */}
            {product.technicalInfo && (
              <div className="space-y-2 pt-1">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-indigo-600" /> Technical Architecture
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {product.technicalInfo.framework && (
                    <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                      <span className="text-gray-400 text-[10px] block">Framework</span>
                      <span className="font-semibold text-gray-800">{product.technicalInfo.framework}</span>
                    </div>
                  )}
                  {product.technicalInfo.language && (
                    <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                      <span className="text-gray-400 text-[10px] block">Language</span>
                      <span className="font-semibold text-gray-800">{product.technicalInfo.language}</span>
                    </div>
                  )}
                  {product.technicalInfo.database && (
                    <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                      <span className="text-gray-400 text-[10px] block">Database</span>
                      <span className="font-semibold text-gray-800">{product.technicalInfo.database}</span>
                    </div>
                  )}
                  {product.technicalInfo.version && (
                    <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                      <span className="text-gray-400 text-[10px] block">Release</span>
                      <span className="font-semibold text-gray-800">{product.technicalInfo.version}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Key Features List */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Key Features
                </h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  {product.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Dual Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`py-3.5 px-4 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-sm ${
                  addedToCart
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                }`}
              >
                {addedToCart ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Cart
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Add to Cart
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!user) {
                    alert('Please log in to purchase software.');
                    router.push('/login');
                  } else {
                    setShowCheckoutModal(true);
                  }
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                Buy & Order
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500 pt-1 text-center">
              <span className="flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Instant Code Delivery
              </span>
              <span className="flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-green-500" /> 100% Tested & Verified
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Checkout / Address Modal with User Autofill */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="border-b pb-3">
              <h3 className="text-xl font-bold text-gray-900">Complete Your Software Order</h3>
              <p className="text-xs text-gray-500 mt-0.5">License key and digital assets will be linked to your account.</p>
            </div>

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              {/* Product Info Display */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Selected Software Package
                </label>
                <input
                  type="text"
                  disabled
                  value={`${product.title || product.name} - ৳${product.price.toLocaleString()}`}
                  className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-xl text-sm text-gray-800 font-semibold"
                />
              </div>

              {/* Customer Account Autofill */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Account Name & Email (Auto-filled)
                </label>
                <input
                  type="text"
                  disabled
                  value={`${user?.name || 'Customer'} (${user?.email || ''})`}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-600 font-medium"
                />
              </div>

              {/* Phone Input with Autofill */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Contact Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="01700000000"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* City Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  City / Location
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* Delivery Notes */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Delivery Notes / Organization
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={ordering}
                  className="px-6 py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl transition shadow-md"
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
