import { NextRequest, NextResponse } from 'next/server';
import { isOwnerAuthenticated } from '@/utils/authOwner';

// Import the shared orders from the public API
// In production, this would be a shared database
let orders: any[] = [];

// Initialize by getting orders from the public endpoint
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

export async function GET(request: NextRequest) {
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
    // Sync with public orders
    await getSharedOrders();
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('[v0] Error fetching owner orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
