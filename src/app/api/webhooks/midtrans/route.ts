import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Verify Midtrans webhook signature
const verifySignature = (requestBody: string, signature: string): boolean => {
  const expectedSignature = crypto
    .createHash('sha512')
    .update(requestBody + process.env.MIDTRANS_SERVER_KEY)
    .digest('hex');
  
  return signature === expectedSignature;
};

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
        // TODO: Update booking status to CONFIRMED
        // TODO: Send confirmation email to customer
        break;

      case 'pending':
        // Payment pending
        console.log(`Payment pending for order: ${order_id}`);
        // TODO: Update booking status to PENDING
        break;

      case 'deny':
      case 'expire':
      case 'cancel':
        // Payment failed
        console.log(`Payment failed for order: ${order_id}`);
        // TODO: Update booking status to CANCELLED
        // TODO: Release tickets back to available
        break;

      default:
        console.log(`Unknown transaction status: ${transaction_status} for order: ${order_id}`);
    }

    // Check fraud status
    if (fraud_status === 'challenge') {
      console.log(`Payment challenged for order: ${order_id}`);
      // TODO: Handle fraud challenge
    } else if (fraud_status === 'deny') {
      console.log(`Payment denied due to fraud for order: ${order_id}`);
      // TODO: Handle fraud denial
    }

    // Return success to Midtrans
    return NextResponse.json({ status: 'OK' });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
