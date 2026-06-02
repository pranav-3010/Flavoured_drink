'use client';

import { useEffect, useRef, useState } from 'react';
import { Order } from '@/types/order';
import { getOwnerAuthHeader } from '@/utils/authOwner';
import { showSuccessToast, showInfoToast } from '@/utils/toast';

interface UseOwnerOrderPollingOptions {
  interval?: number; // polling interval in ms
  onStatusChange?: (orderId: string, oldStatus: string, newStatus: string) => void;
}

export function useOwnerOrderPolling(options: UseOwnerOrderPollingOptions = {}) {
  const { interval = 3000, onStatusChange } = options;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previousOrdersRef = useRef<Map<string, string>>(new Map()); // Track previous statuses
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/owner/orders', {
        headers: getOwnerAuthHeader(),
        cache: 'no-store',
      });

      if (response.status === 401) {
        setError('Unauthorized: Owner authentication required');
        setOrders([]);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setError(null);

      // Check for status changes
      data.forEach((order: Order) => {
        const previousStatus = previousOrdersRef.current.get(order.id);
        if (previousStatus && previousStatus !== order.status) {
          // Status changed, trigger callback and toast
          onStatusChange?.(order.id, previousStatus, order.status);
          
          const statusMessages: Record<string, string> = {
            confirmed: 'Order confirmed',
            shipped: 'Order shipped',
            delivered: 'Order delivered',
            cancelled: 'Order cancelled',
          };

          const message = statusMessages[order.status] || `Order status: ${order.status}`;
          showInfoToast(`${order.id}: ${message}`);
        }
        previousOrdersRef.current.set(order.id, order.status);
      });

      setOrders(data);
    } catch (err) {
      console.error('[v0] Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchOrders();

    // Start polling
    pollingIntervalRef.current = setInterval(fetchOrders, interval);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [interval]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/owner/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          ...getOwnerAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      const updatedOrder = await response.json();
      
      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? updatedOrder : order
        )
      );

      showSuccessToast(`Order status updated to ${newStatus}`);
      return updatedOrder;
    } catch (err) {
      console.error('[v0] Error updating order:', err);
      setError(err instanceof Error ? err.message : 'Failed to update order');
      throw err;
    }
  };

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
    updateOrderStatus,
  };
}
