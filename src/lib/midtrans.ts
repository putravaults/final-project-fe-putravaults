// Simple Midtrans Configuration
export const MIDTRANS_CONFIG = {
  // Use sandbox for testing, change to production for live payments
  isProduction: false,
  
  // Your Midtrans credentials (get these from Midtrans dashboard)
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
  serverKey: process.env.MIDTRANS_SERVER_KEY ,
  
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
    console.log('Creating payment token with data:', paymentData);
    console.log('Using server key:', MIDTRANS_CONFIG.serverKey);
    
    // Use Core API for bank transfer
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
          bank: 'bca', // Default to BCA, can be changed to 'mandiri', 'bni', 'bri'
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

    console.log('Midtrans API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Midtrans API error response:', errorText);
      throw new Error(`Payment creation failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Midtrans API success response:', result);
    
    // For bank transfer, we get a redirect URL instead of a token
    if (result.redirect_url) {
      return result.redirect_url;
    } else if (result.va_numbers && result.va_numbers.length > 0) {
      // If we get VA numbers, we can show them directly
      return `bank_transfer_${result.order_id}`;
    } else {
      throw new Error('No payment URL or VA numbers received from Midtrans');
    }
  } catch (error) {
    console.error('Error creating payment:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to create payment: ${error.message}`);
    } else {
      throw new Error('Failed to create payment');
    }
  }
};

// Open Midtrans payment (modified for bank transfer)
export const openMidtransSnap = (paymentUrl: string) => {
  if (paymentUrl.startsWith('http')) {
    // If it's a redirect URL, open it in a new window
    window.open(paymentUrl, '_blank', 'width=600,height=600');
  } else if (paymentUrl.startsWith('bank_transfer_')) {
    // If it's a bank transfer order ID, show instructions
    const orderId = paymentUrl.replace('bank_transfer_', '');
    alert(`Bank transfer instructions will be shown for order: ${orderId}`);
    // You can redirect to a payment instructions page here
    window.location.href = `/payment/pending?order_id=${orderId}`;
  } else {
    // Fallback to Snap popup if we have a token
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', MIDTRANS_CONFIG.clientKey);
    
    script.onload = () => {
      // @ts-ignore - Midtrans Snap is loaded globally
      window.snap.pay(paymentUrl, {
        onSuccess: (result: any) => {
          console.log('Payment success:', result);
          window.location.href = `/payment/success?order_id=${result.order_id}`;
        },
        onPending: (result: any) => {
          console.log('Payment pending:', result);
          window.location.href = `/payment/pending?order_id=${result.order_id}`;
        },
        onError: (result: any) => {
          console.log('Payment error:', result);
          window.location.href = `/payment/error?order_id=${result.order_id}`;
        },
        onClose: () => {
          console.log('Payment popup closed');
          alert('Payment was cancelled');
        },
      });
    };
    
    document.head.appendChild(script);
  }
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
