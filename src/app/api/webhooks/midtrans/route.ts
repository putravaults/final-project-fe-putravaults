import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const Backend_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

// Verify Midtrans webhook signature
const verifySignature = (requestBody: string, signature: string): boolean => {
  const expectedSignature = crypto
    .createHash('sha512')
    .update(requestBody + process.env.MIDTRANS_SERVER_KEY)
    .digest('hex');
  
  return signature === expectedSignature;
};

// Helper function to update booking status via backend
async function updateBookingStatus(orderId: string, status: string) {
  try {
    // Extract booking ID from order ID (ORDER-175 -> 175)
    const bookingId = orderId.replace('ORDER-', '');
    
    console.log(`Updating booking ${bookingId} to status: ${status}`);
    
    // Call backend to update booking status
    const response = await fetch(`${Backend_URL}/booking/${bookingId}/update-status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to update booking status: ${response.status} - ${errorText}`);
      return false;
    }

    const result = await response.json();
    console.log(`Booking status updated successfully:`, result);
    return true;
  } catch (error) {
    console.error('Error updating booking status:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-signature-key');

    // Verify webhook signature for security
    if (!signature || !verifySignature(body, signature)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const paymentData = JSON.parse(body);
    console.log('Midtrans webhook received:', paymentData);

    // Extract important data
    const {
      order_id,
      transaction_status,
      payment_type,
      gross_amount,
      fraud_status,
    } = paymentData;

    // Handle different payment statuses
    switch (transaction_status) {
      case 'capture':
      case 'settlement':
        // Payment successful
        console.log(`Payment successful for order: ${order_id}`);
        await updateBookingStatus(order_id, 'CONFIRMED');
        break;

      case 'pending':
        // Payment pending
        console.log(`Payment pending for order: ${order_id}`);
        await updateBookingStatus(order_id, 'PENDING');
        break;

      case 'deny':
      case 'expire':
      case 'cancel':
        // Payment failed
        console.log(`Payment failed for order: ${order_id}`);
        await updateBookingStatus(order_id, 'CANCELLED');
        break;

      default:
        console.log(`Unknown transaction status: ${transaction_status} for order: ${order_id}`);
    }

    // Check fraud status
    if (fraud_status === 'challenge') {
      console.log(`Payment challenged for order: ${order_id}`);
      // Could update booking status to 'CHALLENGED' if needed
    } else if (fraud_status === 'deny') {
      console.log(`Payment denied due to fraud for order: ${order_id}`);
      await updateBookingStatus(order_id, 'CANCELLED');
    }

    // Return success to Midtrans
    return NextResponse.json({ status: 'OK' });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
