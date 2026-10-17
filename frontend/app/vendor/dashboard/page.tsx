'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  description: string;
}

export default function VendorDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states for adding product
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userStr);
    const userRole = user?.role ? String(user.role).toLowerCase() : '';

    if (userRole !== 'vendor' && userRole !== 'shop') {
      router.push('/');
      return;
    }

    fetchVendorProducts(token);
  }, [router]);

  const fetchVendorProducts = async (token: string) => {
    try {
      const res = await axios.get('http://172.16.54.179:5000/api/products/my-products', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // safe parsing: array, { products: [] }, or { data: [] }
      const rawData = res.data;
      const productList = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.products)
        ? rawData.products
        : Array.isArray(rawData?.data)
        ? rawData.data
        : [];

      setProducts(productList);
    } catch (err) {
      console.error('Error fetching vendor products:', err);
      setProducts([]); // fallback to empty array to prevent map crashes
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    const token = localStorage.getItem('token');

    try {
      await axios.post(
        'http://172.16.54.179:5000/api/products',
        {
          name,
          price: Number(price),
          category,
          stock: Number(stock),
          description,
          images: imageUrl ? [imageUrl] : []
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMsg('Product added successfully!');
      setName('');
      setPrice('');
      setCategory('');
      setStock('');
      setDescription('');
      setImageUrl('');
      
      if (token) fetchVendorProducts(token);
    } catch (err: any) {
      setMsg(err.response?.data?.message || 'Failed to add product');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Vendor Dashboard</h1>

      {/* Add Product Form Section */}
      <div className="bg-white p-6 rounded-lg shadow-md border mb-10">
        <h2 className="text-xl font-semibold mb-4 text-indigo-600">Upload New Product</h2>
        {msg && (
          <p className={`mb-4 text-sm font-medium ${msg.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
            {msg}
          </p>
        )}

        <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price ($)</label>
            <input
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
            <input
              type="number"
              required
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md"
            ></textarea>
          </div>

          <button
            type="submit"
            className="md:col-span-2 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Add Product
          </button>
        </form>
      </div>

      {/* Uploaded Products List Table */}
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">My Uploaded Products</h2>

        {loading ? (
          <p>Loading products...</p>
        ) : !Array.isArray(products) || products.length === 0 ? (
          <p className="text-gray-500">No products uploaded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((p) => (
                  <tr key={p._id}>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">{p.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{p.category}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">${p.price}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{p.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}