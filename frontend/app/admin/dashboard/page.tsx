'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Shop {
  _id: string;
  name: string;
  status: string;
  userId?: {
    name: string;
    email: string;
    phone: string;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [pendingShops, setPendingShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userStr);
    if (user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    fetchPendingShops(token);
  }, [router]);

  const fetchPendingShops = async (token: string) => {
    try {
      const res = await axios.get('http://172.16.54.179:5000/api/admin/pending-shops', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingShops(res.data.shops || []);
    } catch (err) {
      console.error('Failed to fetch pending shops', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (shopId: string, status: 'APPROVED' | 'REJECTED') => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(
        `http://172.16.54.179:5000/api/admin/shop-status/${shopId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg(`Shop successfully ${status.toLowerCase()}!`);
      if (token) fetchPendingShops(token);
    } catch (err: any) {
      setMsg(err.response?.data?.message || 'Failed to update shop status');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard - Pending Shops</h1>
      
      {msg && <p className="mb-4 text-sm font-medium text-green-600">{msg}</p>}

      <div className="bg-white p-6 rounded-lg shadow-md border">
        {loading ? (
          <p>Loading pending shops...</p>
        ) : pendingShops.length === 0 ? (
          <p className="text-gray-500">No pending shops found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Shop Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Vendor Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pendingShops.map((shop) => (
                  <tr key={shop._id}>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">{shop.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{shop.userId?.name || 'N/A'}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{shop.userId?.email || 'N/A'}</td>
                    <td className="px-4 py-2 text-sm space-x-2">
                      <button
                        onClick={() => handleUpdateStatus(shop._id, 'APPROVED')}
                        className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(shop._id, 'REJECTED')}
                        className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                      >
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
    </div>
  );
}