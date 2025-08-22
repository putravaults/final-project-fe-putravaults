// Simple Midtrans Configuration
export const MIDTRANS_CONFIG = {
  // Use sandbox for testing, change to production for live payments
  isProduction: false,
  
  // Your Midtrans credentials (get these from Midtrans dashboard)
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-61XuGAwQ8Bj8LzSS',
  serverKey: process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-GwIO_WGbJPXsDzsNEBRs8IYA',
  
  // Base URLs
  snapUrl: 'https://app.sandbox.midtrans.com/snap/v1/transactions',
  apiUrl: 'https://api.sandbox.midtrans.com/v2',
};

// Simple payment data structure
export interface PaymentData {
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  itemDetails: {
    id: string;
    price: number;
    quantity: number;
    name: string;
  }[];
}

// Create payment token for Snap
export const createPaymentToken = async (paymentData: PaymentData): Promise<string> => {
  try {
    const response = await fetch(`${MIDTRANS_CONFIG.apiUrl}/charge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${btoa(MIDTRANS_CONFIG.serverKey + ':')}`,
      },
      body: JSON.stringify({
        payment_type: 'bank_transfer',
        bank_transfer: {
          bank: 'bca', // or 'mandiri', 'bni', 'bri'
        },
        transaction_details: {
          order_id: paymentData.orderId,
          gross_amount: paymentData.amount,
        },
        customer_details: {
          first_name: paymentData.customerName,
          email: paymentData.customerEmail,
        },
        item_details: paymentData.itemDetails,
      }),
    });

    if (!response.ok) {
      throw new Error(`Payment creation failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.redirect_url || result.token;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw new Error('Failed to create payment');
  }
};

// Open Midtrans Snap popup
export const openMidtransSnap = (token: string) => {
  // Load Midtrans Snap script
  const script = document.createElement('script');
  script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
  script.setAttribute('data-client-key', MIDTRANS_CONFIG.clientKey);
  
  script.onload = () => {
    // @ts-ignore - Midtrans Snap is loaded globally
    window.snap.pay(token, {
      onSuccess: (result: any) => {
        console.log('Payment success:', result);
        // Handle success - update booking status
        window.location.href = `/payment/success?order_id=${result.order_id}`;
      },
      onPending: (result: any) => {
        console.log('Payment pending:', result);
        // Handle pending - show instructions
        window.location.href = `/payment/pending?order_id=${result.order_id}`;
      },
      onError: (result: any) => {
        console.log('Payment error:', result);
        // Handle error
        window.location.href = `/payment/error?order_id=${result.order_id}`;
      },
      onClose: () => {
        console.log('Payment popup closed');
        // Handle popup closed
        alert('Payment was cancelled');
      },
    });
  };
  
  document.head.appendChild(script);
};

// Verify payment status
export const checkPaymentStatus = async (orderId: string): Promise<any> => {
  try {
    const response = await fetch(`${MIDTRANS_CONFIG.apiUrl}/${orderId}/status`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Basic ${btoa(MIDTRANS_CONFIG.serverKey + ':')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Status check failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking payment status:', error);
    throw new Error('Failed to check payment status');
  }
};
