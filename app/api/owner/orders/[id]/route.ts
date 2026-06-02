import { NextRequest, NextResponse } from 'next/server';
import { isOwnerAuthenticated } from '@/utils/authOwner';
import { OrderStatus } from '@/types/order';

// Shared orders storage (same as /api/orders)
let orders: any[] = [];

async function getSharedOrders() {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/orders`, {
      cache: 'no-store',
    });
    
    if (response.ok) {
      orders = await response.json();
    }
  } catch (error) {
    console.error('[v0] Error fetching shared orders:', error);
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // Check owner authentication
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key.toLowerCase()] = value;
  });

  if (!isOwnerAuthenticated(headers)) {
    return NextResponse.json(
      { error: 'Unauthorized: Owner authentication required' },
      { status: 401 }
    );
  }

  try {
    await getSharedOrders();
    
    const order = orders.find(o => o.id === id);
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('[v0] Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // Check owner authentication
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key.toLowerCase()] = value;
  });

  if (!isOwnerAuthenticated(headers)) {
    return NextResponse.json(
      { error: 'Unauthorized: Owner authentication required' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { status }: { status: OrderStatus } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    const validStatuses: OrderStatus[] = ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    await getSharedOrders();

    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    orders[orderIndex].status = status;
    orders[orderIndex].lastUpdated = Date.now();

    return NextResponse.json(orders[orderIndex]);
  } catch (error) {
    console.error('[v0] Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
