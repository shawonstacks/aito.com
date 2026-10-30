// frontend/components/ProductCard.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Store, Check, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductProps {
  product: {
    _id: string;
    title: string;
    price: number;
    comparePrice?: number;
    images?: string[];
    image?: string;
    category: string;
    shopId?: {
      _id?: string;
      shopName?: string;
    };
  };
}

export default function ProductCard({ product }: ProductProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const productImage = (product.images && product.images.length > 0) ? product.images[0] : product.image;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product._id,
      title: product.title,
      price: product.price,
      comparePrice: product.comparePrice,
      category: product.category,
      image: productImage,
      shopId: product.shopId?._id,
      shopName: product.shopId?.shopName,
    }, 1);

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group flex flex-col justify-between">
      <div>
        {/* Product Image Preview */}
        <Link href={`/products/${product._id}`} className="block relative w-full h-48 bg-gray-100 overflow-hidden">
          {productImage ? (
            <img
              src={productImage}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm flex-col gap-1">
              <ShoppingBag className="w-8 h-8 text-gray-300" />
              <span>No Image Available</span>
            </div>
          )}
          <span className="absolute top-2.5 left-2.5 bg-indigo-600/95 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
            {product.category}
          </span>
        </Link>

        {/* Product Details */}
        <div className="p-4">
          {/* Shop Name */}
          {product.shopId && (
            <div className="flex items-center gap-1 text-xs text-indigo-600 font-medium mb-1">
              <Store className="w-3 h-3" />
              <span>{product.shopId.shopName}</span>
            </div>
          )}

          <Link href={`/products/${product._id}`}>
            <h3 className="text-gray-900 font-semibold text-base line-clamp-1 mb-2 hover:text-indigo-600 transition">
              {product.title}
            </h3>
          </Link>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-lg font-bold text-gray-900">৳{product.price.toLocaleString()}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-xs text-gray-400 line-through">৳{product.comparePrice.toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons: Add to Cart & View */}
      <div className="p-4 pt-0 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleAddToCart}
          className={`py-2 px-3 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
            added
              ? 'bg-emerald-600 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5" /> Added
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" /> Add to Cart
            </>
          )}
        </button>

        <Link
          href={`/products/${product._id}`}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 text-xs text-center"
        >
          Details
        </Link>
      </div>
    </div>
  );
}
