// frontend/components/NotificationBell.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Bell, CheckCheck, Clock, CheckCircle2, AlertCircle, ShoppingBag, ShieldCheck } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  link?: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await API.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch {
      // Ignore background notification fetch errors
    }
  };

  useEffect(() => {
    let ignore = false;
    if (user) {
      fetchNotifications();
    }
    return () => {
      ignore = true;
    };
  }, [user]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await API.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      // ignore
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await API.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // ignore
    }
  };

  if (!user) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'PRODUCT_APPROVED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'PRODUCT_CHANGES_REQUESTED':
      case 'PRODUCT_REJECTED':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'NEW_ORDER':
        return <ShoppingBag className="w-4 h-4 text-indigo-500" />;
      case 'SHOP_APPROVED':
        return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
      default:
        return <Clock className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-2 text-gray-700 hover:text-indigo-600 rounded-full hover:bg-gray-100 relative transition cursor-pointer"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-extrabold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-xs">
                No notifications right now.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`p-3.5 transition hover:bg-gray-50 flex gap-3 items-start ${
                    !n.isRead ? 'bg-indigo-50/30' : 'bg-white'
                  }`}
                >
                  <div className="mt-0.5 p-1.5 rounded-lg bg-gray-100 flex-shrink-0">
                    {getIcon(n.type)}
                  </div>

                  <div className="flex-grow min-w-0 space-y-0.5">
                    <div className="flex justify-between items-start gap-1">
                      <h4 className="text-xs font-bold text-gray-900 truncate">{n.title}</h4>
                      {!n.isRead && (
                        <button
                          type="button"
                          onClick={(e) => handleMarkAsRead(n._id, e)}
                          className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0 hover:scale-125 transition"
                          title="Mark as read"
                        />
                      )}
                    </div>
                    <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                    <div className="flex justify-between items-center pt-1 text-[10px] text-gray-400">
                      <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                      {n.link && (
                        <Link
                          href={n.link}
                          onClick={() => setOpen(false)}
                          className="text-indigo-600 hover:text-indigo-800 font-semibold"
                        >
                          View Details →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

