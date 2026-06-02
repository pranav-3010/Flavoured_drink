import { NextRequest, NextResponse } from 'next/server';
import { Order, DeliveryAddress, BasketItem } from '@/types/order';
import { generateOrderId } from '@/utils/orderStorage';

// Shared orders storage across all API routes
export const sharedOrders: Order[] = [];

export async function GET() {
  try {
    return NextResponse.json(sharedOrders);
  } catch (error) {
    console.error('[v0] Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      items,
      deliveryAddress,
      paymentMethod,
      totalAmount,
    }: {
      items: BasketItem[];
      deliveryAddress: DeliveryAddress;
      paymentMethod: string;
      totalAmount: number;
    } = body;

    // Validate required fields
    if (!items || !deliveryAddress || !paymentMethod || !totalAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate delivery address
    if (!deliveryAddress.name || !deliveryAddress.phone || !deliveryAddress.address) {
      return NextResponse.json(
        { error: 'Incomplete delivery address' },
        { status: 400 }
      );
    }

    const now = Date.now();
    const newOrder: Order = {
      id: generateOrderId(),
      timestamp: now,
      items,
      deliveryAddress,
      paymentMethod,
      totalAmount,
      status: 'placed',
      lastUpdated: now,
      createdAt: now,
    };

    // Store order in shared array
    sharedOrders.push(newOrder);

    // Simulate async background processing - order confirmation after 2-5 seconds
    setTimeout(() => {
      const orderToUpdate = sharedOrders.find(o => o.id === newOrder.id);
      if (orderToUpdate && orderToUpdate.status === 'placed') {
        orderToUpdate.status = 'confirmed';
        orderToUpdate.lastUpdated = Date.now();
      }
    }, 2000 + Math.random() * 3000);

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('[v0] Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
