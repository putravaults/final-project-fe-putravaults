import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const MIDTRANS_CONFIG = {
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  apiUrl: 'https://api.sandbox.midtrans.com/v2',
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order_id');

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    if (!MIDTRANS_CONFIG.serverKey) {
      return NextResponse.json({ error: 'Midtrans server key is not configured' }, { status: 500 });
    }

    // Check payment status from Midtrans
    const response = await fetch(`${MIDTRANS_CONFIG.apiUrl}/${orderId}/status`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Basic ${btoa(MIDTRANS_CONFIG.serverKey + ':')}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Midtrans API error:', errorText);
      return NextResponse.json(
        { error: `Status check failed: ${response.statusText}` }, 
        { status: response.status }
      );
    }

    const paymentStatus = await response.json();
    return NextResponse.json(paymentStatus);

  } catch (error) {
    console.error('Error checking payment status:', error);
    return NextResponse.json(
      { error: 'Failed to check payment status' }, 
      { status: 500 }
    );
  }
}
