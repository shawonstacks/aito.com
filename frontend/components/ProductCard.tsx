// frontend/components/ProductCard.tsx
import Image from 'next/image';
import { ShoppingBag, Store } from 'lucide-react';

interface ProductProps {
  product: {
    _id: string;
    title: string;
    price: number;
    comparePrice?: number;
    images: string[];
    category: string;
    shopId?: {
      shopName: string;
    };
  };
}

export default function ProductCard({ product }: ProductProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group flex flex-col justify-between">
      <div>
        {/* Product Image Placeholder */}
        <div className="relative w-full h-48 bg-gray-100 overflow-hidden flex items-center justify-center">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="text-gray-400 text-sm flex flex-col items-center gap-1">
              <ShoppingBag className="w-8 h-8 text-gray-300" />
              <span>No Image Available</span>
            </div>
          )}
          <span className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            {product.category}
          </span>
        </div>

        {/* Product Details */}
        <div className="p-4">
          {/* Shop Name */}
          {product.shopId && (
            <div className="flex items-center gap-1 text-xs text-indigo-600 font-medium mb-1">
              <Store className="w-3 h-3" />
              <span>{product.shopId.shopName}</span>
            </div>
          )}

          <h3 className="text-gray-900 font-semibold text-base line-clamp-1 mb-2">
            {product.title}
          </h3>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-lg font-bold text-gray-900">৳{product.price}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-sm text-gray-400 line-through">৳{product.comparePrice}</span>
            )}
          </div>
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="p-4 pt-0">
        <button className="w-full bg-indigo-50 text-indigo-600 font-medium py-2 rounded-lg hover:bg-indigo-600 hover:text-white transition flex items-center justify-center gap-2 text-sm">
          <ShoppingBag className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}