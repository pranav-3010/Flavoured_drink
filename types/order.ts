export type OrderStatus = 'placed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface DeliveryAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

export interface BasketItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  timestamp: number;
  items: BasketItem[];
  deliveryAddress: DeliveryAddress;
  paymentMethod: string;
  totalAmount: number;
  status: OrderStatus;
  lastUpdated: number;
  createdAt: number;
}
