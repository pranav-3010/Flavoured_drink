'use client';

import React, { useState } from 'react';
import { Order, OrderStatus } from '@/types/order';
import { motion } from 'framer-motion';
import { ChevronDown, Package, Clock, CheckCircle, Truck, Home } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => Promise<void>;
  loading?: boolean;
}

export function OrderCard({ order, onStatusChange, loading = false }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const statusColors: Record<OrderStatus, string> = {
    placed: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    confirmed: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    shipped: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    delivered: 'bg-green-500/10 border-green-500/30 text-green-400',
    cancelled: 'bg-red-500/10 border-red-500/30 text-red-400',
  };

  const statusIcons: Record<OrderStatus, React.ReactNode> = {
    placed: <Package className="w-4 h-4" />,
    confirmed: <CheckCircle className="w-4 h-4" />,
    shipped: <Truck className="w-4 h-4" />,
    delivered: <Home className="w-4 h-4" />,
    cancelled: <Clock className="w-4 h-4" />,
  };

  const nextStatuses: Record<OrderStatus, OrderStatus[]> = {
    placed: ['confirmed', 'cancelled'],
    confirmed: ['shipped', 'cancelled'],
    shipped: ['delivered'],
    delivered: [],
    cancelled: [],
  };

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    setUpdatingStatus(true);
    try {
      await onStatusChange(order.id, newStatus);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const itemNames = order.items
    .map(item => {
      const product = (global as any).products?.find((p: any) => p.id === item.productId);
      return product ? `${product.name} x${item.quantity}` : `Product x${item.quantity}`;
    })
    .join(', ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-white/10 rounded-xl overflow-hidden bg-white/5"
    >
      {/* Header - Always Visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-white/8 transition-colors"
      >
        <div className="flex items-center gap-4 flex-1 text-left">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-bold text-sm text-white/60">{order.id}</p>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-bold ${statusColors[order.status]}`}>
                {statusIcons[order.status]}
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
            </div>
            <p className="text-sm text-white/80">{order.deliveryAddress.name}</p>
            <p className="text-xs text-white/50 mt-1">₹{order.totalAmount}</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-white/60" />
        </motion.div>
      </button>

      {/* Details - Expandable */}
      <motion.div
        initial={false}
        animate={{ height: expanded ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden border-t border-white/10"
      >
        <div className="p-4 space-y-4">
          {/* Customer Info */}
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-white/60 uppercase font-bold mb-2">Delivery Address</p>
            <p className="text-sm font-bold">{order.deliveryAddress.name}</p>
            <p className="text-sm text-white/80">{order.deliveryAddress.address}</p>
            <p className="text-sm text-white/80">{order.deliveryAddress.city} - {order.deliveryAddress.pincode}</p>
            <p className="text-sm text-white/80 mt-2">Phone: {order.deliveryAddress.phone}</p>
          </div>

          {/* Order Items */}
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-white/60 uppercase font-bold mb-2">Items</p>
            <p className="text-sm text-white/80">{itemNames}</p>
          </div>

          {/* Payment Info */}
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-white/60 uppercase font-bold mb-2">Payment Method</p>
            <p className="text-sm capitalize">{order.paymentMethod.replace(/([A-Z])/g, ' $1').trim()}</p>
          </div>

          {/* Status Update */}
          {nextStatuses[order.status].length > 0 && (
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-white/60 uppercase font-bold mb-2">Update Status</p>
              <div className="flex gap-2 flex-wrap">
                {nextStatuses[order.status].map(status => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(status)}
                    disabled={updatingStatus}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-xs font-bold rounded-lg transition-colors"
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="text-xs text-white/50 space-y-1">
            <p>Created: {new Date(order.createdAt).toLocaleString()}</p>
            <p>Last Updated: {new Date(order.lastUpdated).toLocaleString()}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
