'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertCircle, Lock } from 'lucide-react';
import { useOwnerOrderPolling } from '@/hooks/useOwnerOrderPolling';
import { OrderCard } from '@/components/OrderCard';
import { OrderStatus } from '@/types/order';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toast } from '@/components/Toast';

export default function OwnerOrdersPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authError, setAuthError] = useState('');
  
  const { orders, loading, error, updateOrderStatus } = useOwnerOrderPolling({
    interval: 3000,
  });

  useEffect(() => {
    // Check if owner is authenticated
    const stored = typeof window !== 'undefined' ? localStorage.getItem('owner_auth') : null;
    if (stored === 'true') {
      setIsAuthenticated(true);
    } else {
      setShowAuthForm(true);
    }
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check (in production, this would be server-side)
    if (password === 'owner123') {
      setIsAuthenticated(true);
      setShowAuthForm(false);
      setAuthError('');
      localStorage.setItem('owner_auth', 'true');
      setPassword('');
    } else {
      setAuthError('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('owner_auth');
    router.push('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-white">
        <Navbar />
        
        <div className="flex-1 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="border border-white/10 rounded-2xl p-8 bg-white/5">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mx-auto mb-4">
                <Lock className="w-6 h-6" />
              </div>
              
              <h1 className="text-2xl font-black text-center mb-2">Owner Dashboard</h1>
              <p className="text-center text-white/60 mb-6">Enter your password to access order management</p>

              <form onSubmit={handleAuth} className="space-y-4">
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setAuthError('');
                    }}
                    placeholder="Enter password"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white"
                  />
                  {authError && (
                    <p className="text-red-400 text-sm mt-2">{authError}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-neutral-200 transition-colors"
                >
                  Login
                </button>
              </form>

              <p className="text-center text-white/50 text-xs mt-4">
                Demo: Use password <code className="bg-white/10 px-2 py-1 rounded">owner123</code>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />
      <Toast />

      {/* Page Header */}
      <div className="pt-20 pb-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <div>
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight">
              Order Management
            </h1>
            <p className="text-white/60 mt-2">Real-time order tracking and updates</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-sm font-bold transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-12 py-12">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">{error}</p>
          </motion.div>
        )}

        {loading && orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
            <p className="text-white/60 mt-4">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-black mb-2">No orders yet</h2>
            <p className="text-white/60">Orders will appear here as customers place them</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black">All Orders ({orders.length})</h2>
              <button
                onClick={() => {
                  // Manual refresh
                  window.location.reload();
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-bold transition-colors"
              >
                Refresh
              </button>
            </div>

            {orders.map((order, idx) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <OrderCard
                  order={order}
                  onStatusChange={updateOrderStatus}
                  loading={loading}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
