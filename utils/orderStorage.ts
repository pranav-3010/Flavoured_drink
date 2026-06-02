import { Order } from '@/types/order';

const ORDERS_STORAGE_KEY = 'flavoured_drink_orders';

export function getAllOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('[v0] Failed to retrieve orders from localStorage:', e);
    return [];
  }
}

export function getOrderById(id: string): Order | null {
  const orders = getAllOrders();
  return orders.find(order => order.id === id) || null;
}

export function saveOrder(order: Order): void {
  if (typeof window === 'undefined') return;
  try {
    const orders = getAllOrders();
    const existingIndex = orders.findIndex(o => o.id === order.id);
    if (existingIndex >= 0) {
      orders[existingIndex] = order;
    } else {
      orders.push(order);
    }
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('[v0] Failed to save order to localStorage:', e);
  }
}

export function deleteOrder(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const orders = getAllOrders();
    const filtered = orders.filter(o => o.id !== id);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('[v0] Failed to delete order from localStorage:', e);
  }
}

export function generateOrderId(): string {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
